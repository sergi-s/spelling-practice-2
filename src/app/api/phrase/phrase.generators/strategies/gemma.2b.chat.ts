import { generateRandomLong } from "~/app/utils/random/randomLong";
import { generatedChatSentenceSchema } from "../../phrase.validation";
import type { SentenceGenerationStrategy, SentenceContentBased } from "../interfaces";

const baseURL = 'http://192.168.2.237:11434/api/chat';



export class GemmaTopicMessage implements SentenceContentBased {
    public content: string;
    constructor(message: string) {
        this.content = `The sentence's topic should be ${message}`
    }
}

export class GemmaWordMessage implements SentenceContentBased {
    public content: string;
    constructor(message: string) {
        this.content = `the sentence should contain the word ${message}`
    }
}

export class GemmaChatSentenceStrategy implements SentenceGenerationStrategy {
    async generateSentence(contentMessages: SentenceContentBased[]): Promise<string | undefined> {
        try {
            // Construct the messages array by concatenating values from abstractions
            const messages = [
                {
                    "role": "user",
                    "content": `Give me a very short sentence to practice my spelling in double quotation marks, don't provide anything else, to prevent repeating sentences use this as a seed ${generateRandomLong()}, word count should not exceed 10`
                },
                ...contentMessages.map(({ content }) => ({ role: "user", content }))
            ];

            // Construct the request body
            const requestBody = {
                model: "gemma:2b",
                stream: false,
                messages: messages
            };

            console.log('Request body:', requestBody);

            // Send the request
            const response = await fetch(baseURL, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch. Status: ${response.status}`);
            } else {
                console.log("Successful fetch");
            }

            // Parse and extract the generated response
            const { message: { content: generatedResponse } } = generatedChatSentenceSchema.parse(await response.json());
            if (!generatedResponse) {
                throw new Error('No response');
            }
            const sentence = generatedResponse.match(/"([^"]+)"/)?.[1];

            return sentence;

        } catch (error) {
            console.error('Error:', error);
        }
    }
}
