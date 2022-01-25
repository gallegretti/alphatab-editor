import { MetaEvent } from '@src/midi/MetaEvent';
import { MidiFile } from '@src/midi/MidiFile';
export class MetaNumberEvent extends MetaEvent {
    constructor(track, delta, status, metaId, value) {
        super(track, delta, status, metaId, 0);
        this.value = value;
    }
    writeTo(s) {
        s.writeByte(0xff);
        s.writeByte(this.metaStatus);
        MidiFile.writeVariableInt(s, 3);
        let b = new Uint8Array([(this.value >> 16) & 0xff, (this.value >> 8) & 0xff, this.value & 0xff]);
        s.write(b, 0, b.length);
    }
}
//# sourceMappingURL=MetaNumberEvent.js.map