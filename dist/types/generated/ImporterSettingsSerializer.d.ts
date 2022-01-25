import { ImporterSettings } from "@src/ImporterSettings";
export declare class ImporterSettingsSerializer {
    static fromJson(obj: ImporterSettings, m: unknown): void;
    static toJson(obj: ImporterSettings | null): Map<string, unknown> | null;
    static setProperty(obj: ImporterSettings, property: string, v: unknown): boolean;
}
