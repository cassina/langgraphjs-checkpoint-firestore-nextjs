import * as admin from 'firebase-admin';
import {getApps} from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

console.debug('🔥 Loading firebaseAdmin.ts...', process.env.NODE_ENV);

const isDev = process.env.NODE_ENV === 'development';
const firestoreEmulatorHost = process.env.FIRESTORE_EMULATOR_HOST || null;
const authEmulatorHost = process.env.FIREBASE_AUTH_EMULATOR_HOST || null;

if (isDev) {
    if (!firestoreEmulatorHost || !authEmulatorHost) {
        throw new Error('No host!')
    }
}

export const getGCPCredentials = () => {
    // for Vercel, use environment variables
    return process.env.GCP_PRIVATE_KEY
        ? {
            credentials: {
                client_email: process.env.GCP_SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.GCP_PRIVATE_KEY,
            },
            projectId: process.env.GCP_PROJECT_ID,
        }
        : { projectId: process.env.GCLOUD_PROJECT };
};


const apps = getApps();
const app = apps.length === 0 ? admin.initializeApp(getGCPCredentials()) : apps[0];

export const authAdmin = getAuth(app);
export const dbAdmin = getFirestore(app);

