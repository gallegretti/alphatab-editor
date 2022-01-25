import { MidiEvent, MidiEventType } from '@src/midi/MidiEvent';
export declare enum SystemCommonType {
    SystemExclusive = 240,
    MtcQuarterFrame = 241,
    SongPosition = 242,
    SongSelect = 243,
    TuneRequest = 246,
    SystemExclusive2 = 247
}
export declare class SystemCommonEvent extends MidiEvent {
    get channel(): number;
    get command(): MidiEventType;
    protected constructor(track: number, delta: number, status: number, data1: number, data2: number);
}
