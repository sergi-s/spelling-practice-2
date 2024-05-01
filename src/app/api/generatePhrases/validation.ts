import { z } from 'zod';

export const generatedSentenceSchema = z.object({
    model: z.union([z.literal('gemma:2b'), z.literal('gemma:2b')]),
    response: z.string()
});

export const generatedChatSentenceSchema = z.object({
    message: z.object({ content: z.string() }),
});
