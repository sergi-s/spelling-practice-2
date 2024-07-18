declare module 'node-wordnet' {
  export class WordNetFile {
    dataDir: string;
    fileName: string;
    filePath: string;
    fd?: number;

    constructor(dataDir: string, fileName: string);

    open(callback: (err: NodeJS.ErrnoException | null, fd: number | null) => void): void;
    close(): void;
    appendLineChar(fd: number, pos: number, buffPos: number, buff: Buffer, callback: (err: NodeJS.ErrnoException | null, line: string | null) => void): void;
  }

  export class DataFile extends WordNetFile {
    constructor(dataDir: string, name: string);

    get(location: number, callback: (err: NodeJS.ErrnoException | null, data: unknown) => void): void;
  }

  export class IndexFile extends WordNetFile {
    constructor(dataDir: string, name: string);

    find(searchKey: string, callback: (err: NodeJS.ErrnoException | null, result: unknown) => void): void;
    lookupFromFile(word: string, callback: (err: NodeJS.ErrnoException | null, indexRecord: unknown) => void): void;
    lookup(word: string, callback: (err: NodeJS.ErrnoException | null, indexRecord: unknown) => void): void;
  }

  interface Options {
    dataDir?: string;
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    cache?: boolean | lru.Cache<unknown, unknown> | {
      max: number;
    };
  }

  interface Result {
    synsetOffset: number;
    lexFilenum: number;
    pos: string;
    wCnt: number;
    lemma: string;
    synonyms: string[];
    lexId: string;
    ptrs: unknown[];
    gloss: string;
    def: string;
    exp: string[];
  }

  export class WordNet {
    // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
    cache?: lru.Cache<unknown, unknown> | null;
    path: string;
    nounIndex: IndexFile;
    verbIndex: IndexFile;
    adjIndex: IndexFile;
    advIndex: IndexFile;
    nounData: DataFile;
    verbData: DataFile;
    adjData: DataFile;
    advData: DataFile;
    allFiles: Array<{ index: IndexFile, data: DataFile, pos: string }>;

    constructor(options?: Options | string);

    get(synsetOffset: number, pos: string, callback: (err: NodeJS.ErrnoException | null, result: Result) => void): void;
    getAsync(synsetOffset: number, pos: string): bluebird<unknown>;

    lookup(input: string, callback: (err: NodeJS.ErrnoException | null, results: Result[]) => void): void;
    lookupAsync(input: string): Promise<unknown[]>;

    findSense(input: string, callback: (err: NodeJS.ErrnoException | null, result: Result) => void): void;
    findSenseAsync(input: string): bluebird<unknown>;

    querySense(input: string, callback: (err: NodeJS.ErrnoException | null, senses: string[]) => void): void;
    querySenseAsync(input: string): bluebird<unknown>;

    lookupFromFiles(files: Array<{ index: IndexFile, data: DataFile, pos: string }>, results: Result[], word: string, callback: (err: NodeJS.ErrnoException | null, results: Result[]) => void): void;
    pushResults(data: DataFile, results: Result[], offsets: number[], callback: (results: Result[]) => void): void;
    loadResultSynonyms(synonyms: Result[], results: Result[], callback: (synonyms: Result[]) => void): void;
    loadSynonyms(synonyms: Result[], results: Result[], ptrs: unknown[], callback: (synonyms: Result[]) => void): void;
    lookupSynonyms(word: string, callback: (results: Result[]) => void): void;
    getSynonyms(synsetOffset: number | { synsetOffset: number, pos: string }, posOrCallback: string | ((results: Result[]) => void), callback?: (results: Result[]) => void): void;
  }
}
