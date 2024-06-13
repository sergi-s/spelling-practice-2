
import nlp from 'compromise';
import { syllable } from 'syllable';
import { updateWordFrequencyScores, wordFrequencyScores } from '../../api/globalVariables';

const MAX_WORD_LENGTH = 45; // max is: "pneumonoultramicroscopicsilicovolcanoconiosis"
const MAX_SYLLABLE_COUNT = 14; // max is: "pneumonoultramicroscopicsilicovolcanoconiosis"
const MAX_FREQUENCY_SCORE = 1; // inverted frequency score is between 0 and 1

export async function calculateSentenceDifficulty(sentence: string) {
    const doc = nlp(sentence);
    const words = (doc.terms().out('array') as string[])
        .map((word: string) => word.replace(/[^\w\s]/gi, '').toLowerCase())
        .filter(Boolean).filter((w) => w.length > 1);

    // Length Scores
    const normalizedMaxLengthScore: number = Math.max(...words.map((word) => word.length / MAX_WORD_LENGTH));

    // Syllable Scores
    const syllableScores: number[] = words.map(word => syllable(word));
    const maxSyllableScores: number = Math.max(...syllableScores);
    const normalizedMaxSyllableScore: number = maxSyllableScores / MAX_SYLLABLE_COUNT;

    // Frequency Scores
    const { frequency, invertedFrequency } = await wordFrequencyScores();
    await updateFrequencyDoc(frequency, words);
    const frequencyScore = normalizeFrequencyScore(invertedFrequency, words);
    const normalizedFrequencyScore: number = frequencyScore / MAX_FREQUENCY_SCORE;

    // Combined Difficulty Score
    const difficultyScore: number = (normalizedFrequencyScore + normalizedMaxLengthScore + normalizedMaxSyllableScore) / 3;

    return { difficultyScore, frequencyScore: normalizedFrequencyScore, lengthScore: normalizedMaxLengthScore, syllable: normalizedMaxSyllableScore };
}


function normalizeFrequencyScore(invertedFrequencyScores: Record<string, number>, words: string[]) {
    const debug = {}
    const scores = words.map((word) => {
        debug[word] = invertedFrequencyScores[word] ?? 1
        if (invertedFrequencyScores[word]) return invertedFrequencyScores[word]!
        else { return 1 }
    });
    const maxScore = Math.max(...scores);
    // console.log({ debug })
    return maxScore;
}

// TODO: this should be moved
async function updateFrequencyDoc(frequency: Record<string, number>, words: string[]) {
    // const unseenWords = words.filter((word) => !frequency[word])
    words.forEach((word) => frequency[word] ? frequency[word]++ : 1);
    await updateWordFrequencyScores(frequency)
}