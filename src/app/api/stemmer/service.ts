"use server"
import WordNet from 'wordnet';
import natural, { type Stemmer } from "natural";

const stemmer = natural.PorterStemmer

const initializeWordNet = async () => {
    await WordNet.init("./node_modules/wordnet/db");
};
void initializeWordNet();
export const lookupWord = async (word: string): Promise<string | undefined> => {
    try {
        const definitions = await WordNet.lookup(word.toLowerCase());
        return definitions && definitions.length > 0 ? word : undefined;
    } catch (error) {
        // console.error("Error looking up the word:", error);
        return undefined;
    }
};


const stemmers: Record<string, Stemmer> = {
    en: stemmer,
    // fn: natural.PorterStemmerFr,
};


export const stem = async (word: string, lang: "en" | "fr" = "en") => {
    if (!stemmers[lang]) throw new Error("Invalid language");
    return stemmers[lang]!.stem(word)
};
