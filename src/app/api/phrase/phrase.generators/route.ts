"use server"
import { NextResponse } from "next/server";
import { generateAndSaveSentence } from ".";
import { Logger } from "~/app/utils/logger";
import { ConsoleOutput, StreamOutput } from "~/app/utils/outputs";
import { tokenize } from "~/app/utils/NLP/tokenizer";
import { saveGeneratedPhrase } from "../services/phrase.service";
import { calculateSentenceDifficulty } from "~/app/utils/NLP/calculateDifficulty";

/*export*/ const saveSentenceByMe = async (sentence: string) => {
    //! this is a endpoint to test manually 
    const phrase = { generatedSentence: sentence, tokenizedSentence: tokenize(sentence) }

    const { generatedSentence, tokenizedSentence } = phrase

    if (!phrase) return "No sentence generated"
    const { score, lengthScore, syllableScore } = await calculateSentenceDifficulty(generatedSentence)
    console.log({ score, lengthScore, syllableScore })

    const savedPhrase = await saveGeneratedPhrase(phrase);
    if (!savedPhrase) return "The sentence was not saved"
}

const generateNSentences = async (): Promise<Response | void> => {
    const useConsole = false
    const n = 5;
    let logger: Logger;
    let response
    if (useConsole) {
        logger = new Logger(new ConsoleOutput());
    } else {
        const responseStream = new TransformStream<Uint8Array>();
        const writer = responseStream.writable.getWriter();
        const encoder = new TextEncoder();
        logger = new Logger(new StreamOutput(writer, encoder));

        // Return response connected to readable
        response = new Response(responseStream.readable, {
            headers: {
                "Access-Control-Allow-Origin": "*",
                "Content-Type": "text/event-stream; charset=utf-8",
                Connection: "keep-alive",
                "Cache-Control": "no-cache, no-transform",
                "X-Accel-Buffering": "no",
                "Content-Encoding": "none",
            },
        });

    }
    // Invoke long running process
    generateAndSaveSentence(n, {
        log: (msg: string) => logger.log(msg),
        complete: (obj: string | undefined) => logger.complete(obj),
        error: (err: Error) => logger.error(err),
        close: () => logger.close(),
    }).then(() => {
        logger.close();
    }).catch((e) => {
        console.error("Failed", e);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        logger.error(e);
    });

    return useConsole ? NextResponse.json({ success: "true" }) : response;
};

// // //? NOTE: comment these 2 lines when building
// export const config = {
//     runtime: "edge",
// };

export { generateNSentences as GET }