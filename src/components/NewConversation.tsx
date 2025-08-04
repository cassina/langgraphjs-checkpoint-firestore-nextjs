'use client'

import {db} from '@/lib/firebaseApp';
import {useRouter} from 'next/navigation';
import {createConversation} from '@/lib/ai';
import {Button} from '@/components/ui/button';
import {useUser} from '@/providers/UserProvider';
import {collection, doc} from 'firebase/firestore';
import {chatPath, conversationsColName} from '@/lib/config';


export default function NewConversation() {
    const router = useRouter();
    const { uid } = useUser();
    // We just create a reference to get the id.
    const randomCol = collection(db, conversationsColName);
    const threadId = doc(randomCol).id;
    
    async function handleClick(): Promise<void> {
        const id = await createConversation('Welcome!', uid, threadId)
        router.push(`/${chatPath}/${id}`)
    }
    
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <Button onClick={handleClick}>New conversation</Button>
        </div>
    );
}
