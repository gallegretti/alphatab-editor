import { MetaEvent } from '@src/midi/MetaEvent';
import { MidiFile } from '@src/midi/MidiFile';
export class MetaDataEvent extends MetaEvent {
    constructor(track, delta, status, metaId, data) {
        super(track, delta, status, metaId, 0);
        this.data = data;
    }
    writeTo(s) {
        s.writeByte(0xff);
        s.writeByte(this.metaStatus);
        let l = this.data.length;
        MidiFile.writeVariableInt(s, l);
        s.write(this.data, 0, this.data.length);
    }
}
//# sourceMappingURL=MetaDataEvent.js.map