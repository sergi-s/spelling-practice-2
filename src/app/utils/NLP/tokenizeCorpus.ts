import { WordTokenizer } from "natural";
import * as fs from 'fs';
import path from "path";

// Use process.cwd() to get the absolute path to the current working directory
const corpusDirectory = 'corps/brown';

// Create a tokenizer instance
const tokenizer = new WordTokenizer();

function isPosTag(word: string): boolean {
    // POS tags typically consist of 2-4 lowercase letters
    return /^[a-z]{2,4}$/.test(word);
}

// Function to check if a word contains English characters only
function isEnglishWord(word: string): boolean {
    return /^[a-zA-Z]+$/.test(word) && !isPosTag(word) && word.length > 1;
}

// Function to parse the Brown Corpus files and return the extracted data
export function tokenizeCorpus(): string[] {
    const result: string[] = [];

    // Read each file in the corpus
    fs.readdirSync(corpusDirectory).forEach(file => {
        const data = fs.readFileSync(`${corpusDirectory}/${file}`, 'utf8');

        // Split the data into lines
        const lines: string[] = data.split('\n');

        // Process each line
        lines.forEach(line => {
            // Tokenize the line using the natural tokenizer
            const tokens: string[] = tokenizer.tokenize(line);

            // Filter out non-English words
            const englishTokens: string[] = tokens.filter(token => isEnglishWord(token));

            // Extract relevant information from the tokens
            const words: string[] = englishTokens.map(token => token.toLowerCase()); // Convert to lowercase

            // Add the extracted words to the result
            result.push(...words);
        });
    });

    return result;
}

