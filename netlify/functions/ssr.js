require('dotenv').config()
const fetch = require('node-fetch')
const admin = require('firebase-admin')

async function loadServiceAccount() {
  const gistId = process.env.GCP_FIREBASE_SERVICE_ACCOUNT_GIST_ID
  const token  = process.env.GIST_FETCH_TOKEN
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}` }
  })
  if (!res.ok) throw new Error(`Gist fetch failed: ${res.status}`)
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

  const headers = {
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type':  'text/html',
  }

  try {
    // Netlify gives you event.rawUrl; parse its pathname
    const url = new URL(event.rawUrl, 'https://syntaktes.gr')
    const path = url.pathname
    console.log('SSR for:', path)

    // **inject** for anything under /articles/ (no more strict startsWith)
    if (path.match(/^\/articles\/\d+/)) {
      const id = parseInt(path.split('/')[2], 10)
      const snap = await db.collection('articles')
        .where('id','==',id).limit(1).get()
      if (!snap.empty) {
        const article = snap.docs[0].data()
        const metas = [
          `<meta property="og:title"       content="${article.title.replace(/"/g,'&quot;')}">`,
          `<meta property="og:description" content="${article.content.slice(0,150).replace(/"/g,'&quot;')}">`,
          `<meta property="og:image"       content="${article.imagePath}">`,
          `<meta property="og:url"         content="https://syntaktes.gr${path}">`,
          `<meta property="twitter:card"   content="summary_large_image">`,
          `<meta property="twitter:title"  content="${article.title.replace(/"/g,'&quot;')}">`,
          `<meta property="twitter:description" content="${article.content.slice(0,150).replace(/"/g,'&quot;')}">`,
          `<meta property="twitter:image"  content="${article.imagePath}">`
        ].join('\n')

        let shell = await fetch('https://syntaktes.gr/index.html').then(r=>r.text())
        shell = shell.replace('</head>', metas + '\n</head>')
        return { statusCode: 200, headers, body: shell }
      }
      return { statusCode: 404, headers, body: 'Not found' }
    }

    // everything else → just serve shell
    const shell = await fetch('https://syntaktes.gr/index.html').then(r=>r.text())
    return { statusCode: 200, headers, body: shell }

  } catch(err) {
    console.error(err)
    return { statusCode: 500, headers, body: 'Server error' }
  }
}
