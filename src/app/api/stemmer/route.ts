import natural, { type DataRecordsCallback, type Stemmer } from 'natural';
import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server';
import { z } from 'zod';
const wordnet = new natural.WordNet("./node_modules/wordnet-db/dict");
const tokenizer = new natural.WordTokenizer();


const stemmers: Record<string, Stemmer> = {
    en: natural.PorterStemmer,
    fn: natural.PorterStemmerFr,
};

const schema = z.object({
    language: z.union([
        z.literal('en'),
        z.literal('fr'),
    ]).default('en'),
    phrase: z.string()
});

const stemText = (phrase: string, porterStemmer: Stemmer): string => {
    return porterStemmer.tokenizeAndStem(phrase).join(' ')
}

function lookupAsync(word: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const callback: DataRecordsCallback = (results): void => {
            if (results && results.length > 0) {
                // console.log({ results })
                resolve(word);
            } else {
                reject(word);
            }
        };
        wordnet.lookup(word, callback);
    });
}


const extractEnglishWords = async (phrase: string) => {
    // Tokenize the input phrase
    const tokenized: string[] = tokenizer.tokenize(phrase);

    // Look up each token asynchronously and collect the results
    const promiseResult = await Promise.allSettled(tokenized.map((word) => lookupAsync(word))) || []

    // Filter out words that are not found but could be stemmed to English words
    const wordsNotFound = promiseResult
        .filter((promise) => promise.status === 'rejected')
        .map((promise) => promise.reason as string);

    // Stem the words and look up their meanings
    const stemmedWords = wordsNotFound.map(word => stemText(word, natural.PorterStemmer));
    const englishWords2 = await lookupWords(stemmedWords);

    // Filter out successfully found English words from the original tokens
    const englishWords1 = await lookupWords(tokenized.filter((word, index) => promiseResult[index].status === 'fulfilled'));

    console.log([...englishWords1, ...englishWords2])
    // Merge the results and return
    return [...englishWords1, ...englishWords2];
}

// Helper function to look up words asynchronously
const lookupWords = async (words: string[]) => {
    const results = await Promise.allSettled(words.map((word) => lookupAsync(word)));
    return results
        .filter((promise) => promise.status === 'fulfilled')
        .map((promise) => promise.value as string);
}


export const POST = async (
    req: NextApiRequest,
) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const response = schema.safeParse(await req.json());

    if (!response.success) {
        const { errors } = response.error;
        console.log({ errors })
        return NextResponse.json({
            error: { message: "Invalid request", errors },
        });
    }

    const { language, phrase } = response.data;
    const englishWords: string[] = await extractEnglishWords(phrase)
    const stemmer = stemmers[language]
    if (!stemmer) {
        return NextResponse.json({
            error: { message: "Invalid language" },
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return NextResponse.json({ f: stemText(englishWords.join(' '), stemmer) })

}



