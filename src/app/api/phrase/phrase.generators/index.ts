import { GemmaChatSentenceStrategy, GemmaTopicMessage } from "./strategies/gemma.2b.chat";
import { calculateSentenceDifficulty } from "~/app/utils/NLP/calculateDifficulty";
import { getRandomElement } from "~/app/utils/random/chooseRandomElement";
import type { Notify, SentenceContentBased, SentenceGenerationStrategy } from "./interfaces";
import topicRepo from "../../topics/repositories/topicRepository";
import { GeminiChatSentenceStrategy, GeminiTopicMessage } from "./strategies/gemini";



// TODO: new difficulty implementation
// TODO: 1- generate a phrase (later will try to make the difficulty as input work)
// TODO: 2- get the number of syllabus for each word, and based on the maximum set the difficulty level
// TODO: 3- update the schema so for each word there is a number of appearances, and the number of incorrect spelling, and based on the maximum set the difficulty level


export async function generateSentence(strategy: new () => SentenceGenerationStrategy, contentBased: SentenceContentBased[]): Promise<string | undefined> {
    try {

        // Instantiate the selected strategy
        const sentenceGenerationStrategy = new strategy();

        // Generate the sentence using the selected strategy
        const generatedSentence = await sentenceGenerationStrategy.generateSentence(contentBased);

        if (!generatedSentence) {
            // return generateSentence(strategy, contentBased)
        }

        return generatedSentence;
    } catch (error) {
        console.error('Error generating sentence:', error);
        throw error;
    }
}


export const generateAndSaveSentence = async (n = 1, notify: Notify) => {
    const topics = await topicRepo.getAllTopics()
    for (let i = 0; i < n; i++) {

        const topic = getRandomElement(topics)
        const contentBased: SentenceContentBased[] = [
            // new GemmaTopicMessage(topic)
            new GeminiTopicMessage(topic)
        ];


        const phrase = await generateSentence(GeminiChatSentenceStrategy, contentBased);

        if (!phrase) return notify.log("No sentence generated")
        notify.log(`Sentence ${i + 1}, calculated:${calculateSentenceDifficulty(phrase).toFixed(2)}, topic:${topic}`);

        // const savedPhrase = await saveGeneratedPhrase(difficulty, language, phrase, topic);
        // if (!savedPhrase) return notify.log("The sentence was not saved")
        // notify.log(`Sentence ${i + 1}, topic:${topic}: ${savedPhrase.phrase}`);
        notify.log(`\t=>${phrase}`);
    }
    notify.complete("done all processes");
}
