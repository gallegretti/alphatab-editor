import { MidiEvent } from '@src/midi/MidiEvent';
export var SystemCommonType;
(function (SystemCommonType) {
    SystemCommonType[SystemCommonType["SystemExclusive"] = 240] = "SystemExclusive";
    SystemCommonType[SystemCommonType["MtcQuarterFrame"] = 241] = "MtcQuarterFrame";
    SystemCommonType[SystemCommonType["SongPosition"] = 242] = "SongPosition";
    SystemCommonType[SystemCommonType["SongSelect"] = 243] = "SongSelect";
    SystemCommonType[SystemCommonType["TuneRequest"] = 246] = "TuneRequest";
    SystemCommonType[SystemCommonType["SystemExclusive2"] = 247] = "SystemExclusive2";
})(SystemCommonType || (SystemCommonType = {}));
export class SystemCommonEvent extends MidiEvent {
    get channel() {
        return -1;
    }
    get command() {
        return (this.message & 0x00000ff);
    }
    constructor(track, delta, status, data1, data2) {
        super(track, delta, status, data1, data2);
    }
}
//# sourceMappingURL=SystemCommonEvent.js.map