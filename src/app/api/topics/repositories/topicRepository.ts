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
    },
    getOrCreate: async (topic: string) => {
        return prisma.topic.upsert({ where: { topic }, create: { topic }, update: {} })
    },
    getRandomTopic: async () => {
        // TODO: make this generic
        const totalCount = await prisma.topic.count();
        const randomTopic = await prisma.topic.findFirstOrThrow({ skip: Math.floor(Math.random() * totalCount) });
        return randomTopic;
    }
}

export default topicRepo