'use client'

import * as motion from 'motion/react-client'

import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { ChatMessage } from '@/lib/interfaces'

type MessageRendererProps = {
    message: ChatMessage
}

const animationProps = {
    initial: { opacity: 0, scale: 0 },
    animate: { opacity: 1, scale: 1 },
    transition: {
        duration: 0.4,
        scale: { type: 'spring', visualDuration: 0.4, bounce: 0.5 },
    },
}

const MessageRenderer = ({ message }: MessageRendererProps) => {
    const isAssistant = message.role === 'ai'
    
    return (
        <div
            className={`
                flex w-full
                ${isAssistant ? 'justify-start' : 'justify-end'}
            `}
        >
            <div
                className={`
                    flex items-end
                    ${isAssistant ? '' : 'flex-row-reverse'}
                    gap-2
                    max-w-full
                `}
            >
                <Avatar className='w-8 h-8 shrink-0'>
                    <AvatarImage
                        src={isAssistant ? '/assistant-avatar.png' : '/user-avatar.png'}
                        alt={message.role}
                    />
                    <AvatarFallback>
                        {isAssistant ? 'A' : 'U'}
                    </AvatarFallback>
                </Avatar>
                
                <motion.div { ...animationProps}>
                    <Card
                        className={`
                            rounded-2xl border-0 shadow-none
                            px-0 py-0
                            max-w-[75vw] sm:max-w-md
                            ${
                            isAssistant
                                ? 'bg-gray-100 rounded-tl-md'
                                : 'bg-blue-50 rounded-tr-md'
                        }
                        `}
                    >
                        <CardContent className='p-3 sm:p-4 text-[15px] text-gray-900'>
                            {message.content}
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    )
}

export default MessageRenderer
