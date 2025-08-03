// app/hooks/use-scroll-to-bottom.ts
'use client';

import {DependencyList, useEffect, useRef} from 'react';

/**
 * Returns a ref you drop at the end of a scrollable container.
 * Whenever the deps change, it scrolls that ref into view.
 *
 * @example
 * const bottomRef = useScrollToBottom([messages]);
 * …
 * <div ref={bottomRef} />
 */
export function useScrollToBottom<T extends HTMLElement>(
    deps: DependencyList,
) {
    const bottomRef = useRef<T | null>(null);
    
    useEffect(() => {
        bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }, deps); // eslint-disable-line react-hooks/exhaustive-deps
    
    return bottomRef;
}
