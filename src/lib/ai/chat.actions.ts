'use server'

import {Firestore} from '@google-cloud/firestore';
import {AIMessage, BaseMessage, HumanMessage} from '@langchain/core/messages';

import {conversationsColName} from '@/lib/config';
import {dbAdmin} from '@/lib/firebaseAdminFactory';
import {ChatMessage, StreamConfig} from '@/lib/interfaces';

import {getGraph} from './chat.graph';

const _graph = getGraph();

export async function getHistory(conversationId: string): Promise<ChatMessage[]> {
    const cfg = { configurable: { thread_id: conversationId}}
    const newMessages: ChatMessage[] = [];
    
    const state = await _graph.getState(cfg);
    const stateMessages: HumanMessage[] | AIMessage[] = state.values?.messages;
    
    if(!stateMessages) {
        return newMessages;
    }
    stateMessages.forEach((msg: HumanMessage | AIMessage) => {
        newMessages.push({
            role: msg instanceof HumanMessage ? 'human' : 'ai',
            content: msg.content as string,
        });
    });
    
    return newMessages;
}

export async function streamMessage(threadId: string, input: BaseMessage) {
    const cfg: StreamConfig = { configurable: { thread_id: threadId }, streamMode: 'messages' };
    const encoder = new TextEncoder();
    
    return new ReadableStream({
        async start(controller) {
            for await (const chunk of await _graph.stream({messages: [input]}, cfg)) {
                // Serialize each chunk
                controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'));
            }
            controller.close();
        }
    });
}

export async function createConversation(title: string, userId: string, threadId: string, db: Firestore = dbAdmin) {
    const newConvo = await db
        .collection(conversationsColName)
        .add({title, userId, threadId});
    return newConvo.id;
}
