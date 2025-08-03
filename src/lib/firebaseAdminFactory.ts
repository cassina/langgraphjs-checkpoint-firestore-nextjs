// 'use server';

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
const apps = getApps();
const app = apps.length === 0 ? admin.initializeApp({ projectId: process.env.GCLOUD_PROJECT }) : apps[0];

export const authAdmin = getAuth(app);
export const dbAdmin = getFirestore(app);

