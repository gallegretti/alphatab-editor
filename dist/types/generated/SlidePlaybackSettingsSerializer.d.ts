import { SlidePlaybackSettings } from "@src/PlayerSettings";
export declare class SlidePlaybackSettingsSerializer {
    static fromJson(obj: SlidePlaybackSettings, m: unknown): void;
    static toJson(obj: SlidePlaybackSettings | null): Map<string, unknown> | null;
    static setProperty(obj: SlidePlaybackSettings, property: string, v: unknown): boolean;
}
