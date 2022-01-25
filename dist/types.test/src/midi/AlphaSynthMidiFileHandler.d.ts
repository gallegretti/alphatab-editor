import { IMidiFileHandler } from '@src/midi/IMidiFileHandler';
import { MidiFile } from '@src/midi/MidiFile';
import { DynamicValue } from '@src/model/DynamicValue';
/**
 * This implementation of the {@link IMidiFileHandler}
 * generates a {@link MidiFile} object which can be used in AlphaSynth for playback.
 */
export declare class AlphaSynthMidiFileHandler implements IMidiFileHandler {
    private _midiFile;
    /**
     * Initializes a new instance of the {@link AlphaSynthMidiFileHandler} class.
     * @param midiFile The midi file.
     */
    constructor(midiFile: MidiFile);
    addTimeSignature(tick: number, timeSignatureNumerator: number, timeSignatureDenominator: number): void;
    addRest(track: number, tick: number, channel: number): void;
    addNote(track: number, start: number, length: number, key: number, dynamicValue: DynamicValue, channel: number): void;
    private makeCommand;
    private static fixValue;
    addControlChange(track: number, tick: number, channel: number, controller: number, value: number): void;
    addProgramChange(track: number, tick: number, channel: number, program: number): void;
    addTempo(tick: number, tempo: number): void;
    addBend(track: number, tick: number, channel: number, value: number): void;
    addNoteBend(track: number, tick: number, channel: number, key: number, value: number): void;
    finishTrack(track: number, tick: number): void;
}
