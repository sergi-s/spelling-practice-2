import { type NextRequest, NextResponse } from 'next/server';
import { getRandomPhrasesNotInList } from './phrase.service';
import { schema } from './phrase.validation';


export const POST = async (
    req: NextRequest,
) => {
    const body = await req.json() as unknown;
    const response = schema.safeParse(body);

    if (!response.success) {
        // const { errors } = response.error;
        return NextResponse.json({
            error: { message: "Invalid request" },
        });
    }
    // TODO: get array of wrong words
    // TODO: get a sentence that has one or more of the wrong words
    // TODO: if there is none, generate a new sentence based on the wrong words


    // TODO: filter generated sentences (no politics)

    const { sentenceIds, difficulty, topic, misspelledWords } = response.data
    return NextResponse.json(await getRandomPhrasesNotInList(sentenceIds, difficulty, topic, misspelledWords))
}