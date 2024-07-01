import { syllable } from 'syllable';
import { tokenize } from './tokenizer';
import { type Difficulty } from '~/app/api/phrase/phrase.generators/interfaces';

const MAX_WORD_LENGTH = 45; // max is: "pneumonoultramicroscopicsilicovolcanoconiosis"
const MAX_SYLLABLE_COUNT = 14; // max is: "pneumonoultramicroscopicsilicovolcanoconiosis"

export async function calculateSentenceDifficulty(sentence: string): Promise<Difficulty> {
    const words = tokenize(sentence)

    // Length Scores
    const normalizedMaxLengthScore: number = Math.max(...words.map((word) => word.length / MAX_WORD_LENGTH));

    // Syllable Scores
    const syllableScores: number[] = words.map(word => syllable(word));
    const maxSyllableScores: number = Math.max(...syllableScores);
    const normalizedMaxSyllableScore: number = maxSyllableScores / MAX_SYLLABLE_COUNT;

    // const sad = words.map(word => ({ word, syllable: syllable(word), len: word.length / MAX_WORD_LENGTH }));
    // console.log({ sad })
    // !Used to be Frequency Scores, but got removed for now

    // Combined Difficulty Score
    const difficultyScore: number = (normalizedMaxLengthScore + normalizedMaxSyllableScore) / 2;

    return { score: difficultyScore, frequencyScore: 0, lengthScore: normalizedMaxLengthScore, syllableScore: normalizedMaxSyllableScore };
}