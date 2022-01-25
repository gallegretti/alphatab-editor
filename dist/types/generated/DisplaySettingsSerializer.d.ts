import { DisplaySettings } from "@src/DisplaySettings";
export declare class DisplaySettingsSerializer {
    static fromJson(obj: DisplaySettings, m: unknown): void;
    static toJson(obj: DisplaySettings | null): Map<string, unknown> | null;
    static setProperty(obj: DisplaySettings, property: string, v: unknown): boolean;
}
