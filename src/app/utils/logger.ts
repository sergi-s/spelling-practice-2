import { type Output } from "./outputs";

export class Logger {
    private output: Output;

    constructor(output: Output) {
        this.output = output;
    }

    log(msg: string): void {
        void this.output.log(msg);
    }

    complete(obj: string | undefined): void {
        void this.output.complete(obj);
    }

    error(err: Error): void {
        void this.output.error(err);
    }

    close(): void {
        void this.output.close();
    }
}
