import { toWords } from "number-to-words";

export function extractAndConvertNumbers(text: string): string {
    // Use a regex pattern to find numbers
    const pattern = /\b\d+\b/g;
    const matches = text.match(pattern);

    if (matches) {
        matches.forEach(number => {
            const wordRepresentation: string = toWords(parseInt(number));
            text = text.replace(number, wordRepresentation);
        });
    }

    return text;
}
