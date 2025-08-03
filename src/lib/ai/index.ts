import {makeActions} from './chat.actions';

let cached: Awaited<ReturnType<typeof makeActions>> | null = null;
export async function ai() {
    return (cached ??= await makeActions());
}
