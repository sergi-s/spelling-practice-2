import { db } from '~/server/db';
import { promises, writeFileSync } from 'fs';
import { invertedFrequencyScores } from '../utils/NLP/createFrequencyDocument.cjs';
import path from 'path';


export const prisma = db

export const wordFrequencyScores = async () => {
    try {
        const data = JSON.parse(await promises.readFile("./public/frequency/frequencyDocument.json", 'utf8')) as Record<string, number>;
        const invertedFrequency = invertedFrequencyScores(data);
        return { frequency: data, invertedFrequency }
    } catch (error) {
        console.error('Error loading JSON file:', error);
        throw error;
    }
}


// TODO: this needs to be moved 
export const updateWordFrequencyScores = async (newFreq: Record<string, number>) => {
    try {
        const data = JSON.stringify(newFreq)
        const outputFilePath = path.join(
            process.cwd(),
            "public/frequency",
            "frequencyDocument.json",
        );
        writeFileSync(outputFilePath, data, "utf8");
    } catch (error) {
        console.error('Error loading JSON file:', error);
        throw error;
    }
}