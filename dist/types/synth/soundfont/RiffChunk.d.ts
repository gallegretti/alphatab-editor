import { IReadable } from '@src/io/IReadable';
export declare class RiffChunk {
    static readonly HeaderSize: number;
    id: string;
    size: number;
    static load(parent: RiffChunk | null, chunk: RiffChunk, stream: IReadable): boolean;
}
