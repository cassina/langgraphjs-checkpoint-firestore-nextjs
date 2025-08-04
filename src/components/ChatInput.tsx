'use client';

import {useEffect, useState} from 'react';
import {SimpleTextarea} from '@/components/SimpleTextarea';
import {useChatMessages} from '@/providers/ChatMessagesProvider';
import {apiRoute, chatRoute, DEFAULT_HEADERS} from '@/lib/config';
import AIStreamingMessage from '@/components/AIStreamingMessage';

export default function ChatInput({ threadId }: {threadId: string}) {
    const {pushMessage} = useChatMessages();
    const [userInput, setUserInput] = useState('');
    const [chunks, setChunks] = useState<string[]>([]);
    const [sending, setSending] = useState(false);
    
    const handleOnSend = async () => {
        if (!userInput.trim()) return;
        
        setSending(true);
        
        pushMessage({role: 'human', content: userInput});
        setUserInput('');
        
        const res = await fetch(`/${apiRoute}/${chatRoute}`, {
            method: 'POST',
            headers: DEFAULT_HEADERS,
            body: JSON.stringify({threadId: threadId, content: userInput}),
        });
        
        if(!res.ok) {
            const error = await res.text();
            setSending(false);
            throw new Error(`Failed to send message: ${JSON.stringify(error)}`);
        }
        
        if (!res.body) {
            setSending(false);
            throw new Error('No response body from server :(');
        }
        
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        
        while (true) {
            const {value, done} = await reader.read();
            if (done) { break; }
            
            buffer += decoder.decode(value, {stream: true});
            const lines = buffer.split('\n');
            buffer = lines.pop() ?? '';
            
            for (const line of lines) {
                if (!line.trim()) continue;
                
                // payload can be either a plain object or the funky array
                const raw = JSON.parse(line);
                
                const content =
                    Array.isArray(raw) && raw[0]?.kwargs?.content !== undefined
                        ? raw[0].kwargs.content                   // LangGraph’s AIMessageChunk
                        : (raw as {content?: string}).content;    // plain {content} shape
                
                if (!content) continue;                       // skip empties
                
                setChunks(prev => [...prev, content]);
            }
        }
        
        setSending(false);
        
    };
    
    useEffect(() => {
        if(chunks.length > 0 && !sending) {
            pushMessage({
                role: 'ai',
                content: chunks
                    .map(chunk => chunk)
                    .join('')
            });
            setChunks([]);
        }
    }, [chunks, sending, pushMessage]);
    
    return (
        <div className='mx-auto max-w-[80%] space-y-4'>
            {
                chunks.length > 0 &&
                <AIStreamingMessage chunks={chunks}
                                    isTyping={sending} />
            }
            
            <SimpleTextarea
                input={userInput}
                setInputAction={setUserInput}
                onSendAction={handleOnSend}
                disabled={sending}
            />
        </div>
    );
}
