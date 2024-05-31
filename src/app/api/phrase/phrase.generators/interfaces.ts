export interface Notify {
    log: (message: string) => void;
    complete: (data: string | undefined) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
    error: (error: Error | any) => void;
    close: () => void;
}

export interface SentenceContentBased {
    content: string;
}

export interface SentenceGenerationStrategy {
    generateSentence(messages: SentenceContentBased[]): Promise<string | undefined>;
}

