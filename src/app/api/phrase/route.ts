import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server';
import { getRandomPhrasesNotInList } from './phrase.service';
import { schema } from './phrase.validation';


export const POST = async (
    req: NextApiRequest,
) => {
    const body = await req.json() as unknown;
    const response = schema.safeParse(body);

    if (!response.success) {
        const { errors } = response.error;
        return NextResponse.json({
            error: { message: "Invalid request", errors },
        });
    }

    return NextResponse.json({
        phrase: await getRandomPhrasesNotInList(response.data.sentenceIds, response.data.difficulty)
    })
}



