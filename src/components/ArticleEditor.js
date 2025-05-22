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

exports.handler = async (event) => {
  await ensureFirebase()
  const db = admin.firestore()

  // 3) Parse article ID from the URL path, not querystring
  const path = event.path || ''           // e.g. '/articles/287'
  const match = path.match(/^\/articles\/(\d+)/)
  if (!match) {
    return { statusCode: 400, body: 'Invalid article ID' }
  }
  const id = Number(match[1])

  // 4) Fetch SPA shell
  const SPA_URL = process.env.SPA_URL || 'https://syntaktes.gr'
  const shell = await fetch(`${SPA_URL}/index.html`).then(r => r.text())

  // 5) Load article data
  const snap = await db.collection('articles')
    .where('id','==',id).limit(1).get()
  if (snap.empty) {
    return { statusCode: 404, body: 'Article not found' }
  }
  const art = snap.docs[0].data()

  // 6) Build <meta> tags
  const metas = [
    `<meta property="og:title"       content="${art.title.replace(/"/g,'&quot;')}">`,
    `<meta property="og:description" content="${art.content.slice(0,150).replace(/"/g,'&quot;')}">`,
    `<meta property="og:image"       content="${art.imagePath}">`,
    `<meta property="og:url"         content="${SPA_URL}/articles/${id}">`,
    `<meta name="twitter:card"       content="summary_large_image">`,
    `<meta name="twitter:title"      content="${art.title.replace(/"/g,'&quot;')}">`,
    `<meta name="twitter:description"content="${art.content.slice(0,150).replace(/"/g,'&quot;')}">`,
    `<meta name="twitter:image"      content="${art.imagePath}">`
  ].join('\n')

  // 7) Inject <base> + metas
  const withBase = shell.replace(
    '<head>',
    `<head>\n  <base href="${SPA_URL}/">`
  )
  const html = withBase.replace('</head>', `${metas}\n</head>`)

  // 8) Return with edge-caching
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=31536000, immutable'
    },
    body: html
  }
}