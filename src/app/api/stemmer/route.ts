import type { NextApiRequest } from 'next'
import { NextResponse } from 'next/server';
import { schema } from './validation';
import { extractEnglishWords, stem, stemText, stemmers } from './service';


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

    const { language, phrase } = response.data;
    const englishWords: string[] = await extractEnglishWords(phrase)
    // const stemmer = stemmers[language]
    // if (!stemmer) {
    //     return NextResponse.json({
    //         error: { message: "Invalid language" },
    //     });
    // }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return NextResponse.json({ f: stem(englishWords.join(' '), language) })

}



