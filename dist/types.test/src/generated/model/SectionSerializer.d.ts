import { Section } from "@src/model/Section";
export declare class SectionSerializer {
    static fromJson(obj: Section, m: unknown): void;
    static toJson(obj: Section | null): Map<string, unknown> | null;
    static setProperty(obj: Section, property: string, v: unknown): boolean;
}
