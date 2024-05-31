import { prisma } from "../../globalVariables";

const repository = {
    getPhraseByWordIdAndNotInSentencesIds: async (wordId: string, sentenceIds: string[]) => {
        return await prisma.phrase.findFirst({ where: { wordIDs: { has: wordId }, NOT: { id: { in: sentenceIds } } } });
    },

    countPhrasesByCriteria: async (difficulty: number, topic: string, sentenceIds: string[]) => {
        const count = await prisma.phrase.count({
            where: {
                difficulty,
                topic: { topic },
                NOT: { id: { in: sentenceIds } }
            }
        });
        return count;
    },

    findPhrasesByRandom: async (skip: number, difficulty: number, sentenceIds: string[]) => {
        return await prisma.phrase.findMany({
            take: 1,
            skip: skip,
            where: {
                difficulty,
                NOT: { id: { in: sentenceIds } }
            }
        });
    },

    findPhrasesByCompletePhrase: async (phrase: string) => {
        return await prisma.phrase.findFirst({ where: { phrase } });
    },

    createPhrase: async (phrase: string, difficulty: number, wordIDs: string[], isTopic?: { id: string }) => {
        const sentenceP = await prisma.phrase.create({
            data: {
                phrase,
                difficulty,
                wordIDs,
                ...(isTopic && { topicId: isTopic.id })
            }
        });
        return sentenceP;
    }
};

export default repository