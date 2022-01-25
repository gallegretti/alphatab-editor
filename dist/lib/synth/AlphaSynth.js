import { MidiFileSequencer } from '@src/synth/MidiFileSequencer';
import { PlayerState } from '@src/synth/PlayerState';
import { PlayerStateChangedEventArgs } from '@src/synth/PlayerStateChangedEventArgs';
import { PositionChangedEventArgs } from '@src/synth/PositionChangedEventArgs';
import { Hydra } from '@src/synth/soundfont/Hydra';
import { TinySoundFont } from '@src/synth/synthesis/TinySoundFont';
import { SynthHelper } from '@src/synth/SynthHelper';
import { EventEmitter, EventEmitterOfT } from '@src/EventEmitter';
import { ByteBuffer } from '@src/io/ByteBuffer';
import { Logger } from '@src/Logger';
import { SynthConstants } from '@src/synth/SynthConstants';
import { Queue } from './ds/Queue';
import { MidiEventsPlayedEventArgs } from './MidiEventsPlayedEventArgs';
/**
 * This is the main synthesizer component which can be used to
 * play a {@link MidiFile} via a {@link ISynthOutput}.
 */
export class AlphaSynth {
    /**
     * Initializes a new instance of the {@link AlphaSynth} class.
     * @param output The output to use for playing the generated samples.
     */
    constructor(output) {
        this._isSoundFontLoaded = false;
        this._isMidiLoaded = false;
        this._tickPosition = 0;
        this._timePosition = 0;
        this._metronomeVolume = 0;
        this._countInVolume = 0;
        this._playedEventsQueue = new Queue();
        this._midiEventsPlayedFilter = new Set();
        this.isReady = false;
        this.state = PlayerState.Paused;
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
        Logger.debug('AlphaSynth', 'Initializing player');
        this.state = PlayerState.Paused;
        Logger.debug('AlphaSynth', 'Creating output');
        this.output = output;
        Logger.debug('AlphaSynth', 'Creating synthesizer');
        this._synthesizer = new TinySoundFont(this.output.sampleRate);
        this._sequencer = new MidiFileSequencer(this._synthesizer);
        Logger.debug('AlphaSynth', 'Opening output');
        this.output.ready.on(() => {
            this.isReady = true;
            this.ready.trigger();
            this.checkReadyForPlayback();
        });
        this.output.sampleRequest.on(() => {
            let samples = new Float32Array(SynthConstants.MicroBufferSize * SynthConstants.MicroBufferCount * SynthConstants.AudioChannels);
            let bufferPos = 0;
            for (let i = 0; i < SynthConstants.MicroBufferCount; i++) {
                // synthesize buffer
                this._sequencer.fillMidiEventQueue();
                const synthesizedEvents = this._synthesizer.synthesize(samples, bufferPos, SynthConstants.MicroBufferSize);
                bufferPos += SynthConstants.MicroBufferSize * SynthConstants.AudioChannels;
                // push all processed events into the queue
                // for informing users about played events
                for (const e of synthesizedEvents) {
                    if (this._midiEventsPlayedFilter.has(e.event.command)) {
                        this._playedEventsQueue.enqueue(e);
                    }
                }
                // tell sequencer to check whether its work is done
                if (this._sequencer.isFinished) {
                    break;
                }
            }
            // send it to output
            if (bufferPos < samples.length) {
                samples = samples.subarray(0, bufferPos);
            }
            this.output.addSamples(samples);
        });
        this.output.samplesPlayed.on(this.onSamplesPlayed.bind(this));
        this.output.open();
    }
    get isReadyForPlayback() {
        return this.isReady && this._isSoundFontLoaded && this._isMidiLoaded;
    }
    get logLevel() {
        return Logger.logLevel;
    }
    set logLevel(value) {
        Logger.logLevel = value;
    }
    get masterVolume() {
        return this._synthesizer.masterVolume;
    }
    set masterVolume(value) {
        value = Math.max(value, SynthConstants.MinVolume);
        this._synthesizer.masterVolume = value;
    }
    get metronomeVolume() {
        return this._metronomeVolume;
    }
    set metronomeVolume(value) {
        value = Math.max(value, SynthConstants.MinVolume);
        this._metronomeVolume = value;
        this._synthesizer.metronomeVolume = value;
    }
    get countInVolume() {
        return this._countInVolume;
    }
    set countInVolume(value) {
        value = Math.max(value, SynthConstants.MinVolume);
        this._countInVolume = value;
    }
    get midiEventsPlayedFilter() {
        return Array.from(this._midiEventsPlayedFilter);
    }
    set midiEventsPlayedFilter(value) {
        this._midiEventsPlayedFilter = new Set(value);
    }
    get playbackSpeed() {
        return this._sequencer.playbackSpeed;
    }
    set playbackSpeed(value) {
        value = SynthHelper.clamp(value, SynthConstants.MinPlaybackSpeed, SynthConstants.MaxPlaybackSpeed);
        let oldSpeed = this._sequencer.playbackSpeed;
        this._sequencer.playbackSpeed = value;
        this.updateTimePosition(this._timePosition * (oldSpeed / value), true);
    }
    get tickPosition() {
        return this._tickPosition;
    }
    set tickPosition(value) {
        this.timePosition = this._sequencer.tickPositionToTimePosition(value);
    }
    get timePosition() {
        return this._timePosition;
    }
    set timePosition(value) {
        Logger.debug('AlphaSynth', `Seeking to position ${value}ms`);
        // tell the sequencer to jump to the given position
        this._sequencer.seek(value);
        // update the internal position
        this.updateTimePosition(value, true);
        // tell the output to reset the already synthesized buffers and request data again
        this.output.resetSamples();
    }
    get playbackRange() {
        return this._sequencer.playbackRange;
    }
    set playbackRange(value) {
        this._sequencer.playbackRange = value;
        if (value) {
            this.tickPosition = value.startTick;
        }
    }
    get isLooping() {
        return this._sequencer.isLooping;
    }
    set isLooping(value) {
        this._sequencer.isLooping = value;
    }
    destroy() {
        Logger.debug('AlphaSynth', 'Destroying player');
        this.stop();
        this.output.destroy();
    }
    play() {
        if (this.state !== PlayerState.Paused || !this._isMidiLoaded) {
            return false;
        }
        this.output.activate();
        this.playInternal();
        if (this._countInVolume > 0) {
            Logger.debug('AlphaSynth', 'Starting countin');
            this._sequencer.startCountIn();
            this._synthesizer.setupMetronomeChannel(this._countInVolume);
            this.tickPosition = 0;
        }
        this.output.play();
        return true;
    }
    playInternal() {
        Logger.debug('AlphaSynth', 'Starting playback');
        this._synthesizer.setupMetronomeChannel(this.metronomeVolume);
        this.state = PlayerState.Playing;
        this.stateChanged.trigger(new PlayerStateChangedEventArgs(this.state, false));
    }
    pause() {
        if (this.state === PlayerState.Paused || !this._isMidiLoaded) {
            return;
        }
        Logger.debug('AlphaSynth', 'Pausing playback');
        this.state = PlayerState.Paused;
        this.stateChanged.trigger(new PlayerStateChangedEventArgs(this.state, false));
        this.output.pause();
        this._synthesizer.noteOffAll(false);
    }
    playPause() {
        if (this.state !== PlayerState.Paused || !this._isMidiLoaded) {
            this.pause();
        }
        else {
            this.play();
        }
    }
    stop() {
        if (!this._isMidiLoaded) {
            return;
        }
        Logger.debug('AlphaSynth', 'Stopping playback');
        this.state = PlayerState.Paused;
        this.output.pause();
        this._sequencer.stop();
        this._synthesizer.noteOffAll(true);
        this.tickPosition = this._sequencer.playbackRange ? this._sequencer.playbackRange.startTick : 0;
        this.stateChanged.trigger(new PlayerStateChangedEventArgs(this.state, true));
    }
    playOneTimeMidiFile(midi) {
        // pause current playback.
        this.pause();
        this._sequencer.loadOneTimeMidi(midi);
        this._sequencer.stop();
        this._synthesizer.noteOffAll(true);
        this.tickPosition = 0;
        this.output.play();
    }
    resetSoundFonts() {
        this.stop();
        this._synthesizer.resetPresets();
        this._isSoundFontLoaded = false;
        this.soundFontLoaded.trigger();
    }
    loadSoundFont(data, append) {
        this.pause();
        let input = ByteBuffer.fromBuffer(data);
        try {
            Logger.debug('AlphaSynth', 'Loading soundfont from bytes');
            let soundFont = new Hydra();
            soundFont.load(input);
            this._synthesizer.loadPresets(soundFont, append);
            this._isSoundFontLoaded = true;
            this.soundFontLoaded.trigger();
            Logger.debug('AlphaSynth', 'soundFont successfully loaded');
            this.checkReadyForPlayback();
        }
        catch (e) {
            Logger.error('AlphaSynth', 'Could not load soundfont from bytes ' + e);
            this.soundFontLoadFailed.trigger(e);
        }
    }
    checkReadyForPlayback() {
        if (this.isReadyForPlayback) {
            this._synthesizer.setupMetronomeChannel(this.metronomeVolume);
            this.readyForPlayback.trigger();
        }
    }
    /**
     * Loads the given midi file for playback.
     * @param midi The midi file to load
     */
    loadMidiFile(midi) {
        this.stop();
        try {
            Logger.debug('AlphaSynth', 'Loading midi from model');
            this._sequencer.loadMidi(midi);
            this._isMidiLoaded = true;
            this.midiLoaded.trigger(new PositionChangedEventArgs(0, this._sequencer.endTime, 0, this._sequencer.endTick, false));
            Logger.debug('AlphaSynth', 'Midi successfully loaded');
            this.checkReadyForPlayback();
            this.tickPosition = 0;
        }
        catch (e) {
            Logger.error('AlphaSynth', 'Could not load midi from model ' + e);
            this.midiLoadFailed.trigger(e);
        }
    }
    setChannelMute(channel, mute) {
        this._synthesizer.channelSetMute(channel, mute);
    }
    resetChannelStates() {
        this._synthesizer.resetChannelStates();
    }
    setChannelSolo(channel, solo) {
        this._synthesizer.channelSetSolo(channel, solo);
    }
    setChannelVolume(channel, volume) {
        volume = Math.max(volume, SynthConstants.MinVolume);
        this._synthesizer.channelSetMixVolume(channel, volume);
    }
    onSamplesPlayed(sampleCount) {
        let playedMillis = (sampleCount / this._synthesizer.outSampleRate) * 1000;
        this.updateTimePosition(this._timePosition + playedMillis, false);
        this.checkForFinish();
    }
    checkForFinish() {
        let startTick = 0;
        let endTick = 0;
        if (this.playbackRange) {
            startTick = this.playbackRange.startTick;
            endTick = this.playbackRange.endTick;
        }
        else {
            endTick = this._sequencer.endTick;
        }
        if (this._tickPosition >= endTick) {
            Logger.debug('AlphaSynth', 'Finished playback');
            if (this._sequencer.isPlayingCountIn) {
                this._sequencer.resetCountIn();
                this.timePosition = this._sequencer.currentTime;
                this.playInternal();
            }
            else if (this._sequencer.isPlayingOneTimeMidi) {
                this._sequencer.resetOneTimeMidi();
                this.state = PlayerState.Paused;
                this.output.pause();
                this._synthesizer.noteOffAll(false);
            }
            else {
                this.finished.trigger();
                if (this.isLooping) {
                    this.tickPosition = startTick;
                }
                else {
                    this.stop();
                }
            }
        }
    }
    updateTimePosition(timePosition, isSeek) {
        // update the real positions
        const currentTime = timePosition;
        this._timePosition = currentTime;
        const currentTick = this._sequencer.timePositionToTickPosition(currentTime);
        this._tickPosition = currentTick;
        const endTime = this._sequencer.endTime;
        const endTick = this._sequencer.endTick;
        if (!this._sequencer.isPlayingOneTimeMidi && !this._sequencer.isPlayingCountIn) {
            Logger.debug('AlphaSynth', `Position changed: (time: ${currentTime}/${endTime}, tick: ${currentTick}/${endTick}, Active Voices: ${this._synthesizer.activeVoiceCount}`);
            this.positionChanged.trigger(new PositionChangedEventArgs(currentTime, endTime, currentTick, endTick, isSeek));
        }
        // build events which were actually played
        if (isSeek) {
            this._playedEventsQueue.clear();
        }
        else {
            const playedEvents = new Queue();
            while (!this._playedEventsQueue.isEmpty && this._playedEventsQueue.peek().time < currentTime) {
                const synthEvent = this._playedEventsQueue.dequeue();
                playedEvents.enqueue(synthEvent.event);
            }
            if (!playedEvents.isEmpty) {
                this.midiEventsPlayed.trigger(new MidiEventsPlayedEventArgs(playedEvents.toArray()));
            }
        }
    }
}
//# sourceMappingURL=AlphaSynth.js.map