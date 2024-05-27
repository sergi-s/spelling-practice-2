import type { NextApiRequest } from 'next';
import { NextResponse } from 'next/server';
import { schema } from './validation';
import { extractEnglishWords, stem } from './service';

// this is a playground file to test stemmers and word lookups



export const POST = async (req: NextApiRequest) => {
    try {
        const body = await req.json();
        const response = schema.safeParse(body);

        if (!response.success) {
            const { errors } = response.error;
            console.log({ errors });
            return NextResponse.json({
                error: { message: "Invalid request", errors },
            }, { status: 400 });
        }


        let { language, phrase } = response.data;
        // what comes next should be language specific (because french has accents and what not)


        phrase = phrase.replace(/[^a-z A-Z]/g, '').toLowerCase();


        // console.log({ extractEnglishWords: extractEnglishWords(phrase) })
        const englishWords = extractEnglishWords(phrase);
        return NextResponse.json({
            englishWords,
            stem: await stem(phrase, "en")
        });

    } catch (error) {
        console.error("Error processing the request:", error);
        return NextResponse.json({
            error: { message: "Internal server error" },
        }, { status: 500 });
    }
}
