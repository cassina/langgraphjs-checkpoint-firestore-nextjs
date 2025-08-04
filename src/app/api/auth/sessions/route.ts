import { NextResponse } from 'next/server';
import { authAdmin } from '@/lib/firebaseAdminFactory';

export async function POST(req: Request) {
    const { idToken } = await req.json();
    
    await authAdmin.verifyIdToken(idToken, true);
    const sessionCookie = await authAdmin.createSessionCookie(idToken, {
        expiresIn: 60 * 60 * 24 * 5 * 1000, // 5 days
    });
    
    const res = NextResponse.json({ ok: true });
    res.cookies.set({
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 5,
        name: 'session',
        path: '/',
        sameSite: 'strict',
        secure: true,
        value: sessionCookie,
    });
    
    return res;
}
