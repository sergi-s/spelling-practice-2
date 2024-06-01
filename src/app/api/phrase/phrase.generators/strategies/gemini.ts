import type { SentenceGenerationStrategy, SentenceContentBased } from "../interfaces";

import { GoogleGenerativeAI, type Content } from "@google/generative-ai"
import { generateRandomLong } from "~/app/utils/random/randomLong";
import { env } from "~/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Give me a short sentence to practice my spelling in double quotation marks, don't provide anything else. word count should at most be 10"
});

const localHistory: Content[] = [];

export class GeminiTopicMessage implements SentenceContentBased {
    public content: string;
    constructor(message: string) {
        this.content = `The sentence's topic should be ${message}`
    }
}

export class GeminiWordMessage implements SentenceContentBased {
    public content: string;
    constructor(message: string) {
        this.content = `the sentence should contain the word ${message}`
    }
}

export class GeminiChatSentenceStrategy implements SentenceGenerationStrategy {

    async generateSentence(contentMessages: SentenceContentBased[]): Promise<string | undefined> {
        try {
            const chat = model.startChat({
                history: localHistory,
                generationConfig: {
                    maxOutputTokens: 100,
                    temperature: 1,
                },
            });
            const prompt = `use ${generateRandomLong()} as a seed \n${contentMessages.map(({ content }) => content).join(", ")}`;

            localHistory.push({
                role: "user",
                parts: [{ text: prompt }],
            })
            const result = await chat.sendMessage(prompt);
            const response = result.response;
            const generatedResponse = response.text();

            return generatedResponse.match(/"([^"]+)"/)?.[1];;

        } catch (error) {
            console.error('Error:', error);
        }
    }
}
