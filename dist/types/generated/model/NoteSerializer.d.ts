import { Note } from "@src/model/Note";
export declare class NoteSerializer {
    static fromJson(obj: Note, m: unknown): void;
    static toJson(obj: Note | null): Map<string, unknown> | null;
    static setProperty(obj: Note, property: string, v: unknown): boolean;
}
