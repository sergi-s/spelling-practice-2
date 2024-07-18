import { calculateSentenceDifficulty } from "~/app/utils/NLP/calculateDifficulty";
import { getRandomElement } from "~/app/utils/random/chooseRandomElement";
import type { GeneratedPhrase, Notify, SentenceContentBased, SentenceGenerationStrategy } from "./interfaces";
import topicRepo from "../../topics/repositories/topicRepository";
import { SentenceStrategy, TopicSentenceStrategy, WordSentenceStrategy } from "./strategies";
import { extractAndConvertNumbers } from "~/app/utils/NLP/number-to-word";
import { tokenize } from "~/app/utils/NLP/tokenizer";
import { saveGeneratedPhrase } from "../services/phrase.service";
import { type Topic } from "@prisma/client";


// TODO: new difficulty implementation
// TODO: 1- generate a phrase (later will try to make the difficulty as input work)

export async function generateSentence(strategy: new () => SentenceGenerationStrategy, contentBased: SentenceContentBased[]): Promise<GeneratedPhrase | undefined> {
    try {

        // Instantiate the selected strategy
        const sentenceGenerationStrategy = new strategy();

        // Generate the sentence using the selected strategy
        let generatedSentence = await sentenceGenerationStrategy.generateSentence(contentBased);

        if (!generatedSentence) {
            // return generateSentence(strategy, contentBased)
            throw new Error("could not generate a word")
        }

        // clean up the sentence
        // if string has numbers
        generatedSentence = extractAndConvertNumbers(generatedSentence)
        const tokenizedSentence = tokenize(generatedSentence)


        return { generatedSentence, tokenizedSentence };
    } catch (error) {
        console.error('Error generating sentence:', error);
        throw error;
    }
}

export const generateAndSaveSentence = async ({ word, topicName }: { word?: string, topicName?: string }) => {

    let topic: Topic | null = null;
    if (topicName) topic = await topicRepo.getOrCreate(topicName)
    const contentBased: SentenceContentBased[] = [];
    if (topic) contentBased.push(new TopicSentenceStrategy(topic.topic))
    if (word) contentBased.push(new WordSentenceStrategy(word))

    const phrase = await generateSentence(SentenceStrategy, contentBased);

    if (!phrase) {
        throw new Error("I was not able to generate a sentence")
    }

    const savedPhrase = await saveGeneratedPhrase(phrase, topic?.topic);
    if (!savedPhrase) throw new Error("The sentence was not saved")
    return savedPhrase
}

// ?This is used by the SSE only, so technically this should be moved 
export const generateAndSaveSentenceSSE = async (n = 1, notify: Notify) => {
    const topics = await topicRepo.getAllTopics()
    for (let i = 0; i < n; i++) {

        const topic = getRandomElement(topics)
        const contentBased: SentenceContentBased[] = [new TopicSentenceStrategy(topic)];

        const phrase = await generateSentence(SentenceStrategy, contentBased);

        if (!phrase) { notify.log(`Sentence ${i + 1}, FAILED TO GENERATE`); notify.error(`Sentence ${i + 1}, FAILED TO GENERATE`); return }

        const { generatedSentence, tokenizedSentence } = phrase

        if (!phrase) return notify.log("No sentence generated")
        const { score, lengthScore, syllableScore } = await calculateSentenceDifficulty(generatedSentence)

        notify.log(`Sentence ${i + 1}, 
        \n\difficultyScore:${(score).toFixed(2)}
        \n\tsyllable:${(syllableScore).toFixed(2)}
        \n\tlengthScores:${(lengthScore).toFixed(2)}, 
        \n\ttopic:${topic}, 
        \n\ttokenizedSentence:${tokenizedSentence.join("_")}`);

        const savedPhrase = await saveGeneratedPhrase(phrase, topic);
        if (!savedPhrase) return notify.log("The sentence was not saved")
        // notify.log(`Sentence ${i + 1}, topic:${topic}: ${savedPhrase.phrase}`);
        notify.log(`\t=>${generatedSentence}`);
    }
    notify.complete("done all processes");
}