import { existsSync, readFileSync, writeFileSync } from "fs";
import { WordTokenizer } from "natural";
import path from "path";

export function createFrequencyDocument(documents: string[]): Record<string, number> {
    const outputFilePath = path.join(process.cwd(), 'public/frequency', 'frequencyDocument.json');

    // Check if the JSON file exists
    if (existsSync(outputFilePath)) {
        // Load and parse the existing JSON file
        const data = readFileSync(outputFilePath, 'utf8');
        return JSON.parse(data) as Record<string, number>;
    }

    // Calculate word frequency if the file doesn't exist
    const wordFrequency: Record<string, number> = {};
    const tokenizer = new WordTokenizer();

    // Add documents to the frequency model
    documents.forEach((doc) => {
        const words = tokenizer.tokenize(doc.toLowerCase());
        words.forEach((word) => {
            if (wordFrequency[word]) {
                wordFrequency[word]++;
            } else {
                wordFrequency[word] = 1;
            }
        });
    });

    // Write the JSON string to a file
    writeFileSync(outputFilePath, JSON.stringify(wordFrequency), 'utf8');
    return wordFrequency;
}