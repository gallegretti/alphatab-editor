import { AlphaTabApiBase } from '@src/AlphaTabApiBase';
import { IEventEmitterOfT } from '@src/EventEmitter';
import { Track } from '@src/model/Track';
import { ProgressEventArgs } from '@src/ProgressEventArgs';
/**
 * @target web
 */
export declare class AlphaTabApi extends AlphaTabApiBase<unknown> {
    constructor(element: HTMLElement, options: unknown);
    tex(tex: string, tracks?: number[]): void;
    print(width: string, additionalSettings?: unknown): void;
    downloadMidi(): void;
    changeTrackMute(tracks: Track[], mute: boolean): void;
    changeTrackSolo(tracks: Track[], solo: boolean): void;
    changeTrackVolume(tracks: Track[], volume: number): void;
    private trackIndexesToTracks;
    soundFontLoad: IEventEmitterOfT<ProgressEventArgs>;
    loadSoundFontFromUrl(url: string, append: boolean): void;
}
