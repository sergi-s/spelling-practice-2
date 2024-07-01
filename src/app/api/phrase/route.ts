import { type NextRequest, NextResponse } from 'next/server';
import { schema } from './phrase.validation';
import { getRandomPhrasesNotInList, trainOnMisspelledWords } from './services/phrase.service';


export const POST = async (
    req: NextRequest,
) => {
    try {
        const body = await req.json() as unknown;
        const response = schema.safeParse(body);

        if (!response.success) throw new Error("Invalid request")

        const { sentenceIds, difficulty, topic, misspelledWords } = response.data

        // const isMisspelledLogic = !!(misspelledWords && misspelledWords.length > 0 && Math.random() > 0.5);
        // console.log({ misspelledWords, isMisspelledLogic })

        // // return NextResponse.json({
        // //     phrase: "mama 7elwa",
        // //     id: "121212112",
        // //     difficulty: 1
        // // })

        // if (isMisspelledLogic) return NextResponse.json(await trainOnMisspelledWords(misspelledWords));
        // return NextResponse.json(await getRandomPhrasesNotInList(sentenceIds, difficulty, topic))

    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal Server Error', c: error }, { status: 500 });
    }
}