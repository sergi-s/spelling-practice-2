import { z } from "zod";

export const schema = z.object({
    userId: z.string(),
    skip: z.number().default(0),
    take: z.number().default(10),
    topic: z.string().optional(),
    difficulty: z.number().optional()
})