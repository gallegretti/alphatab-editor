import { Voice } from "@src/model/Voice";
export declare class VoiceSerializer {
    static fromJson(obj: Voice, m: unknown): void;
    static toJson(obj: Voice | null): Map<string, unknown> | null;
    static setProperty(obj: Voice, property: string, v: unknown): boolean;
}
