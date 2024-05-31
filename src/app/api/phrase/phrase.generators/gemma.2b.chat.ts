import { generateRandomLong } from "~/app/utils/random/randomLong";
import { type SentenceGenerationStrategy } from ".";
import { type Language } from "../../stemmer/validation";
import { generatedChatSentenceSchema } from "../phrase.validation";
import { calculateSentenceDifficulty } from "~/app/utils/NLP/calculateDifficulty";


const baseURL = 'http://192.168.2.237:11434/api/chat';

export class GemmaChatSentenceStrategy implements SentenceGenerationStrategy {
    async generateSentence(difficulty: number, language: Language, topic?: string): Promise<string | undefined> {
        try {
            const requestBody = {
                "model": "gemma:2b",
                "stream": false,
                "messages": [
                    {
                        "role": "user",
                        "content": `Give me a very short sentence to practice my spelling in double quotation marks, don't provide anything else, to prevent repeating sentences use this as a seed ${generateRandomLong()}, word count should not exceed 10`
                    },
                    {
                        "role": "user",
                        "content": `The sentence difficulty should be from ${difficulty}/5`
                    }
                    ,
                    {
                        "role": "user",
                        "content": `and the topic should be about ${topic}`
                    }
                ]
            }
            console.log('Request body:', requestBody);

            const response = await fetch(baseURL, {
                method: 'POST',
                body: JSON.stringify(requestBody),
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`Failed to fetch. Status: ${response.status}`);
            } else console.log("SUCCESSFUL To fetch")

            const { message: { content: generatedResponse } } = generatedChatSentenceSchema.parse(await response.json());
            if (!generatedResponse) {
                throw new Error('No response');
            }
            const sentence = generatedResponse.match(/"([^"]+)"/)?.[1]
            
            return sentence;

        } catch (error) {
            console.error('Error:', error);
        }
    }
}
