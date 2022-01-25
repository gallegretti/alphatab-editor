import { PlaybackInformation } from "@src/model/PlaybackInformation";
export declare class PlaybackInformationSerializer {
    static fromJson(obj: PlaybackInformation, m: unknown): void;
    static toJson(obj: PlaybackInformation | null): Map<string, unknown> | null;
    static setProperty(obj: PlaybackInformation, property: string, v: unknown): boolean;
}
