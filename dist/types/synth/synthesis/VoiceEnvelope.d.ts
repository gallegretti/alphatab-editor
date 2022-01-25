import { Envelope } from '@src/synth/synthesis/Envelope';
export declare enum VoiceEnvelopeSegment {
    None = 0,
    Delay = 1,
    Attack = 2,
    Hold = 3,
    Decay = 4,
    Sustain = 5,
    Release = 6,
    Done = 7
}
export declare class VoiceEnvelope {
    private static readonly FastReleaseTime;
    level: number;
    slope: number;
    samplesUntilNextSegment: number;
    segment: VoiceEnvelopeSegment;
    midiVelocity: number;
    parameters: Envelope | null;
    segmentIsExponential: boolean;
    isAmpEnv: boolean;
    nextSegment(activeSegment: VoiceEnvelopeSegment, outSampleRate: number): void;
    setup(newParameters: Envelope, midiNoteNumber: number, midiVelocity: number, isAmpEnv: boolean, outSampleRate: number): void;
    process(numSamples: number, outSampleRate: number): void;
}
