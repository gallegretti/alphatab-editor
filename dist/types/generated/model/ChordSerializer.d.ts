import { Chord } from "@src/model/Chord";
export declare class ChordSerializer {
    static fromJson(obj: Chord, m: unknown): void;
    static toJson(obj: Chord | null): Map<string, unknown> | null;
    static setProperty(obj: Chord, property: string, v: unknown): boolean;
}
