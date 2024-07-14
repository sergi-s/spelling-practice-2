import { type Phrase } from "@prisma/client";
import { prisma } from "../../globalVariables";
import { type Difficulty } from "../phrase.generators/interfaces";

const phraseRepo = {
    getPhraseByWordIdAndNotInSentencesIds: async (wordId: string, sentenceIds: string[]) => {
        return await prisma.phrase.findFirst({ where: { wordIDs: { has: wordId }, NOT: { id: { in: sentenceIds } } } });
    },

    countPhrasesByCriteria: async ({ take, skip }: { take?: number, skip?: number }, where?: Record<string, unknown>) => {
        const queryOptions: Record<string, unknown> = {};
        if (take) queryOptions.take = take;
        if (skip) queryOptions.skip = skip;
        if (where) queryOptions.where = where;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return prisma.phrase.count(queryOptions);
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

    createPhrase: async (phrase: string, difficulty: Difficulty, wordIDs: string[], isTopic?: { id: string, topic: string }) => {
        const sentenceP = await prisma.phrase.create({
            data: {
                phrase,
                words: { connect: wordIDs.map((id) => ({ id })) },
                difficulty,
                ...(isTopic && { topic: { connectOrCreate: { where: { id: isTopic.id }, create: isTopic } } })
            }
        });
        return sentenceP;
    },

    getPhrasesByWord: async (wordId: string) => {
        return await prisma.phrase.findMany({ where: { wordIDs: { has: wordId } } });
    },
    getByWordsIds: async (wordIds: string[]) => {
        const include = { userAttemptingPhrase: { select: { performance: { select: { encounters: true } } } } }
        return await prisma.phrase.findMany({ include, where: { wordIDs: { hasSome: wordIds } } })

    },
    getBasedOnElo: async (eloRating: number, limit: number) => {
        const min = 0, max = 1000
        const fromEloToWordDiff = (eloRating - min) / (max - min);
        const score = {
            $gte: fromEloToWordDiff - 0.1,
            $lte: fromEloToWordDiff + 0.1
        }
        // console.log({ fromEloToWordDiff, score })
        return await prisma.phrase.findRaw({
            filter: {
                "difficulty.score": score
            },
            options: { limit }

        }) as unknown as Phrase[]
    },
};

export default phraseRepo