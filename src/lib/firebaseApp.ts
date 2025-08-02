'use client';

import { initializeApp } from 'firebase/app';
import {connectAuthEmulator, getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth';
import {connectFirestoreEmulator, getFirestore} from 'firebase/firestore';

// Your web app's Firebase configuration
export const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

export const firebaseApp = initializeApp({
    ...firebaseConfig
});

export const auth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);

export const googleProvider = new GoogleAuthProvider();
export const loginWithGoogle = () => {
    return signInWithPopup(auth, googleProvider);
}

const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
    connectAuthEmulator(auth, process.env.NEXT_PUBLIC_FIREBASE_AUTH_EMULATOR_HOST);
    const [firestoreHost, firestorePort] = process.env.NEXT_PUBLIC_FIRESTORE_EMULATOR_HOST.split(':');
    connectFirestoreEmulator(db, firestoreHost, Number(firestorePort));
}

