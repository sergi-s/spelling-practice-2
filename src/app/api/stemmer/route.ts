"use server"
import { type NextRequest, NextResponse } from 'next/server';
import { schema } from './validation';
import { stem } from './service';

//? NOTE: This is a playground file to test stemmers and word lookups


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


        // console.log({ extractEnglishWords: extractEnglishWords(phrase) })
        const englishWords = tokenize(phrase);
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


import { calculateSentenceDifficulty } from '../../utils/NLP/calculateDifficulty';
import phraseRepo from '../phrase/repositories/phraseRepository';
import { tokenize } from '~/app/utils/NLP/tokenizer';


// ====================================================



// export const GET = async (req: NextRequest) => {
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
//     const sentence = req.nextUrl.searchParams.get("sentence")

//     const sentenceStr = String(sentence);
//     console.log({ sentenceStr })
//     // const sentence = "The antediluvian obfuscations promulgated by the perspicacious yet sesquipedalian orator left the congregation in a state of befuddlement, with only the most sagacious attendees grasping the esoteric nuances of his grandiloquent discourse."
//     const difficultyScore: number = calculateSentenceDifficulty(sentenceStr);
//     console.log(`Sentence Difficulty Score: ${difficultyScore}`);
//     return NextResponse.json({ sad: `Sentence Difficulty Score: ${difficultyScore}` })
// }


export const GET = async () => {

    // const sentences = await prisma.phrase.findMany({ take: 30, skip: 0 })
    const sentences = await phraseRepo.findMany({ take: 30, skip: 0 })
    const r: Record<string, number> = {} as Record<string, number>;
    for (const sentence of sentences) {
        const sentenceStr = sentence.phrase.replace(/[^a-zA-Z\s]/g, '').toLowerCase();
        const difficultyScore = await calculateSentenceDifficulty(sentenceStr);
        r[sentenceStr] = difficultyScore.score;
        console.log("=============")
    }
    return NextResponse.json(Object.fromEntries(Object.entries(r).sort((a, b) => a[1] - b[1])))
}
