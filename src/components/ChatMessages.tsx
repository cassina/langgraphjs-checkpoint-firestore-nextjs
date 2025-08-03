'use client'

import { ChatMessage } from '@/lib/interfaces'
import {useScrollToBottom} from '@/hooks/use-scroll';
import { ScrollArea } from '@/components/ui/scroll-area'
import MessageRenderer from '@/components/MessageRenderer'
import {useChatMessages} from '@/providers/ChatMessagesProvider';

export default function ChatMessages() {
    const { messages } = useChatMessages();
    const bottomRef = useScrollToBottom<HTMLDivElement>([messages]);
    
    return (
        <ScrollArea className='h-[calc(100vh-6rem)] px-2 max-w-[80%] mx-auto'>
            <div className='flex flex-col gap-4 py-4'>
                {
                    messages.map((msg: ChatMessage, i: number) => (
                        <MessageRenderer key={i} message={msg} />
                    ))
                }
            </div>
            
            {/* sentinel div to keep us pinned to the end */}
            <div ref={bottomRef} />
        </ScrollArea>
    )
}
