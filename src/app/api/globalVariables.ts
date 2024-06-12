import { db } from '~/server/db';
import { promises } from 'fs';


export const prisma = db

export const wordFrequencyScores = async (): Promise<Record<string, number>> => {
    try {
        const data = await promises.readFile("./public/frequency/frequencyDocument.json", 'utf8');
        return JSON.parse(data) as Record<string, number>;
    } catch (error) {
        console.error('Error loading JSON file:', error);
        throw error;
    }
}