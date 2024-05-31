import { Language } from "../../stemmer/validation";


// TODO: new difficulty implementation
// TODO: 1- generate a phrase (later will try to make the difficulty as input work)
// TODO: 2- get the number of syllabus for each word, and based on the maximum set the difficulty level
// TODO: 3- update the schema so for each word there is a number of appearances, and the number of incorrect spelling, and based on the maximum set the difficulty level

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
