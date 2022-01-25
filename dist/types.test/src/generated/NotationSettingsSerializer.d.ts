import { NotationSettings } from "@src/NotationSettings";
export declare class NotationSettingsSerializer {
    static fromJson(obj: NotationSettings, m: unknown): void;
    static toJson(obj: NotationSettings | null): Map<string, unknown> | null;
    static setProperty(obj: NotationSettings, property: string, v: unknown): boolean;
}
