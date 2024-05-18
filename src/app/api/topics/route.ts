import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server';
import { topics } from '../phrase/phrase.generators/constants';


export const GET = async (
    req: NextApiRequest,
) => {
    return NextResponse.json(topics)
}