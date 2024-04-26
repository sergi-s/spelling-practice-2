import { z } from 'zod';

export const schema = z.object({
    language: z.union([
        z.literal('en'),
        z.literal('fr'),
    ]).default('en'),
    phrase: z.string()
});
