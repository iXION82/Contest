declare module 'pdf-parse' {
    interface Result {
        numpages: number;
        numrender: number;
        info: any;
        metadata: any;
        text: string;
        version: string;
    }
    function pdf(buffer: Buffer, options?: any): Promise<Result>;
    export = pdf;
}
