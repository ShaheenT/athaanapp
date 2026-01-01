import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

// Load service account JSON
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH || './config/firebaseServiceAccount.json';
const serviceAccount = JSON.parse(fs.readFileSync(path.resolve(serviceAccountPath), 'utf-8'));

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

export { admin };

// Export verifyFirebaseToken function
export async function verifyFirebaseToken(token: string) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
}
