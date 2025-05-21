// netlify/functions/ssr.js
const admin = require('firebase-admin')
const fetch = require('node-fetch')

admin.initializeApp()
const db = admin.firestore()

exports.handler = async (event, context) => {
  // no caching at the CDN or browser
  const headers = {
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type': 'text/html'
  }

  try {
    // parse the incoming path
    const url = new URL(event.rawUrl)
    const path = url.pathname       // e.g. "/articles/287"

    // if it’s NOT an article, just serve your SPA shell
    if (!path.startsWith('/articles/')) {
      const shell = await fetch('https://syntaktes.gr/index.html').then(r => r.text())
      return { statusCode: 200, headers, body: shell }
    }

    // extract the article ID
    const id = parseInt(path.split('/')[2], 10)
    if (isNaN(id)) {
      return { statusCode: 404, headers, body: 'Not found' }
    }

    // fetch from Firestore
    const snap = await db
      .collection('articles')
      .where('id', '==', id)
      .limit(1)
      .get()

    if (snap.empty) {
      return { statusCode: 404, headers, body: 'Not found' }
    }

    const article = snap.docs[0].data()
    // build your Open Graph + Twitter tags
    const metas = [
      `<meta property="og:title"       content="${article.title.replace(/"/g,'&quot;')}">`,
      `<meta property="og:description" content="${article.content.slice(0,150).replace(/"/g,'&quot;')}">`,
      `<meta property="og:image"       content="${article.imagePath}">`,
      `<meta property="og:url"         content="https://syntaktes.gr${path}">`,
      `<meta name="twitter:card"       content="summary_large_image">`,
      `<meta name="twitter:title"      content="${article.title.replace(/"/g,'&quot;')}">`,
      `<meta name="twitter:description"content="${article.content.slice(0,150).replace(/"/g,'&quot;')}">`,
      `<meta name="twitter:image"      content="${article.imagePath}">`
    ].join('\n')

    // fetch your published shell, inject the tags, and return
    let shell = await fetch('https://syntaktes.gr/index.html').then(r => r.text())
    shell = shell.replace('</head>', metas + '\n</head>')

    return { statusCode: 200, headers, body: shell }
  }
  catch (err) {
    console.error(err)
    return { statusCode: 500, headers, body: 'Server error' }
  }
}
