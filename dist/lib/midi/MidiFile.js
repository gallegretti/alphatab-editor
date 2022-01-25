import { MidiUtils } from '@src/midi/MidiUtils';
import { ByteBuffer } from '@src/io/ByteBuffer';
/**
 * Represents a midi file with a single track that can be played via {@link AlphaSynth}
 */
export class MidiFile {
    constructor() {
        /**
         * Gets or sets the division per quarter notes.
         */
        this.division = MidiUtils.QuarterTime;
        /**
         * Gets a list of midi events sorted by time.
         */
        this.events = [];
    }
    /**
     * Adds the given midi event a the correct time position into the file.
     */
    addEvent(e) {
        if (this.events.length === 0) {
            this.events.push(e);
        }
        else {
            let insertPos = this.events.length;
            while (insertPos > 0) {
                const prevItem = this.events[insertPos - 1];
                if (prevItem.tick > e.tick) {
                    insertPos--;
                }
                else {
                    break;
                }
            }
            this.events.splice(insertPos, 0, e);
        }
    }
    /**
     * Writes the midi file into a binary format.
     * @returns The binary midi file.
     */
    toBinary() {
        let data = ByteBuffer.empty();
        this.writeTo(data);
        return data.toArray();
    }
    /**
     * Writes the midi file as binary into the given stream.
     * @returns The stream to write to.
     */
    writeTo(s) {
        // magic number "MThd" (0x4D546864)
        let b = new Uint8Array([0x4d, 0x54, 0x68, 0x64]);
        s.write(b, 0, b.length);
        // Header Length 6 (0x00000006)
        b = new Uint8Array([0x00, 0x00, 0x00, 0x06]);
        s.write(b, 0, b.length);
        // format
        b = new Uint8Array([0x00, 0x00]);
        s.write(b, 0, b.length);
        // number of tracks
        let v = 1;
        b = new Uint8Array([(v >> 8) & 0xff, v & 0xff]);
        s.write(b, 0, b.length);
        v = this.division;
        b = new Uint8Array([(v >> 8) & 0xff, v & 0xff]);
        s.write(b, 0, b.length);
        // build track data first
        let trackData = ByteBuffer.empty();
        let previousTick = 0;
        for (let midiEvent of this.events) {
            let delta = midiEvent.tick - previousTick;
            MidiFile.writeVariableInt(trackData, delta);
            midiEvent.writeTo(trackData);
            previousTick = midiEvent.tick;
        }
        // end of track
        // magic number "MTrk" (0x4D54726B)
        b = new Uint8Array([0x4d, 0x54, 0x72, 0x6b]);
        s.write(b, 0, b.length);
        // size as integer
        let data = trackData.toArray();
        let l = data.length;
        b = new Uint8Array([(l >> 24) & 0xff, (l >> 16) & 0xff, (l >> 8) & 0xff, l & 0xff]);
        s.write(b, 0, b.length);
        s.write(data, 0, data.length);
    }
    static writeVariableInt(s, value) {
        let array = new Uint8Array(4);
        let n = 0;
        do {
            array[n++] = value & 0x7f;
            value >>= 7;
        } while (value > 0);
        while (n > 0) {
            n--;
            if (n > 0) {
                s.writeByte(array[n] | 0x80);
            }
            else {
                s.writeByte(array[n]);
            }
        }
    }
}
//# sourceMappingURL=MidiFile.js.map