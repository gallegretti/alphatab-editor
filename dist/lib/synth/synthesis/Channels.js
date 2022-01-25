// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
export class Channels {
    constructor() {
        this.activeChannel = 0;
        this.channelList = [];
    }
    setupVoice(tinySoundFont, voice) {
        const c = this.channelList[this.activeChannel];
        const newpan = voice.region.pan + c.panOffset;
        voice.playingChannel = this.activeChannel;
        voice.mixVolume = c.mixVolume;
        voice.noteGainDb += c.gainDb;
        voice.updatePitchRatio(c, tinySoundFont.outSampleRate);
        if (newpan <= -0.5) {
            voice.panFactorLeft = 1.0;
            voice.panFactorRight = 0.0;
        }
        else if (newpan >= 0.5) {
            voice.panFactorLeft = 0.0;
            voice.panFactorRight = 1.0;
        }
        else {
            voice.panFactorLeft = Math.sqrt(0.5 - newpan);
            voice.panFactorRight = Math.sqrt(0.5 + newpan);
        }
    }
}
//# sourceMappingURL=Channels.js.map