// scripts/set-admin-claim.js

const admin = require('firebase-admin');

const serviceAccount = require('./1.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const UID = 'H52dRpgADdO3oqEJ5sg8S3rqsv62';  // ← replace with your actual editor UID

admin
  .auth()
  .setCustomUserClaims(UID, { admin: true })
  .then(() => {
    console.log(`✅ UID ${UID} is now an admin`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Error setting custom claim:', err);
    process.exit(1);
  });
