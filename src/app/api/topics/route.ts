import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server';
import { prisma } from '../prisma';


export const GET = async (
    req: NextApiRequest,
) => {
    const topics = await prisma.topic.findMany().then((topcis) => {
        return topcis.map(t => t.topic)
    })
    return NextResponse.json(topics)
}