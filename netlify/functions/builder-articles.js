// netlify/functions/builder-articles.js
require('dotenv').config()
const fetch = require('node-fetch')
const admin = require('firebase-admin')

// 1) Gist → Service Account loader
async function loadServiceAccount() {
  const gistId = process.env.SERVICE_ACCOUNT_GIST_ID
  const token  = process.env.GIST_FETCH_TOKEN
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}` }
  })
  if (!res.ok) throw new Error(`Gist fetch failed: ${res.status}`)
  const gist = await res.json()
  const file = gist.files['service-account.json'] || Object.values(gist.files)[0]
  return JSON.parse(file.content)
}

// 2) Init Firebase Admin
async function ensureFirebase() {
  if (!admin.apps.length) {
    const creds = await loadServiceAccount()
    admin.initializeApp({ credential: admin.credential.cert(creds) })
  }
  return admin
}

// Helper function to strip HTML tags
function stripHtml(html) {
  if (!html) return ''
  return html.replace(/<[^>]*>?/gm, '').trim()
}

exports.handler = async (event) => {
  try {
    // Initialize Firebase first
    await ensureFirebase()
    const db = admin.firestore()

    // 3) Parse article ID from the URL path
    // Netlify can pass the path in different ways depending on redirect configuration
    let id = null
    
    // Try multiple ways to get the article ID
    // Method 1: From event.path (most common with :splat redirect)
    const path = event.path || event.rawPath || ''
    let pathMatch = path.match(/(?:builder-articles|articles)\/(\d+)/)
    if (pathMatch) {
      id = Number(pathMatch[1])
    }
    
    // Method 1b: Check headers for original path (Netlify sometimes provides this)
    if (!id && event.headers && event.headers['x-forwarded-path']) {
      pathMatch = event.headers['x-forwarded-path'].match(/\/articles\/(\d+)/)
      if (pathMatch) {
        id = Number(pathMatch[1])
      }
    }
    
    // Method 2: From query string (if redirect uses ?id=)
    if (!id && event.queryStringParameters && event.queryStringParameters.id) {
      id = Number(event.queryStringParameters.id)
    }
    
    // Method 3: From path segments (fallback - extract any number from path)
    if (!id) {
      const segments = path.split('/').filter(Boolean)
      for (const segment of segments) {
        const num = Number(segment)
        if (!isNaN(num) && num > 0 && num < 100000) { // Reasonable article ID range
          id = num
          break
        }
      }
    }
    
    if (!id || isNaN(id)) {
      console.error('Could not parse article ID from:', { path, query: event.queryStringParameters })
      return { 
        statusCode: 400, 
        headers: { 'Content-Type': 'text/plain' },
        body: 'Invalid article ID' 
      }
    }

    // 4) Fetch SPA shell
    const SPA_URL = process.env.SPA_URL || 'https://syntaktes.gr'
    const shellRes = await fetch(`${SPA_URL}/index.html`)
    if (!shellRes.ok) {
      throw new Error(`Failed to fetch shell: ${shellRes.status}`)
    }
    const shell = await shellRes.text()

    // 5) Load article data (filter out deleted articles)
    let snap
    try {
      // First try: query by id field
      snap = await db.collection('articles')
        .where('id', '==', id)
        .where('deleted', '==', false)
        .limit(1)
        .get()
      
      // Fallback: if empty, try to get by document ID (in case id field doesn't match)
      if (snap.empty) {
        console.log(`Article ${id} not found by id field, trying document ID...`)
        const docRef = db.collection('articles').doc(id.toString())
        const docSnap = await docRef.get()
        if (docSnap.exists() && !docSnap.data().deleted) {
          // Create a fake snapshot-like object
          snap = {
            empty: false,
            docs: [{ data: () => docSnap.data(), id: docSnap.id }]
          }
        }
      }
    } catch (firestoreError) {
      console.error('Firestore query error:', firestoreError)
      throw new Error(`Database error: ${firestoreError.message}`)
    }
    
    if (snap.empty) {
      console.error(`Article ${id} not found or deleted`)
      return { 
        statusCode: 404, 
        headers: { 'Content-Type': 'text/plain' },
        body: 'Article not found' 
      }
    }
    
    const art = snap.docs[0].data()
    
    // Debug mode: if ?debug=true, return JSON data (for easy debugging)
    if (event.queryStringParameters && event.queryStringParameters.debug === 'true') {
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          articleId: id,
          article: {
            title: art.title,
            imagePath: art.imagePath || 'MISSING',
            hasImagePath: !!art.imagePath,
            imagePathType: typeof art.imagePath,
            allFields: Object.keys(art),
            imagePathValue: art.imagePath
          }
        }, null, 2)
      }
    }
    
    // Validate article has required fields
    if (!art || !art.title) {
      console.error(`Article ${id} missing required fields`)
      return { 
        statusCode: 500, 
        headers: { 'Content-Type': 'text/plain' },
        body: 'Article data incomplete' 
      }
    }

    // Debug: Log article data to see what we're getting
    console.log(`Article ${id} data:`, {
      title: art.title,
      hasImagePath: !!art.imagePath,
      imagePath: art.imagePath ? art.imagePath.substring(0, 50) + '...' : 'MISSING',
      imagePathType: typeof art.imagePath,
      imagePathLength: art.imagePath ? art.imagePath.length : 0,
      allFields: Object.keys(art)
    })

    // Strip HTML from content for description
    const strippedContent = stripHtml(art.content || '')
    const description = strippedContent.slice(0, 200).trim() || 'Article from syntaktes.gr'

    // Ensure imagePath exists and is absolute URL
    // Check for imagePath - handle empty strings, null, undefined
    // Also check alternative field names just in case
    let imageUrl = null
    
    // Try imagePath first (standard field name)
    if (art.imagePath && typeof art.imagePath === 'string' && art.imagePath.trim().length > 0) {
      imageUrl = art.imagePath.trim()
    }
    // Fallback: check for image (some systems use this)
    else if (art.image && typeof art.image === 'string' && art.image.trim().length > 0) {
      imageUrl = art.image.trim()
    }
    // Fallback: check for imageUrl
    else if (art.imageUrl && typeof art.imageUrl === 'string' && art.imageUrl.trim().length > 0) {
      imageUrl = art.imageUrl.trim()
    }
    
    // If no valid imagePath, use fallback logo
    if (!imageUrl) {
      console.warn(`Article ${id} has no imagePath/image/imageUrl field. Available fields:`, Object.keys(art))
      imageUrl = `${SPA_URL}/syntaktes-black.png`
    }
    
    // Make sure image URL is absolute (starts with http/https)
    if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      // If relative, make it absolute
      imageUrl = imageUrl.startsWith('/') 
        ? `${SPA_URL}${imageUrl}` 
        : `${SPA_URL}/${imageUrl}`
    }
    
    console.log(`Using image URL for article ${id}:`, imageUrl.substring(0, 100))

    // 6) Build <meta> tags with proper escaping
    const metas = [
      `<meta property="og:title" content="${art.title.replace(/"/g, '&quot;').replace(/'/g, '&#39;')}">`,
      `<meta property="og:description" content="${description.replace(/"/g, '&quot;').replace(/'/g, '&#39;')}">`,
      `<meta property="og:image" content="${imageUrl}">`,
      `<meta property="og:image:width" content="1200">`,
      `<meta property="og:image:height" content="630">`,
      `<meta property="og:url" content="${SPA_URL}/articles/${id}">`,
      `<meta property="og:type" content="article">`,
      `<meta name="twitter:card" content="summary_large_image">`,
      `<meta name="twitter:title" content="${art.title.replace(/"/g, '&quot;').replace(/'/g, '&#39;')}">`,
      `<meta name="twitter:description" content="${description.replace(/"/g, '&quot;').replace(/'/g, '&#39;')}">`,
      `<meta name="twitter:image" content="${imageUrl}">`
    ].join('\n')

    // 7) Inject <base> + metas
    const withBase = shell.replace(
      '<head>',
      `<head>\n  <base href="${SPA_URL}/">`
    )
    const html = withBase.replace('</head>', `${metas}\n</head>`)

    // 8) Return with appropriate caching
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600'
      },
      body: html
    }
  } catch (err) {
    console.error('Builder-articles error:', err)
    console.error('Error stack:', err.stack)
    console.error('Event:', JSON.stringify(event, null, 2))
    
    // Return a proper HTML error page so Facebook doesn't see 502
    const errorHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Error</title>
  <meta property="og:title" content="syntaktes.gr">
  <meta property="og:description" content="Article">
  <meta property="og:image" content="https://syntaktes.gr/syntaktes-black.png">
</head>
<body>
  <h1>Error loading article</h1>
  <p>${err.message}</p>
</body>
</html>`
    
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: errorHtml
    }
  }
}
