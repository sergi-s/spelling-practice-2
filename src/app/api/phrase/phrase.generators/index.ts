import { Language } from "../../stemmer/validation";
import { getRandomElement } from "./route";


export interface SentenceGenerationStrategy {
    generateSentence(difficulty: number, language: Language, topic: string): Promise<string | undefined>;
}


export async function generateSentence(strategy: new () => SentenceGenerationStrategy, difficulty?: number, language?: Language, topic?: string): Promise<string | undefined> {
    try {
        difficulty = difficulty ?? Math.floor(Math.random() * 4) + 1;
        language = language ?? Language.en;
        topic = topic ?? ""

        // Instantiate the selected strategy
        const sentenceGenerationStrategy = new strategy();

        // Generate the sentence using the selected strategy
        const generatedSentence = await sentenceGenerationStrategy.generateSentence(difficulty, language, topic);
        if (!generatedSentence) {
            // console.log("Sentence is empty and will try again", generatedSentence)
            return generateSentence(strategy, difficulty, language)
        }

        return generatedSentence;
    } catch (error) {
        console.error('Error generating sentence:', error);
        throw error;
    }
}
