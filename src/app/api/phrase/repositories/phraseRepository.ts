import { prisma } from "../../globalVariables";

const phraseRepo = {
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

    findMany: async ({ take = 1, skip = 0 }, where?: Record<string, unknown>) => {
        const queryOptions: {
            where?: Record<string, unknown>, take: number, skip: number
        } = { take, skip };

        if (where) {
            queryOptions.where = where;
        }
        return await prisma.phrase.findMany(queryOptions);
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

export default phraseRepo