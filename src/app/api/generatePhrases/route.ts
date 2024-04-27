import { generateSentence } from "./generateGemma:2b";

export const GET = async () => {
    // Initialize response stream
    const responseStream = new TransformStream();
    const writer = responseStream.writable.getWriter();
    const encoder = new TextEncoder();

    try {
        // Generate additional responses asynchronously
        for (let i = 0; i < 10; i++) {
            const additionalResponse = await generateSentence();
            // Write additional response to stream
            await writer.write(encoder.encode(`${additionalResponse?.phrase}\n`));
        }
    } catch (error) {
        console.error('An error occurred during stream generation', error);
        await writer.write(encoder.encode('An error occurred during stream generation'));
    } finally {
        // Close the writer
        await writer.close();
    }

    // Return response with appropriate headers
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
};
