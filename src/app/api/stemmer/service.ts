"use server"
import { stemmer } from 'stemmer';
import WordNet from 'wordnet';
// import path from 'path';


// Construct the relative path to the WordNet database file
// const dbPath = path.resolve('./node_modules/wordnet/db');
// console.log({ dbPath })
// await WordNet.init("./node_modules/wordnet/db");
const initializeWordNet = async () => {
    await WordNet.init("./node_modules/wordnet/db");
};
void initializeWordNet();
const lookupWord = async (word: string): Promise<string | undefined> => {
    try {
        const definitions = await WordNet.lookup(word.toLowerCase());
        return definitions && definitions.length > 0 ? word : undefined;
    } catch (error) {
        // console.error("Error looking up the word:", error);
        return undefined;
    }
};


const stemmers: Record<string, unknown> = {
    en: stemmer,
    // fn: natural.PorterStemmerFr,
};




export const extractEnglishWords = async (phrase: string) => {

    const words = phrase.split(" ").filter(word => word.trim() !== "");

    const foundEnglishWords = (await Promise.all(words.map(lookupWord))).filter(Boolean)

    // Filter out words that are not found but could be stemmed to English words
    const wordsNotFound = words.filter((w) => !foundEnglishWords.find((word) => w === word))

    console.log({ wordsNotFound })

    // for words not found Stem and try again
    const stemmedWords = wordsNotFound.map(word => stemmer(word));
    const stemmedAndFoundEnglishWords = (await Promise.all(stemmedWords.map(lookupWord))).filter(Boolean);
    console.log({ stemmedAndFoundEnglishWords })

    // Merge the results and return
    return [...foundEnglishWords, ...stemmedAndFoundEnglishWords];
}



export const stem = async (text: string, lang: "en" | "fr") => {
    const englishWords = await extractEnglishWords(text) as string[];
    if (!stemmers[lang]) throw new Error("Invalid language");

    const uniqueEnglishWords = Array.from(new Set(englishWords));
    // const stemmer = stemmers[lang];

    return uniqueEnglishWords.map(word => stemmer(word)).join(" ");
};
