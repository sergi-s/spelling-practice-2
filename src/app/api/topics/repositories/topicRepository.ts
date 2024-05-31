import { prisma } from "../../globalVariables";


const repository = {
    getTopicByName: async (topic: string) => {
        return await prisma.topic.findFirst({ where: { topic } })
    },
    save: async (topic: string) => {
        return await prisma.topic.create({ data: { topic } })
    }
}

export default repository