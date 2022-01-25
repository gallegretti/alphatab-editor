import { PlayerSettings } from "@src/PlayerSettings";
export declare class PlayerSettingsSerializer {
    static fromJson(obj: PlayerSettings, m: unknown): void;
    static toJson(obj: PlayerSettings | null): Map<string, unknown> | null;
    static setProperty(obj: PlayerSettings, property: string, v: unknown): boolean;
}
