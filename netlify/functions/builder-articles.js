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
    await ensureFirebase()
    const db = admin.firestore()

    // 3) Parse article ID from the URL path
    // Netlify passes the splat as part of event.path
    // event.path will be like: /.netlify/functions/builder-articles/287
    const path = event.path || ''
    
    // Extract ID from path (handles both direct calls and redirects)
    let id
    const pathMatch = path.match(/builder-articles\/(\d+)/)
    if (pathMatch) {
      id = Number(pathMatch[1])
    } else {
      // Fallback: try to extract from any numeric path segment
      const fallbackMatch = path.match(/\/(\d+)$/)
      if (fallbackMatch) {
        id = Number(fallbackMatch[1])
      }
    }
    
    if (!id || isNaN(id)) {
      return { statusCode: 400, body: 'Invalid article ID' }
    }

    // 4) Fetch SPA shell
    const SPA_URL = process.env.SPA_URL || 'https://syntaktes.gr'
    const shellRes = await fetch(`${SPA_URL}/index.html`)
    if (!shellRes.ok) {
      throw new Error(`Failed to fetch shell: ${shellRes.status}`)
    }
    const shell = await shellRes.text()

    // 5) Load article data (filter out deleted articles)
    const snap = await db.collection('articles')
      .where('id', '==', id)
      .where('deleted', '==', false)
      .limit(1)
      .get()
    
    if (snap.empty) {
      return { statusCode: 404, body: 'Article not found' }
    }
    const art = snap.docs[0].data()

    // Strip HTML from content for description
    const strippedContent = stripHtml(art.content)
    const description = strippedContent.slice(0, 200).trim()

    // Ensure imagePath exists and is absolute URL
    // Firebase Storage URLs are already absolute, but handle edge cases
    let imageUrl = art.imagePath || `${SPA_URL}/syntaktes-black.png`
    
    // Make sure image URL is absolute (starts with http/https)
    if (imageUrl && !imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
      // If relative, make it absolute
      imageUrl = imageUrl.startsWith('/') 
        ? `${SPA_URL}${imageUrl}` 
        : `${SPA_URL}/${imageUrl}`
    }

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
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain' },
      body: `Error: ${err.message}`
    }
  }
}
