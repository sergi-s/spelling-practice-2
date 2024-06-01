import { generateRandomLong } from "~/app/utils/random/randomLong";
import { generatedChatSentenceSchema } from "../../phrase.validation";
import type { SentenceGenerationStrategy, SentenceContentBased } from "../interfaces";

import { GoogleGenerativeAI } from "@google/generative-ai"
import { env } from "~/env";

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);


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
    private model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    async generateSentence(contentMessages: SentenceContentBased[]): Promise<string | undefined> {
        try {

            // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts

            const prompt = `Give me a very short sentence to practice my spelling in double quotation marks, don't provide anything else, to prevent repeating sentences use this as a seed ${generateRandomLong()}, word count should not exceed 10\n
            ${contentMessages.map(({ content }) => content).join(" ")}`

            const result = await this.model.generateContent(prompt);
            const response = result.response;
            const generatedResponse = response.text();
            console.log({ generatedResponse })

            const sentence = generatedResponse.match(/"([^"]+)"/)?.[1];

            return sentence;

        } catch (error) {
            console.error('Error:', error);
        }
    }
}
