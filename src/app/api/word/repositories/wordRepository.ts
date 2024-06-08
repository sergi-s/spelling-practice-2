import { prisma } from "../../globalVariables";


const repository = {
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
    }
}

export default repository