// netlify/functions/builder-articles.js
require('dotenv').config()
const fetch = require('node-fetch')
const admin = require('firebase-admin')

// Load service account from Gist (as before)
async function loadServiceAccount() {
  const gistId = process.env.SERVICE_ACCOUNT_GIST_ID
  const token  = process.env.GIST_FETCH_TOKEN
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}` }
  })
  const gist = await res.json()
  const file = gist.files['service-account.json'] || Object.values(gist.files)[0]
  return JSON.parse(file.content)
}

async function ensureFirebase() {
  if (!admin.apps.length) {
    const creds = await loadServiceAccount()
    admin.initializeApp({ credential: admin.credential.cert(creds) })
  }
  return admin
}

exports.handler = async (event, context) => {
  await ensureFirebase()
  const db = admin.firestore()

  // Extract article ID from the query parameter
  const id = Number(event.queryStringParameters.id)
  if (!id) {
    return { statusCode: 400, body: 'Invalid article ID' }
  }

  // Fetch the SPA shell over HTTP
  const SPA_URL = process.env.SPA_URL || 'https://syntaktes.gr'
  const shellRes = await fetch(`${SPA_URL}/index.html`)
  let shell = await shellRes.text()

  // Inject <base> so assets resolve correctly
  shell = shell.replace('<head>', '<head>\n  <base href="/">')

  // Load article data
  const snap = await db.collection('articles')
    .where('id', '==', id).limit(1).get()
  if (snap.empty) {
    return { statusCode: 404, body: 'Article not found' }
  }
  const article = snap.docs[0].data()

  // Build your <meta> tags
  const metas = [
    `<meta property="og:title" content="${article.title.replace(/"/g,'&quot;')}">`,
    `<meta property="og:description" content="${article.content.slice(0,150).replace(/"/g,'&quot;')}">`,
    `<meta property="og:image" content="${article.imagePath}">`,
    `<meta property="og:url" content="${SPA_URL}/articles/${id}">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${article.title.replace(/"/g,'&quot;')}">`,
    `<meta name="twitter:description" content="${article.content.slice(0,150).replace(/"/g,'&quot;')}">`,
    `<meta name="twitter:image" content="${article.imagePath}">`
  ].join('\n')

  shell = shell.replace('</head>', `${metas}\n</head>`)

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Cache-Control': 'public, max-age=31536000, immutable'
    },
    body: shell
  }
}
