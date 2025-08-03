'use server';

import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { authAdmin, dbAdmin } from '@/lib/firebaseAdminFactory';
import { UserProvider } from '@/providers/UserProvider';
import {UserDoc} from '@/lib/interfaces';
import {DashboardSidebar} from '@/components/DashboardSidebar';
import {SidebarProvider} from '@/components/ui/sidebar';

export default async function ProtectedLayout({children}: { children: React.ReactNode; }) {
    const session = (await cookies()).get('session')?.value;
    
    if (!session) {
        redirect('/login')
    }
    
    let uid: string | null = null;
    let email: string | null = null;
    
    try {
        const decoded = await authAdmin.verifySessionCookie(session, true);
        uid = decoded.uid;
        email = decoded.email ?? null;
    } catch (err) {
        console.error('Failed to verify session cookie:', err);
        redirect('/login');
    }
    
    if (!email) {
        throw new Error('No email found in user')
    }
    
    if (!uid) {
        redirect('/login');
    }
    
    // Firestore check
    const snap = await dbAdmin
    .collection('users')
    .doc(uid.toString())
    .get();
    
    if (!snap.exists) {
        redirect('/pending');
    }
    const userData = snap.data() as UserDoc;
    
    return (
        <UserProvider
            user={{
                uid,
                email,
                userData,
            }}
        >
            <SidebarProvider>
                <DashboardSidebar/>
                <div className="w-full">
                    {children}
                </div>
            </SidebarProvider>
        </UserProvider>
    );
}
