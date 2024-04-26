import { generateSentence } from "./generateGemma:2b";
import { NextResponse } from "next/server";


export const GET = async () => {

    const response = await generateSentence()

    for (let i = 0; i < 10; i++) {
        await generateSentence()
    }

    if (!response) {
        return NextResponse.json({
            error: { message: "Invalid request" },
        });
    }

    return NextResponse.json(response)

}

