// export function tokenize(text: string): string[] {
//     text = text.toLowerCase()
//     const pattern = /\b[\w'-]+\b/g;
//     const tokens = text.match(pattern) ?? [];

//     return tokens;
// }

// ?This is the official way to tokenize any string in the application, please use it to be uniform
export function tokenize(text: string): string[] {
    text = text.toLowerCase();
    // Updated pattern without apostrophes
    const pattern = /\b[\w-]+\b/g;
    const tokens = text.match(pattern) ?? [];

    return tokens;
}
