import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '../prisma';

const schema = z.object({
    sentenceIds: z.string().array(),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
})

export const POST = async (
    req: NextApiRequest,
) => {
    const body = await req.json();
    const response = schema.safeParse(body);

    if (!response.success) {
        const { errors } = response.error;
        console.log({ errors })
        return NextResponse.json({
            error: { message: "Invalid request", errors },
        });
    }

    return NextResponse.json(await getRandomphrasesNotInList(response.data.sentenceIds, response.data.difficulty))

}


async function getRandomphrasesNotInList(sentenceIds: string[], difficulty: number | undefined) {
    try {
        const phrasesCount = await prisma.phrase.count({
            where: {
                difficulty,
                NOT: { id: { in: sentenceIds } },
            },
        });
        const skip = Math.floor(Math.random() * phrasesCount);
        const phrases = await prisma.phrase.findMany({
            take: 1,
            skip: skip,
            where: {
                difficulty,
                NOT: { id: { in: sentenceIds } },
            }
        });
        return phrases[0]
    } catch (error) {
        console.error('Error fetching random sentence:', error);
        throw error;
    }
}

