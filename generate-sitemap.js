require('dotenv').config();
const admin = require('firebase-admin');
const { SitemapStream } = require('sitemap');
const fs = require('fs');
const path = require('path');

async function loadServiceAccount() {
  const gistId = process.env.SERVICE_ACCOUNT_GIST_ID;
  const token  = process.env.GIST_FETCH_TOKEN;
  const res = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: { Authorization: `token ${token}` }
  });
  if (!res.ok) throw new Error(`Gist fetch failed: ${res.status}`);
  const gist = await res.json();
  const file = gist.files['service-account.json'] || Object.values(gist.files)[0];
  return JSON.parse(file.content);
}


const generateSitemap = async () => {

    const serviceAccount = await loadServiceAccount();
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    const db = admin.firestore();

    const links = [
        { url: '/', changefreq: 'daily', priority: 1.0 },
        { url: '/category/all/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Πολιτική/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Απόψεις/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Παρασκήνια/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Kedpress_ΕΣΗΕΑ/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Οικονομία/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Εκτός_Συνόρων/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Αγορά_Καταναλωτές/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Plus_Life/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Σπορ/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Art/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Pet/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Υγεία_Συντάξεις/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Εργασία/', changefreq: 'weekly', priority: 0.8 },
        { url: '/category/Δικαστικά/', changefreq: 'weekly', priority: 0.8 },
        { url: '/podcasts/', changefreq: 'weekly', priority: 0.7 },
        { url: '/radio/', changefreq: 'weekly', priority: 0.7 },
        { url: '/videotv/', changefreq: 'weekly', priority: 0.7 },
        { url: '/about/', changefreq: 'monthly', priority: 0.6 },
        { url: '/contact/', changefreq: 'monthly', priority: 0.6 },
        { url: '/terms/', changefreq: 'monthly', priority: 0.6 }
    ];

  const infoSnap = await db.collection('articles').doc('info').get()
  if (!infoSnap.exists) throw new Error('Missing articles/info doc')
  const { article_id_counter, removed_ids = [] } = infoSnap.data()
  const removedSet = new Set(removed_ids.map(String))

  for (let i = 1; i <= article_id_counter; i++) {
    if (!removedSet.has(String(i))) {
      links.push({
        url: `/articles/${i}`,
        changefreq: 'daily',
        priority: 0.8
      })
    }
  }

  const sitemapStream = new SitemapStream({ hostname: 'https://www.syntaktes.gr' })
  const writeStream   = fs.createWriteStream(path.join(__dirname, 'public', 'sitemap.xml'))
  sitemapStream.pipe(writeStream)

  for (const link of links) sitemapStream.write(link)
  sitemapStream.end()

  await new Promise((resolve, reject) => {
    writeStream.on('finish', resolve)
    writeStream.on('error', reject)
  })

  console.log('✅ sitemap.xml generated—total URLs:', links.length)
}

generateSitemap().catch(err => {
  console.error(err)
  process.exit(1)
})