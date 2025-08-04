import {ChatOpenAI} from '@langchain/openai';
import {BaseMessage} from '@langchain/core/messages';
import {Annotation, START, StateGraph} from '@langchain/langgraph';
import {FirestoreSaver} from '@cassina/langgraphjs-checkpoint-firestore';

import {dbAdmin} from '@/lib/firebaseAdminFactory';
import {DEFAULT_MODEL} from '@/lib/config';

const model = new ChatOpenAI({ model: DEFAULT_MODEL });
const saver = new FirestoreSaver({ firestore: dbAdmin });
let _graph: ReturnType<typeof buildGraph> | null = null;

const ChatStateAnnotation = Annotation.Root({
    messages: Annotation<BaseMessage[]>({
        reducer: (left: BaseMessage[], right: BaseMessage | BaseMessage[]) => {
            if (Array.isArray(right)) {
                return left.concat(right);
            }
            return left.concat([right]);
        },
        default: () => [],
    }),
});

//---------------------------------------------------------------------------
async function callModel(state: ChatState) {
    const response = await model.invoke(state.messages);
    return { messages: [response] };
}

function buildGraph() {
    return new StateGraph(ChatStateAnnotation)
        .addNode('agent', callModel)
        .addEdge(START, 'agent')
        .compile({ checkpointer: saver });
}


//---------------------------------------------------------------------------
export type ChatState = typeof ChatStateAnnotation.State;

export function getGraph() {
    if (_graph) return _graph;
    _graph = buildGraph();
    return _graph;
}
