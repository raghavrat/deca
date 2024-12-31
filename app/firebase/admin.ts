import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

if (!getApps().length) {
  try {
    const serviceAccountJson = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64 || '', 'base64').toString('utf8')
    );

    initializeApp({
      credential: cert(serviceAccountJson)
    });
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
  }
}

export const adminAuth = getAuth();

