import { MetaDataEvent } from '@src/midi/MetaDataEvent';
import { MetaEventType } from '@src/midi/MetaEvent';
import { MetaNumberEvent } from '@src/midi/MetaNumberEvent';
import { MidiEvent, MidiEventType } from '@src/midi/MidiEvent';
import { SystemCommonType } from '@src/midi/SystemCommonEvent';
import { AlphaTabSystemExclusiveEvents, SystemExclusiveEvent } from '@src/midi/SystemExclusiveEvent';
import { MidiUtils } from '@src/midi/MidiUtils';
import { SynthConstants } from '@src/synth/SynthConstants';
import { Midi20PerNotePitchBendEvent } from './Midi20PerNotePitchBendEvent';
/**
 * This implementation of the {@link IMidiFileHandler}
 * generates a {@link MidiFile} object which can be used in AlphaSynth for playback.
 */
export class AlphaSynthMidiFileHandler {
    /**
     * Initializes a new instance of the {@link AlphaSynthMidiFileHandler} class.
     * @param midiFile The midi file.
     */
    constructor(midiFile) {
        this._midiFile = midiFile;
    }
    addTimeSignature(tick, timeSignatureNumerator, timeSignatureDenominator) {
        let denominatorIndex = 0;
        while (true) {
            timeSignatureDenominator = timeSignatureDenominator >> 1;
            if (timeSignatureDenominator > 0) {
                denominatorIndex++;
            }
            else {
                break;
            }
        }
        const message = new MetaDataEvent(0, tick, 0xff, MetaEventType.TimeSignature, new Uint8Array([timeSignatureNumerator & 0xff, denominatorIndex & 0xff, 48, 8]));
        this._midiFile.addEvent(message);
    }
    addRest(track, tick, channel) {
        const message = new SystemExclusiveEvent(track, tick, SystemCommonType.SystemExclusive, SystemExclusiveEvent.AlphaTabManufacturerId, new Uint8Array([AlphaTabSystemExclusiveEvents.Rest]));
        this._midiFile.addEvent(message);
    }
    addNote(track, start, length, key, dynamicValue, channel) {
        const velocity = MidiUtils.dynamicToVelocity(dynamicValue);
        const noteOn = new MidiEvent(track, start, this.makeCommand(MidiEventType.NoteOn, channel), AlphaSynthMidiFileHandler.fixValue(key), AlphaSynthMidiFileHandler.fixValue(velocity));
        this._midiFile.addEvent(noteOn);
        const noteOff = new MidiEvent(track, start + length, this.makeCommand(MidiEventType.NoteOff, channel), AlphaSynthMidiFileHandler.fixValue(key), AlphaSynthMidiFileHandler.fixValue(velocity));
        this._midiFile.addEvent(noteOff);
    }
    makeCommand(command, channel) {
        return (command & 0xf0) | (channel & 0x0f);
    }
    static fixValue(value) {
        if (value > 127) {
            return 127;
        }
        if (value < 0) {
            return 0;
        }
        return value;
    }
    addControlChange(track, tick, channel, controller, value) {
        const message = new MidiEvent(track, tick, this.makeCommand(MidiEventType.Controller, channel), AlphaSynthMidiFileHandler.fixValue(controller), AlphaSynthMidiFileHandler.fixValue(value));
        this._midiFile.addEvent(message);
    }
    addProgramChange(track, tick, channel, program) {
        const message = new MidiEvent(track, tick, this.makeCommand(MidiEventType.ProgramChange, channel), AlphaSynthMidiFileHandler.fixValue(program), 0);
        this._midiFile.addEvent(message);
    }
    addTempo(tick, tempo) {
        // bpm -> microsecond per quarter note
        const tempoInUsq = (60000000 / tempo) | 0;
        const message = new MetaNumberEvent(0, tick, 0xff, MetaEventType.Tempo, tempoInUsq);
        this._midiFile.addEvent(message);
    }
    addBend(track, tick, channel, value) {
        if (value >= SynthConstants.MaxPitchWheel) {
            value = SynthConstants.MaxPitchWheel;
        }
        else {
            value = Math.floor(value);
        }
        const message = new MidiEvent(track, tick, this.makeCommand(MidiEventType.PitchBend, channel), value & 0x7F, (value >> 7) & 0x7F);
        this._midiFile.addEvent(message);
    }
    addNoteBend(track, tick, channel, key, value) {
        if (value >= SynthConstants.MaxPitchWheel) {
            value = SynthConstants.MaxPitchWheel;
        }
        else {
            value = Math.floor(value);
        }
        // map midi 1.0 range of 0-16384     (0x4000)
        // to midi 2.0 range of 0-4294967296 (0x100000000)
        value = value * SynthConstants.MaxPitchWheel20 / SynthConstants.MaxPitchWheel;
        const message = new Midi20PerNotePitchBendEvent(track, tick, this.makeCommand(MidiEventType.PerNotePitchBend, channel), key, value);
        this._midiFile.addEvent(message);
    }
    finishTrack(track, tick) {
        const message = new MetaDataEvent(track, tick, 0xff, MetaEventType.EndOfTrack, new Uint8Array(0));
        this._midiFile.addEvent(message);
    }
}
//# sourceMappingURL=AlphaSynthMidiFileHandler.js.map