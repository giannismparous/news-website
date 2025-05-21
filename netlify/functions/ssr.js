const admin = require('firebase-admin');

// Your Firebase config from Netlify env-vars
const firebaseConfig = {
  apiKey:            process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain:        process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.REACT_APP_FIREBASE_APP_ID,
};

// Initialize the Admin SDK
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  ...firebaseConfig,
});

const db = admin.firestore();

exports.handler = async (event, context) => {
  const resHeaders = {
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type':  'text/html',
  };

  try {
    const path = new URL(event.rawUrl).pathname;
    console.log('SSR hit for path:', path);

    // 1) Non-article ⇒ just proxy your SPA shell
    if (!path.startsWith('/articles/')) {
      let shell = await fetch('https://syntaktes.gr/index.html').then(r => r.text());
      return { statusCode: 200, headers: resHeaders, body: shell };
    }

    // 2) Article ⇒ pull its data
    const id = parseInt(path.split('/')[2], 10);
    if (isNaN(id)) {
      return { statusCode: 404, headers: resHeaders, body: 'Not found' };
    }

    const snap = await db.collection('articles')
      .where('id', '==', id)
      .limit(1)
      .get();

    if (snap.empty) {
      return { statusCode: 404, headers: resHeaders, body: 'Not found' };
    }

    const article = snap.docs[0].data();

    // 3) Build your <meta> tags
    const metas = [
      `<meta property="og:title"       content="${article.title.replace(/"/g, '&quot;')}">`,
      `<meta property="og:description" content="${article.content.slice(0,150).replace(/"/g, '&quot;')}">`,
      `<meta property="og:image"       content="${article.imagePath}">`,
      `<meta property="og:url"         content="https://syntaktes.gr${path}">`,
      `<meta property="twitter:card"         content="summary_large_image">`,
      `<meta property="twitter:title"        content="${article.title.replace(/"/g, '&quot;')}">`,
      `<meta property="twitter:description"  content="${article.content.slice(0,150).replace(/"/g, '&quot;')}">`,
      `<meta property="twitter:image"        content="${article.imagePath}">`
    ].join('\n');

    // 4) Inject into your shell
    let shell = await fetch('https://syntaktes.gr/index.html').then(r => r.text());
    shell = shell.replace('</head>', metas + '\n</head>');

    return { statusCode: 200, headers: resHeaders, body: shell };

  } catch (err) {
    console.error(err);
    return { statusCode: 500, headers: resHeaders, body: 'Server error' };
  }
};
