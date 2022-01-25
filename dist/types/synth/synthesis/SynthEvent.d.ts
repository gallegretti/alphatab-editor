import { MidiEvent } from '@src/midi/MidiEvent';
export declare class SynthEvent {
    eventIndex: number;
    event: MidiEvent;
    readonly isMetronome: boolean;
    time: number;
    constructor(eventIndex: number, e: MidiEvent);
    static newMetronomeEvent(eventIndex: number, tick: number, counter: number, durationInTicks: number, durationInMillis: number): SynthEvent;
}
