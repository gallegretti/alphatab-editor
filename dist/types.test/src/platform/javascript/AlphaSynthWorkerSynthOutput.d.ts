import { ISynthOutput } from '@src/synth/ISynthOutput';
import { IEventEmitter, IEventEmitterOfT } from '@src/EventEmitter';
/**
 * @target web
 */
export declare class AlphaSynthWorkerSynthOutput implements ISynthOutput {
    static readonly CmdOutputPrefix: string;
    static readonly CmdOutputAddSamples: string;
    static readonly CmdOutputPlay: string;
    static readonly CmdOutputPause: string;
    static readonly CmdOutputResetSamples: string;
    static readonly CmdOutputSampleRequest: string;
    static readonly CmdOutputSamplesPlayed: string;
    static preferredSampleRate: number;
    private _worker;
    get sampleRate(): number;
    open(): void;
    destroy(): void;
    private handleMessage;
    readonly ready: IEventEmitter;
    readonly samplesPlayed: IEventEmitterOfT<number>;
    readonly sampleRequest: IEventEmitter;
    addSamples(samples: Float32Array): void;
    play(): void;
    pause(): void;
    resetSamples(): void;
    activate(): void;
}
