'use server';

import {AIMessage, BaseMessage, HumanMessage} from '@langchain/core/messages';

import {ChatMessage, StreamConfig} from '@/lib/interfaces';

import {getGraph} from './chat.graph';

export async function makeActions(graph = getGraph()) {
    async function getHistory(conversationId: string): Promise<ChatMessage[]> {
        const cfg = { configurable: { thread_id: conversationId}}
        const newMessages: ChatMessage[] = [];
        
        const state = await graph.getState(cfg);
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
    
    async function streamMessage(threadId: string, input: BaseMessage) {
        const cfg: StreamConfig = { configurable: { thread_id: threadId }, streamMode: 'messages' };
        const encoder = new TextEncoder();
        
        return new ReadableStream({
            async start(controller) {
                for await (const chunk of await graph.stream({messages: [input]}, cfg)) {
                    // Serialize each chunk
                    controller.enqueue(encoder.encode(JSON.stringify(chunk) + '\n'));
                }
                controller.close();
            }
        });
    }
    
    return { getHistory, streamMessage };
}

// export const sendMsg = async (threadId: string, msg: string) => {
//     const cfg = { configurable: { thread_id: threadId } };
//     const inputMessage = new HumanMessage(msg);
//     const graph = await getGraph();
//     const response = await graph.invoke({ messages: [inputMessage]}, cfg);
//
//     return JSON.stringify(response)
// }
