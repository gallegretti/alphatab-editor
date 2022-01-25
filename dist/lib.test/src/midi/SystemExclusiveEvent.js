import { SystemCommonEvent } from '@src/midi/SystemCommonEvent';
import { ByteBuffer } from '@src/io/ByteBuffer';
import { IOHelper } from '@src/io/IOHelper';
export var AlphaTabSystemExclusiveEvents;
(function (AlphaTabSystemExclusiveEvents) {
    AlphaTabSystemExclusiveEvents[AlphaTabSystemExclusiveEvents["MetronomeTick"] = 0] = "MetronomeTick";
    AlphaTabSystemExclusiveEvents[AlphaTabSystemExclusiveEvents["Rest"] = 1] = "Rest";
})(AlphaTabSystemExclusiveEvents || (AlphaTabSystemExclusiveEvents = {}));
export class SystemExclusiveEvent extends SystemCommonEvent {
    constructor(track, delta, status, id, data) {
        super(track, delta, status, id & 0x00ff, (id >> 8) & 0xff);
        this.data = data;
    }
    get isMetronome() {
        return this.manufacturerId == SystemExclusiveEvent.AlphaTabManufacturerId &&
            this.data[0] == AlphaTabSystemExclusiveEvents.MetronomeTick;
    }
    get metronomeNumerator() {
        return this.isMetronome ? this.data[1] : -1;
    }
    get metronomeDurationInTicks() {
        if (!this.isMetronome) {
            return -1;
        }
        return IOHelper.decodeUInt32LE(this.data, 2);
    }
    get metronomeDurationInMilliseconds() {
        if (!this.isMetronome) {
            return -1;
        }
        return IOHelper.decodeUInt32LE(this.data, 6);
    }
    get isRest() {
        return this.manufacturerId == SystemExclusiveEvent.AlphaTabManufacturerId &&
            this.data[0] == AlphaTabSystemExclusiveEvents.Rest;
    }
    get manufacturerId() {
        return this.message >> 8;
    }
    writeTo(s) {
        s.writeByte(0xf0);
        let l = this.data.length + 2;
        s.writeByte(this.manufacturerId);
        let b = new Uint8Array([(l >> 24) & 0xff, (l >> 16) & 0xff, (l >> 8) & 0xff, l & 0xff]);
        s.write(b, 0, b.length);
        s.writeByte(0xf7);
    }
    static encodeMetronome(counter, durationInTicks, durationInMillis) {
        // [0] type
        // [1] counter
        // [2-5] durationInTicks
        // [6-9] durationInMillis
        const data = ByteBuffer.withCapacity(2 + 2 * 4);
        data.writeByte(AlphaTabSystemExclusiveEvents.MetronomeTick);
        data.writeByte(counter);
        IOHelper.writeInt32LE(data, durationInTicks);
        IOHelper.writeInt32LE(data, durationInMillis);
        return data.toArray();
    }
}
SystemExclusiveEvent.AlphaTabManufacturerId = 0x7D;
//# sourceMappingURL=SystemExclusiveEvent.js.map