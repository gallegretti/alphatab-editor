import { Track } from "@src/model/Track";
export declare class TrackSerializer {
    static fromJson(obj: Track, m: unknown): void;
    static toJson(obj: Track | null): Map<string, unknown> | null;
    static setProperty(obj: Track, property: string, v: unknown): boolean;
}
