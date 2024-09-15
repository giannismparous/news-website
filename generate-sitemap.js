const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const path = require('path');

const links = [
    { url: '/', changefreq: 'daily', priority: 1.0 },
    { url: '/category/all/', changefreq: 'weekly', priority: 0.8 },
    { url: '/category/Πολιτική/', changefreq: 'weekly', priority: 0.8 },
    { url: '/category/Απόψεις/', changefreq: 'weekly', priority: 0.8 },
    { url: '/category/Παρασκήνια/', changefreq: 'weekly', priority: 0.8 },
    { url: '/category/Kedpress_ΕΣΗΕΑ/', changefreq: 'weekly', priority: 0.8 },
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

// Add dynamic article URLs
for (let i = 1; i <= 100; i++) {
    links.push({ url: `/articles/${i}`, changefreq: 'daily', priority: 0.8 });
}

const sitemapStream = new SitemapStream({ hostname: 'https://www.syntaktes.gr' });

// Create a writable stream to save the sitemap to a file
const writeStream = fs.createWriteStream(path.resolve(__dirname, 'public', 'sitemap.xml'));

// Pipe the SitemapStream to the writable stream
sitemapStream.pipe(writeStream);

links.forEach(link => {
    sitemapStream.write(link);
});

sitemapStream.end();

writeStream.on('finish', () => {
    console.log('Sitemap generated and saved to sitemap.xml');
});

writeStream.on('error', err => {
    console.error('Error writing sitemap:', err);
});
