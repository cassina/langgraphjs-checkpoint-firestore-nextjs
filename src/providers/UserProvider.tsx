'use client';

import React, { createContext, useContext } from 'react';
import {UserDoc} from '@/lib/interfaces';

export type UserContextType = {
    uid: string;
    email: string;
    userData: UserDoc;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
                                 user,
                                 children,
                             }: {
    user: UserContextType;
    children: React.ReactNode;
}) {
    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

export function useUser() {
    const ctx = useContext(UserContext);
    if (!ctx) throw new Error('useUser must be inside UserProvider');
    return ctx;
}
