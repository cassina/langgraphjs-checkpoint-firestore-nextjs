import {HumanMessage} from '@langchain/core/messages';
import {NextRequest, NextResponse} from 'next/server';

import {ai} from '@/lib/ai';


export async function POST(req: NextRequest) {
    const {threadId, content} = await req.json();
    const input = new HumanMessage(content);
    const {streamMessage} = await ai();
    const stream = await streamMessage(threadId, input)
    
    return new NextResponse(stream, {headers: {'Content-Type': 'text/plain'}});
}
