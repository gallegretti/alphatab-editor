import { Score } from "@src/model/Score";
export declare class ScoreSerializer {
    static fromJson(obj: Score, m: unknown): void;
    static toJson(obj: Score | null): Map<string, unknown> | null;
    static setProperty(obj: Score, property: string, v: unknown): boolean;
}
