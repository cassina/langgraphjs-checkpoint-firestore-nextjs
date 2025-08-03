'use client';

import { useRef, useEffect, type Dispatch, type SetStateAction } from 'react';
import { Textarea } from '@/components/ui/textarea';
import {Button} from '@/components/ui/button';
import {ArrowUpIcon} from '@/components/Icons';

type SimpleTextareaProps = {
    input: string;
    setInputAction: Dispatch<SetStateAction<string>>;
    onSendAction: (message: string) => void;
    disabled?: boolean;
    className?: string;
};

export function SimpleTextarea({
    input,
    setInputAction,
    onSendAction,
    disabled = false,
    className,
}: SimpleTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    
    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight + 2}px`;
        }
    }, [input]);
    
    return (
        <div className="relative w-full flex gap-4">
            <Textarea
                ref={textareaRef}
                className={className ?? 'w-full min-h-[24px] max-h-[400px] resize-none'}
                placeholder='Send a message…'
                value={input}
                onChange={e => setInputAction(e.target.value)}
                disabled={disabled}
                rows={2}
                autoFocus
                onKeyDown={event => {
                    if (
                        event.key === 'Enter' &&
                        !event.shiftKey &&
                        !event.nativeEvent.isComposing
                    ) {
                        event.preventDefault();
                        if (input.trim().length > 0 && !disabled) {
                            onSendAction(input);
                        }
                    }
                }}
            />
            <Button
                data-testid="send-button"
                className="rounded-full p-1.5 h-fit border dark:border-zinc-600"
                onClick={(event) => {
                    event.preventDefault();
                    onSendAction(input);
                }}
                disabled={input.length === 0}
            >
                <ArrowUpIcon size={14} />
            </Button>
        </div>
    );
}
