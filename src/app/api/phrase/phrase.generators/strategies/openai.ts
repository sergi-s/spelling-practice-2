import OpenAI from 'openai';
import { generateRandomLong } from '~/app/utils/random/randomLong';
import { env } from '~/env';
import { type SentenceContentBased, type SentenceGenerationStrategy } from '../interfaces';

const openai = new OpenAI({
    apiKey: env.OPENAI_API_KEY
});


const localHistory: { role: "user", content: string }[] = [
    { role: "user", content: `Give me a short sentence to practice my spelling in double quotation marks, don't provide anything else.word count should at most be 10` }
];

export class OpenAITopicMessage implements SentenceContentBased {
    public content: string;
    constructor(message: string) {
        this.content = `The sentence's topic should be ${message}`
    }
}

export class OpenAIWordMessage implements SentenceContentBased {
    public content: string;
    constructor(message: string) {
        this.content = `The sentence should contain this world: ${message}`
    }
}

export class OpenAIChatSentenceStrategy implements SentenceGenerationStrategy {
    async generateSentence(contentMessages: SentenceContentBased[]): Promise<string | undefined> {
        try {

            const prompt = `use ${generateRandomLong()} as a seed \n${contentMessages.map(({ content }) => content).join(", ")}`;

            localHistory.push({
                role: "user",
                content: prompt,
            })

            const chatCompletion = await openai.chat.completions.create({
                messages: [...localHistory],
                model: 'gpt-3.5-turbo',
                stream: false,
                temperature: 2,
            });

            console.dir({ chatCompletion }, { depth: null })

            const generatedResponse = `"hello world"`

            return generatedResponse.match(/"([^"]+)"/)?.[1];;

        } catch (error) {
            console.error('Error:', error);
        }
    }
}
