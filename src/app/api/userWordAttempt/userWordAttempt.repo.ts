import { type UserAttemptingWord } from "@prisma/client";
import { prisma } from "../globalVariables"


export const userWordAttemptRepo = {
    getWordUserAttempted: async (userId: string, wordIds: string[]) => {
        return await prisma.userAttemptingWord.findRaw({
            filter: {
                userId: { $eq: userId },
                wordId: { $in: wordIds },
            }
        }).then((userAttempts) => {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
            return userAttempts.map(({ wordId }) => wordId)
        }) as string[]
    },
    updateAttemptPerformance: async (userId: string, correctWords: string[], userWords: string[], savedWords: { word: string, id: string }[]) => {
        const bulkOperations = correctWords.map((word: string, index) => {
            const isCorrect = userWords[index] === word;
            const { id } = savedWords?.find(({ word: savedWord }) => savedWord === word) ?? {};

            return {
                q: { wordId: id, userId },
                u: { $inc: { "performance.encounters": 1, "performance.correctEncounters": isCorrect ? 1 : 0 } },
                upsert: true
            };
        });


        await prisma.$runCommandRaw({
            update: "UserAttemptingWord",
            updates: bulkOperations.filter(Boolean)
        })

    },

    getAttemptsBasedOnAverage: async (userId: string, average: number) => {
        const r = await prisma.userAttemptingWord.findRaw({
            filter: {
                userId: { $eq: userId },
                "performance.correctEncounters": { $exists: true },
                "performance.encounters": { $gt: 0 },
                $expr: { $lt: [{ $divide: ["$performance.correctEncounters", "$performance.encounters"] }, average] }
            },
        })
        return r as unknown as UserAttemptingWord[]
    }
}