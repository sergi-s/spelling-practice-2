// import { tokenizeCorpus } from '../utils/NLP/tokenizeCorpus';
// import { createFrequencyDocument } from '../utils/NLP/createfrequencyDocument';
import { db } from '~/server/db';


export const prisma = db


export const documents: string[] = []//tokenizeCorpus();
export const wordFrequencyScores: Record<string, number> = {} //createFrequencyDocument(documents);