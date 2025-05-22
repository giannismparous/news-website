require('dotenv').config()
const fs = require('fs').promises
const pathModule = require('path')
const fetch = require('node-fetch')
const admin = require('firebase-admin')

// Load service account JSON from GitHub Gist
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

// Initialize Firebase Admin if not already
async function ensureFirebase() {
  if (!admin.apps.length) {
    const creds = await loadServiceAccount()
    admin.initializeApp({ credential: admin.credential.cert(creds) })
  }
  return admin
}

exports.handler = async (event) => {
  try {
    await ensureFirebase()
    const db = admin.firestore()

    // Get the incoming path, e.g. '/articles/287'
    const path = event.path

    // Only handle /articles/:id
    if (!path.startsWith('/articles/')) {
      return { statusCode: 404, body: 'Not found' }
    }

    // Parse the article ID
    const parts = path.split('/').filter(Boolean)
    const id = Number(parts[1])
    if (!id) {
      return { statusCode: 400, body: 'Invalid article ID' }
    }

    // Query Firestore for the article
    const snap = await db.collection('articles')
      .where('id', '==', id).limit(1).get()
    if (snap.empty) {
      return { statusCode: 404, body: 'Article not found' }
    }
    const article = snap.docs[0].data()

    // Read the built React shell directly from disk
    const buildPath = pathModule.join(__dirname, '../../build/index.html')
    let shell = await fs.readFile(buildPath, 'utf8')

    // Inject <base href="/"> so all relative assets resolve to your domain root
    shell = shell.replace(
      '<head>',
      `<head>\n  <base href=\"/\">`
    )

    // Prepare meta tags
    const metas = [
      `<meta property=\"og:title\" content=\"${article.title.replace(/\"/g, '&quot;')}\">`,
      `<meta property=\"og:description\" content=\"${article.content.slice(0,150).replace(/\"/g, '&quot;')}\">`,
      `<meta property=\"og:image\" content=\"${article.imagePath}\">`,
      `<meta property=\"og:url\" content=\"https://syntaktes.gr${path}\">`,
      `<meta property=\"twitter:card\" content=\"summary_large_image\">`,
      `<meta property=\"twitter:title\" content=\"${article.title.replace(/\"/g, '&quot;')}\">`,
      `<meta property=\"twitter:description\" content=\"${article.content.slice(0,150).replace(/\"/g, '&quot;')}\">`,
      `<meta property=\"twitter:image\" content=\"${article.imagePath}\">`
    ].join('\n')

    // Inject metas before closing </head>
    shell = shell.replace('</head>', `${metas}\n</head>`)

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html' },
      body: shell
    }
  } catch (err) {
    console.error('SSR error:', err)
    return {
      statusCode: 500,
      body: `SSR error: ${err.message}`
    }
  }
}