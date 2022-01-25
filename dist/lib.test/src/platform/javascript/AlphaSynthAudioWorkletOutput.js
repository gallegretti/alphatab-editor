import { CircularSampleBuffer } from '@src/synth/ds/CircularSampleBuffer';
import { Environment } from '@src/Environment';
import { Logger } from '@src/Logger';
import { AlphaSynthWorkerSynthOutput } from './AlphaSynthWorkerSynthOutput';
import { AlphaSynthWebAudioOutputBase } from './AlphaSynthWebAudioOutputBase';
/**
 * This class implements a HTML5 Web Audio API based audio output device
 * for alphaSynth using the modern Audio Worklets.
 * @target web
 */
export class AlphaSynthWebWorklet {
    static init() {
        var _a;
        if (AlphaSynthWebWorklet._isRegistered) {
            return;
        }
        AlphaSynthWebWorklet._isRegistered = true;
        registerProcessor('alphatab', (_a = class AlphaSynthWebWorkletProcessor extends AudioWorkletProcessor {
                constructor(...args) {
                    super(...args);
                    this._outputBuffer = new Float32Array(0);
                    this._bufferCount = 0;
                    this._requestedBufferCount = 0;
                    Logger.info('WebAudio', 'creating processor');
                    this._bufferCount = Math.floor((AlphaSynthWebWorkletProcessor.TotalBufferTimeInMilliseconds *
                        sampleRate) /
                        1000 /
                        AlphaSynthWebWorkletProcessor.BufferSize);
                    this._circularBuffer = new CircularSampleBuffer(AlphaSynthWebWorkletProcessor.BufferSize * this._bufferCount);
                    this.port.onmessage = this.handleMessage.bind(this);
                }
                handleMessage(e) {
                    let data = e.data;
                    let cmd = data.cmd;
                    switch (cmd) {
                        case AlphaSynthWorkerSynthOutput.CmdOutputAddSamples:
                            const f = data.samples;
                            this._circularBuffer.write(f, 0, f.length);
                            this._requestedBufferCount--;
                            break;
                        case AlphaSynthWorkerSynthOutput.CmdOutputResetSamples:
                            this._circularBuffer.clear();
                            break;
                    }
                }
                process(_inputs, outputs, _parameters) {
                    if (outputs.length !== 1 && outputs[0].length !== 2) {
                        return false;
                    }
                    let left = outputs[0][0];
                    let right = outputs[0][1];
                    if (!left || !right) {
                        return true;
                    }
                    let samples = left.length + right.length;
                    let buffer = this._outputBuffer;
                    if (buffer.length !== samples) {
                        buffer = new Float32Array(samples);
                        this._outputBuffer = buffer;
                    }
                    this._circularBuffer.read(buffer, 0, Math.min(buffer.length, this._circularBuffer.count));
                    let s = 0;
                    for (let i = 0; i < left.length; i++) {
                        left[i] = buffer[s++];
                        right[i] = buffer[s++];
                    }
                    this.port.postMessage({
                        cmd: AlphaSynthWorkerSynthOutput.CmdOutputSamplesPlayed,
                        samples: left.length
                    });
                    this.requestBuffers();
                    return true;
                }
                requestBuffers() {
                    // if we fall under the half of buffers
                    // we request one half
                    const halfBufferCount = (this._bufferCount / 2) | 0;
                    let halfSamples = halfBufferCount * AlphaSynthWebWorkletProcessor.BufferSize;
                    // Issue #631: it can happen that requestBuffers is called multiple times
                    // before we already get samples via addSamples, therefore we need to
                    // remember how many buffers have been requested, and consider them as available.
                    let bufferedSamples = this._circularBuffer.count +
                        this._requestedBufferCount * AlphaSynthWebWorkletProcessor.BufferSize;
                    if (bufferedSamples < halfSamples) {
                        for (let i = 0; i < halfBufferCount; i++) {
                            this.port.postMessage({
                                cmd: AlphaSynthWorkerSynthOutput.CmdOutputSampleRequest
                            });
                        }
                        this._requestedBufferCount += halfBufferCount;
                    }
                }
            },
            _a.BufferSize = 4096,
            _a.TotalBufferTimeInMilliseconds = 5000,
            _a));
    }
}
AlphaSynthWebWorklet._isRegistered = false;
/**
 * This class implements a HTML5 Web Audio API based audio output device
 * for alphaSynth. It can be controlled via a JS API.
 * @target web
 */
export class AlphaSynthAudioWorkletOutput extends AlphaSynthWebAudioOutputBase {
    constructor() {
        super(...arguments);
        this._worklet = null;
    }
    open() {
        super.open();
        this.onReady();
    }
    play() {
        super.play();
        let ctx = this._context;
        // create a script processor node which will replace the silence with the generated audio
        ctx.audioWorklet.addModule(Environment.scriptFile).then(() => {
            this._worklet = new AudioWorkletNode(ctx, 'alphatab', {
                numberOfOutputs: 1,
                outputChannelCount: [2]
            });
            this._worklet.port.onmessage = this.handleMessage.bind(this);
            this._source.connect(this._worklet);
            this._source.start(0);
            this._worklet.connect(ctx.destination);
        }, reason => {
            Logger.error('WebAudio', `Audio Worklet creation failed: reason=${reason}`);
        });
    }
    handleMessage(e) {
        let data = e.data;
        let cmd = data.cmd;
        switch (cmd) {
            case AlphaSynthWorkerSynthOutput.CmdOutputSamplesPlayed:
                this.onSamplesPlayed(data.samples);
                break;
            case AlphaSynthWorkerSynthOutput.CmdOutputSampleRequest:
                this.onSampleRequest();
                break;
        }
    }
    pause() {
        super.pause();
        if (this._worklet) {
            this._worklet.port.onmessage = null;
            this._worklet.disconnect();
        }
        this._worklet = null;
    }
    addSamples(f) {
        var _a;
        (_a = this._worklet) === null || _a === void 0 ? void 0 : _a.port.postMessage({
            cmd: AlphaSynthWorkerSynthOutput.CmdOutputAddSamples,
            samples: f
        });
    }
    resetSamples() {
        var _a;
        (_a = this._worklet) === null || _a === void 0 ? void 0 : _a.port.postMessage({
            cmd: AlphaSynthWorkerSynthOutput.CmdOutputResetSamples
        });
    }
}
//# sourceMappingURL=AlphaSynthAudioWorkletOutput.js.map