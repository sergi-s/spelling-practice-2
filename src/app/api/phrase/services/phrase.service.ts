import { stem } from '../../stemmer/service';
import topicRepo from '../../topics/repositories/topicRepository';
import phraseRepo from '../repositories/phraseRepository';
import wordRepo from '../../word/repositories/wordRepository'
import { type GeneratedPhrase } from '../phrase.generators/interfaces';
import { calculateSentenceDifficulty } from '~/app/utils/NLP/calculateDifficulty';
import { type Topic } from '@prisma/client';

export async function saveGeneratedPhrase(phrase: GeneratedPhrase, topic?: string) {
    try {
        // TODO: cosine similarity is needed here
        console.log('Saving generated sentence:', phrase);
        const sentenceAlreadyExists = await phraseRepo.findPhrasesByCompletePhrase(phrase.generatedSentence)
        if (sentenceAlreadyExists) return sentenceAlreadyExists;

        const difficulty = await calculateSentenceDifficulty(phrase.generatedSentence)

        const words = phrase.tokenizedSentence

        const wordIDs = [];

        for await (const word of words) {
            if (word.length <= 1) continue;
            const stemmedWord = await stem(word)
            const savedWord = await wordRepo.createOrGet(word, stemmedWord)
            wordIDs.push(savedWord.id)
        }

        let isTopic: Topic | null;
        if (topic) {
            isTopic = await topicRepo.getTopicByName(topic)
            if (!isTopic) {
                isTopic = await topicRepo.save(topic)
            }
        }

        const sentenceP = await phraseRepo.createPhrase(phrase.generatedSentence, difficulty, wordIDs, isTopic!)
        console.log({ saved: sentenceP })
        return sentenceP;
    } catch (error) {
        console.error('Error:', error);
    }
}
