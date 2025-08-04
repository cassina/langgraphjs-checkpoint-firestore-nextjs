'use client';

import {useState} from 'react';
import {useRouter} from 'next/navigation';

import {loginWithGoogle} from '@/lib/firebaseApp';
import Register from '@/components/Register';
import {apiRoute, authRoute, chatPath, DEFAULT_HEADERS, sessionsRoute} from '@/lib/config';

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    
    async function handleLogin() {
        setLoading(true);
        
        const cred = await loginWithGoogle();
        const idToken = await cred.user.getIdToken(true);
        
        const res = await fetch(`/${apiRoute}/${authRoute}/${sessionsRoute}`, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({ idToken }),
        });
        
        if (res.ok) {
            await new Promise(resolve => setTimeout(resolve, 500));
            router.push(`/${chatPath}`);
        } else {
            console.error('Failed to create session cookie', await res.text());
        }
    }
    
    return(
        loading ?
            <div>Loading</div>
            :
            <Register onLogin={handleLogin} />
    )
}
