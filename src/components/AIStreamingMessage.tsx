import React, { useEffect, useMemo, useRef } from 'react';

/**
 * AIStreamingMessage
 * A simple, styled bubble that displays the currently streamed text (joined from `chunks`).
 * No MessageRenderer involved. While `isTyping` is true it shows a subtle caret blink;
 * when there is no text yet it shows two skeleton lines + three tiny dots.
 *
 * Keep the same visual style as before so it fits into your chat UI.
 *
 * Usage in your container:
 *   <div className='mx-auto max-w-[80%] space-y-4'>
 *     <AIStreamingMessage chunks={chunks} isTyping={!finished} />
 *   </div>
 */
type AIStreamingMessageProps = {
    chunks: string[];
    showAvatar?: boolean;
    avatar?: React.ReactNode;
    compact?: boolean;
    /** true while the AI is still writing (controls caret / dots). */
    isTyping?: boolean;
    className?: string;
    dataTestId?: string;
};

// Inject minimal CSS for subtle animations
let __aiStreamStyleInjected = false;
const __aiStreamStyle = `
@keyframes aiWritingDot { 0%{opacity:.25; transform:translateY(0)} 20%{opacity:1; transform:translateY(-1px)} 40%{opacity:.6; transform:translateY(0)} 100%{opacity:.25; transform:translateY(0)} }
.ai-writing-dot { animation: aiWritingDot 1200ms ease-in-out infinite; }
.ai-writing-dot:nth-child(2) { animation-delay: 150ms; }
.ai-writing-dot:nth-child(3) { animation-delay: 300ms; }

@keyframes caretBlink { 0%,100%{opacity:.25} 50%{opacity:1} }
.caret-blink { display:inline-block; width:2px; height:1em; vertical-align:baseline; animation: caretBlink 1100ms step-end infinite; }

@media (prefers-reduced-motion: reduce) { .ai-writing-dot, .caret-blink { animation:none; } }
`;

function useInjectAiStreamStyle() {
    useEffect(() => {
        if (typeof document === 'undefined') return; // SSR safe
        if (__aiStreamStyleInjected) return;
        const style = document.createElement('style');
        style.setAttribute('data-ai-stream-style', 'true');
        style.textContent = __aiStreamStyle;
        document.head.appendChild(style);
        __aiStreamStyleInjected = true;
    }, []);
}

export default function AIStreamingMessage({
    chunks,
    showAvatar = true,
    avatar,
    compact = false,
    isTyping = true,
    className,
    dataTestId = 'ai-streaming-message',
}: AIStreamingMessageProps) {
    useInjectAiStreamStyle();
    
    const text = useMemo(() => (chunks?.length ? chunks.join('') : ''), [chunks]);
    
    // Auto-scroll to the end when new chunks arrive
    const endRef = useRef<HTMLDivElement | null>(null);
    const prevLen = useRef<number>(0);
    useEffect(() => {
        if (!endRef.current) return;
        if ((chunks?.length ?? 0) !== prevLen.current) {
            try { endRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' }); } catch {}
            prevLen.current = chunks?.length ?? 0;
        }
    }, [chunks?.length]);
    
    const showSkeleton = text.length === 0;
    
    return (
        <div
            role="status"
            aria-live="polite"
            aria-label={isTyping ? 'Assistant is writing' : 'Assistant message'}
            data-testid={dataTestId}
            className={['flex w-full items-start gap-3', compact ? 'py-1' : 'py-2', className ?? ''].join(' ')}
        >
            {/* Avatar */}
            {showAvatar ? (
                <div className="shrink-0">
                    {avatar ?? (
                        <div className="size-8 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 animate-pulse" />
                    )}
                </div>
            ) : null}
            
            {/* Bubble */}
            <div className="max-w-[85%] rounded-2xl border border-zinc-200/60 bg-white px-3 py-2 shadow-sm dark:border-zinc-800/60 dark:bg-zinc-900">
                {showSkeleton ? (
                    <>
                        <div className="space-y-2">
                            <div className="h-[10px] w-[78%] rounded bg-zinc-200/80 dark:bg-zinc-700/80 animate-pulse" />
                            <div className="h-[10px] w-[62%] rounded bg-zinc-200/70 dark:bg-zinc-700/70 animate-pulse" />
                        </div>
                        <div className="mt-2 flex items-center gap-1.5">
                            <span className="sr-only">Writing…</span>
                            <div className="ai-writing-dot h-1.5 w-1.5 rounded-full bg-zinc-400/90 dark:bg-zinc-500/90" />
                            <div className="ai-writing-dot h-1.5 w-1.5 rounded-full bg-zinc-400/90 dark:bg-zinc-500/90" />
                            <div className="ai-writing-dot h-1.5 w-1.5 rounded-full bg-zinc-400/90 dark:bg-zinc-500/90" />
                        </div>
                    </>
                ) : (
                    <div className="whitespace-pre-wrap text-[15px] leading-6 text-zinc-800 dark:text-zinc-200">
                        {text}
                        {isTyping && (
                            <span aria-hidden="true" className="ml-0.5 caret-blink bg-zinc-400/90 dark:bg-zinc-500/90" />
                        )}
                    </div>
                )}
                <div ref={endRef} />
            </div>
        </div>
    );
};
