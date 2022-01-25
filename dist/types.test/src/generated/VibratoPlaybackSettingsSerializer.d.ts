import { VibratoPlaybackSettings } from "@src/PlayerSettings";
export declare class VibratoPlaybackSettingsSerializer {
    static fromJson(obj: VibratoPlaybackSettings, m: unknown): void;
    static toJson(obj: VibratoPlaybackSettings | null): Map<string, unknown> | null;
    static setProperty(obj: VibratoPlaybackSettings, property: string, v: unknown): boolean;
}
