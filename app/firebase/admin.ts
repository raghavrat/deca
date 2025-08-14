import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app;

if (!getApps().length) {
  try {
    const serviceAccountJson = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || '', 'base64').toString('utf8')
    );

    app = initializeApp({
      credential: cert(serviceAccountJson)
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
} else {
  app = getApp();
}

export const adminAuth = getAuth();
export const adminDb = getFirestore();

