
import { prisma } from '../prisma';
import { extractEnglishWords, stem } from '../stemmer/service';
import { type Language } from '../stemmer/validation';

export async function getRandomPhrasesNotInList(sentenceIds: string[], difficulty: number | undefined) {
    try {
        const phrasesCount = await prisma.phrase.count({
            where: {
                difficulty,
                NOT: { id: { in: sentenceIds } },
            },
        });
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


export async function saveGeneratedPhrase(difficulty: number, language: Language, phrase: string) {
    try {
        console.log('Saving generated sentence:', phrase);
        const sentenceAlreadyExists = await prisma.phrase.findFirst({ where: { phrase } });
        if (sentenceAlreadyExists) {
            console.log('Sentence already exists:', sentenceAlreadyExists);
            return sentenceAlreadyExists.phrase;
        }

        const englishWords = await extractEnglishWords(phrase);
        const wordIDs = [];

        for await (const word of englishWords) {
            const stemmedWord = await stem(word, language);

            if (stemmedWord) {
                let savedWord = await prisma.word.findUnique({ where: { stemmedWord } });

                if (!savedWord) {
                    savedWord = await prisma.word.create({ data: { stemmedWord, representations: [word] } });
                } else {
                    await prisma.word.update({ where: { stemmedWord }, data: { representations: { push: word } } });
                }

                wordIDs.push(savedWord.id);
            }
        }

        const sentenceP = await prisma.phrase.create({ data: { phrase, difficulty, wordIDs } });
        console.log("Saved sentence:", sentenceP);

        return sentenceP.phrase;
    } catch (error) {
        console.error('Error:', error);
    }
}