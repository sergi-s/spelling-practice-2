import { prisma } from "../../globalVariables";


const topicRepo = {
    getTopicByName: async (topic: string) => {
        return await prisma.topic.findFirst({ where: { topic } })
    },
    save: async (topic: string) => {
        return await prisma.topic.create({ data: { topic } })
    },
    getAllTopics: async () => {
        return await prisma.topic.findMany().then((topics) => {
            return topics.map(t => t.topic)
        })
    },
    createManyTopics: async (topics: { topic: string; }[]) => {
        return await prisma.topic.createMany({ data: topics })
    }
}

export default topicRepo