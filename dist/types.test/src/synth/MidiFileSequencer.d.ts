import { MidiFile } from '@src/midi/MidiFile';
import { PlaybackRange } from '@src/synth/PlaybackRange';
import { SynthEvent } from '@src/synth/synthesis/SynthEvent';
import { TinySoundFont } from '@src/synth/synthesis/TinySoundFont';
export declare class MidiFileSequencerTempoChange {
    bpm: number;
    ticks: number;
    time: number;
    constructor(bpm: number, ticks: number, time: number);
}
declare class MidiSequencerState {
    tempoChanges: MidiFileSequencerTempoChange[];
    firstProgramEventPerChannel: Map<number, SynthEvent>;
    firstTimeSignatureNumerator: number;
    firstTimeSignatureDenominator: number;
    synthData: SynthEvent[];
    division: number;
    eventIndex: number;
    currentTime: number;
    playbackRange: PlaybackRange | null;
    playbackRangeStartTime: number;
    playbackRangeEndTime: number;
    endTick: number;
    endTime: number;
}
/**
 * This sequencer dispatches midi events to the synthesizer based on the current
 * synthesize position. The sequencer does not consider the playback speed.
 */
export declare class MidiFileSequencer {
    private _synthesizer;
    private _currentState;
    private _mainState;
    private _oneTimeState;
    private _countInState;
    get isPlayingOneTimeMidi(): boolean;
    get isPlayingCountIn(): boolean;
    constructor(synthesizer: TinySoundFont);
    get playbackRange(): PlaybackRange | null;
    set playbackRange(value: PlaybackRange | null);
    isLooping: boolean;
    get currentTime(): number;
    /**
     * Gets the duration of the song in ticks.
     */
    get endTick(): number;
    get endTime(): number;
    /**
     * Gets or sets the playback speed.
     */
    playbackSpeed: number;
    seek(timePosition: number): void;
    private silentProcess;
    loadOneTimeMidi(midiFile: MidiFile): void;
    loadMidi(midiFile: MidiFile): void;
    createStateFromFile(midiFile: MidiFile): MidiSequencerState;
    fillMidiEventQueue(): boolean;
    private fillMidiEventQueueLimited;
    tickPositionToTimePosition(tickPosition: number): number;
    timePositionToTickPosition(timePosition: number): number;
    private tickPositionToTimePositionWithSpeed;
    private timePositionToTickPositionWithSpeed;
    private get internalEndTime();
    get isFinished(): boolean;
    stop(): void;
    resetOneTimeMidi(): void;
    resetCountIn(): void;
    startCountIn(): void;
    generateCountInMidi(): void;
}
export {};
