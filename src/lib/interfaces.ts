import {RunnableConfig} from '@langchain/core/runnables';
import {StreamMode} from '@langchain/langgraph';

export interface UserDoc {
    email: string;
    creationTime?: string; // ISO timestamp from Firebase Auth
    emailVerified?: boolean;
    displayName?: string | null;
    photoURL?: string | null;
    phoneNumber?: string | null;
    disabled?: boolean;
}

export interface ConversationDoc {
    createdAt: string;
    threadId: string;
    userId: string;
    title: string;
}

export interface SerializedConversation extends ConversationDoc {
    id: string;
}

export interface ChatMessage {
    role: 'ai' | 'human';
    content: string;
}


export interface StreamConfig extends RunnableConfig {
    streamMode: StreamMode;
}
