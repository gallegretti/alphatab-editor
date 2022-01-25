// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
export class VoiceLowPass {
    constructor(other) {
        this.qInv = 0;
        this.a0 = 0;
        this.a1 = 0;
        this.b1 = 0;
        this.b2 = 0;
        this.z1 = 0;
        this.z2 = 0;
        this.active = false;
        if (other) {
            this.qInv = other.qInv;
            this.a0 = other.a0;
            this.a1 = other.a1;
            this.b1 = other.b1;
            this.b2 = other.b2;
            this.z1 = other.z1;
            this.z2 = other.z2;
            this.active = other.active;
        }
    }
    setup(fc) {
        // Lowpass filter from http://www.earlevel.com/main/2012/11/26/biquad-c-source-code/
        let k = Math.tan(Math.PI * fc);
        let KK = k * k;
        let norm = 1 / (1 + k * this.qInv + KK);
        this.a0 = KK * norm;
        this.a1 = 2 * this.a0;
        this.b1 = 2 * (KK - 1) * norm;
        this.b2 = (1 - k * this.qInv + KK) * norm;
    }
    process(input) {
        let output = input * this.a0 + this.z1;
        this.z1 = input * this.a1 + this.z2 - this.b1 * output;
        this.z2 = input * this.a0 - this.b2 * output;
        return output;
    }
}
//# sourceMappingURL=VoiceLowPass.js.map