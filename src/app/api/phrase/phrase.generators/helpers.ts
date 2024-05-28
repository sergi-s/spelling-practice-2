
import { generateSentence } from ".";
import { saveGeneratedPhrase } from "../phrase.service";
import { Language } from "../../stemmer/validation";
import { llama3SentenceStrategy } from "./llama3-70b-8192";
import { GemmaChatSentenceStrategy } from "./gemma.2b.chat";
import { prisma } from "../../prisma";


export function getRandomElement(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
}

interface Notify {
    log: (message: string) => void;
    complete: (data: string | undefined) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
    error: (error: Error | any) => void;
    close: () => void;
}


export const generateAndSaveSentence = async (n = 1, notify: Notify) => {
    const topics = await prisma.topic.findMany().then((topcis) => {
        return topcis.map(t => t.topic)
    })
    for (let i = 0; i < n; i++) {

        const difficulty = Math.floor(Math.random() * 4) + 1;
        const language = Language.en;
        const topic = getRandomElement(topics);


        // const phrase = await generateSentence(GemmaChatSentenceStrategy, difficulty, language);

        const phrase = await generateSentence(llama3SentenceStrategy, difficulty, language, topic);
        if (!phrase) return notify.log("No sentence generated")
        const savedPhrase = await saveGeneratedPhrase(difficulty, language, phrase, topic);
        if (!savedPhrase) return notify.log("The sentence was not saved")
        notify.log(`Sentence ${i + 1}, difficulty level:${difficulty}/5, topic:${topic}: ${savedPhrase.phrase}`);
    }
    notify.complete("done all processes");
}