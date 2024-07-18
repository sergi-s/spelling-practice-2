import { generateRandomLong } from "~/app/utils/random/randomLong";
import type { SentenceGenerationStrategy, SentenceContentBased } from "../interfaces";
import { Ollama } from 'ollama'

const ollama = new Ollama({ host: 'http://192.168.2.237:11434' })
const modelfile = `
FROM gemma:2b
SYSTEM "Give me a very short sentence to practice my spelling in double quotation marks, don't provide anything else,"
`
const history: Message[] = [
    {
        "role": "user",
        "content": `Give me a very short sentence to practice my spelling in double quotation marks, don't provide anything else, to prevent repeating sentences use this as a seed ${generateRandomLong()}, word count should not exceed 10`
    }
]

interface Message {
    role: string;
    content: string;
    images?: Uint8Array[] | string[];
}

export class GemmaTopicMessage implements SentenceContentBased {
    public content: string;
    constructor(message: string) {
        this.content = `The new sentence's topic should be ${message}`
    }
}

export class GemmaWordMessage implements SentenceContentBased {
    public content: string;
    constructor(message: string) {
        this.content = `the new sentence should contain the word ${message}`
    }
}

export class GemmaChatSentenceStrategy implements SentenceGenerationStrategy {

    async generateSentence(contentMessages: SentenceContentBased[]): Promise<string | undefined> {
        try {

            await ollama.create({ model: 'example', modelfile: modelfile })

            history.push(...contentMessages.map(({ content }) => ({ role: "user", content })))
            const response = await ollama.chat({
                model: "example",
                messages: history,
                stream: false,
                options: { seed: generateRandomLong() }
            })

            history.push(response.message)
            
            const sentence = response.message.content.match(/"([^"]+)"/)?.[1];

            return sentence;

        } catch (error) {
            console.error('Error:', error);
        }
    }
}
