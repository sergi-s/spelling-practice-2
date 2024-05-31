import { NextResponse } from "next/server";
import { generateAndSaveSentence } from ".";
import { Logger } from "~/app/utils/logger";
import { ConsoleOutput, StreamOutput } from "~/app/utils/outputs";

const generateNSentences = async (): Promise<Response | void> => {
    const useConsole = true
    const n = 10;
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