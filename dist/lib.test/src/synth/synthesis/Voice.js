// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
import { LoopMode } from '@src/synth/synthesis/LoopMode';
import { OutputMode } from '@src/synth/synthesis/OutputMode';
import { VoiceEnvelope, VoiceEnvelopeSegment } from '@src/synth/synthesis/VoiceEnvelope';
import { VoiceLfo } from '@src/synth/synthesis/VoiceLfo';
import { VoiceLowPass } from '@src/synth/synthesis/VoiceLowPass';
import { SynthHelper } from '@src/synth/SynthHelper';
import { SynthConstants } from '../SynthConstants';
export class Voice {
    constructor() {
        this.playingPreset = 0;
        this.playingKey = 0;
        this.playingChannel = 0;
        this.region = null;
        this.pitchInputTimecents = 0;
        this.pitchOutputFactor = 0;
        this.sourceSamplePosition = 0;
        this.noteGainDb = 0;
        this.panFactorLeft = 0;
        this.panFactorRight = 0;
        this.playIndex = 0;
        this.loopStart = 0;
        this.loopEnd = 0;
        this.ampEnv = new VoiceEnvelope();
        this.modEnv = new VoiceEnvelope();
        this.lowPass = new VoiceLowPass();
        this.modLfo = new VoiceLfo();
        this.vibLfo = new VoiceLfo();
        this.mixVolume = 0;
        this.mute = false;
    }
    updatePitchRatio(c, outSampleRate) {
        let pitchWheel = c.pitchWheel;
        // add additional note pitch
        if (c.perNotePitchWheel.has(this.playingKey)) {
            pitchWheel += (c.perNotePitchWheel.get(this.playingKey) - 8192);
        }
        const pitchShift = pitchWheel === 8192
            ? c.tuning
            : (pitchWheel / 16383.0 * c.pitchRange * 2) - c.pitchRange + c.tuning;
        this.calcPitchRatio(pitchShift, outSampleRate);
    }
    calcPitchRatio(pitchShift, outSampleRate) {
        if (!this.region) {
            return;
        }
        const note = this.playingKey + this.region.transpose + this.region.tune / 100.0;
        let adjustedPitch = this.region.pitchKeyCenter + (note - this.region.pitchKeyCenter) * (this.region.pitchKeyTrack / 100.0);
        if (pitchShift !== 0)
            adjustedPitch += pitchShift;
        this.pitchInputTimecents = adjustedPitch * 100.0;
        this.pitchOutputFactor =
            this.region.sampleRate / (SynthHelper.timecents2Secs(this.region.pitchKeyCenter * 100.0) * outSampleRate);
    }
    end(outSampleRate) {
        if (!this.region) {
            return;
        }
        this.ampEnv.nextSegment(VoiceEnvelopeSegment.Sustain, outSampleRate);
        this.modEnv.nextSegment(VoiceEnvelopeSegment.Sustain, outSampleRate);
        if (this.region.loopMode === LoopMode.Sustain) {
            // Continue playing, but stop looping.
            this.loopEnd = this.loopStart;
        }
    }
    endQuick(outSampleRate) {
        this.ampEnv.parameters.release = 0.0;
        this.ampEnv.nextSegment(VoiceEnvelopeSegment.Sustain, outSampleRate);
        this.modEnv.parameters.release = 0.0;
        this.modEnv.nextSegment(VoiceEnvelopeSegment.Sustain, outSampleRate);
    }
    render(f, outputBuffer, offset, numSamples, isMuted) {
        if (!this.region) {
            return;
        }
        let region = this.region;
        const preset = f.presets[this.playingPreset];
        let input = preset.fontSamples;
        let outL = 0;
        let outR = f.outputMode === OutputMode.StereoUnweaved ? numSamples : -1;
        // Cache some values, to give them at least some chance of ending up in registers.
        let updateModEnv = region.modEnvToPitch !== 0 || region.modEnvToFilterFc !== 0;
        let updateModLFO = this.modLfo.delta > 0 &&
            (region.modLfoToPitch !== 0 || region.modLfoToFilterFc !== 0 || region.modLfoToVolume !== 0);
        let updateVibLFO = this.vibLfo.delta > 0 && region.vibLfoToPitch !== 0;
        let isLooping = this.loopStart < this.loopEnd;
        let tmpLoopStart = this.loopStart;
        let tmpLoopEnd = this.loopEnd;
        let tmpSampleEndDbl = region.end;
        let tmpLoopEndDbl = tmpLoopEnd + 1.0;
        let tmpSourceSamplePosition = this.sourceSamplePosition;
        let tmpLowpass = new VoiceLowPass(this.lowPass);
        let dynamicLowpass = region.modLfoToFilterFc !== 0 || region.modEnvToFilterFc !== 0;
        let tmpSampleRate = 0;
        let tmpInitialFilterFc = 0;
        let tmpModLfoToFilterFc = 0;
        let tmpModEnvToFilterFc = 0;
        let dynamicPitchRatio = region.modLfoToPitch !== 0 || region.modEnvToPitch !== 0 || region.vibLfoToPitch !== 0;
        let pitchRatio = 0;
        let tmpModLfoToPitch = 0;
        let tmpVibLfoToPitch = 0;
        let tmpModEnvToPitch = 0;
        let dynamicGain = region.modLfoToVolume !== 0;
        let noteGain = 0;
        let tmpModLfoToVolume = 0;
        if (dynamicLowpass) {
            tmpSampleRate = f.outSampleRate;
            tmpInitialFilterFc = region.initialFilterFc;
            tmpModLfoToFilterFc = region.modLfoToFilterFc;
            tmpModEnvToFilterFc = region.modEnvToFilterFc;
        }
        else {
            tmpSampleRate = 0;
            tmpInitialFilterFc = 0;
            tmpModLfoToFilterFc = 0;
            tmpModEnvToFilterFc = 0;
        }
        if (dynamicPitchRatio) {
            pitchRatio = 0;
            tmpModLfoToPitch = region.modLfoToPitch;
            tmpVibLfoToPitch = region.vibLfoToPitch;
            tmpModEnvToPitch = region.modEnvToPitch;
        }
        else {
            pitchRatio = SynthHelper.timecents2Secs(this.pitchInputTimecents) * this.pitchOutputFactor;
            tmpModLfoToPitch = 0;
            tmpVibLfoToPitch = 0;
            tmpModEnvToPitch = 0;
        }
        if (dynamicGain) {
            tmpModLfoToVolume = region.modLfoToVolume * 0.1;
        }
        else {
            noteGain = SynthHelper.decibelsToGain(this.noteGainDb);
            tmpModLfoToVolume = 0;
        }
        while (numSamples > 0) {
            let gainMono;
            let gainLeft;
            let gainRight = 0;
            let blockSamples = numSamples > Voice.RenderEffectSampleBlock ? Voice.RenderEffectSampleBlock : numSamples;
            numSamples -= blockSamples;
            if (dynamicLowpass) {
                let fres = tmpInitialFilterFc +
                    this.modLfo.level * tmpModLfoToFilterFc +
                    this.modEnv.level * tmpModEnvToFilterFc;
                tmpLowpass.active = fres <= 13500.0;
                if (tmpLowpass.active) {
                    tmpLowpass.setup(SynthHelper.cents2Hertz(fres) / tmpSampleRate);
                }
            }
            if (dynamicPitchRatio) {
                pitchRatio =
                    SynthHelper.timecents2Secs(this.pitchInputTimecents +
                        (this.modLfo.level * tmpModLfoToPitch +
                            this.vibLfo.level * tmpVibLfoToPitch +
                            this.modEnv.level * tmpModEnvToPitch)) * this.pitchOutputFactor;
            }
            if (dynamicGain) {
                noteGain = SynthHelper.decibelsToGain(this.noteGainDb + this.modLfo.level * tmpModLfoToVolume);
            }
            gainMono = noteGain * this.ampEnv.level;
            if (isMuted) {
                gainMono = 0;
            }
            else {
                gainMono *= this.mixVolume;
            }
            // Update EG.
            this.ampEnv.process(blockSamples, f.outSampleRate);
            if (updateModEnv) {
                this.modEnv.process(blockSamples, f.outSampleRate);
            }
            // Update LFOs.
            if (updateModLFO) {
                this.modLfo.process(blockSamples);
            }
            if (updateVibLFO) {
                this.vibLfo.process(blockSamples);
            }
            switch (f.outputMode) {
                case OutputMode.StereoInterleaved:
                    gainLeft = gainMono * this.panFactorLeft;
                    gainRight = gainMono * this.panFactorRight;
                    while (blockSamples-- > 0 && tmpSourceSamplePosition < tmpSampleEndDbl) {
                        let pos = tmpSourceSamplePosition | 0;
                        let nextPos = pos >= tmpLoopEnd && isLooping ? tmpLoopStart : pos + 1;
                        // Simple linear interpolation.
                        // TODO: check for interpolation mode on voice
                        let alpha = tmpSourceSamplePosition - pos;
                        let value = input[pos] * (1.0 - alpha) + input[nextPos] * alpha;
                        // Low-pass filter.
                        if (tmpLowpass.active)
                            value = tmpLowpass.process(value);
                        outputBuffer[offset + outL] += value * gainLeft;
                        outL++;
                        outputBuffer[offset + outL] += value * gainRight;
                        outL++;
                        // Next sample.
                        tmpSourceSamplePosition += pitchRatio;
                        if (tmpSourceSamplePosition >= tmpLoopEndDbl && isLooping) {
                            tmpSourceSamplePosition -= tmpLoopEnd - tmpLoopStart + 1.0;
                        }
                    }
                    break;
                case OutputMode.StereoUnweaved:
                    gainLeft = gainMono * this.panFactorLeft;
                    gainRight = gainMono * this.panFactorRight;
                    while (blockSamples-- > 0 && tmpSourceSamplePosition < tmpSampleEndDbl) {
                        let pos = tmpSourceSamplePosition | 0;
                        let nextPos = pos >= tmpLoopEnd && isLooping ? tmpLoopStart : pos + 1;
                        // Simple linear interpolation.
                        let alpha = tmpSourceSamplePosition - pos;
                        let value = input[pos] * (1.0 - alpha) + input[nextPos] * alpha;
                        // Low-pass filter.
                        if (tmpLowpass.active)
                            value = tmpLowpass.process(value);
                        outputBuffer[offset + outL] += value * gainLeft;
                        outL++;
                        outputBuffer[offset + outR] += value * gainRight;
                        outR++;
                        // Next sample.
                        tmpSourceSamplePosition += pitchRatio;
                        if (tmpSourceSamplePosition >= tmpLoopEndDbl && isLooping) {
                            tmpSourceSamplePosition -= tmpLoopEnd - tmpLoopStart + 1.0;
                        }
                    }
                    break;
                case OutputMode.Mono:
                    while (blockSamples-- > 0 && tmpSourceSamplePosition < tmpSampleEndDbl) {
                        let pos = tmpSourceSamplePosition | 0;
                        let nextPos = pos >= tmpLoopEnd && isLooping ? tmpLoopStart : pos + 1;
                        // Simple linear interpolation.
                        let alpha = tmpSourceSamplePosition - pos;
                        let value = input[pos] * (1.0 - alpha) + input[nextPos] * alpha;
                        // Low-pass filter.
                        if (tmpLowpass.active)
                            value = tmpLowpass.process(value);
                        outputBuffer[offset + outL] = value * gainMono;
                        outL++;
                        // Next sample.
                        tmpSourceSamplePosition += pitchRatio;
                        if (tmpSourceSamplePosition >= tmpLoopEndDbl && isLooping) {
                            tmpSourceSamplePosition -= tmpLoopEnd - tmpLoopStart + 1.0;
                        }
                    }
                    break;
            }
            if (tmpSourceSamplePosition >= tmpSampleEndDbl || this.ampEnv.segment === VoiceEnvelopeSegment.Done) {
                this.kill();
                return;
            }
        }
        this.sourceSamplePosition = tmpSourceSamplePosition;
        if (tmpLowpass.active || dynamicLowpass) {
            this.lowPass = tmpLowpass;
        }
    }
    kill() {
        this.playingPreset = -1;
    }
}
/**
 * The lower this block size is the more accurate the effects are.
 * Increasing the value significantly lowers the CPU usage of the voice rendering.
 * If LFO affects the low-pass filter it can be hearable even as low as 8.
 */
Voice.RenderEffectSampleBlock = SynthConstants.MicroBufferSize;
//# sourceMappingURL=Voice.js.map