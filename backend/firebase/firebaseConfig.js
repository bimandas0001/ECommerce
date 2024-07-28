import admin from 'firebase-admin';
import serviceAccount from '../config/serviceAccountKey.js';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: `${serviceAccount.project_id}.appspot.com`,
  databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

const bucket = admin.storage().bucket();
const db = admin.firestore();

export { bucket, db };  // (bucket is used, db is not used till now).
