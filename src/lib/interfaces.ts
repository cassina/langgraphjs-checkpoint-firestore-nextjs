export interface UserDoc {
    email: string;
    creationTime?: string; // ISO timestamp from Firebase Auth
    emailVerified?: boolean;
    displayName?: string | null;
    photoURL?: string | null;
    phoneNumber?: string | null;
    disabled?: boolean;
}
