import { Score } from '@src/model/Score';
export declare class TrackConfiguration {
    showSlash: boolean;
    showStandardNotation: boolean;
    showTablature: boolean;
}
export declare class Part {
    isMultiRest: boolean;
    tracks: TrackConfiguration[];
}
export declare class PartConfiguration {
    parts: Part[];
    zoomLevel: number;
    layout: number;
    apply(score: Score): void;
    constructor(partConfigurationData: Uint8Array);
    static writeForScore(score: Score): Uint8Array;
}
