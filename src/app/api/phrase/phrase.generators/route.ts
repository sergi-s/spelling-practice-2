import { generateAndSaveSentence } from "./helpers";


const SSE = async () => {

    const n = 10;
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();
    let closed = false;

    // Invoke long running process
    generateAndSaveSentence(n, {
        log: (msg: string) => void writer.write(encoder.encode("data: " + msg + "\n\n")),
        complete: (obj: string | undefined) => {
            void writer.write(encoder.encode("data: " + JSON.stringify(obj) + "\n\n"))
            if (!closed) {
                void writer.close();
                closed = true;
            }
        },
        error: (err: Error) => {
            void writer.write(encoder.encode("data: " + JSON.stringify(err) + "\n\n"));
            if (!closed) {
                void writer.close();
                closed = true;
            }
        },
        close: () => {
            if (!closed) {
                void writer.close();
                closed = true;
            }
        },
    }).then(() => {
        if (!closed) {
            void writer.close();
        }
    }).catch((e) => {
        console.error("Failed", e);
        if (!closed) {
            void writer.close();
        }
    });

    // Return response connected to readable
    return new Response(responseStream.readable, {
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

// //? NOTE: comment these 2 lines when building
// export const config = {
//     runtime: "edge",
// };

// export { SSE as GET }