import { MidiEvent } from "@src/midi/MidiEvent";
/**
 * Represents the info when the synthesizer played certain midi events.
 */
export declare class MidiEventsPlayedEventArgs {
    /**
     * Gets the events which were played.
     */
    readonly events: MidiEvent[];
    /**
     * Initializes a new instance of the {@link MidiEventsPlayedEventArgs} class.
     * @param events The events which were played.
     */
    constructor(events: MidiEvent[]);
}
