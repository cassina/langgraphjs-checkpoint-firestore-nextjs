'use server';

import {ai} from '@/lib/ai';
import ChatInput from '@/components/ChatInput';
import {ConversationDoc} from '@/lib/interfaces';
import {dbAdmin} from '@/lib/firebaseAdminFactory';
import ChatMessages from '@/components/ChatMessages';
import {ChatMessagesProvider} from '@/providers/ChatMessagesProvider';

type ConversationPageParams = {
    params: Promise<{
        conversationId: string;
    }>
};

export default async function ConversationPage({ params }: ConversationPageParams) {
    const { conversationId } = await params;
    const {getHistory} = await ai();

    const conversationSnap = await dbAdmin
        .collection('conversations')
        .doc(conversationId).get();
    
    if (!conversationSnap.exists) {
        throw new Error('404 not found')
    }
    
    const { threadId } = conversationSnap.data() as ConversationDoc;
    const history = await getHistory(threadId);
    
    return (
        <>
            <ChatMessagesProvider initialMessages={history}>
                <ChatMessages />
                <ChatInput />
            </ChatMessagesProvider>
        </>
    );
}
