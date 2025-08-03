'use client';

import {createContext, ReactNode, useContext, useState} from 'react';
import {ChatMessage} from '@/lib/interfaces';

type ChatMessagesCtxType = {
    messages: ChatMessage[];
    pushMessage: (msg: ChatMessage) => void;
    setAll: (msgs: ChatMessage[]) => void;
};

const ChatMessagesCtx = createContext<ChatMessagesCtxType | null>(null);

export function ChatMessagesProvider({initialMessages = [], children}: {
    initialMessages?: ChatMessage[];
    children: ReactNode;
}) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    
    const pushMessage = (msg: ChatMessage) => {
        setMessages(prev => [...prev, msg]);
        console.log('psuhed: ', msg);
    };
    
    const setAll = (msgs: ChatMessage[]) => setMessages(msgs);
    
    return (
        <ChatMessagesCtx.Provider value={{messages, pushMessage, setAll}}>
            {children}
        </ChatMessagesCtx.Provider>
    );
}

export function useChatMessages() {
    const ctx = useContext(ChatMessagesCtx);
    if (!ctx) throw new Error('useMessages must be inside <ChatMessagesProvider>');
    return ctx;
}
