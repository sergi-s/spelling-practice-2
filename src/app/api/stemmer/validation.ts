import { z } from 'zod';

export const schema = z.object({
    language: z.union([
        z.literal('en'),
        z.literal('fr'),
    ]).default('en'),
    phrase: z.string()
});


export enum Language {
    en = 'en',
    fr = 'fr',
}


export const difficultyMap: Record<number, string> = {
    1: 'very easy',
    2: 'moderately easy',
    3: 'medium',
    4: 'moderately hard',
    5: 'very hard'
}