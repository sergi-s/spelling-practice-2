import { generateSentence } from ".";
import { saveGeneratedPhrase } from "../phrase.service";
import { Language } from "../../stemmer/validation";
import { llama3SentenceStrategy } from "./llama3-70b-8192";
import { GemmaChatSentenceStrategy } from "./gemma.2b.chat";
import { prisma } from "../../prisma";

interface Notify {
    log: (message: string) => void;
    complete: (data: string | undefined) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
    error: (error: Error | any) => void;
    close: () => void;
}


export function getRandomElement(array: string[]) {
    return array[Math.floor(Math.random() * array.length)];
}


export const generateAndSaveSentence = async (n = 1, notify: Notify) => {
    const topics = await prisma.topic.findMany().then((topcis) => {
        return topcis.map(t => t.topic)
    }) as string[]
    for (let i = 0; i < n; i++) {

        const difficulty = Math.floor(Math.random() * 4) + 1;
        const language = Language.en;
        const topic = getRandomElement(topics);


        // const phrase = await generateSentence(GemmaChatSentenceStrategy, difficulty, language);

        const phrase = await generateSentence(llama3SentenceStrategy, difficulty, language, topic);
        if (!phrase) return notify.log("No sentence generated")
        const savedPhrase = await saveGeneratedPhrase(difficulty, language, phrase, topic);
        if (!savedPhrase) return notify.log("The sentence was not saved")
        notify.log(`Sentence ${i + 1}, difficulty level:${difficulty}/5, topic:${topic}: ${savedPhrase.phrase}`);
    }
    notify.complete("done all processes");
}

export const GET = async () => {

    const n = 50;
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

// export const runtime = "edge";