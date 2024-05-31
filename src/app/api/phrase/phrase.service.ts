
import { getRandomElement } from '~/app/utils/random/chooseRandomElement';
import { prisma } from '../globalVariables';
import { extractEnglishWords, stem } from '../stemmer/service';
import { Language } from '../stemmer/validation';
import { generateSentence } from './phrase.generators';
import { GemmaChatSentenceStrategy, GemmaTopicMessage, GemmaWordMessage } from './phrase.generators/strategies/gemma.2b.chat';


//TODO: repo pattern

export async function getRandomPhrasesNotInList(sentenceIds: string[], difficulty?: number, topic?: string, misspelledWords?: string[]) {
    try {

        // 50% old misspelled words
        if (misspelledWords && misspelledWords?.length > 0 && Math.random() > 0.5) {
            const stemmedMisspelledWords: string[] = await Promise.all(
                misspelledWords?.map(async (w) => await stem(w, Language.en))
            );
            console.log({ stemmedMisspelledWords })
            const chosenWord = getRandomElement(stemmedMisspelledWords)
            if (!chosenWord) return { phrase: 'No phrases found' }
            const word = await prisma.word.findFirst({ where: { stemmedWord: chosenWord } });
            console.log({ word })
            if (!word) return { phrase: 'No word found you need to generate a new one' }
            const phrase = await prisma.phrase.findFirst({ where: { wordIDs: { has: word.id }, NOT: { id: { in: sentenceIds } }, } })
            if (!phrase) {
                const p = await generateSentence(GemmaChatSentenceStrategy, [new GemmaWordMessage(getRandomElement(word.representations) ?? word.stemmedWord)])
                // const p = await generateSentenceBasedOnaWord(1, Language.en, getRandomElement(word.representations) ?? word.stemmedWord)
                if (!p) return { phrase: "no phrase found 3x" }
                const savedPhrase = await saveGeneratedPhrase(1, Language.en, p)
                return savedPhrase
            }
            return phrase

        }

        // =========================
        // 50% new words
        difficulty = difficulty ?? 1

        // Topic
        const savedTopic = await prisma.topic.findFirst({ where: { topic } })

        const phrasesCount = await prisma.phrase.count({
            where: {
                difficulty, topic: { topic },
                NOT: { id: { in: sentenceIds } },
            },
        });
        // Generate a new sentence if we did not find any with the same topic
        if (!phrasesCount || !savedTopic) {
            const phrase = await generateSentence(GemmaChatSentenceStrategy, [new GemmaTopicMessage(topic!)]);
            if (!phrase) throw new Error("sorry we ran into a problem")
            return phrase
            // const savedPhrase = await saveGeneratedPhrase(difficulty, Language.en, phrase, topic ?? "");
            // return savedPhrase
        }
        const skip = Math.floor(Math.random() * phrasesCount);
        const phrases = await prisma.phrase.findMany({
            take: 1,
            skip: skip,
            where: {
                difficulty,
                NOT: { id: { in: sentenceIds } },
            }
        });
        return phrases[0] ?? { phrase: 'No phrases found' }
    } catch (error) {
        console.error('Error fetching random sentence:', error);
        throw error;
    }
}


export async function saveGeneratedPhrase(difficulty: number, language: Language, phrase: string, topic?: string) {
    try {
        console.log('Saving generated sentence:', phrase);
        const sentenceAlreadyExists = await prisma.phrase.findFirst({ where: { phrase } });
        if (sentenceAlreadyExists) {
            return sentenceAlreadyExists;
        }

        const englishWords = await extractEnglishWords(phrase);
        const wordIDs = [];

        for await (const word of englishWords) {
            if (!word) continue;
            const stemmedWord = await stem(word, language);

            if (stemmedWord) {
                let savedWord = await prisma.word.findUnique({ where: { stemmedWord } });

                if (!savedWord) {
                    savedWord = await prisma.word.create({ data: { stemmedWord, representations: [word] } });
                } else {
                    if (!savedWord.representations.includes(word)) {
                        await prisma.word.update({ where: { stemmedWord }, data: { representations: { push: word } } });
                    }
                }

                wordIDs.push(savedWord.id);
            }
        }

        let isTopic
        if (topic) {
            isTopic = await prisma.topic.findUnique({ where: { topic } })
            if (!isTopic) {
                isTopic = await prisma.topic.create({ data: { topic } })
            }
        }

        const sentenceP = await prisma.phrase.create({
            data: {
                phrase,
                difficulty,
                wordIDs,
                ...(isTopic && { topicId: isTopic.id })
            }
        });

        return sentenceP;
    } catch (error) {
        console.error('Error:', error);
    }
}