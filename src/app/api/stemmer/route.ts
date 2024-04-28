import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server';
import { schema } from './validation';
import { extractEnglishWords, stem } from './service';


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

    const { language, phrase } = response.data;
    const englishWords: string[] = await extractEnglishWords(phrase)

    return NextResponse.json(stem(englishWords.join(' '), language))

}



