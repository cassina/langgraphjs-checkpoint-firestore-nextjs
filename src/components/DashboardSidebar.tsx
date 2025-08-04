'use client';

import * as React from 'react';
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupLabel,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from '@/components/ui/sidebar';
import { useEffect, useState} from 'react';
import { MessageSquare } from 'lucide-react';
import {collection, onSnapshot, query, where} from 'firebase/firestore';

import {db} from '@/lib/firebaseApp';
import {useRouter} from 'next/navigation';
import {useUser} from '@/providers/UserProvider';
import {chatPath, conversationsColName} from '@/lib/config';
import {ConversationDoc, SerializedConversation} from '@/lib/interfaces';


// Sidebar component implementation
export function DashboardSidebar() {
    const router = useRouter();
    const { uid } = useUser();
    const [conversations, setConversations] = useState<SerializedConversation[]>([]);
    
    useEffect(() => {
        const q = query(collection(db, conversationsColName), where('userId', '==', uid));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const conversationsList: SerializedConversation[] = snapshot.docs.map((snapshot) => {
                return {
                    id: snapshot.id,
                    ...snapshot.data() as ConversationDoc,
                };
            });
            
            setConversations([...conversationsList])
        });
        
        return () => unsubscribe();
    }, [uid, setConversations]);
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Conversations</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                conversations.map((conv) => (
                                    <SidebarMenuItem key={conv.id}>
                                        <SidebarMenuButton onClick={() => router.push(`/${chatPath}/${conv.id}`)}
                                                           className="flex items-center gap-2">
                                            <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
                                            <span>{conv.title}</span>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}
