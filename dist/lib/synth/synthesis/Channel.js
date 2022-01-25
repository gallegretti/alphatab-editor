// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
export class Channel {
    constructor() {
        this.presetIndex = 0;
        this.bank = 0;
        this.pitchWheel = 0;
        this.perNotePitchWheel = new Map();
        this.midiPan = 0;
        this.midiVolume = 0;
        this.midiExpression = 0;
        this.midiRpn = 0;
        this.midiData = 0;
        this.panOffset = 0;
        this.gainDb = 0;
        this.pitchRange = 0;
        this.tuning = 0;
        this.mixVolume = 0;
        this.mute = false;
        this.solo = false;
    }
}
//# sourceMappingURL=Channel.js.map