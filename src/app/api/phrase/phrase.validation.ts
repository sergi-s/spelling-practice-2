import { z } from "zod";

export const schema = z.object({
    sentenceIds: z.string().array(),
    difficulty: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
    topic: z.string()
})

export const generatedChatSentenceSchema = z.object({
    message: z.object({ content: z.string() }),
});