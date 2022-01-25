import { Hydra } from '@src/synth/soundfont/Hydra';
import { OutputMode } from '@src/synth/synthesis/OutputMode';
import { Preset } from '@src/synth/synthesis/Preset';
import { SynthEvent } from '@src/synth/synthesis/SynthEvent';
/**
 * This is a tiny soundfont based synthesizer.
 * NOT YET IMPLEMENTED
 *   - Support for ChorusEffectsSend and ReverbEffectsSend generators
 *   - Better low-pass filter without lowering performance too much
 *   - Support for modulators
 */
export declare class TinySoundFont {
    private _midiEventQueue;
    private _mutedChannels;
    private _soloChannels;
    private _isAnySolo;
    currentTempo: number;
    timeSignatureNumerator: number;
    timeSignatureDenominator: number;
    constructor(sampleRate: number);
    synthesize(buffer: Float32Array, bufferPos: number, sampleCount: number): SynthEvent[];
    synthesizeSilent(sampleCount: number): void;
    channelGetMixVolume(channel: number): number;
    channelSetMixVolume(channel: number, volume: number): void;
    channelSetMute(channel: number, mute: boolean): void;
    channelSetSolo(channel: number, solo: boolean): void;
    resetChannelStates(): void;
    dispatchEvent(synthEvent: SynthEvent): void;
    private fillWorkingBuffer;
    private processMidiMessage;
    get metronomeVolume(): number;
    set metronomeVolume(value: number);
    setupMetronomeChannel(volume: number): void;
    get masterVolume(): number;
    set masterVolume(value: number);
    /**
     * Stop all playing notes immediatly and reset all channel parameters but keeps user
     * defined settings
     */
    resetSoft(): void;
    presets: Preset[] | null;
    private _voices;
    private _channels;
    private _voicePlayIndex;
    get presetCount(): number;
    /**
     * Gets the currently configured output mode.
     */
    outputMode: OutputMode;
    /**
     * Gets the currently configured sample rate.
     */
    outSampleRate: number;
    /**
     * Gets the currently configured global gain in DB.
     */
    globalGainDb: number;
    /**
     * Stop all playing notes immediatly and reset all channel parameters
     */
    reset(): void;
    /**
     * Setup the parameters for the voice render methods
     * @param outputMode if mono or stereo and how stereo channel data is ordered
     * @param sampleRate the number of samples per second (output frequency)
     * @param globalGainDb volume gain in decibels (>0 means higher, <0 means lower)
     */
    setOutput(outputMode: OutputMode, sampleRate: number, globalGainDb: number): void;
    /**
     * Start playing a note
     * @param presetIndex preset index >= 0 and < {@link presetCount}
     * @param key note value between 0 and 127 (60 being middle C)
     * @param vel velocity as a float between 0.0 (equal to note off) and 1.0 (full)
     */
    noteOn(presetIndex: number, key: number, vel: number): void;
    /**
     * Start playing a note
     * @param bank instrument bank number (alternative to preset_index)
     * @param presetNumber preset number (alternative to preset_index)
     * @param key note value between 0 and 127 (60 being middle C)
     * @param vel velocity as a float between 0.0 (equal to note off) and 1.0 (full)
     * @returns returns false if preset does not exist, otherwise true
     */
    bankNoteOn(bank: number, presetNumber: number, key: number, vel: number): boolean;
    /**
     * Stop playing a note
     */
    noteOff(presetIndex: number, key: number): void;
    /**
     * Stop playing a note
     * @returns returns false if preset does not exist, otherwise true
     */
    bankNoteOff(bank: number, presetNumber: number, key: number): boolean;
    /**
     * Stop playing all notes (end with sustain and release)
     */
    noteOffAll(immediate: boolean): void;
    get activeVoiceCount(): number;
    private channelInit;
    /**
     * Returns the preset index from a bank and preset number, or -1 if it does not exist in the loaded SoundFont
     */
    private getPresetIndex;
    /**
     * Returns the name of a preset index >= 0 and < GetPresetName()
     * @param presetIndex
     */
    getPresetName(presetIndex: number): string | null;
    /**
     * Returns the name of a preset by bank and preset number
     */
    bankGetPresetName(bank: number, presetNumber: number): string | null;
    /**
     * Start playing a note on a channel
     * @param channel channel number
     * @param key note value between 0 and 127 (60 being middle C)
     * @param vel velocity as a float between 0.0 (equal to note off) and 1.0 (full)
     */
    channelNoteOn(channel: number, key: number, vel: number): void;
    /**
     * Stop playing notes on a channel
     * @param channel channel number
     * @param key note value between 0 and 127 (60 being middle C)
     */
    channelNoteOff(channel: number, key: number): void;
    /**
     * Stop playing all notes on a channel with sustain and release.
     * @param channel channel number
     */
    channelNoteOffAll(channel: number): void;
    /**
     * Stop playing all notes on a channel immediately
     * @param channel channel number
     */
    channelSoundsOffAll(channel: number): void;
    /**
     *
     * @param channel channel number
     * @param presetIndex preset index <= 0 and > {@link presetCount}
     */
    channelSetPresetIndex(channel: number, presetIndex: number): void;
    /**
     * @param channel channel number
     * @param presetNumber preset number (alternative to preset_index)
     * @param midiDrums false for normal channels, otherwise apply MIDI drum channel rules
     * @returns return false if preset does not exist, otherwise true
     */
    channelSetPresetNumber(channel: number, presetNumber: number, midiDrums?: boolean): boolean;
    /**
     * @param channel channel number
     * @param bank instrument bank number (alternative to preset_index)
     */
    channelSetBank(channel: number, bank: number): void;
    /**
     * @param channel channel number
     * @param bank instrument bank number (alternative to preset_index)
     * @param presetNumber preset number (alternative to preset_index)
     * @returns return false if preset does not exist, otherwise true
     */
    channelSetBankPreset(channel: number, bank: number, presetNumber: number): boolean;
    /**
     * @param channel channel number
     * @param pan stereo panning value from 0.0 (left) to 1.0 (right) (default 0.5 center)
     */
    channelSetPan(channel: number, pan: number): void;
    /**
     * @param channel channel number
     * @param volume linear volume scale factor (default 1.0 full)
     */
    channelSetVolume(channel: number, volume: number): void;
    /**
     * @param channel channel number
     * @param pitchWheel pitch wheel position 0 to 16383 (default 8192 unpitched)
     */
    channelSetPitchWheel(channel: number, pitchWheel: number): void;
    /**
     * @param channel channel number
     * @param key note value between 0 and 127
     * @param pitchWheel pitch wheel position 0 to 16383 (default 8192 unpitched)
     */
    channelSetPerNotePitchWheel(channel: number, key: number, pitchWheel: number): void;
    private channelApplyPitch;
    /**
     * @param channel channel number
     * @param pitchRange range of the pitch wheel in semitones (default 2.0, total +/- 2 semitones)
     */
    channelSetPitchRange(channel: number, pitchRange: number): void;
    /**
     * @param channel channel number
     * @param tuning tuning of all playing voices in semitones (default 0.0, standard (A440) tuning)
     */
    channelSetTuning(channel: number, tuning: number): void;
    /**
     * Apply a MIDI control change to the channel (not all controllers are supported!)
     */
    channelMidiControl(channel: number, controller: number, controlValue: number): void;
    /**
     * Gets the current preset index of the given channel.
     * @param channel The channel index
     * @returns The current preset index of the given channel.
     */
    channelGetPresetIndex(channel: number): number;
    /**
     * Gets the current bank of the given channel.
     * @param channel The channel index
     * @returns The current bank of the given channel.
     */
    channelGetPresetBank(channel: number): number;
    /**
     * Gets the current pan of the given channel.
     * @param channel The channel index
     * @returns The current pan of the given channel.
     */
    channelGetPan(channel: number): number;
    /**
     * Gets the current volume of the given channel.
     * @param channel The channel index
     * @returns The current volune of the given channel.
     */
    channelGetVolume(channel: number): number;
    /**
     * Gets the current pitch wheel of the given channel.
     * @param channel The channel index
     * @returns The current pitch wheel of the given channel.
     */
    channelGetPitchWheel(channel: number): number;
    /**
     * Gets the current pitch range of the given channel.
     * @param channel The channel index
     * @returns The current pitch range of the given channel.
     */
    channelGetPitchRange(channel: number): number;
    /**
     * Gets the current tuning of the given channel.
     * @param channel The channel index
     * @returns The current tuning of the given channel.
     */
    channelGetTuning(channel: number): number;
    resetPresets(): void;
    loadPresets(hydra: Hydra, append: boolean): void;
}
