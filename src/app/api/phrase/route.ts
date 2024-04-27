import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../prisma';

const schema = z.object({
    sentenceIds: z.string().array(),
})

export const POST = async (
    req: NextApiRequest,
) => {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    const response = schema.safeParse(await req.json());

    if (!response.success) {
        const { errors } = response.error;
        console.log({ errors })
        return NextResponse.json({
            error: { message: "Invalid request", errors },
        });
    }

    return NextResponse.json(await getRandomphrasesNotInList(response.data.sentenceIds))

}


async function getRandomphrasesNotInList(sentenceIds: string[]) {
    try {
        const phrasesCount = await prisma.phrase.count({
            where: {
                NOT: { id: { in: sentenceIds } },
            },
        });
        const skip = Math.floor(Math.random() * phrasesCount);
        const phrases = await prisma.phrase.findMany({
            take: 1,
            skip: skip,
            where: {
                NOT: { id: { in: sentenceIds } },
            }
        });
        return phrases[0]
    } catch (error) {
        console.error('Error fetching random sentence:', error);
        throw error;
    }
}

