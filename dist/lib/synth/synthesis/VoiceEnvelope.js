// The SoundFont loading and Audio Synthesis is based on TinySoundFont, licensed under MIT,
// developed by Bernhard Schelling (https://github.com/schellingb/TinySoundFont)
// TypeScript port for alphaTab: (C) 2020 by Daniel Kuschny
// Licensed under: MPL-2.0
import { Envelope } from '@src/synth/synthesis/Envelope';
import { SynthHelper } from '@src/synth/SynthHelper';
export var VoiceEnvelopeSegment;
(function (VoiceEnvelopeSegment) {
    VoiceEnvelopeSegment[VoiceEnvelopeSegment["None"] = 0] = "None";
    VoiceEnvelopeSegment[VoiceEnvelopeSegment["Delay"] = 1] = "Delay";
    VoiceEnvelopeSegment[VoiceEnvelopeSegment["Attack"] = 2] = "Attack";
    VoiceEnvelopeSegment[VoiceEnvelopeSegment["Hold"] = 3] = "Hold";
    VoiceEnvelopeSegment[VoiceEnvelopeSegment["Decay"] = 4] = "Decay";
    VoiceEnvelopeSegment[VoiceEnvelopeSegment["Sustain"] = 5] = "Sustain";
    VoiceEnvelopeSegment[VoiceEnvelopeSegment["Release"] = 6] = "Release";
    VoiceEnvelopeSegment[VoiceEnvelopeSegment["Done"] = 7] = "Done";
})(VoiceEnvelopeSegment || (VoiceEnvelopeSegment = {}));
export class VoiceEnvelope {
    constructor() {
        this.level = 0;
        this.slope = 0;
        this.samplesUntilNextSegment = 0;
        this.segment = VoiceEnvelopeSegment.None;
        this.midiVelocity = 0;
        this.parameters = null;
        this.segmentIsExponential = false;
        this.isAmpEnv = false;
    }
    nextSegment(activeSegment, outSampleRate) {
        if (!this.parameters) {
            return;
        }
        while (true) {
            switch (activeSegment) {
                case VoiceEnvelopeSegment.None:
                    this.samplesUntilNextSegment = (this.parameters.delay * outSampleRate) | 0;
                    if (this.samplesUntilNextSegment > 0) {
                        this.segment = VoiceEnvelopeSegment.Delay;
                        this.segmentIsExponential = false;
                        this.level = 0.0;
                        this.slope = 0.0;
                        return;
                    }
                    activeSegment = VoiceEnvelopeSegment.Delay;
                    break;
                case VoiceEnvelopeSegment.Delay:
                    this.samplesUntilNextSegment = (this.parameters.attack * outSampleRate) | 0;
                    if (this.samplesUntilNextSegment > 0) {
                        if (!this.isAmpEnv) {
                            // mod env attack duration scales with velocity (velocity of 1 is full duration, max velocity is 0.125 times duration)
                            this.samplesUntilNextSegment =
                                (this.parameters.attack * ((145 - this.midiVelocity) / 144.0) * outSampleRate) | 0;
                        }
                        this.segment = VoiceEnvelopeSegment.Attack;
                        this.segmentIsExponential = false;
                        this.level = 0.0;
                        this.slope = 1.0 / this.samplesUntilNextSegment;
                        return;
                    }
                    activeSegment = VoiceEnvelopeSegment.Attack;
                    break;
                case VoiceEnvelopeSegment.Attack:
                    this.samplesUntilNextSegment = (this.parameters.hold * outSampleRate) | 0;
                    if (this.samplesUntilNextSegment > 0) {
                        this.segment = VoiceEnvelopeSegment.Hold;
                        this.segmentIsExponential = false;
                        this.level = 1.0;
                        this.slope = 0.0;
                        return;
                    }
                    activeSegment = VoiceEnvelopeSegment.Hold;
                    break;
                case VoiceEnvelopeSegment.Hold:
                    this.samplesUntilNextSegment = (this.parameters.decay * outSampleRate) | 0;
                    if (this.samplesUntilNextSegment > 0) {
                        this.segment = VoiceEnvelopeSegment.Decay;
                        this.level = 1.0;
                        if (this.isAmpEnv) {
                            // I don't truly understand this; just following what LinuxSampler does.
                            let mysterySlope = -9.226 / this.samplesUntilNextSegment;
                            this.slope = Math.exp(mysterySlope);
                            this.segmentIsExponential = true;
                            if (this.parameters.sustain > 0.0) {
                                // Again, this is following LinuxSampler's example, which is similar to
                                // SF2-style decay, where "decay" specifies the time it would take to
                                // get to zero, not to the sustain level.  The SFZ spec is not that
                                // specific about what "decay" means, so perhaps it's really supposed
                                // to specify the time to reach the sustain level.
                                this.samplesUntilNextSegment = (Math.log(this.parameters.sustain) / mysterySlope) | 0;
                            }
                        }
                        else {
                            this.slope = -1.0 / this.samplesUntilNextSegment;
                            this.samplesUntilNextSegment =
                                (this.parameters.decay * (1.0 - this.parameters.sustain) * outSampleRate) | 0;
                            this.segmentIsExponential = false;
                        }
                        return;
                    }
                    activeSegment = VoiceEnvelopeSegment.Decay;
                    break;
                case VoiceEnvelopeSegment.Decay:
                    this.segment = VoiceEnvelopeSegment.Sustain;
                    this.level = this.parameters.sustain;
                    this.slope = 0.0;
                    this.samplesUntilNextSegment = 0x7fffffff;
                    this.segmentIsExponential = false;
                    return;
                case VoiceEnvelopeSegment.Sustain:
                    this.segment = VoiceEnvelopeSegment.Release;
                    this.samplesUntilNextSegment =
                        ((this.parameters.release <= 0 ? VoiceEnvelope.FastReleaseTime : this.parameters.release) *
                            outSampleRate) | 0;
                    if (this.isAmpEnv) {
                        // I don't truly understand this; just following what LinuxSampler does.
                        let mysterySlope = -9.226 / this.samplesUntilNextSegment;
                        this.slope = Math.exp(mysterySlope);
                        this.segmentIsExponential = true;
                    }
                    else {
                        this.slope = -this.level / this.samplesUntilNextSegment;
                        this.segmentIsExponential = false;
                    }
                    return;
                // case VoiceEnvelopeSegment.Release:
                default:
                    this.segment = VoiceEnvelopeSegment.Done;
                    this.segmentIsExponential = false;
                    this.level = 0.0;
                    this.slope = 0.0;
                    this.samplesUntilNextSegment = 0x7ffffff;
                    return;
            }
        }
    }
    setup(newParameters, midiNoteNumber, midiVelocity, isAmpEnv, outSampleRate) {
        this.parameters = new Envelope(newParameters);
        if (this.parameters.keynumToHold > 0) {
            this.parameters.hold += this.parameters.keynumToHold * (60.0 - midiNoteNumber);
            this.parameters.hold =
                this.parameters.hold < -10000.0 ? 0.0 : SynthHelper.timecents2Secs(this.parameters.hold);
        }
        if (this.parameters.keynumToDecay > 0) {
            this.parameters.decay += this.parameters.keynumToDecay * (60.0 - midiNoteNumber);
            this.parameters.decay =
                this.parameters.decay < -10000.0 ? 0.0 : SynthHelper.timecents2Secs(this.parameters.decay);
        }
        this.midiVelocity = midiVelocity | 0;
        this.isAmpEnv = isAmpEnv;
        this.nextSegment(VoiceEnvelopeSegment.None, outSampleRate);
    }
    process(numSamples, outSampleRate) {
        if (this.slope > 0) {
            if (this.segmentIsExponential) {
                this.level *= Math.pow(this.slope, numSamples);
            }
            else {
                this.level += this.slope * numSamples;
            }
        }
        this.samplesUntilNextSegment -= numSamples;
        if (this.samplesUntilNextSegment <= 0) {
            this.nextSegment(this.segment, outSampleRate);
        }
    }
}
VoiceEnvelope.FastReleaseTime = 0.01;
//# sourceMappingURL=VoiceEnvelope.js.map