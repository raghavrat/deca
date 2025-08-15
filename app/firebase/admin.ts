import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app;

if (!getApps().length) {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      console.error('FIREBASE_SERVICE_ACCOUNT_BASE64 environment variable is not set');
      throw new Error('Missing Firebase service account configuration');
    }
    
    const serviceAccountJson = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
    );

    app = initializeApp({
      credential: cert(serviceAccountJson)
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw error; // Re-throw to make the error more visible
  }
} else {
  app = getApp();
}

export const adminAuth = app ? getAuth(app) : null as any;
export const adminDb = app ? getFirestore(app) : null as any;

