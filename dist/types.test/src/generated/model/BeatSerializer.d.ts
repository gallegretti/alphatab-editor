import { Beat } from "@src/model/Beat";
export declare class BeatSerializer {
    static fromJson(obj: Beat, m: unknown): void;
    static toJson(obj: Beat | null): Map<string, unknown> | null;
    static setProperty(obj: Beat, property: string, v: unknown): boolean;
}
