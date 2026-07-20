import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import type { App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App | null = null;

if (!getApps().length) {
  try {
    if (!process.env.FIREBASE_SERVICE_ACCOUNT_BASE64) {
      throw new Error('Missing Firebase service account configuration');
    }
    
    const serviceAccountJson = JSON.parse(
      Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64, 'base64').toString('utf8')
    );

    app = initializeApp({
      credential: cert(serviceAccountJson)
    });
  } catch {
    // Routes return a controlled configuration error when credentials are absent.
    // Keeping module initialization non-fatal allows static pages to build.
    app = null;
  }
} else {
  app = getApp();
}

export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app ? getFirestore(app) : null;
