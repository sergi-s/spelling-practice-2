
import { getRandomElement } from '~/app/utils/random/chooseRandomElement';
import { stem } from '../../stemmer/service';
import { Language } from '../../stemmer/validation';
import { generateSentence } from '../phrase.generators';

import topicRepo from '../../topics/repositories/topicRepository';
import phraseRepo from '../repositories/phraseRepository';
import wordRepo from '../../word/repositories/wordRepository'
import { SentenceStrategy, TopicSentenceStrategy, WordSentenceStrategy } from '../phrase.generators/strategies';


export async function getRandomPhrasesNotInList(sentenceIds: string[], difficulty?: number, topic?: string) {
    try {
        difficulty = difficulty ?? 1
        topic = topic ?? getRandomElement(await topicRepo.getAllTopics())

        // Topic
        const savedTopic = await topicRepo.getTopicByName(topic)

        const phrasesCount = await phraseRepo.countPhrasesByCriteria({}, { difficulty, topic: { topic }, NOT: { id: { in: sentenceIds } } })
        // Generate a new sentence if we did not find any with the same topic
        if (!phrasesCount || !savedTopic) {
            const phrase = await generateSentence(SentenceStrategy, [new TopicSentenceStrategy(topic)]);
            if (!phrase) throw new Error("sorry we ran into a problem")
            // return phrase
            const savedPhrase = await saveGeneratedPhrase(difficulty, Language.en, phrase, topic);
            return savedPhrase
        }
        const skip = Math.floor(Math.random() * phrasesCount);
        const phrases = await phraseRepo.findMany({ skip, take: 1 }, { difficulty, topic: { topic }, NOT: { id: { in: sentenceIds } } })
        return phrases[0] ?? 'No phrases found'
    } catch (error) {
        console.error('Error fetching random sentence:', error);
        throw error;
    }
}
export async function trainOnMisspelledWords(misspelledWords: string[]) {
    const stemmedMisspelledWords = (await stem(misspelledWords.join(" "))).split(" ")
    if (stemmedMisspelledWords.length === 0) throw new Error("No misspelled words found")
    const chosenWord = getRandomElement(stemmedMisspelledWords)
    console.log({ stemmedMisspelledWords })

    if (!chosenWord) throw new Error("No chosen misspelled words found")

    const word = getRandomElement(await wordRepo.getWordsByStem(chosenWord))
    if (!word) throw new Error(`how did you misspell a word not in our database =>${chosenWord}<=`)

    const phrase = getRandomElement(await phraseRepo.getPhrasesByWord(word?.id));
    if (!phrase || Math.random() < 0.5) {
        const temp = word.word
        const generatedSentence = await generateSentence(SentenceStrategy, [new WordSentenceStrategy(temp)])
        if (!generatedSentence) throw new Error('Failed to fetch user');
        // return generatedSentence
        const savedPhrase = await saveGeneratedPhrase(1, Language.en, generatedSentence)
        return savedPhrase
    }
    return phrase
}

export async function saveGeneratedPhrase(difficulty: number, language: Language, phrase: string, topic?: string) {
    try {
        // TODO: cosine similarity is needed here
        console.log('Saving generated sentence:', phrase);
        const sentenceAlreadyExists = await phraseRepo.findPhrasesByCompletePhrase(phrase)
        if (sentenceAlreadyExists) return sentenceAlreadyExists;

        const words = extractWords(phrase)

        const wordIDs = [];

        for await (const word of words) {

            let savedWord = await wordRepo.getWord(word);
            if (!savedWord) savedWord = await wordRepo.save({ stemmedWord: await stem(word), word })
            wordIDs.push(savedWord.id);
        }

        let isTopic
        if (topic) {
            isTopic = await topicRepo.getTopicByName(topic)
            if (!isTopic) {
                isTopic = await topicRepo.save(topic)
            }
        }

        const sentenceP = await phraseRepo.createPhrase(phrase, difficulty, wordIDs)

        return sentenceP;
    } catch (error) {
        console.error('Error:', error);
    }
}

const extractWords = (str: string) => {
    // Remove periods and single quotes using regex
    const cleanedStr = str.replace(/[.'']/g, "");
    // Split the string into words using space as a delimiter
    const wordsArray = cleanedStr.split(" ");
    return wordsArray;
};
