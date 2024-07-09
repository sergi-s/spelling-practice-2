import { prisma } from "../globalVariables"


export const userPhraseAttemptRepo = {
    updateAttemptPerformance: async (userId: string, sentenceId: string) => {
        await prisma.userAttemptingPhrase.upsert({
            where: {
                userId_sentenceId: { userId, sentenceId }
            },
            create: { sentenceId, userId, "performance": { encounters: 1 } },
            update: { performance: { update: { encounters: { increment: 1 } } } },
        })
    }
}