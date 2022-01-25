import { IAlphaSynth } from '@src/synth/IAlphaSynth';
import { PlayerState } from '@src/synth/PlayerState';
import { Score } from '@src/model/Score';
import { Track } from '@src/model/Track';
import { AlphaTabApi } from '@src/platform/javascript/AlphaTabApi';
import { IScoreRenderer } from '@src/rendering/IScoreRenderer';
import { Settings } from '@src/Settings';
import { MidiEventType } from '@src/midi/MidiEvent';
/**
 * @target web
 */
export declare class jQuery extends Array<HTMLElement> {
    constructor(v?: any);
    readonly context: HTMLElement;
    readonly length: number;
    data(key: string): unknown;
    data(key: string, value: any): void;
    removeData(key: string): void;
    each(action: (i: number, x: HTMLElement) => void): void;
    empty(): jQuery;
}
/**
 * @target web
 */
export declare class JQueryAlphaTab {
    exec(element: HTMLElement, method: string, args: any[]): unknown;
    init(element: jQuery, context: AlphaTabApi, options: any): void;
    destroy(element: jQuery, context: AlphaTabApi): void;
    print(element: jQuery, context: AlphaTabApi, width: string, additionalSettings?: unknown): void;
    load(element: jQuery, context: AlphaTabApi, data: unknown, tracks?: number[]): boolean;
    render(element: jQuery, context: AlphaTabApi): void;
    renderScore(element: jQuery, context: AlphaTabApi, score: Score, tracks?: number[]): void;
    renderTracks(element: jQuery, context: AlphaTabApi, tracks: Track[]): void;
    invalidate(element: jQuery, context: AlphaTabApi): void;
    tex(element: jQuery, context: AlphaTabApi, tex: string, tracks: number[]): void;
    muteTrack(element: jQuery, context: AlphaTabApi, tracks: Track[], mute: boolean): void;
    soloTrack(element: jQuery, context: AlphaTabApi, tracks: Track[], solo: boolean): void;
    trackVolume(element: jQuery, context: AlphaTabApi, tracks: Track[], volume: number): void;
    loadSoundFont(element: jQuery, context: AlphaTabApi, value: unknown, append: boolean): void;
    resetSoundFonts(element: jQuery, context: AlphaTabApi): void;
    pause(element: jQuery, context: AlphaTabApi): void;
    play(element: jQuery, context: AlphaTabApi): boolean;
    playPause(element: jQuery, context: AlphaTabApi): void;
    stop(element: jQuery, context: AlphaTabApi): void;
    api(element: jQuery, context: AlphaTabApi): AlphaTabApi;
    player(element: jQuery, context: AlphaTabApi): IAlphaSynth | null;
    isReadyForPlayback(element: jQuery, context: AlphaTabApi): boolean;
    playerState(element: jQuery, context: AlphaTabApi): PlayerState;
    masterVolume(element: jQuery, context: AlphaTabApi, masterVolume?: number): number;
    metronomeVolume(element: jQuery, context: AlphaTabApi, metronomeVolume?: number): number;
    countInVolume(element: jQuery, context: AlphaTabApi, countInVolume?: number): number;
    midiEventsPlayedFilter(element: jQuery, context: AlphaTabApi, midiEventsPlayedFilter?: MidiEventType[]): MidiEventType[];
    playbackSpeed(element: jQuery, context: AlphaTabApi, playbackSpeed?: number): number;
    tickPosition(element: jQuery, context: AlphaTabApi, tickPosition?: number): number;
    timePosition(element: jQuery, context: AlphaTabApi, timePosition?: number): number;
    loop(element: jQuery, context: AlphaTabApi, loop?: boolean): boolean;
    renderer(element: jQuery, context: AlphaTabApi): IScoreRenderer;
    score(element: jQuery, context: AlphaTabApi): Score | null;
    settings(element: jQuery, context: AlphaTabApi): Settings;
    tracks(element: jQuery, context: AlphaTabApi): Track[];
    private _initListeners;
    _oninit(listener: (jq: jQuery, api: AlphaTabApi, params: any[]) => void): void;
    static restore(selector: string): void;
}
