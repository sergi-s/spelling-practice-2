import { Language } from "../../stemmer/validation";


export interface SentenceGenerationStrategy {
    generateSentence(difficulty: number, language: Language): Promise<string | undefined>;
}

export async function generateSentence(strategy: new () => SentenceGenerationStrategy, difficulty?: number, language?: Language): Promise<string | undefined> {
    try {
        console.log('Generating phrase with difficulty:', difficulty, 'and language:', language);
        console.log("and strategy ", strategy)
        difficulty = difficulty ?? Math.floor(Math.random() * 4) + 1;
        language = language ?? Language.en;

        // Instantiate the selected strategy
        const sentenceGenerationStrategy = new strategy();

        // Generate the sentence using the selected strategy
        const generatedSentence = await sentenceGenerationStrategy.generateSentence(difficulty, language);
        if (!generatedSentence) {
            console.log("Sentence is empty and will try again", generatedSentence)
            return generateSentence(strategy, difficulty, language)

        }

        const sentence = generatedSentence.match(/"([^"]+)"/)?.[1];
        if (!sentence) {
            console.log("Sentence is not the correct format and will try again", sentence)
            return generateSentence(strategy, difficulty, language)
        }

        console.log('Generated sentence:', sentence);
        return sentence;
    } catch (error) {
        console.error('Error generating sentence:', error);
        throw error;
    }
}