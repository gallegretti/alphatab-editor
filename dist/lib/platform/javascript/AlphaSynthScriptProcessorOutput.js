import { CircularSampleBuffer } from '@src/synth/ds/CircularSampleBuffer';
import { AlphaSynthWebAudioOutputBase } from './AlphaSynthWebAudioOutputBase';
// tslint:disable: deprecation
/**
 * This class implements a HTML5 Web Audio API based audio output device
 * for alphaSynth using the legacy ScriptProcessor node.
 * @target web
 */
export class AlphaSynthScriptProcessorOutput extends AlphaSynthWebAudioOutputBase {
    constructor() {
        super(...arguments);
        this._audioNode = null;
        this._bufferCount = 0;
        this._requestedBufferCount = 0;
        this._outputBuffer = new Float32Array(0);
    }
    open() {
        super.open();
        this._bufferCount = Math.floor((AlphaSynthWebAudioOutputBase.TotalBufferTimeInMilliseconds * this.sampleRate) /
            1000 /
            AlphaSynthWebAudioOutputBase.BufferSize);
        this._circularBuffer = new CircularSampleBuffer(AlphaSynthWebAudioOutputBase.BufferSize * this._bufferCount);
        this.onReady();
    }
    play() {
        super.play();
        let ctx = this._context;
        // create a script processor node which will replace the silence with the generated audio
        this._audioNode = ctx.createScriptProcessor(4096, 0, 2);
        this._audioNode.onaudioprocess = this.generateSound.bind(this);
        this._circularBuffer.clear();
        this.requestBuffers();
        this._source = ctx.createBufferSource();
        this._source.buffer = this._buffer;
        this._source.loop = true;
        this._source.connect(this._audioNode, 0, 0);
        this._source.start(0);
        this._audioNode.connect(ctx.destination, 0, 0);
    }
    pause() {
        super.pause();
        if (this._audioNode) {
            this._audioNode.disconnect(0);
        }
        this._audioNode = null;
    }
    addSamples(f) {
        this._circularBuffer.write(f, 0, f.length);
        this._requestedBufferCount--;
    }
    resetSamples() {
        this._circularBuffer.clear();
    }
    requestBuffers() {
        // if we fall under the half of buffers
        // we request one half
        const halfBufferCount = (this._bufferCount / 2) | 0;
        let halfSamples = halfBufferCount * AlphaSynthWebAudioOutputBase.BufferSize;
        // Issue #631: it can happen that requestBuffers is called multiple times
        // before we already get samples via addSamples, therefore we need to
        // remember how many buffers have been requested, and consider them as available.
        let bufferedSamples = this._circularBuffer.count + this._requestedBufferCount * AlphaSynthWebAudioOutputBase.BufferSize;
        if (bufferedSamples < halfSamples) {
            for (let i = 0; i < halfBufferCount; i++) {
                this.onSampleRequest();
            }
            this._requestedBufferCount += halfBufferCount;
        }
    }
    generateSound(e) {
        let left = e.outputBuffer.getChannelData(0);
        let right = e.outputBuffer.getChannelData(1);
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
        this.onSamplesPlayed(left.length);
        this.requestBuffers();
    }
}
//# sourceMappingURL=AlphaSynthScriptProcessorOutput.js.map