import { IWriteable } from '@src/io/IWriteable';
/**
 * Lists all midi events.
 */
export declare enum MidiEventType {
    /**
     * A per note pitch bend. (Midi 2.0)
     */
    PerNotePitchBend = 96,
    /**
     * A note is released.
     */
    NoteOff = 128,
    /**
     * A note is started.
     */
    NoteOn = 144,
    /**
     * The pressure that was used to play the note.
     */
    NoteAftertouch = 160,
    /**
     * Change of a midi controller
     */
    Controller = 176,
    /**
     * Change of a midi program
     */
    ProgramChange = 192,
    /**
     * The pressure that should be applied to the whole channel.
     */
    ChannelAftertouch = 208,
    /**
     * A change of the audio pitch.
     */
    PitchBend = 224,
    /**
     * A System Exclusive event.
     */
    SystemExclusive = 240,
    /**
     * A System Exclusive event.
     */
    SystemExclusive2 = 247,
    /**
     * A meta event. See `MetaEventType` for details.
     */
    Meta = 255
}
/**
 * Represents a midi event.
 */
export declare class MidiEvent {
    /**
     * Gets or sets the track to which the midi event belongs.
     */
    track: number;
    /**
     * Gets or sets the raw midi message.
     */
    message: number;
    /**
     * Gets or sets the absolute tick of this midi event.
     */
    tick: number;
    get channel(): number;
    get command(): MidiEventType;
    get data1(): number;
    set data1(value: number);
    get data2(): number;
    set data2(value: number);
    /**
     * Initializes a new instance of the {@link MidiEvent} class.
     * @param track The track this event belongs to.
     * @param tick The absolute midi ticks of this event.
     * @param status The status information of this event.
     * @param data1 The first data component of this midi event.
     * @param data2 The second data component of this midi event.
     */
    constructor(track: number, tick: number, status: number, data1: number, data2: number);
    /**
     * Writes the midi event as binary into the given stream.
     * @param s The stream to write to.
     */
    writeTo(s: IWriteable): void;
}
