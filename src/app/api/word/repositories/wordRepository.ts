import { prisma } from "../../globalVariables";


const repository = {
    getWordByStem: async (stemmedWord: string) => {
        const word = await prisma.word.findFirst({ where: { stemmedWord } });
        return word;
    },
    save: async (stemmedWord: string, word: string) => {
        const savedWord = await prisma.word.create({ data: { stemmedWord, representations: [word] } });
        return savedWord;
    },
    update: async (stemmedWord: string, word: string) => {
        const updatedWord = await prisma.word.update({ where: { stemmedWord }, data: { representations: { push: word } } });
        return updatedWord;
    }
}

export default repository