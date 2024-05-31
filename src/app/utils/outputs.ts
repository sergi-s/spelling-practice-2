export interface Output {
    log(msg: string): void | Promise<void>;
    complete(obj: string | undefined): void | Promise<void>;
    error(err: Error): void | Promise<void>;
    close(): void | Promise<void>;
}

export class StreamOutput implements Output {
    private writer: WritableStreamDefaultWriter<Uint8Array>;
    private encoder: TextEncoder;
    private closed: boolean;

    constructor(writer: WritableStreamDefaultWriter<Uint8Array>, encoder: TextEncoder) {
        this.writer = writer;
        this.encoder = encoder;
        this.closed = false;
    }

    async log(msg: string): Promise<void> {
        await this.writer.write(this.encoder.encode(`data: ${msg}\n\n`));
    }

    async complete(obj: string | undefined): Promise<void> {
        await this.writer.write(this.encoder.encode(`data: ${JSON.stringify(obj)}\n\n`));
        await this.close();
    }

    async error(err: Error): Promise<void> {
        await this.writer.write(this.encoder.encode(`data: ${JSON.stringify(err)}\n\n`));
        await this.close();
    }

    async close(): Promise<void> {
        if (!this.closed) {
            try {
                await this.writer.close();
            } catch (error) {
                console.log("Failed to close")
            }
            this.closed = true;
        }
    }
}

export class ConsoleOutput implements Output {
    log(msg: string): void {
        console.log(`data: ${msg}\n\n`);
    }

    complete(obj: string | undefined): void {
        console.log(`data: ${JSON.stringify(obj)}\n\n`);
        this.close();
    }

    error(err: Error): void {
        console.error(`data: ${JSON.stringify(err)}\n\n`);
        this.close();
    }

    close(): void {
        // No action needed for console
    }
}
