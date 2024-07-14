import natural, { type Stemmer } from "natural";
import { WordNet } from "node-wordnet"
const stemmer = natural.PorterStemmer

const initializeWordNet = async () => {
    // const customWordNetPath = path.join(wordnetdb.path);
    // const defaultWordNetPath = path.join(process.cwd(), 'node_modules', 'wordnet', 'db');
    // const wordNetPath = existsSync(customWordNetPath) ? customWordNetPath : defaultWordNetPath;
    // await WordNet.init(wordNetPath);
};

void initializeWordNet();
export const lookupWord = async (word: string): Promise<string | undefined> => {
    console.log("===========================================================================")
    try {
        console.log("I AM LOOKING UP WORDs")
        const wordnet = new WordNet()
        const definitions = await wordnet.lookupAsync(word.toLowerCase())
        // const definitions = await WordNet.lookup(word.toLowerCase());
        return definitions && definitions.length > 0 ? word : undefined;
    } catch (error) {
        console.error("Error looking up the word:", error);
        return undefined;
    }
    finally {
        console.log("I COMPLETED MY LOOKING UP")
        console.log("===========================================================================")
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
