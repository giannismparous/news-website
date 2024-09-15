const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');
const path = require('path');
// const { fetchInfo } = require('./src/firebase/firebaseConfig');

// Function to generate the sitemap
const generateSitemap = async () => {
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

    try {
        // const info = await fetchInfo('articles'); // Adjust the collection key
        // if (info) {
            const article_id_counter=160;
            const removed_ids=[10,12,14,16,17,25,27,32,39,41,42,45,46,47,49,50,51,52,53,60,61,63,64,65,66,67,68,69,70,72,74,79,80,81,87,90,92,107,117,118,119,120,131,133,134,137];
            const removed_ids_as_strings = removed_ids.map(id => id.toString());
            // Add dynamic article URLs
            for (let i = 1; i <= article_id_counter; i++) {
                if (!removed_ids_as_strings.includes(i.toString())) {
                    links.push({ url: `/articles/${i}`, changefreq: 'daily', priority: 0.8 });
                }
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

            // Once the sitemap is written, prepend the XML declaration
            writeStream.on('finish', () => {
                fs.readFile(path.resolve(__dirname, 'public', 'sitemap.xml'), 'utf8', (err, data) => {
                    if (err) {
                        console.error('Error reading sitemap file:', err);
                        return;
                    }

                    // Add XML declaration
                    const xmlWithDeclaration = `<?xml version="1.0" encoding="UTF-8"?>\n${data}`;

                    // Write the new XML content with declaration
                    fs.writeFile(path.resolve(__dirname, 'public', 'sitemap.xml'), xmlWithDeclaration, 'utf8', err => {
                        if (err) {
                            console.error('Error writing XML declaration to sitemap file:', err);
                            return;
                        }
                        console.log('Sitemap generated and saved to sitemap.xml with XML declaration');
                    });
                });
            });

            writeStream.on('error', err => {
                console.error('Error writing sitemap:', err);
            });
        // } else {
        //     console.log('No info document found.');
        // }
    } catch (error) {
        console.error('Error generating sitemap:', error);
    }
};

generateSitemap();
