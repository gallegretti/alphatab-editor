import { PlayerState } from '@src/synth/PlayerState';
import { PlayerStateChangedEventArgs } from '@src/synth/PlayerStateChangedEventArgs';
import { PositionChangedEventArgs } from '@src/synth/PositionChangedEventArgs';
import { SynthHelper } from '@src/synth/SynthHelper';
import { EventEmitter, EventEmitterOfT } from '@src/EventEmitter';
import { JsonConverter } from '@src/model/JsonConverter';
import { Logger } from '@src/Logger';
import { SynthConstants } from '@src/synth/SynthConstants';
import { ProgressEventArgs } from '@src/ProgressEventArgs';
import { FileLoadError } from '@src/FileLoadError';
import { MidiEventsPlayedEventArgs } from '@src/synth/MidiEventsPlayedEventArgs';
import { Environment } from '@src/Environment';
/**
 * a WebWorker based alphaSynth which uses the given player as output.
 * @target web
 */
export class AlphaSynthWebWorkerApi {
    constructor(player, alphaSynthScriptFile, logLevel) {
        this._workerIsReadyForPlayback = false;
        this._workerIsReady = false;
        this._outputIsReady = false;
        this._state = PlayerState.Paused;
        this._masterVolume = 0;
        this._metronomeVolume = 0;
        this._countInVolume = 0;
        this._playbackSpeed = 0;
        this._tickPosition = 0;
        this._timePosition = 0;
        this._isLooping = false;
        this._playbackRange = null;
        this._midiEventsPlayedFilter = [];
        this.ready = new EventEmitter();
        this.readyForPlayback = new EventEmitter();
        this.finished = new EventEmitter();
        this.soundFontLoaded = new EventEmitter();
        this.soundFontLoadFailed = new EventEmitterOfT();
        this.midiLoaded = new EventEmitterOfT();
        this.midiLoadFailed = new EventEmitterOfT();
        this.stateChanged = new EventEmitterOfT();
        this.positionChanged = new EventEmitterOfT();
        this.midiEventsPlayed = new EventEmitterOfT();
        this._workerIsReadyForPlayback = false;
        this._workerIsReady = false;
        this._outputIsReady = false;
        this._state = PlayerState.Paused;
        this._masterVolume = 0.0;
        this._metronomeVolume = 0.0;
        this._playbackSpeed = 0.0;
        this._tickPosition = 0;
        this._timePosition = 0.0;
        this._isLooping = false;
        this._playbackRange = null;
        this._output = player;
        this._output.ready.on(this.onOutputReady.bind(this));
        this._output.samplesPlayed.on(this.onOutputSamplesPlayed.bind(this));
        this._output.sampleRequest.on(this.onOutputSampleRequest.bind(this));
        this._output.open();
        try {
            this._synth = Environment.createAlphaTabWorker(alphaSynthScriptFile);
        }
        catch (e) {
            // fallback to direct worker
            try {
                this._synth = new Worker(alphaSynthScriptFile);
            }
            catch (e2) {
                Logger.error('AlphaSynth', 'Failed to create WebWorker: ' + e2);
                return;
            }
        }
        this._synth.addEventListener('message', this.handleWorkerMessage.bind(this), false);
        this._synth.postMessage({
            cmd: 'alphaSynth.initialize',
            sampleRate: this._output.sampleRate,
            logLevel: logLevel
        });
        this.masterVolume = 1;
        this.playbackSpeed = 1;
        this.metronomeVolume = 0;
    }
    get isReady() {
        return this._workerIsReady && this._outputIsReady;
    }
    get isReadyForPlayback() {
        return this._workerIsReadyForPlayback;
    }
    get state() {
        return this._state;
    }
    get logLevel() {
        return Logger.logLevel;
    }
    set logLevel(value) {
        Logger.logLevel = value;
        this._synth.postMessage({
            cmd: 'alphaSynth.setLogLevel',
            value: value
        });
    }
    get masterVolume() {
        return this._masterVolume;
    }
    set masterVolume(value) {
        value = Math.max(value, SynthConstants.MinVolume);
        this._masterVolume = value;
        this._synth.postMessage({
            cmd: 'alphaSynth.setMasterVolume',
            value: value
        });
    }
    get metronomeVolume() {
        return this._metronomeVolume;
    }
    set metronomeVolume(value) {
        value = Math.max(value, SynthConstants.MinVolume);
        this._metronomeVolume = value;
        this._synth.postMessage({
            cmd: 'alphaSynth.setMetronomeVolume',
            value: value
        });
    }
    get countInVolume() {
        return this._countInVolume;
    }
    set countInVolume(value) {
        value = Math.max(value, SynthConstants.MinVolume);
        this._countInVolume = value;
        this._synth.postMessage({
            cmd: 'alphaSynth.setCountInVolume',
            value: value
        });
    }
    get midiEventsPlayedFilter() {
        return this._midiEventsPlayedFilter;
    }
    set midiEventsPlayedFilter(value) {
        this._midiEventsPlayedFilter = value;
        this._synth.postMessage({
            cmd: 'alphaSynth.setMidiEventsPlayedFilter',
            value: value
        });
    }
    get playbackSpeed() {
        return this._playbackSpeed;
    }
    set playbackSpeed(value) {
        value = SynthHelper.clamp(value, SynthConstants.MinPlaybackSpeed, SynthConstants.MaxPlaybackSpeed);
        this._playbackSpeed = value;
        this._synth.postMessage({
            cmd: 'alphaSynth.setPlaybackSpeed',
            value: value
        });
    }
    get tickPosition() {
        return this._tickPosition;
    }
    set tickPosition(value) {
        if (value < 0) {
            value = 0;
        }
        this._tickPosition = value;
        this._synth.postMessage({
            cmd: 'alphaSynth.setTickPosition',
            value: value
        });
    }
    get timePosition() {
        return this._timePosition;
    }
    set timePosition(value) {
        if (value < 0) {
            value = 0;
        }
        this._timePosition = value;
        this._synth.postMessage({
            cmd: 'alphaSynth.setTimePosition',
            value: value
        });
    }
    get isLooping() {
        return this._isLooping;
    }
    set isLooping(value) {
        this._isLooping = value;
        this._synth.postMessage({
            cmd: 'alphaSynth.setIsLooping',
            value: value
        });
    }
    get playbackRange() {
        return this._playbackRange;
    }
    set playbackRange(value) {
        if (value) {
            if (value.startTick < 0) {
                value.startTick = 0;
            }
            if (value.endTick < 0) {
                value.endTick = 0;
            }
        }
        this._playbackRange = value;
        this._synth.postMessage({
            cmd: 'alphaSynth.setPlaybackRange',
            value: value
        });
    }
    destroy() {
        this._synth.postMessage({
            cmd: 'alphaSynth.destroy'
        });
    }
    //
    // API communicating with the web worker
    play() {
        this._output.activate();
        this._synth.postMessage({
            cmd: 'alphaSynth.play'
        });
        return true;
    }
    pause() {
        this._synth.postMessage({
            cmd: 'alphaSynth.pause'
        });
    }
    playPause() {
        this._output.activate();
        this._synth.postMessage({
            cmd: 'alphaSynth.playPause'
        });
    }
    stop() {
        this._synth.postMessage({
            cmd: 'alphaSynth.stop'
        });
    }
    playOneTimeMidiFile(midi) {
        this._synth.postMessage({
            cmd: 'alphaSynth.playOneTimeMidiFile',
            midi: JsonConverter.midiFileToJsObject(midi)
        });
    }
    loadSoundFont(data, append) {
        this._synth.postMessage({
            cmd: 'alphaSynth.loadSoundFontBytes',
            data: data,
            append: append
        });
    }
    loadSoundFontFromUrl(url, append, progress) {
        Logger.debug('AlphaSynth', `Start loading Soundfont from url ${url}`);
        let request = new XMLHttpRequest();
        request.open('GET', url, true, null, null);
        request.responseType = 'arraybuffer';
        request.onload = _ => {
            let buffer = new Uint8Array(request.response);
            this.loadSoundFont(buffer, append);
        };
        request.onerror = e => {
            Logger.error('AlphaSynth', 'Loading failed: ' + e.message);
            this.soundFontLoadFailed.trigger(new FileLoadError(e.message, request));
        };
        request.onprogress = e => {
            Logger.debug('AlphaSynth', `Soundfont downloading: ${e.loaded}/${e.total} bytes`);
            progress(new ProgressEventArgs(e.loaded, e.total));
        };
        request.send();
    }
    resetSoundFonts() {
        this._synth.postMessage({
            cmd: 'alphaSynth.resetSoundFonts'
        });
    }
    loadMidiFile(midi) {
        this._synth.postMessage({
            cmd: 'alphaSynth.loadMidi',
            midi: JsonConverter.midiFileToJsObject(midi)
        });
    }
    setChannelMute(channel, mute) {
        this._synth.postMessage({
            cmd: 'alphaSynth.setChannelMute',
            channel: channel,
            mute: mute
        });
    }
    resetChannelStates() {
        this._synth.postMessage({
            cmd: 'alphaSynth.resetChannelStates'
        });
    }
    setChannelSolo(channel, solo) {
        this._synth.postMessage({
            cmd: 'alphaSynth.setChannelSolo',
            channel: channel,
            solo: solo
        });
    }
    setChannelVolume(channel, volume) {
        volume = Math.max(volume, SynthConstants.MinVolume);
        this._synth.postMessage({
            cmd: 'alphaSynth.setChannelVolume',
            channel: channel,
            volume: volume
        });
    }
    handleWorkerMessage(e) {
        let data = e.data;
        let cmd = data.cmd;
        switch (cmd) {
            case 'alphaSynth.ready':
                this._workerIsReady = true;
                this.checkReady();
                break;
            case 'alphaSynth.destroyed':
                this._synth.terminate();
                break;
            case 'alphaSynth.readyForPlayback':
                this._workerIsReadyForPlayback = true;
                this.checkReadyForPlayback();
                break;
            case 'alphaSynth.positionChanged':
                this._timePosition = data.currentTime;
                this._tickPosition = data.currentTick;
                this.positionChanged.trigger(new PositionChangedEventArgs(data.currentTime, data.endTime, data.currentTick, data.endTick, data.isSeek));
                break;
            case 'alphaSynth.midiEventsPlayed':
                this.midiEventsPlayed.trigger(new MidiEventsPlayedEventArgs(data.events.map(JsonConverter.jsObjectToMidiEvent)));
                break;
            case 'alphaSynth.playerStateChanged':
                this._state = data.state;
                this.stateChanged.trigger(new PlayerStateChangedEventArgs(data.state, data.stopped));
                break;
            case 'alphaSynth.finished':
                this.finished.trigger();
                break;
            case 'alphaSynth.soundFontLoaded':
                this.soundFontLoaded.trigger();
                break;
            case 'alphaSynth.soundFontLoadFailed':
                this.soundFontLoadFailed.trigger(data.error);
                break;
            case 'alphaSynth.midiLoaded':
                this.checkReadyForPlayback();
                this.midiLoaded.trigger(new PositionChangedEventArgs(data.currentTime, data.endTime, data.currentTick, data.endTick, data.isSeek));
                break;
            case 'alphaSynth.midiLoadFailed':
                this.checkReadyForPlayback();
                this.midiLoadFailed.trigger(data.error);
                break;
            case 'alphaSynth.output.addSamples':
                this._output.addSamples(data.samples);
                break;
            case 'alphaSynth.output.play':
                this._output.play();
                break;
            case 'alphaSynth.output.pause':
                this._output.pause();
                break;
            case 'alphaSynth.output.destroy':
                this._output.destroy();
                break;
            case 'alphaSynth.output.resetSamples':
                this._output.resetSamples();
                break;
        }
    }
    checkReady() {
        if (this.isReady) {
            this.ready.trigger();
        }
    }
    checkReadyForPlayback() {
        if (this.isReadyForPlayback) {
            this.readyForPlayback.trigger();
        }
    }
    //
    // output communication ( output -> worker )
    onOutputSampleRequest() {
        this._synth.postMessage({
            cmd: 'alphaSynth.output.sampleRequest'
        });
    }
    onOutputSamplesPlayed(samples) {
        this._synth.postMessage({
            cmd: 'alphaSynth.output.samplesPlayed',
            samples: samples
        });
    }
    onOutputReady() {
        this._outputIsReady = true;
        this.checkReady();
    }
}
//# sourceMappingURL=AlphaSynthWebWorkerApi.js.map