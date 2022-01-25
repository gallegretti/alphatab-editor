/**
 * Lists all midi events.
 */
export var MidiEventType;
(function (MidiEventType) {
    /**
     * A per note pitch bend. (Midi 2.0)
     */
    MidiEventType[MidiEventType["PerNotePitchBend"] = 96] = "PerNotePitchBend";
    /**
     * A note is released.
     */
    MidiEventType[MidiEventType["NoteOff"] = 128] = "NoteOff";
    /**
     * A note is started.
     */
    MidiEventType[MidiEventType["NoteOn"] = 144] = "NoteOn";
    /**
     * The pressure that was used to play the note.
     */
    MidiEventType[MidiEventType["NoteAftertouch"] = 160] = "NoteAftertouch";
    /**
     * Change of a midi controller
     */
    MidiEventType[MidiEventType["Controller"] = 176] = "Controller";
    /**
     * Change of a midi program
     */
    MidiEventType[MidiEventType["ProgramChange"] = 192] = "ProgramChange";
    /**
     * The pressure that should be applied to the whole channel.
     */
    MidiEventType[MidiEventType["ChannelAftertouch"] = 208] = "ChannelAftertouch";
    /**
     * A change of the audio pitch.
     */
    MidiEventType[MidiEventType["PitchBend"] = 224] = "PitchBend";
    /**
     * A System Exclusive event.
     */
    MidiEventType[MidiEventType["SystemExclusive"] = 240] = "SystemExclusive";
    /**
     * A System Exclusive event.
     */
    MidiEventType[MidiEventType["SystemExclusive2"] = 247] = "SystemExclusive2";
    /**
     * A meta event. See `MetaEventType` for details.
     */
    MidiEventType[MidiEventType["Meta"] = 255] = "Meta";
})(MidiEventType || (MidiEventType = {}));
/**
 * Represents a midi event.
 */
export class MidiEvent {
    /**
     * Initializes a new instance of the {@link MidiEvent} class.
     * @param track The track this event belongs to.
     * @param tick The absolute midi ticks of this event.
     * @param status The status information of this event.
     * @param data1 The first data component of this midi event.
     * @param data2 The second data component of this midi event.
     */
    constructor(track, tick, status, data1, data2) {
        this.track = track;
        this.tick = tick;
        this.message = status | (data1 << 8) | (data2 << 16);
    }
    get channel() {
        return this.message & 0x000000f;
    }
    get command() {
        return (this.message & 0x00000f0);
    }
    get data1() {
        return (this.message & 0x000ff00) >> 8;
    }
    set data1(value) {
        this.message &= ~0x000ff00;
        this.message |= value << 8;
    }
    get data2() {
        return (this.message & 0x0ff0000) >> 16;
    }
    set data2(value) {
        this.message &= ~0x0ff0000;
        this.message |= value << 16;
    }
    /**
     * Writes the midi event as binary into the given stream.
     * @param s The stream to write to.
     */
    writeTo(s) {
        let b = new Uint8Array([
            (this.message >> 24) & 0xff,
            (this.message >> 16) & 0xff,
            (this.message >> 8) & 0xff,
            this.message & 0xff
        ]);
        s.write(b, 0, b.length);
    }
}
//# sourceMappingURL=MidiEvent.js.map