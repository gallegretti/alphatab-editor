import { AlphaSynthWebAudioOutputBase } from './AlphaSynthWebAudioOutputBase';
/**
 * This class implements a HTML5 Web Audio API based audio output device
 * for alphaSynth using the modern Audio Worklets.
 * @target web
 */
export declare class AlphaSynthWebWorklet {
    private static _isRegistered;
    static init(): void;
}
/**
 * This class implements a HTML5 Web Audio API based audio output device
 * for alphaSynth. It can be controlled via a JS API.
 * @target web
 */
export declare class AlphaSynthAudioWorkletOutput extends AlphaSynthWebAudioOutputBase {
    private _worklet;
    open(): void;
    play(): void;
    private handleMessage;
    pause(): void;
    addSamples(f: Float32Array): void;
    resetSamples(): void;
}
