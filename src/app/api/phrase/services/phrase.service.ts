
// import { getRandomElement } from '~/app/utils/random/chooseRandomElement';
import { stem } from '../../stemmer/service';
// import { generateSentence } from '../phrase.generators';

import topicRepo from '../../topics/repositories/topicRepository';
import phraseRepo from '../repositories/phraseRepository';
import wordRepo from '../../word/repositories/wordRepository'
// import { SentenceStrategy, TopicSentenceStrategy, WordSentenceStrategy } from '../phrase.generators/strategies';
import { type GeneratedPhrase } from '../phrase.generators/interfaces';
import { calculateSentenceDifficulty } from '~/app/utils/NLP/calculateDifficulty';


// export async function getRandomPhrasesNotInList(sentenceIds: string[], difficulty?: number, topic?: string) {
//     try {
//         difficulty = difficulty ?? 1
//         topic = topic ?? getRandomElement(await topicRepo.getAllTopics())

//         // Topic
//         const savedTopic = await topicRepo.getTopicByName(topic)

//         const phrasesCount = await phraseRepo.countPhrasesByCriteria({}, { difficulty, topic: { topic }, NOT: { id: { in: sentenceIds } } })
//         // Generate a new sentence if we did not find any with the same topic
//         if (!phrasesCount || !savedTopic) {
//             const phrase = await generateSentence(SentenceStrategy, [new TopicSentenceStrategy(topic)]);
//             if (!phrase) throw new Error("sorry we ran into a problem")
//             // return phrase
//             const savedPhrase = await saveGeneratedPhrase(difficulty, Language.en, phrase, topic);
//             return savedPhrase
//         }
//         const skip = Math.floor(Math.random() * phrasesCount);
//         const phrases = await phraseRepo.findMany({ skip, take: 1 }, { difficulty, topic: { topic }, NOT: { id: { in: sentenceIds } } })
//         return phrases[0] ?? 'No phrases found'
//     } catch (error) {
//         console.error('Error fetching random sentence:', error);
//         throw error;
//     }
// }
// export async function trainOnMisspelledWords(misspelledWords: string[]) {
//     const stemmedMisspelledWords = (await stem(misspelledWords.join(" "))).split(" ")
//     if (stemmedMisspelledWords.length === 0) throw new Error("No misspelled words found")
//     const chosenWord = getRandomElement(stemmedMisspelledWords)
//     console.log({ stemmedMisspelledWords })

//     if (!chosenWord) throw new Error("No chosen misspelled words found")

//     const word = getRandomElement(await wordRepo.getWordsByStem(chosenWord))
//     if (!word) throw new Error(`how did you misspell a word not in our database =>${chosenWord}<=`)

//     const phrase = getRandomElement(await phraseRepo.getPhrasesByWord(word?.id));
//     if (!phrase || Math.random() < 0.5) {
//         const temp = word.word
//         const generatedSentence = await generateSentence(SentenceStrategy, [new WordSentenceStrategy(temp)])
//         if (!generatedSentence) throw new Error('Failed to fetch user');
//         // return generatedSentence
//         const savedPhrase = await saveGeneratedPhrase(1, Language.en, generatedSentence)
//         return savedPhrase
//     }
//     return phrase
// }

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

        let isTopic
        if (topic) {
            isTopic = await topicRepo.getTopicByName(topic)
            if (!isTopic) {
                isTopic = await topicRepo.save(topic)
            }
        }

        const sentenceP = await phraseRepo.createPhrase(phrase.generatedSentence, difficulty, wordIDs)
        console.log({ saved: sentenceP })
        return sentenceP;
    } catch (error) {
        console.error('Error:', error);
    }
}
