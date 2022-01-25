import { ControllerType } from '@src/midi/ControllerType';
import { IMidiFileHandler } from '@src/midi/IMidiFileHandler';
import { DynamicValue } from '@src/model/DynamicValue';
export declare class FlatMidiEventGenerator implements IMidiFileHandler {
    midiEvents: FlatMidiEvent[];
    constructor();
    addTimeSignature(tick: number, timeSignatureNumerator: number, timeSignatureDenominator: number): void;
    addRest(track: number, tick: number, channel: number): void;
    addNote(track: number, start: number, length: number, key: number, dynamicValue: DynamicValue, channel: number): void;
    addControlChange(track: number, tick: number, channel: number, controller: number, value: number): void;
    addProgramChange(track: number, tick: number, channel: number, program: number): void;
    addTempo(tick: number, tempo: number): void;
    addBend(track: number, tick: number, channel: number, value: number): void;
    addNoteBend(track: number, tick: number, channel: number, key: number, value: number): void;
    finishTrack(track: number, tick: number): void;
}
export declare class FlatMidiEvent {
    tick: number;
    constructor(tick: number);
    toString(): string;
    protected equals_FlatMidiEventGenerator_MidiEvent(other: FlatMidiEvent): boolean;
    equals(obj: unknown): boolean;
}
export declare class TempoEvent extends FlatMidiEvent {
    tempo: number;
    constructor(tick: number, tempo: number);
    toString(): string;
    equals(obj: unknown): boolean;
}
export declare class TimeSignatureEvent extends FlatMidiEvent {
    numerator: number;
    denominator: number;
    constructor(tick: number, numerator: number, denominator: number);
    toString(): string;
    equals(obj: unknown): boolean;
}
export declare class TrackMidiEvent extends FlatMidiEvent {
    track: number;
    constructor(tick: number, track: number);
    toString(): string;
    equals(obj: unknown): boolean;
}
export declare class TrackEndEvent extends TrackMidiEvent {
    constructor(tick: number, track: number);
    toString(): string;
}
export declare class ChannelMidiEvent extends TrackMidiEvent {
    channel: number;
    constructor(tick: number, track: number, channel: number);
    toString(): string;
    equals(obj: unknown): boolean;
}
export declare class ControlChangeEvent extends ChannelMidiEvent {
    controller: ControllerType;
    value: number;
    constructor(tick: number, track: number, channel: number, controller: ControllerType, value: number);
    toString(): string;
    equals(obj: unknown): boolean;
}
export declare class RestEvent extends ChannelMidiEvent {
    constructor(tick: number, track: number, channel: number);
    toString(): string;
    equals(obj: unknown): boolean;
}
export declare class ProgramChangeEvent extends ChannelMidiEvent {
    program: number;
    constructor(tick: number, track: number, channel: number, program: number);
    toString(): string;
    equals(obj: unknown): boolean;
}
export declare class NoteEvent extends ChannelMidiEvent {
    length: number;
    key: number;
    dynamicValue: DynamicValue;
    constructor(tick: number, track: number, channel: number, length: number, key: number, dynamicValue: DynamicValue);
    toString(): string;
    equals(obj: unknown): boolean;
}
export declare class BendEvent extends ChannelMidiEvent {
    value: number;
    constructor(tick: number, track: number, channel: number, value: number);
    toString(): string;
    equals(obj: unknown): boolean;
}
export declare class NoteBendEvent extends ChannelMidiEvent {
    key: number;
    value: number;
    constructor(tick: number, track: number, channel: number, key: number, value: number);
    toString(): string;
    equals(obj: unknown): boolean;
}
