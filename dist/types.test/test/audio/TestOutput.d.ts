import { ISynthOutput } from '@src/synth/ISynthOutput';
import { IEventEmitter, IEventEmitterOfT } from '@src/EventEmitter';
export declare class TestOutput implements ISynthOutput {
    samples: number[];
    get sampleRate(): number;
    open(): void;
    play(): void;
    destroy(): void;
    next(): void;
    pause(): void;
    addSamples(f: Float32Array): void;
    resetSamples(): void;
    activate(): void;
    /**
     * Fired when the output has been successfully opened and is ready to play samples.
     */
    readonly ready: IEventEmitter;
    /**
     * Fired when a certain number of samples have been played.
     */
    readonly samplesPlayed: IEventEmitterOfT<number>;
    /**
     * Fired when the output needs more samples to be played.
     */
    readonly sampleRequest: IEventEmitter;
}
