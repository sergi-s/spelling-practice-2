import type { SentenceGenerationStrategy, SentenceContentBased } from "../interfaces";
import { GoogleGenerativeAI, GoogleGenerativeAIError, type Content } from "@google/generative-ai";
import { generateRandomLong } from "~/app/utils/random/randomLong";
import { env } from "~/env";

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: "Give me a short sentence to practice my spelling in double quotation marks, don't provide anything else. word count should at most be 10"
});

const localHistory: Content[] = [];

async function countTokens(contents: Content[]): Promise<number> {
    const req = { contents };
    const countTokensResp = await model.countTokens(req);
    return countTokensResp.totalTokens;
}

export class GeminiTopicMessage implements SentenceContentBased {
    public content: string;
    constructor(message: string) {
        this.content = `The sentence's topic should be ${message}`;
    }
}

export class GeminiWordMessage implements SentenceContentBased {
    public content: string;
    constructor(message: string) {
        this.content = `the sentence should contain the word ${message}`;
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

            const prompt = `use ${generateRandomLong()} as a seed ${contentMessages.map(({ content }) => content).join(", ")}`;

            localHistory.push({
                role: "user",
                parts: [{ text: prompt }],
            });

            // Calculate the total number of tokens in the chat history
            let totalTokens = await countTokens(localHistory);

            // If total tokens exceed 10,000,000 remove the first element until it's below 10,000
            while (totalTokens > 10000000) {
                localHistory.shift();
                totalTokens = await countTokens(localHistory);
            }
            console.debug(`localHistory size is ${localHistory.length}, number of tokens:${totalTokens}`)

            const result = await chat.sendMessage(prompt);

            const response = result.response;

            const generatedResponse = response.text();

            return generatedResponse.match(/"([^"]+)"/)?.[1];

        } catch (error) {
            console.log("error instanceof GoogleGenerativeAIError", error instanceof GoogleGenerativeAIError)
            if (typeof error === "string" && error.includes("SAFETY")) {
                localHistory.shift()
                return await this.generateSentence(contentMessages)
            }
            console.error('Error:');
            console.dir({ error }, { depth: null })
        }
    }
}
