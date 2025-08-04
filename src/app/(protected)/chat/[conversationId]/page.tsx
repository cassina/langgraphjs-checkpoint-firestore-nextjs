import {getHistory} from '@/lib/ai';
import ChatInput from '@/components/ChatInput';
import {ConversationDoc} from '@/lib/interfaces';
import {conversationsColName} from '@/lib/config';
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

    const conversationSnap = await dbAdmin
        .collection(conversationsColName)
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
                <ChatInput threadId={threadId}/>
            </ChatMessagesProvider>
        </>
    );
}
