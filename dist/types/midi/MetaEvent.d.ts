import { MidiEvent, MidiEventType } from '@src/midi/MidiEvent';
export declare enum MetaEventType {
    SequenceNumber = 0,
    TextEvent = 1,
    CopyrightNotice = 2,
    SequenceOrTrackName = 3,
    InstrumentName = 4,
    LyricText = 5,
    MarkerText = 6,
    CuePoint = 7,
    PatchName = 8,
    PortName = 9,
    MidiChannel = 32,
    MidiPort = 33,
    EndOfTrack = 47,
    Tempo = 81,
    SmpteOffset = 84,
    TimeSignature = 88,
    KeySignature = 89,
    SequencerSpecific = 127
}
export declare class MetaEvent extends MidiEvent {
    get channel(): number;
    get command(): MidiEventType;
    get metaStatus(): MetaEventType;
    protected constructor(track: number, delta: number, status: number, data1: number, data2: number);
}
