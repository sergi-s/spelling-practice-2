import { type SentenceGenerationStrategy } from ".";
import { type Language, difficultyMap } from "../../stemmer/validation";
import { generatedChatSentenceSchema } from "../phrase.validation";


const baseURL = 'http://192.168.2.237:11434/api/chat';

export class GemmaChatSentenceStrategy implements SentenceGenerationStrategy {
    async generateSentence(difficulty: number, language: Language): Promise<string | undefined> {
        try {
            const requestBody = {
                "model": "gemma:2b",
                "stream": false,
                "messages": [
                    // {
                    //     "role": "user",
                    //     "content": "Give a sentence to practice my spelling in double quotation marks, don't provide anything else"
                    // },
                    // {
                    //     "role": "user",
                    //     "content": `The provided sentence difficulty should be ${difficultyMap[difficulty]}`
                    // },
                    // {
                    //     "role": "user",
                    //     "content": "The provided sentence difficulty should be maximum 5 words"
                    // }
                    // // ,
                    // // {
                    // //     "role": "user",
                    // //     "content": `The provided sentence difficulty should in ${language}`
                    // // },
                    // ,
                    // {
                    //     "role": "user",
                    //     "content": `to prevent repeating sentences use this as a seed ${generateRandomLong()}`
                    // }
                    {
                        "role": "user",
                        "content":
                            "Give a sentence to practice my spelling in double quotation marks, "
                            + "The provided sentence should be a complex sentence with a variety of grammatical "
                            + "structures and vocabulary words, ALSO very important The provided sentence difficulty should be "
                            + difficultyMap[difficulty] + " also, The provided sentence difficulty should be maximum 5 words "
                        // + "to prevent repeating sentences use this as a seed " + generateRandomLong().toString()

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
            }

            const { message: { content: generatedResponse } } = generatedChatSentenceSchema.parse(await response.json());
            if (!generatedResponse) {
                throw new Error('No response');
            }
            return generatedResponse

        } catch (error) {
            console.error('Error:', error);
        }
    }
}

function generateRandomLong(): number {
    const MAX_INT32 = 0xFFFFFFFF;
    const MAX_INT32_DIV_100 = MAX_INT32 / 100;

    // Generate two random 32-bit integers and combine them to form a 64-bit integer
    const high = Math.floor(Math.random() * MAX_INT32);
    const low = Math.floor(Math.random() * MAX_INT32);
    const randomLong = (high * MAX_INT32_DIV_100 + low) % Number.MAX_SAFE_INTEGER;

    return randomLong;
}