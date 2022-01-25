import { MidiEvent } from '@src/midi/MidiEvent';
import { IWriteable } from '@src/io/IWriteable';
/**
 * Represents a midi file with a single track that can be played via {@link AlphaSynth}
 */
export declare class MidiFile {
    /**
     * Gets or sets the division per quarter notes.
     */
    division: number;
    /**
     * Gets a list of midi events sorted by time.
     */
    readonly events: MidiEvent[];
    /**
     * Adds the given midi event a the correct time position into the file.
     */
    addEvent(e: MidiEvent): void;
    /**
     * Writes the midi file into a binary format.
     * @returns The binary midi file.
     */
    toBinary(): Uint8Array;
    /**
     * Writes the midi file as binary into the given stream.
     * @returns The stream to write to.
     */
    writeTo(s: IWriteable): void;
    static writeVariableInt(s: IWriteable, value: number): void;
}
