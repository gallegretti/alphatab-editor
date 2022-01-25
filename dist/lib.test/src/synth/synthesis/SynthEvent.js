// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
import { MidiEventType } from '@src/midi/MidiEvent';
import { SystemExclusiveEvent } from '@src/midi/SystemExclusiveEvent';
export class SynthEvent {
    constructor(eventIndex, e) {
        this.time = 0;
        this.eventIndex = eventIndex;
        this.event = e;
        this.isMetronome = this.event instanceof SystemExclusiveEvent && this.event.isMetronome;
    }
    static newMetronomeEvent(eventIndex, tick, counter, durationInTicks, durationInMillis) {
        const evt = new SystemExclusiveEvent(0, tick, MidiEventType.SystemExclusive2, SystemExclusiveEvent.AlphaTabManufacturerId, SystemExclusiveEvent.encodeMetronome(counter, durationInTicks, durationInMillis));
        const x = new SynthEvent(eventIndex, evt);
        return x;
    }
}
//# sourceMappingURL=SynthEvent.js.map