import { CoreSettings } from "@src/CoreSettings";
export declare class CoreSettingsSerializer {
    static fromJson(obj: CoreSettings, m: unknown): void;
    static toJson(obj: CoreSettings | null): Map<string, unknown> | null;
    static setProperty(obj: CoreSettings, property: string, v: unknown): boolean;
}
