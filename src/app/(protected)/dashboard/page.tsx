'use client';
import { useUser } from '@/providers/UserProvider';

export default function DashboardPage() {
    const { uid, email, userData } = useUser();
    console.info('UserData: ', userData)
    
    return (
        <main>
            <h1>Welcome, {userData.displayName ?? email}!</h1>
            <p>Email verified: {userData.emailVerified}</p>
            <p>Phone: {userData.phoneNumber || 'No phone :('}</p>
            <p>Your UID is: {uid}</p>
        </main>
    );
}
