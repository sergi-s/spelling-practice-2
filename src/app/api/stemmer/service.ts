"use server"
import WordNet from 'wordnet';
import natural, { type Stemmer } from "natural";
import { env } from '~/env';

const stemmer = natural.PorterStemmer

const initializeWordNet = async () => {
    let wordNetPath = "./node_modules/wordnet/db";
    
    if (env.NODE_ENV === "production") {
        wordNetPath = "/var/task/node_modules/wordnet/db";
    }
    await WordNet.init(wordNetPath);
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
