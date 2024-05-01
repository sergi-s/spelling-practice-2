import { prisma } from "../prisma";
import { extractEnglishWords, stem } from "../stemmer/service";
import { Language, difficultyMap } from "../stemmer/validation";
import { generatedChatSentenceSchema } from "./validation";

const baseURL = 'http://192.168.2.237:11434/api/chat';

export async function generateSentence() {
    try {
        const difficulty = Math.floor(Math.random() * 4) + 1;
        const prompt = `Give me a ${difficultyMap[difficulty]} sentence to practice my spelling in double quotation marks, don't provide anything else`;

        const requestBody = {
            "model": "gemma:2b",
            "stream": false,
            "messages": [
                {
                    "role": "user",
                    "content": "Give a sentence to practice my spelling in double quotation marks, don't provide anything else"
                },
                {
                    "role": "user",
                    "content": `The provided sentence difficulty should be ${difficultyMap[difficulty]}`
                },
                {
                    "role": "user",
                    "content": "The provided sentence difficulty should be maximum 5 words"
                }
            ]
        }

        const response = await fetch(baseURL, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch. Status: ${response.status}`);
        }

        const { message: { content: generatedResponse } } = generatedChatSentenceSchema.parse(await response.json());
        if (!generatedResponse) {
            throw new Error('No response');
        }

        const sentence = generatedResponse.match(/"([^"]+)"/)?.[1];
        if (!sentence) {
            return;
        }

        const sentenceAlreadyExists = await prisma.phrase.findFirst({ where: { phrase: sentence } });
        if (sentenceAlreadyExists) {
            return await generateSentence();
        }

        const englishWords = await extractEnglishWords(sentence);
        const wordIDs = [];

        for await (const word of englishWords) {
            const stemmedWord = await stem(word, 'en');

            if (stemmedWord) {
                let savedWord = await prisma.word.findUnique({ where: { stemmedWord } });

                if (!savedWord) {
                    savedWord = await prisma.word.create({ data: { stemmedWord, representations: [word] } });
                } else {
                    await prisma.word.update({ where: { stemmedWord }, data: { representations: { push: word } } });
                }

                wordIDs.push(savedWord.id);
            }
        }

        const sentenceP = await prisma.phrase.create({ data: { phrase: sentence, difficulty, wordIDs } });

        console.log({ sentence });
        return sentenceP.phrase;
    } catch (error) {
        console.error('Error:', error);
    }
}

