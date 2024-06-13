
import nlp from 'compromise';
import { syllable } from 'syllable';
import { wordFrequencyScores } from '../../api/globalVariables';

const averageWordLength = 5;

export async function calculateSentenceDifficulty(sentence: string): Promise<number> {
    const doc = nlp(sentence);
    const words = (doc.terms().out('array') as string[]).map((word: string) => word.replace(/[^\w\s]/gi, '')).filter(Boolean);

    // Word Length Score
    const lengthScores: number[] = words.map(word => Math.abs(word.length - averageWordLength));
    const maxLengthScore: number = Math.max(...lengthScores);


    // Syllable Count Score
    const syllableScores: number[] = words.map(word => syllable(word));
    const maxSyllableScores: number = Math.max(...syllableScores);
    // const avgSyllableScore: number = syllableScores.reduce((a, b) => a + b, 0) / syllableScores.length;

    const frequencyScore = normalizeFrequencyScore(await wordFrequencyScores(), words)
    // Combine Scores
    // TODO: flow this = > https://youtube.com/playlist?list=PL8dPuuaLjXtP5mp25nStsuDzk2blncJDW&si=QXQJncuzNDYwFcP4
    const difficultyScore: number = (frequencyScore + maxLengthScore + maxSyllableScores);

    // console.log({ sentence, len: { lengthScores, maxLengthScore }, syl: { syllableScores, maxSyllableScores }, freq: { words, frequencyScore } })
    return difficultyScore;
}


function normalizeFrequencyScore(wordFrequencyScores: Record<string, number>, words: string[]): number {
    // Calculate the maximum frequency score
    const maxFrequencyScore = Math.max(...Object.values(wordFrequencyScores));

    // Calculate the inverted frequency scores
    const invertedFrequencyScores: number[] = words.map(word => maxFrequencyScore - (wordFrequencyScores[word] ?? 0));
    // console.log({ sad: words.map((word) => ({ word, freq: wordFrequencyScores[word] })) })
    // Calculate the sum of the inverted frequency scores
    const sumOfInvertedScores: number = invertedFrequencyScores.reduce((sum, score) => sum + score, 0);

    // Normalize the inverted frequency scores
    const normalizedFrequencyScores: number[] = invertedFrequencyScores.map(score => score / sumOfInvertedScores);

    // Calculate the overall normalized frequency score
    const normalizedFrequencyScore: number = normalizedFrequencyScores.reduce((sum, score) => sum + score, 0) / words.length;

    return normalizedFrequencyScore;
}

