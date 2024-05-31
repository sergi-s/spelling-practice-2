
import nlp from 'compromise';
import { syllable } from 'syllable';
import { wordFrequencyScores } from '../../api/globalVariables';

const averageWordLength = 5;

export function calculateSentenceDifficulty(sentence: string): number {
    const doc = nlp(sentence);
    const words = (doc.terms().out('array') as string[]).map((word: string) => word.replace(/[^\w\s]/gi, '')).filter(Boolean);

    // Word Length Score
    const lengthScores: number[] = words.map(word => Math.abs(word.length - averageWordLength));
    const avgLengthScore: number = lengthScores.reduce((a, b) => a + b, 0) / lengthScores.length;

    // Syllable Count Score
    const syllableScores: number[] = words.map(word => syllable(word));
    const avgSyllableScore: number = syllableScores.reduce((a, b) => a + b, 0) / syllableScores.length;

    const frequencyScore = normalizeFrequencyScore(wordFrequencyScores, words)
    // Combine Scores
    const difficultyScore: number = (frequencyScore + avgLengthScore + avgSyllableScore) / 3;

    // console.log({ sentence, avgLengthScore, avgSyllableScore, frequencyScore, difficultyScore, syllableScores })
    return difficultyScore;
}


function normalizeFrequencyScore(wordFrequencyScores: Record<string, number>, words: string[]): number {
    // Calculate the maximum frequency score
    const maxFrequencyScore = Math.max(...Object.values(wordFrequencyScores));

    // Calculate the inverted frequency scores
    const invertedFrequencyScores: number[] = words.map(word => maxFrequencyScore - (wordFrequencyScores[word] ?? 0));

    // Calculate the sum of the inverted frequency scores
    const sumOfInvertedScores: number = invertedFrequencyScores.reduce((sum, score) => sum + score, 0);

    // Normalize the inverted frequency scores
    const normalizedFrequencyScores: number[] = invertedFrequencyScores.map(score => score / sumOfInvertedScores);

    // Calculate the overall normalized frequency score
    const normalizedFrequencyScore: number = normalizedFrequencyScores.reduce((sum, score) => sum + score, 0) / words.length;

    return normalizedFrequencyScore;
}

