import { type NextRequest, NextResponse } from 'next/server';
import { schema } from './phrase.validation';
import { getServerAuthSession } from '~/server/auth';
import { userRepo } from '../user/user.repo';
import { recommendSentences } from './actions/authedPhrases';


export const POST = async (
    req: NextRequest,
) => {
    try {
        const body = await req.json() as unknown;
        const response = schema.safeParse(body);
        // currently we dont do anything with the data form the frontend
        const session = await getServerAuthSession()
        if (!session) throw new Error("Oops")
        const userId = session?.user.id
        const user = await userRepo.getById(userId)
        if (!user) throw new Error("Oops")

        const practiceSentences = (await recommendSentences(user)).sort(() => Math.random() - 0.5)
        console.dir({ practiceSentences }, { depth: null })
        return NextResponse.json(practiceSentences)

    } catch (error) {
        console.error('Error fetching user:', error);
        return NextResponse.json({ error: 'Internal Server Error', c: error }, { status: 500 });
    }
}