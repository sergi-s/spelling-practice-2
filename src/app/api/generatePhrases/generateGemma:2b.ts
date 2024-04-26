import { prisma } from "../prisma";
import { extractEnglishWords, stem } from "../stemmer/service";
import { generatedSentenceSchema } from "./validation";

export async function generateSentence() {
    const url = 'http://localhost:11434/api/generate';
    const requestBody = {
        model: 'gemma:2b',
        prompt: 'Give me a very easy sentence to practice my spelling in double quotation marks, dont provide anything else',
        stream: false
    };

    try {
        const LLMResponse = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!LLMResponse.ok) {
            throw new Error(`Failed to fetch. Status: ${LLMResponse.status}`);
        }

        const { response } = generatedSentenceSchema.parse(await LLMResponse.json())
        if (!response) throw new Error(`No response`)

        // the response contains string in a double quoted, extract it
        const sentence = response.match(/"([^"]+)"/)[1];

        if (!sentence) return

        console.log({ response, sentence });

        const englishWords: string[] = await extractEnglishWords(sentence)

        const sentenceP = await prisma.phrase.create({ data: { phrase: sentence } })

        const wordIDs = []

        for await (const word of englishWords) {
            const stemmedWord = await stem(word, 'en')


            if (!stemmedWord) {
                // word is useless
                continue
            }

            let savedWord;

            savedWord = await prisma.word.findUnique({ where: { stemmedWord } })

            if (savedWord) {
                await prisma.word.update({ where: { stemmedWord }, data: { representations: { push: word } } })
            }
            else {
                savedWord = await prisma.word.create({ data: { stemmedWord, representations: [word] } })
            }

            wordIDs.push(savedWord.id)

        }

        const savedPhrase = await prisma.phrase.update({ where: { id: sentenceP.id }, data: { wordIDs } })


        console.log({ savedPhrase })
        // Handle responseData
    } catch (error) {
        console.error('Error:', error);
    }
}

// void (async () => {
//     await generateSentence()
// })()