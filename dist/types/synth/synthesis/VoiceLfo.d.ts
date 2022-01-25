export declare class VoiceLfo {
    samplesUntil: number;
    level: number;
    delta: number;
    setup(delay: number, freqCents: number, outSampleRate: number): void;
    process(blockSamples: number): void;
}
