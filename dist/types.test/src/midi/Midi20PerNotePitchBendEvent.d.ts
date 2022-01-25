import { IWriteable } from '@src/io/IWriteable';
import { MidiEvent } from '@src/midi/MidiEvent';
export declare class Midi20PerNotePitchBendEvent extends MidiEvent {
    noteKey: number;
    pitch: number;
    constructor(track: number, tick: number, status: number, noteKey: number, pitch: number);
    /**
     * Writes the midi event as binary into the given stream.
     * @param s The stream to write to.
     */
    writeTo(s: IWriteable): void;
}
