import { MidiEvent } from '@src/midi/MidiEvent';
export var MetaEventType;
(function (MetaEventType) {
    MetaEventType[MetaEventType["SequenceNumber"] = 0] = "SequenceNumber";
    MetaEventType[MetaEventType["TextEvent"] = 1] = "TextEvent";
    MetaEventType[MetaEventType["CopyrightNotice"] = 2] = "CopyrightNotice";
    MetaEventType[MetaEventType["SequenceOrTrackName"] = 3] = "SequenceOrTrackName";
    MetaEventType[MetaEventType["InstrumentName"] = 4] = "InstrumentName";
    MetaEventType[MetaEventType["LyricText"] = 5] = "LyricText";
    MetaEventType[MetaEventType["MarkerText"] = 6] = "MarkerText";
    MetaEventType[MetaEventType["CuePoint"] = 7] = "CuePoint";
    MetaEventType[MetaEventType["PatchName"] = 8] = "PatchName";
    MetaEventType[MetaEventType["PortName"] = 9] = "PortName";
    MetaEventType[MetaEventType["MidiChannel"] = 32] = "MidiChannel";
    MetaEventType[MetaEventType["MidiPort"] = 33] = "MidiPort";
    MetaEventType[MetaEventType["EndOfTrack"] = 47] = "EndOfTrack";
    MetaEventType[MetaEventType["Tempo"] = 81] = "Tempo";
    MetaEventType[MetaEventType["SmpteOffset"] = 84] = "SmpteOffset";
    MetaEventType[MetaEventType["TimeSignature"] = 88] = "TimeSignature";
    MetaEventType[MetaEventType["KeySignature"] = 89] = "KeySignature";
    MetaEventType[MetaEventType["SequencerSpecific"] = 127] = "SequencerSpecific";
})(MetaEventType || (MetaEventType = {}));
export class MetaEvent extends MidiEvent {
    get channel() {
        return -1;
    }
    get command() {
        return (this.message & 0x00000ff);
    }
    get metaStatus() {
        return this.data1;
    }
    constructor(track, delta, status, data1, data2) {
        super(track, delta, status, data1, data2);
    }
}
//# sourceMappingURL=MetaEvent.js.map