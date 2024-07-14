

declare class IndexFile {
    constructor(path: string, type: string);
    lookup(word: string, callback: (err: Error | null, record?: unknown) => void): void;
}

declare class DataFile {
    constructor(path: string, type: string);
    get(synsetOffset: number, callback: (err: Error | null, record?: unknown) => void): void;
    close(): void;
}

declare class WordNet {
    constructor(options: string | { dataDir?: string, cache?: boolean | { max: number } });
    get(synsetOffset: number, pos: string, callback: (result: unknown) => void): void;
    getAsync(synsetOffset: number, pos: string): Promise<unknown>;
    lookup(input: string, callback: (results: unknown[]) => void): void;
    lookupAsync(input: string): Promise<unknown>;
    findSense(input: string, callback: (result: unknown) => void): void;
    findSenseAsync(input: string): Promise<unknown>;
    querySense(input: string, callback: (senses: string[]) => void): void;
    querySenseAsync(input: string): Promise<string[]>;
    lookupSynonyms(word: string, callback: (synonyms: unknown[]) => void): void;
    getSynonyms(pos: string | { pos: string, synsetOffset?: number }, callback: (synonyms: unknown[]) => void): void;
    getDataFile(pos: string): DataFile;
    validForms(string: string, callback: (forms: string[]) => void): void;
    validFormsAsync(string: string): Promise<string[]>;
    close(): void;
}

export declare module "node-wordnet" {
    export const path: string;
}
