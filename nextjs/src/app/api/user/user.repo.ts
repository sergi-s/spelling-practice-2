import { prisma } from "../globalVariables"


export const userRepo = {
    getById: async (userId: string) => {
        return await prisma.user.findFirst({ where: { id: userId } })
    },
    updateEloRating: async (userId: string, newEloRating: number) => {
        return await prisma.user.update({ where: { id: userId }, data: { eloRating: newEloRating } })
    },
}
