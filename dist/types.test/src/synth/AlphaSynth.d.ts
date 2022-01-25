import { MidiFile } from '@src/midi/MidiFile';
import { IAlphaSynth } from '@src/synth/IAlphaSynth';
import { ISynthOutput } from '@src/synth/ISynthOutput';
import { PlaybackRange } from '@src/synth/PlaybackRange';
import { PlayerState } from '@src/synth/PlayerState';
import { PlayerStateChangedEventArgs } from '@src/synth/PlayerStateChangedEventArgs';
import { PositionChangedEventArgs } from '@src/synth/PositionChangedEventArgs';
import { IEventEmitter, IEventEmitterOfT } from '@src/EventEmitter';
import { LogLevel } from '@src/LogLevel';
import { MidiEventsPlayedEventArgs } from './MidiEventsPlayedEventArgs';
import { MidiEventType } from '@src/midi/MidiEvent';
/**
 * This is the main synthesizer component which can be used to
 * play a {@link MidiFile} via a {@link ISynthOutput}.
 */
export declare class AlphaSynth implements IAlphaSynth {
    private _sequencer;
    private _synthesizer;
    private _isSoundFontLoaded;
    private _isMidiLoaded;
    private _tickPosition;
    private _timePosition;
    private _metronomeVolume;
    private _countInVolume;
    private _playedEventsQueue;
    private _midiEventsPlayedFilter;
    /**
     * Gets the {@link ISynthOutput} used for playing the generated samples.
     */
    readonly output: ISynthOutput;
    isReady: boolean;
    get isReadyForPlayback(): boolean;
    state: PlayerState;
    get logLevel(): LogLevel;
    set logLevel(value: LogLevel);
    get masterVolume(): number;
    set masterVolume(value: number);
    get metronomeVolume(): number;
    set metronomeVolume(value: number);
    get countInVolume(): number;
    set countInVolume(value: number);
    get midiEventsPlayedFilter(): MidiEventType[];
    set midiEventsPlayedFilter(value: MidiEventType[]);
    get playbackSpeed(): number;
    set playbackSpeed(value: number);
    get tickPosition(): number;
    set tickPosition(value: number);
    get timePosition(): number;
    set timePosition(value: number);
    get playbackRange(): PlaybackRange | null;
    set playbackRange(value: PlaybackRange | null);
    get isLooping(): boolean;
    set isLooping(value: boolean);
    destroy(): void;
    /**
     * Initializes a new instance of the {@link AlphaSynth} class.
     * @param output The output to use for playing the generated samples.
     */
    constructor(output: ISynthOutput);
    play(): boolean;
    private playInternal;
    pause(): void;
    playPause(): void;
    stop(): void;
    playOneTimeMidiFile(midi: MidiFile): void;
    resetSoundFonts(): void;
    loadSoundFont(data: Uint8Array, append: boolean): void;
    private checkReadyForPlayback;
    /**
     * Loads the given midi file for playback.
     * @param midi The midi file to load
     */
    loadMidiFile(midi: MidiFile): void;
    setChannelMute(channel: number, mute: boolean): void;
    resetChannelStates(): void;
    setChannelSolo(channel: number, solo: boolean): void;
    setChannelVolume(channel: number, volume: number): void;
    private onSamplesPlayed;
    private checkForFinish;
    private updateTimePosition;
    readonly ready: IEventEmitter;
    readonly readyForPlayback: IEventEmitter;
    readonly finished: IEventEmitter;
    readonly soundFontLoaded: IEventEmitter;
    readonly soundFontLoadFailed: IEventEmitterOfT<Error>;
    readonly midiLoaded: IEventEmitterOfT<PositionChangedEventArgs>;
    readonly midiLoadFailed: IEventEmitterOfT<Error>;
    readonly stateChanged: IEventEmitterOfT<PlayerStateChangedEventArgs>;
    readonly positionChanged: IEventEmitterOfT<PositionChangedEventArgs>;
    readonly midiEventsPlayed: IEventEmitterOfT<MidiEventsPlayedEventArgs>;
}
