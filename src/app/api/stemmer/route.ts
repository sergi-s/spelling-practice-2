"use server"
import { type NextRequest, NextResponse } from 'next/server';
import { schema } from './validation';
import { extractEnglishWords, stem } from './service';

// this is a playground file to test stemmers and word lookups



export const POST = async (req: NextRequest) => {
    try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const body = await req.json();
        const response = schema.safeParse(body);

        if (!response.success) {
            // const { errors } = response.error;
            // console.log({ errors });
            return NextResponse.json({
                error: { message: "Invalid request" },
            }, { status: 400 });
        }


        // eslint-disable-next-line @typescript-eslint/no-unused-vars, prefer-const
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
