const functions = require('firebase-functions');
const admin     = require('firebase-admin');
const fetch     = require('node-fetch');

admin.initializeApp();
const db = admin.firestore();

console.log('✅ Loaded NEW SSR function code');

// ─── sanitize content for use inside a meta tag ───
function escapeHtml(str) {
  const noTags = str.replace(/<[^>]*>/g, '');
  return noTags
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

// ─── fetch the hosted index.html at runtime ───
async function loadIndexHtml(req) {
  const origin = 'https://syntaktes.gr';
  const url    = `${origin}/index.html`;
  console.log('SSR fetching index.html from', url);
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch index.html: ${res.status}`);
  return await res.text();
}

// ─── inject the meta tags ───
function injectMeta(html, metas) {
  const tags = metas.map(m => {
    const safe = escapeHtml(m.content);
    return `<meta property="${m.property}" content="${safe}">`;
  }).join('\n');
  return html.replace('</head>', tags + '\n</head>');
}

exports.ssr = functions
  .runWith({ minInstances: 0 })
  .https.onRequest(async (req, res) => {
    try {
      const path = req.path;
      console.log('SSR hit for path:', path);

      if (path.startsWith('/articles/')) {
        const id = parseInt(path.split('/')[2], 10);
        if (isNaN(id)) return res.status(404).send('Not found');

        const snap = await db.collection('articles')
          .where('id', '==', id)
          .limit(1)
          .get();
        if (snap.empty) return res.status(404).send('Not found');

        const article = snap.docs[0].data();
        const metas = [
          { property: 'og:title',       content: article.title },
          { property: 'og:description', content: article.content.slice(0,150) },
          { property: 'og:image',       content: article.imagePath },
          { property: 'og:url',         content: `https://syntaktes.gr${path}` },
          { property: 'twitter:card',    content: 'summary_large_image' },
          { property: 'twitter:title',   content: article.title },
          { property: 'twitter:description', content: article.content.slice(0,150) },
          { property: 'twitter:image',   content: article.imagePath }
        ];

        const html = await loadIndexHtml(req);
        return res.status(200).send(injectMeta(html, metas));
      }

      // fallback: just serve the SPA shell
      const html = await loadIndexHtml(req);
      return res.status(200).send(html);

    } catch (err) {
      console.error(err);
      res.status(500).send('Server error');
    }
  });
