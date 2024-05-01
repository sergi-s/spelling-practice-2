import { GemmaChatSentenceStrategy } from "./gemma.2b.chat";
import { generateSentence } from ".";
import { saveGeneratedPhrase } from "../phrase.service";
import { Language } from "../../stemmer/validation";

interface Notify {
    log: (message: string) => void;
    complete: (data: string | undefined) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
    error: (error: Error | any) => void;
    close: () => void;
}

const generateAndSaveSentence = async (n = 1, notify: Notify) => {
    for (let i = 0; i < n; i++) {

        const difficulty = Math.floor(Math.random() * 4) + 1;
        const language = Language.en;

        const phrase = await generateSentence(GemmaChatSentenceStrategy, difficulty, language);
        if (!phrase) return notify.log("No sentence generated")
        const savedPhrase = await saveGeneratedPhrase(difficulty, language, phrase);
        if (!savedPhrase) return notify.log("The sentence was not saved")
        notify.log(`Sentence ${i + 1}: ${savedPhrase.phrase}`);
    }
    notify.complete("done all processes");
}

export const GET = async () => {

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

export const config = {
    runtime: "edge",
};