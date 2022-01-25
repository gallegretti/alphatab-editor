export class FlatMidiEventGenerator {
    constructor() {
        this.midiEvents = [];
    }
    addTimeSignature(tick, timeSignatureNumerator, timeSignatureDenominator) {
        let e = new TimeSignatureEvent(tick, timeSignatureNumerator, timeSignatureDenominator);
        this.midiEvents.push(e);
    }
    addRest(track, tick, channel) {
        let e = new RestEvent(tick, track, channel);
        this.midiEvents.push(e);
    }
    addNote(track, start, length, key, dynamicValue, channel) {
        let e = new NoteEvent(start, track, channel, length, key, dynamicValue);
        this.midiEvents.push(e);
    }
    addControlChange(track, tick, channel, controller, value) {
        let e = new ControlChangeEvent(tick, track, channel, controller, value);
        this.midiEvents.push(e);
    }
    addProgramChange(track, tick, channel, program) {
        let e = new ProgramChangeEvent(tick, track, channel, program);
        this.midiEvents.push(e);
    }
    addTempo(tick, tempo) {
        let e = new TempoEvent(tick, tempo);
        this.midiEvents.push(e);
    }
    addBend(track, tick, channel, value) {
        let e = new BendEvent(tick, track, channel, value);
        this.midiEvents.push(e);
    }
    addNoteBend(track, tick, channel, key, value) {
        let e = new NoteBendEvent(tick, track, channel, key, value);
        this.midiEvents.push(e);
    }
    finishTrack(track, tick) {
        let e = new TrackEndEvent(tick, track);
        this.midiEvents.push(e);
    }
}
export class FlatMidiEvent {
    constructor(tick) {
        this.tick = 0;
        this.tick = tick;
    }
    toString() {
        return `Tick[${this.tick}]`;
    }
    equals_FlatMidiEventGenerator_MidiEvent(other) {
        return this.tick === other.tick;
    }
    equals(obj) {
        if (!obj) {
            return false;
        }
        if (obj === this) {
            return true;
        }
        if (obj instanceof FlatMidiEvent) {
            return this.tick === obj.tick;
        }
        return false;
    }
}
export class TempoEvent extends FlatMidiEvent {
    constructor(tick, tempo) {
        super(tick);
        this.tempo = 0;
        this.tempo = tempo;
    }
    toString() {
        return `Tempo: ${super.toString()} Tempo[${this.tempo}]`;
    }
    equals(obj) {
        if (!super.equals(obj)) {
            return false;
        }
        if (obj instanceof TempoEvent) {
            return this.tempo === obj.tempo;
        }
        return false;
    }
}
export class TimeSignatureEvent extends FlatMidiEvent {
    constructor(tick, numerator, denominator) {
        super(tick);
        this.numerator = 0;
        this.denominator = 0;
        this.numerator = numerator;
        this.denominator = denominator;
    }
    toString() {
        return `TimeSignature: ${super.toString()} Numerator[${this.numerator}] Denominator[${this.denominator}]`;
    }
    equals(obj) {
        if (!super.equals(obj)) {
            return false;
        }
        if (obj instanceof TimeSignatureEvent) {
            return this.numerator === obj.numerator && this.denominator === obj.denominator;
        }
        return false;
    }
}
export class TrackMidiEvent extends FlatMidiEvent {
    constructor(tick, track) {
        super(tick);
        this.track = 0;
        this.track = track;
    }
    toString() {
        return `${super.toString()} Track[${this.track}]`;
    }
    equals(obj) {
        if (!super.equals(obj)) {
            return false;
        }
        if (obj instanceof TrackMidiEvent) {
            return this.track === obj.track;
        }
        return false;
    }
}
export class TrackEndEvent extends TrackMidiEvent {
    constructor(tick, track) {
        super(tick, track);
    }
    toString() {
        return 'End of Track ' + super.toString();
    }
}
export class ChannelMidiEvent extends TrackMidiEvent {
    constructor(tick, track, channel) {
        super(tick, track);
        this.channel = 0;
        this.channel = channel;
    }
    toString() {
        return `${super.toString()} Channel[${this.channel}]`;
    }
    equals(obj) {
        if (!super.equals(obj)) {
            return false;
        }
        if (obj instanceof ChannelMidiEvent) {
            return this.channel === obj.channel;
        }
        return false;
    }
}
export class ControlChangeEvent extends ChannelMidiEvent {
    constructor(tick, track, channel, controller, value) {
        super(tick, track, channel);
        this.value = 0;
        this.controller = controller;
        this.value = value;
    }
    toString() {
        return `ControlChange: ${super.toString()} Controller[${this.controller}] Value[${this.value}]`;
    }
    equals(obj) {
        if (!super.equals(obj)) {
            return false;
        }
        if (obj instanceof ControlChangeEvent) {
            return this.controller === obj.controller && this.channel === obj.channel && this.value === obj.value;
        }
        return false;
    }
}
export class RestEvent extends ChannelMidiEvent {
    constructor(tick, track, channel) {
        super(tick, track, channel);
    }
    toString() {
        return `Rest: ${super.toString()}`;
    }
    equals(obj) {
        if (!super.equals(obj)) {
            return false;
        }
        if (obj instanceof TempoEvent) {
            return true;
        }
        return false;
    }
}
export class ProgramChangeEvent extends ChannelMidiEvent {
    constructor(tick, track, channel, program) {
        super(tick, track, channel);
        this.program = 0;
        this.program = program;
    }
    toString() {
        return `ProgramChange: ${super.toString()} Program[${this.program}]`;
    }
    equals(obj) {
        if (!super.equals(obj)) {
            return false;
        }
        if (obj instanceof ProgramChangeEvent) {
            return this.program === obj.program;
        }
        return false;
    }
}
export class NoteEvent extends ChannelMidiEvent {
    constructor(tick, track, channel, length, key, dynamicValue) {
        super(tick, track, channel);
        this.length = 0;
        this.key = 0;
        this.length = length;
        this.key = key;
        this.dynamicValue = dynamicValue;
    }
    toString() {
        return `Note: ${super.toString()} Length[${this.length}] Key[${this.key}] Dynamic[${this.dynamicValue}]`;
    }
    equals(obj) {
        if (!super.equals(obj)) {
            return false;
        }
        if (obj instanceof NoteEvent) {
            return this.length === obj.length && this.key === obj.key && this.dynamicValue === obj.dynamicValue;
        }
        return false;
    }
}
export class BendEvent extends ChannelMidiEvent {
    constructor(tick, track, channel, value) {
        super(tick, track, channel);
        this.value = 0;
        this.value = value;
    }
    toString() {
        return `Bend: ${super.toString()} Value[${this.value}]`;
    }
    equals(obj) {
        if (!super.equals(obj)) {
            return false;
        }
        if (obj instanceof BendEvent) {
            return this.value === obj.value;
        }
        return false;
    }
}
export class NoteBendEvent extends ChannelMidiEvent {
    constructor(tick, track, channel, key, value) {
        super(tick, track, channel);
        this.key = key;
        this.value = value;
    }
    toString() {
        return `NoteBend: ${super.toString()} Key[${this.key}] Value[${this.value}]`;
    }
    equals(obj) {
        if (!super.equals(obj)) {
            return false;
        }
        if (obj instanceof NoteBendEvent) {
            return this.value === obj.value && this.key === obj.key;
        }
        return false;
    }
}
//# sourceMappingURL=FlatMidiEventGenerator.js.map