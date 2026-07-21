import { initializeApp, getApps, cert, getApp } from 'firebase-admin/app';
import type { App } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

let app: App | null = null;
const hasServiceAccount = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64);

export const developmentIdTokenSessionsEnabled =
  process.env.NODE_ENV === 'development' && !hasServiceAccount;

if (!getApps().length) {
  try {
    if (hasServiceAccount) {
      const serviceAccountJson = JSON.parse(
        Buffer.from(process.env.FIREBASE_SERVICE_ACCOUNT_BASE64!, 'base64').toString('utf8')
      );

      app = initializeApp({
        credential: cert(serviceAccountJson)
      });
    } else if (developmentIdTokenSessionsEnabled && process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      // Local previews can verify short-lived Firebase ID tokens without a
      // service-account private key. Production never enables this fallback.
      app = initializeApp({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      });
    } else {
      throw new Error('Missing Firebase service account configuration');
    }
  } catch {
    // Routes return a controlled configuration error when credentials are absent.
    // Keeping module initialization non-fatal allows static pages to build.
    app = null;
  }
} else {
  app = getApp();
}

export const adminAuth = app ? getAuth(app) : null;
export const adminDb = app && !developmentIdTokenSessionsEnabled ? getFirestore(app) : null;
