import { prisma } from "../../globalVariables";


const repository = {
    getWordsByIds: async (wordsIds: string[]) => {
        return await prisma.word.findMany({ where: { id: { in: wordsIds } } });
    },
    getWord: async (word: string) => {
        return await prisma.word.findFirst({ where: { word } });
    },
    getWordsByStem: async (stemmedWord: string) => {
        const word = await prisma.word.findMany({ where: { stemmedWord: { stem: stemmedWord } } });
        return word;
    },
    save: async ({ stemmedWord, word }: { stemmedWord: string, word: string }) => {
        const savedWord = await prisma.word.create({
            data: {
                performance: { correctEncounters: 0, encounters: 0 },
                word, stemmedWord: {
                    connectOrCreate: {
                        where: { stem: stemmedWord },
                        create: { stem: stemmedWord }
                    }
                }
            }
        });
        return savedWord;
    },
    update: async (stemmedWord: string, word: string) => {
        const updatedWord = await prisma.word.update({
            where: { word }, data:
            {
                stemmedWord: {
                    connectOrCreate: { create: { stem: stemmedWord }, where: { stem: stemmedWord } }
                }
            }
        });
        return updatedWord;
    },
    createOrGet: async (word: string, stemmedWord: string) => {
        return await prisma.word.upsert({
            create: {
                performance: { correctEncounters: 0, encounters: 0 },
                word, stemmedWord: {
                    connectOrCreate: {
                        where: { stem: stemmedWord }, create: { stem: stemmedWord }
                    }
                }
            }, update: {}, where: { word }
        })
    },

    getByPhraseId: async (id: string) => {
        return await prisma.phrase.findFirst({ where: { id }, include: { words: true } })
            .then((sentence) => { return sentence?.words.map((word) => word) }) ?? []
    },
    updateWordsPerformance: async (savedWords: { id: string, word: string }[], existingUserWordIds: string[], userWords: string[]) => {
        const bulkOperationsWords = savedWords
            .filter(({ id }) => !existingUserWordIds.includes(id))
            .map(({ word }, index) => {
                const isCorrect = userWords[index] === word;

                return {
                    q: { word },
                    u: { $inc: { "performance.encounters": 1, "performance.correctEncounters": isCorrect ? 1 : 0 } },
                };
            });

        (bulkOperationsWords.length <= 0) ? [] : await prisma.$runCommandRaw({
            update: "Word",
            updates: bulkOperationsWords,
        });

    }
}

export default repository