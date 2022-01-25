// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
import { SynthHelper } from '@src/synth/SynthHelper';
export class VoiceLfo {
    constructor() {
        this.samplesUntil = 0;
        this.level = 0;
        this.delta = 0;
    }
    setup(delay, freqCents, outSampleRate) {
        this.samplesUntil = (delay * outSampleRate) | 0;
        this.delta = (4.0 * SynthHelper.cents2Hertz(freqCents)) / outSampleRate;
        this.level = 0;
    }
    process(blockSamples) {
        if (this.samplesUntil > blockSamples) {
            this.samplesUntil -= blockSamples;
            return;
        }
        this.level += this.delta * blockSamples;
        if (this.level > 1.0) {
            this.delta = -this.delta;
            this.level = 2.0 - this.level;
        }
        else if (this.level < -1.0) {
            this.delta = -this.delta;
            this.level = -2.0 - this.level;
        }
    }
}
//# sourceMappingURL=VoiceLfo.js.map