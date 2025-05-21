const fs = require('fs');
const { parseStringPromise } = require('xml2js');

(async () => {
  // Read the sitemap that lives in build/
  const mapXml = await fs.promises.readFile('build/sitemap.xml', 'utf8');
  const { urlset } = await parseStringPromise(mapXml);

  const include = urlset.url
    .map(u => new URL(u.loc[0]).pathname)
    .filter(path => !!path);

  if (!include.includes('/')) include.unshift('/');

  const pkgPath = 'package.json';
  const pkg = JSON.parse(await fs.promises.readFile(pkgPath, 'utf8'));
  pkg.reactSnap.include = include;
  await fs.promises.writeFile(pkgPath, JSON.stringify(pkg, null, 2));

  console.log(`✔ reactSnap.include populated with ${include.length} routes`);
})();