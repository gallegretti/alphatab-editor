var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ControllerType } from '@src/midi/ControllerType';
import { MidiEvent, MidiEventType } from '@src/midi/MidiEvent';
import { MidiFileGenerator } from '@src/midi/MidiFileGenerator';
import { MidiFile } from '@src/midi/MidiFile';
import { MidiUtils } from '@src/midi/MidiUtils';
import { AlphaTexImporter } from '@src/importer/AlphaTexImporter';
import { Gp3To5Importer } from '@src/importer/Gp3To5Importer';
import { Gp7Importer } from '@src/importer/Gp7Importer';
import { ByteBuffer } from '@src/io/ByteBuffer';
import { DynamicValue } from '@src/model/DynamicValue';
import { GraceType } from '@src/model/GraceType';
import { Settings } from '@src/Settings';
import { Logger } from '@src/Logger';
import { NoteBendEvent, ControlChangeEvent, FlatMidiEventGenerator, NoteEvent, ProgramChangeEvent, TempoEvent, TimeSignatureEvent, TrackEndEvent, RestEvent } from '@test/audio/FlatMidiEventGenerator';
import { TestPlatform } from '@test/TestPlatform';
import { AlphaSynthMidiFileHandler } from '@src/midi/AlphaSynthMidiFileHandler';
import { MetaEventType } from '@src/midi/MetaEvent';
describe('MidiFileGeneratorTest', () => {
    const parseTex = (tex) => {
        let importer = new AlphaTexImporter();
        importer.initFromString(tex, new Settings());
        return importer.readScore();
    };
    it('full-song', () => __awaiter(void 0, void 0, void 0, function* () {
        const buffer = yield TestPlatform.loadFile('test-data/audio/full-song.gp5');
        let readerBase = new Gp3To5Importer();
        readerBase.init(ByteBuffer.fromBuffer(buffer), new Settings());
        let score = readerBase.readScore();
        let generator = new MidiFileGenerator(score, null, new FlatMidiEventGenerator());
        generator.generate();
    }));
    it('midi-order', () => {
        let midiFile = new MidiFile();
        midiFile.addEvent(new MidiEvent(0, 0, 0, 0, 0));
        midiFile.addEvent(new MidiEvent(0, 0, 0, 1, 0));
        midiFile.addEvent(new MidiEvent(0, 100, 0, 2, 0));
        midiFile.addEvent(new MidiEvent(0, 50, 0, 3, 0));
        midiFile.addEvent(new MidiEvent(0, 50, 0, 4, 0));
        expect(midiFile.events[0].data1).toEqual(0);
        expect(midiFile.events[1].data1).toEqual(1);
        expect(midiFile.events[2].data1).toEqual(3);
        expect(midiFile.events[3].data1).toEqual(4);
        expect(midiFile.events[4].data1).toEqual(2);
    });
    it('bend', () => {
        let tex = ':4 15.6{b(0 4)} 15.6';
        let score = parseTex(tex);
        expect(score.tracks.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars[0].voices.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats.length).toEqual(2);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[1].notes.length).toEqual(1);
        let handler = new FlatMidiEventGenerator();
        let generator = new MidiFileGenerator(score, null, handler);
        generator.generate();
        let info = score.tracks[0].playbackInfo;
        let note = score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0];
        let expectedEvents = [
            // channel init
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.primaryChannel, info.program),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.secondaryChannel, info.program),
            new TimeSignatureEvent(0, 4, 4),
            new TempoEvent(0, 120),
            // bend effect
            new NoteBendEvent(0, 0, info.secondaryChannel, note.realValue, 8192),
            new NoteBendEvent(0, 0, info.secondaryChannel, note.realValue, 8192),
            new NoteBendEvent(1 * 80, 0, info.secondaryChannel, note.realValue, 8277),
            new NoteBendEvent(2 * 80, 0, info.secondaryChannel, note.realValue, 8363),
            new NoteBendEvent(3 * 80, 0, info.secondaryChannel, note.realValue, 8448),
            new NoteBendEvent(4 * 80, 0, info.secondaryChannel, note.realValue, 8533),
            new NoteBendEvent(5 * 80, 0, info.secondaryChannel, note.realValue, 8619),
            new NoteBendEvent(6 * 80, 0, info.secondaryChannel, note.realValue, 8704),
            new NoteBendEvent(7 * 80, 0, info.secondaryChannel, note.realValue, 8789),
            new NoteBendEvent(8 * 80, 0, info.secondaryChannel, note.realValue, 8875),
            new NoteBendEvent(9 * 80, 0, info.secondaryChannel, note.realValue, 8960),
            new NoteBendEvent(10 * 80, 0, info.secondaryChannel, note.realValue, 9045),
            new NoteBendEvent(11 * 80, 0, info.secondaryChannel, note.realValue, 9131),
            // note itself
            new NoteEvent(0, 0, info.secondaryChannel, MidiUtils.toTicks(note.beat.duration), note.realValue, note.dynamics),
            // reset bend
            new NoteBendEvent(960, 0, info.primaryChannel, note.realValue, 8192),
            new NoteEvent(960, 0, info.primaryChannel, MidiUtils.toTicks(note.beat.duration), note.realValue, note.dynamics),
            // end of track
            new TrackEndEvent(3840, 0) // 3840 = end of bar
        ];
        for (let i = 0; i < handler.midiEvents.length; i++) {
            Logger.info('Test', `i[${i}] ${handler.midiEvents[i]}`);
            if (i < expectedEvents.length) {
                expect(expectedEvents[i].equals(handler.midiEvents[i]))
                    .withContext(`i[${i}] expected[${expectedEvents[i]}] !== actual[${handler.midiEvents[i]}]`)
                    .toEqual(true);
            }
        }
        expect(handler.midiEvents.length).toEqual(expectedEvents.length);
    });
    it('grace-beats', () => __awaiter(void 0, void 0, void 0, function* () {
        let reader = new Gp7Importer();
        const buffer = yield TestPlatform.loadFile('test-data/audio/grace-beats.gp');
        let settings = Settings.songBook;
        reader.init(ByteBuffer.fromBuffer(buffer), settings);
        let score = reader.readScore();
        let handler = new FlatMidiEventGenerator();
        let generator = new MidiFileGenerator(score, settings, handler);
        generator.generate();
        // on beat
        let tick = 0;
        let ticks = [];
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].absolutePlaybackStart).toEqual(tick);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].playbackDuration).toEqual(3840);
        ticks.push(tick);
        tick += score.tracks[0].staves[0].bars[0].voices[0].beats[0].playbackDuration;
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].absolutePlaybackStart).toEqual(tick);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].playbackDuration).toEqual(120);
        ticks.push(tick);
        tick += score.tracks[0].staves[0].bars[1].voices[0].beats[0].playbackDuration;
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[1].absolutePlaybackStart).toEqual(tick);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[1].playbackDuration).toEqual(3720);
        ticks.push(tick);
        tick += score.tracks[0].staves[0].bars[1].voices[0].beats[1].playbackDuration;
        // before beat
        expect(score.tracks[0].staves[0].bars[2].voices[0].beats[0].absolutePlaybackStart).toEqual(tick);
        expect(score.tracks[0].staves[0].bars[2].voices[0].beats[0].playbackDuration).toEqual(3720);
        ticks.push(tick);
        tick += score.tracks[0].staves[0].bars[2].voices[0].beats[0].playbackDuration;
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].absolutePlaybackStart).toEqual(tick);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].playbackDuration).toEqual(120);
        ticks.push(tick);
        tick += score.tracks[0].staves[0].bars[3].voices[0].beats[0].playbackDuration;
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[1].absolutePlaybackStart).toEqual(tick);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[1].playbackDuration).toEqual(3840);
        ticks.push(tick);
        tick += score.tracks[0].staves[0].bars[3].voices[0].beats[1].playbackDuration;
        // bend
        expect(score.tracks[0].staves[0].bars[4].voices[0].beats[0].graceType).toEqual(GraceType.BendGrace);
        expect(score.tracks[0].staves[0].bars[4].voices[0].beats[0].absolutePlaybackStart).toEqual(tick);
        expect(score.tracks[0].staves[0].bars[4].voices[0].beats[0].playbackDuration).toEqual(1920);
        ticks.push(tick);
        tick += score.tracks[0].staves[0].bars[4].voices[0].beats[0].playbackDuration;
        expect(score.tracks[0].staves[0].bars[4].voices[0].beats[1].absolutePlaybackStart).toEqual(tick);
        expect(score.tracks[0].staves[0].bars[4].voices[0].beats[1].playbackDuration).toEqual(1920);
        ticks.push(tick);
        tick += score.tracks[0].staves[0].bars[4].voices[0].beats[1].playbackDuration;
        let info = score.tracks[0].playbackInfo;
        let expectedEvents = [
            // channel init
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.VolumeCoarse, 96),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.primaryChannel, info.program),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.VolumeCoarse, 96),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.secondaryChannel, info.program),
            new TimeSignatureEvent(0, 4, 4),
            new TempoEvent(0, 120),
            // on beat
            new NoteBendEvent(ticks[0], 0, info.primaryChannel, 67, 8192),
            new NoteEvent(ticks[0], 0, info.primaryChannel, 3840, 67, DynamicValue.MF),
            new NoteBendEvent(ticks[1], 0, info.primaryChannel, 67, 8192),
            new NoteEvent(ticks[1], 0, info.primaryChannel, 120, 67, DynamicValue.MF),
            new NoteBendEvent(ticks[2], 0, info.primaryChannel, 67, 8192),
            new NoteEvent(ticks[2], 0, info.primaryChannel, 3720, 67, DynamicValue.MF),
            // before beat
            new NoteBendEvent(ticks[3], 0, info.primaryChannel, 67, 8192),
            new NoteEvent(ticks[3], 0, info.primaryChannel, 3720, 67, DynamicValue.MF),
            new NoteBendEvent(ticks[4], 0, info.primaryChannel, 67, 8192),
            new NoteEvent(ticks[4], 0, info.primaryChannel, 120, 67, DynamicValue.MF),
            new NoteBendEvent(ticks[5], 0, info.primaryChannel, 67, 8192),
            new NoteEvent(ticks[5], 0, info.primaryChannel, 3840, 67, DynamicValue.MF),
            // bend beat
            new NoteBendEvent(ticks[6], 0, info.secondaryChannel, 67, 8192),
            new NoteBendEvent(ticks[6] + 12 * 0, 0, info.secondaryChannel, 67, 8192),
            new NoteBendEvent(ticks[6] + 12 * 1, 0, info.secondaryChannel, 67, 8277),
            new NoteBendEvent(ticks[6] + 12 * 2, 0, info.secondaryChannel, 67, 8363),
            new NoteBendEvent(ticks[6] + 12 * 3, 0, info.secondaryChannel, 67, 8448),
            new NoteBendEvent(ticks[6] + 12 * 4, 0, info.secondaryChannel, 67, 8533),
            new NoteBendEvent(ticks[6] + 12 * 5, 0, info.secondaryChannel, 67, 8619),
            new NoteBendEvent(ticks[6] + 12 * 6, 0, info.secondaryChannel, 67, 8704),
            new NoteBendEvent(ticks[6] + 12 * 7, 0, info.secondaryChannel, 67, 8789),
            new NoteBendEvent(ticks[6] + 12 * 8, 0, info.secondaryChannel, 67, 8875),
            new NoteBendEvent(ticks[6] + 12 * 9, 0, info.secondaryChannel, 67, 8960),
            new NoteBendEvent(ticks[6] + 12 * 10, 0, info.secondaryChannel, 67, 9045),
            new NoteBendEvent(ticks[6] + 12 * 11, 0, info.secondaryChannel, 67, 9131),
            new NoteEvent(ticks[6], 0, info.secondaryChannel, 3840, 67, DynamicValue.MF),
            // end of track
            new TrackEndEvent(19200, 0) // 3840 = end of bar
        ];
        for (let i = 0; i < handler.midiEvents.length; i++) {
            Logger.info('Test', `i[${i}] ${handler.midiEvents[i]}`);
            if (i < expectedEvents.length) {
                expect(handler.midiEvents[i].equals(expectedEvents[i]))
                    .withContext(`i[${i}] expected[${expectedEvents[i]}] !== actual[${handler.midiEvents[i]}]`)
                    .toEqual(true);
            }
        }
        expect(handler.midiEvents.length).toEqual(expectedEvents.length);
    }));
    it('bend-multi-point', () => {
        let tex = ':4 15.6{b(0 4 0)} 15.6';
        let score = parseTex(tex);
        expect(score.tracks.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars[0].voices.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats.length).toEqual(2);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[1].notes.length).toEqual(1);
        let handler = new FlatMidiEventGenerator();
        let generator = new MidiFileGenerator(score, null, handler);
        generator.generate();
        let info = score.tracks[0].playbackInfo;
        let note = score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0];
        let expectedEvents = [
            // channel init
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.primaryChannel, info.program),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.secondaryChannel, info.program),
            new TimeSignatureEvent(0, 4, 4),
            new TempoEvent(0, 120),
            // bend effect
            new NoteBendEvent(0, 0, info.secondaryChannel, note.realValue, 8192),
            new NoteBendEvent(0 * 40, 0, info.secondaryChannel, note.realValue, 8192),
            new NoteBendEvent(1 * 40, 0, info.secondaryChannel, note.realValue, 8277),
            new NoteBendEvent(2 * 40, 0, info.secondaryChannel, note.realValue, 8363),
            new NoteBendEvent(3 * 40, 0, info.secondaryChannel, note.realValue, 8448),
            new NoteBendEvent(4 * 40, 0, info.secondaryChannel, note.realValue, 8533),
            new NoteBendEvent(5 * 40, 0, info.secondaryChannel, note.realValue, 8619),
            new NoteBendEvent(6 * 40, 0, info.secondaryChannel, note.realValue, 8704),
            new NoteBendEvent(7 * 40, 0, info.secondaryChannel, note.realValue, 8789),
            new NoteBendEvent(8 * 40, 0, info.secondaryChannel, note.realValue, 8875),
            new NoteBendEvent(9 * 40, 0, info.secondaryChannel, note.realValue, 8960),
            new NoteBendEvent(10 * 40, 0, info.secondaryChannel, note.realValue, 9045),
            new NoteBendEvent(11 * 40, 0, info.secondaryChannel, note.realValue, 9131),
            new NoteBendEvent(12 * 40, 0, info.secondaryChannel, note.realValue, 9216),
            new NoteBendEvent(13 * 40, 0, info.secondaryChannel, note.realValue, 9131),
            new NoteBendEvent(14 * 40, 0, info.secondaryChannel, note.realValue, 9045),
            new NoteBendEvent(15 * 40, 0, info.secondaryChannel, note.realValue, 8960),
            new NoteBendEvent(16 * 40, 0, info.secondaryChannel, note.realValue, 8875),
            new NoteBendEvent(17 * 40, 0, info.secondaryChannel, note.realValue, 8789),
            new NoteBendEvent(18 * 40, 0, info.secondaryChannel, note.realValue, 8704),
            new NoteBendEvent(19 * 40, 0, info.secondaryChannel, note.realValue, 8619),
            new NoteBendEvent(20 * 40, 0, info.secondaryChannel, note.realValue, 8533),
            new NoteBendEvent(21 * 40, 0, info.secondaryChannel, note.realValue, 8448),
            new NoteBendEvent(22 * 40, 0, info.secondaryChannel, note.realValue, 8363),
            new NoteBendEvent(23 * 40, 0, info.secondaryChannel, note.realValue, 8277),
            new NoteBendEvent(24 * 40, 0, info.secondaryChannel, note.realValue, 8192),
            // note itself
            new NoteEvent(0, 0, info.secondaryChannel, MidiUtils.toTicks(note.beat.duration), note.realValue, note.dynamics),
            // reset bend
            new NoteBendEvent(960, 0, info.primaryChannel, note.realValue, 8192),
            new NoteEvent(960, 0, info.primaryChannel, MidiUtils.toTicks(note.beat.duration), note.realValue, note.dynamics),
            new TrackEndEvent(3840, 0) // 3840 = end of bar
        ];
        for (let i = 0; i < handler.midiEvents.length; i++) {
            Logger.info('Test', `i[${i}] ${handler.midiEvents[i]}`);
            if (i < expectedEvents.length) {
                expect(expectedEvents[i].equals(handler.midiEvents[i]))
                    .withContext(`i[${i}] expected[${expectedEvents[i]}] !== actual[${handler.midiEvents[i]}]`)
                    .toEqual(true);
            }
        }
        expect(handler.midiEvents.length).toEqual(expectedEvents.length);
    });
    it('bend-continued', () => {
        let tex = '7.3{b (0 4)} -.3{b (4 0)}';
        let score = parseTex(tex);
        let handler = new FlatMidiEventGenerator();
        let generator = new MidiFileGenerator(score, null, handler);
        generator.generate();
        let info = score.tracks[0].playbackInfo;
        let note = score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0];
        let expectedEvents = [
            // channel init
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.primaryChannel, info.program),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.secondaryChannel, info.program),
            new TimeSignatureEvent(0, 4, 4),
            new TempoEvent(0, 120),
            // bend up
            new NoteBendEvent(0, 0, info.secondaryChannel, 62, 8192),
            new NoteBendEvent(0 * 80, 0, info.secondaryChannel, 62, 8192),
            new NoteBendEvent(1 * 80, 0, info.secondaryChannel, 62, 8277),
            new NoteBendEvent(2 * 80, 0, info.secondaryChannel, 62, 8363),
            new NoteBendEvent(3 * 80, 0, info.secondaryChannel, 62, 8448),
            new NoteBendEvent(4 * 80, 0, info.secondaryChannel, 62, 8533),
            new NoteBendEvent(5 * 80, 0, info.secondaryChannel, 62, 8619),
            new NoteBendEvent(6 * 80, 0, info.secondaryChannel, 62, 8704),
            new NoteBendEvent(7 * 80, 0, info.secondaryChannel, 62, 8789),
            new NoteBendEvent(8 * 80, 0, info.secondaryChannel, 62, 8875),
            new NoteBendEvent(9 * 80, 0, info.secondaryChannel, 62, 8960),
            new NoteBendEvent(10 * 80, 0, info.secondaryChannel, 62, 9045),
            new NoteBendEvent(11 * 80, 0, info.secondaryChannel, 62, 9131),
            // note itself
            new NoteEvent(0, 0, info.secondaryChannel, MidiUtils.toTicks(note.beat.duration) * 2, note.realValue, note.dynamics),
            // release on tied note
            new NoteBendEvent(12 * 80, 0, info.secondaryChannel, 62, 9216),
            new NoteBendEvent(12 * 80, 0, info.secondaryChannel, 62, 9216),
            new NoteBendEvent(13 * 80, 0, info.secondaryChannel, 62, 9131),
            new NoteBendEvent(14 * 80, 0, info.secondaryChannel, 62, 9045),
            new NoteBendEvent(15 * 80, 0, info.secondaryChannel, 62, 8960),
            new NoteBendEvent(16 * 80, 0, info.secondaryChannel, 62, 8875),
            new NoteBendEvent(17 * 80, 0, info.secondaryChannel, 62, 8789),
            new NoteBendEvent(18 * 80, 0, info.secondaryChannel, 62, 8704),
            new NoteBendEvent(19 * 80, 0, info.secondaryChannel, 62, 8619),
            new NoteBendEvent(20 * 80, 0, info.secondaryChannel, 62, 8533),
            new NoteBendEvent(21 * 80, 0, info.secondaryChannel, 62, 8448),
            new NoteBendEvent(22 * 80, 0, info.secondaryChannel, 62, 8363),
            new NoteBendEvent(23 * 80, 0, info.secondaryChannel, 62, 8277),
            new NoteBendEvent(24 * 80, 0, info.secondaryChannel, 62, 8192),
            new TrackEndEvent(3840, 0) // 3840 = end of bar
        ];
        for (let i = 0; i < handler.midiEvents.length; i++) {
            Logger.info('Test', `i[${i}] ${handler.midiEvents[i]}`);
            if (i < expectedEvents.length) {
                expect(expectedEvents[i].equals(handler.midiEvents[i]))
                    .withContext(`i[${i}] expected[${expectedEvents[i]}] !== actual[${handler.midiEvents[i]}]`)
                    .toEqual(true);
            }
        }
        expect(handler.midiEvents.length).toEqual(expectedEvents.length);
    });
    it('pre-bend-release-continued', () => {
        let tex = '7.3{b (4 0)} -.3';
        let score = parseTex(tex);
        let handler = new FlatMidiEventGenerator();
        let generator = new MidiFileGenerator(score, null, handler);
        generator.generate();
        let info = score.tracks[0].playbackInfo;
        let note = score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0];
        let expectedEvents = [
            // channel init
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.primaryChannel, info.program),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.secondaryChannel, info.program),
            new TimeSignatureEvent(0, 4, 4),
            new TempoEvent(0, 120),
            // bend up
            new NoteBendEvent(0 * 80, 0, info.secondaryChannel, 62, 9216),
            new NoteBendEvent(0 * 160, 0, info.secondaryChannel, 62, 9216),
            new NoteBendEvent(1 * 160, 0, info.secondaryChannel, 62, 9131),
            new NoteBendEvent(2 * 160, 0, info.secondaryChannel, 62, 9045),
            new NoteBendEvent(3 * 160, 0, info.secondaryChannel, 62, 8960),
            new NoteBendEvent(4 * 160, 0, info.secondaryChannel, 62, 8875),
            new NoteBendEvent(5 * 160, 0, info.secondaryChannel, 62, 8789),
            new NoteBendEvent(6 * 160, 0, info.secondaryChannel, 62, 8704),
            new NoteBendEvent(7 * 160, 0, info.secondaryChannel, 62, 8619),
            new NoteBendEvent(8 * 160, 0, info.secondaryChannel, 62, 8533),
            new NoteBendEvent(9 * 160, 0, info.secondaryChannel, 62, 8448),
            new NoteBendEvent(10 * 160, 0, info.secondaryChannel, 62, 8363),
            new NoteBendEvent(11 * 160, 0, info.secondaryChannel, 62, 8277),
            new NoteBendEvent(12 * 160, 0, info.secondaryChannel, 62, 8192),
            // note itself
            new NoteEvent(0, 0, info.secondaryChannel, MidiUtils.toTicks(note.beat.duration) * 2, note.realValue, note.dynamics),
            new TrackEndEvent(3840, 0) // 3840 = end of bar
        ];
        for (let i = 0; i < handler.midiEvents.length; i++) {
            Logger.info('Test', `i[${i}] ${handler.midiEvents[i]}`);
            if (i < expectedEvents.length) {
                expect(expectedEvents[i].equals(handler.midiEvents[i]))
                    .withContext(`i[${i}] expected[${expectedEvents[i]}] !== actual[${handler.midiEvents[i]}]`)
                    .toEqual(true);
            }
        }
        expect(handler.midiEvents.length).toEqual(expectedEvents.length);
    });
    it('pre-bend-release-continued-songbook', () => {
        let tex = '7.3{b (4 0)} -.3';
        let score = parseTex(tex);
        let handler = new FlatMidiEventGenerator();
        let settings = new Settings();
        settings.setSongBookModeSettings();
        let generator = new MidiFileGenerator(score, settings, handler);
        generator.generate();
        let info = score.tracks[0].playbackInfo;
        let note = score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0];
        let expectedEvents = [
            // channel init
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.primaryChannel, info.program),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.secondaryChannel, info.program),
            new TimeSignatureEvent(0, 4, 4),
            new TempoEvent(0, 120),
            // bend up
            new NoteBendEvent(0 * 80, 0, info.secondaryChannel, 62, 9216),
            new NoteBendEvent(0 * 80, 0, info.secondaryChannel, 62, 9216),
            new NoteBendEvent(1 * 80, 0, info.secondaryChannel, 62, 9131),
            new NoteBendEvent(2 * 80, 0, info.secondaryChannel, 62, 9045),
            new NoteBendEvent(3 * 80, 0, info.secondaryChannel, 62, 8960),
            new NoteBendEvent(4 * 80, 0, info.secondaryChannel, 62, 8875),
            new NoteBendEvent(5 * 80, 0, info.secondaryChannel, 62, 8789),
            new NoteBendEvent(6 * 80, 0, info.secondaryChannel, 62, 8704),
            new NoteBendEvent(7 * 80, 0, info.secondaryChannel, 62, 8619),
            new NoteBendEvent(8 * 80, 0, info.secondaryChannel, 62, 8533),
            new NoteBendEvent(9 * 80, 0, info.secondaryChannel, 62, 8448),
            new NoteBendEvent(10 * 80, 0, info.secondaryChannel, 62, 8363),
            new NoteBendEvent(11 * 80, 0, info.secondaryChannel, 62, 8277),
            new NoteBendEvent(12 * 80, 0, info.secondaryChannel, 62, 8192),
            // note itself
            new NoteEvent(0, 0, info.secondaryChannel, MidiUtils.toTicks(note.beat.duration) * 2, note.realValue, note.dynamics),
            new TrackEndEvent(3840, 0) // 3840 = end of bar
        ];
        for (let i = 0; i < handler.midiEvents.length; i++) {
            Logger.info('Test', `i[${i}] ${handler.midiEvents[i]}`);
            if (i < expectedEvents.length) {
                expect(expectedEvents[i].equals(handler.midiEvents[i]))
                    .withContext(`i[${i}] expected[${expectedEvents[i]}] !== actual[${handler.midiEvents[i]}]`)
                    .toEqual(true);
            }
        }
        expect(handler.midiEvents.length).toEqual(expectedEvents.length);
    });
    it('triplet-feel', () => {
        let tex = '\\ts 2 4 \\tf t8 3.2.8*4 | \\tf t16 3.2.16*8 | \\tf d8 3.2.8*4 | \\tf d16 3.2.16*8 | \\tf s8 3.2.8*4 | \\tf s16 3.2.16*8';
        let score = parseTex(tex);
        // prettier-ignore
        let expectedPlaybackStartTimes = [
            0, 480, 960, 1440,
            0, 240, 480, 720, 960, 1200, 1440, 1680,
            0, 480, 960, 1440,
            0, 240, 480, 720, 960, 1200, 1440, 1680,
            0, 480, 960, 1440,
            0, 240, 480, 720, 960, 1200, 1440, 1680
        ];
        // prettier-ignore
        let expectedPlaybackDurations = [
            480, 480, 480, 480,
            240, 240, 240, 240, 240, 240, 240, 240,
            480, 480, 480, 480,
            240, 240, 240, 240, 240, 240, 240, 240,
            480, 480, 480, 480,
            240, 240, 240, 240, 240, 240, 240, 240
        ];
        let actualPlaybackStartTimes = [];
        let actualPlaybackDurations = [];
        let beat = score.tracks[0].staves[0].bars[0].voices[0].beats[0];
        while (beat) {
            actualPlaybackStartTimes.push(beat.playbackStart);
            actualPlaybackDurations.push(beat.playbackDuration);
            beat = beat.nextBeat;
        }
        expect(actualPlaybackStartTimes.join(',')).toEqual(expectedPlaybackStartTimes.join(','));
        expect(actualPlaybackDurations.join(',')).toEqual(expectedPlaybackDurations.join(','));
        // prettier-ignore
        let expectedMidiStartTimes = [
            0, 640, 960, 1600,
            1920, 2240, 2400, 2720, 2880, 3200, 3360, 3680,
            3840, 4560, 4800, 5520,
            5760, 6120, 6240, 6600, 6720, 7080, 7200, 7560,
            7680, 7920, 8640, 8880,
            9600, 9720, 10080, 10200, 10560, 10680, 11040, 11160
        ];
        // prettier-ignore
        let expectedMidiDurations = [
            640, 320, 640, 320,
            320, 160, 320, 160, 320, 160, 320, 160,
            720, 240, 720, 240,
            360, 120, 360, 120, 360, 120, 360, 120,
            240, 720, 240, 720,
            120, 360, 120, 360, 120, 360, 120, 360
        ];
        let actualMidiStartTimes = [];
        let actualMidiDurations = [];
        let handler = new FlatMidiEventGenerator();
        let generator = new MidiFileGenerator(score, null, handler);
        generator.generate();
        for (let midiEvent of handler.midiEvents) {
            if (midiEvent instanceof NoteEvent) {
                actualMidiStartTimes.push(midiEvent.tick);
                actualMidiDurations.push(midiEvent.length);
            }
        }
        expect(actualMidiStartTimes.join(',')).toEqual(expectedMidiStartTimes.join(','));
        expect(actualMidiDurations.join(',')).toEqual(expectedMidiDurations.join(','));
    });
    it('beat-multi-bend', () => {
        let tex = ':4 (15.6{b(0 4)} 14.6{b(0 8)}) 15.6';
        let score = parseTex(tex);
        expect(score.tracks.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars[0].voices.length).toEqual(1);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats.length).toEqual(2);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes.length).toEqual(2);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[1].notes.length).toEqual(1);
        let handler = new FlatMidiEventGenerator();
        let generator = new MidiFileGenerator(score, null, handler);
        generator.generate();
        let info = score.tracks[0].playbackInfo;
        let note1 = score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0];
        let note2 = score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[1];
        let expectedEvents = [
            // channel init
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.primaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.primaryChannel, info.program),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.VolumeCoarse, 120),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.PanCoarse, 64),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.ExpressionControllerCoarse, 127),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.RegisteredParameterCourse, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryFine, 0),
            new ControlChangeEvent(0, 0, info.secondaryChannel, ControllerType.DataEntryCoarse, 16),
            new ProgramChangeEvent(0, 0, info.secondaryChannel, info.program),
            new TimeSignatureEvent(0, 4, 4),
            new TempoEvent(0, 120),
            // bend effect (note 1)
            new NoteBendEvent(0, 0, info.secondaryChannel, note1.realValue, 8192),
            new NoteBendEvent(0, 0, info.secondaryChannel, note1.realValue, 8192),
            new NoteBendEvent(1 * 80, 0, info.secondaryChannel, note1.realValue, 8277),
            new NoteBendEvent(2 * 80, 0, info.secondaryChannel, note1.realValue, 8363),
            new NoteBendEvent(3 * 80, 0, info.secondaryChannel, note1.realValue, 8448),
            new NoteBendEvent(4 * 80, 0, info.secondaryChannel, note1.realValue, 8533),
            new NoteBendEvent(5 * 80, 0, info.secondaryChannel, note1.realValue, 8619),
            new NoteBendEvent(6 * 80, 0, info.secondaryChannel, note1.realValue, 8704),
            new NoteBendEvent(7 * 80, 0, info.secondaryChannel, note1.realValue, 8789),
            new NoteBendEvent(8 * 80, 0, info.secondaryChannel, note1.realValue, 8875),
            new NoteBendEvent(9 * 80, 0, info.secondaryChannel, note1.realValue, 8960),
            new NoteBendEvent(10 * 80, 0, info.secondaryChannel, note1.realValue, 9045),
            new NoteBendEvent(11 * 80, 0, info.secondaryChannel, note1.realValue, 9131),
            // note itself
            new NoteEvent(0, 0, info.secondaryChannel, MidiUtils.toTicks(note1.beat.duration), note1.realValue, note1.dynamics),
            // bend effect (note 2)
            new NoteBendEvent(0, 0, info.secondaryChannel, note2.realValue, 8192),
            new NoteBendEvent(0, 0, info.secondaryChannel, note2.realValue, 8192),
            new NoteBendEvent(1 * 40, 0, info.secondaryChannel, note2.realValue, 8277),
            new NoteBendEvent(2 * 40, 0, info.secondaryChannel, note2.realValue, 8363),
            new NoteBendEvent(3 * 40, 0, info.secondaryChannel, note2.realValue, 8448),
            new NoteBendEvent(4 * 40, 0, info.secondaryChannel, note2.realValue, 8533),
            new NoteBendEvent(5 * 40, 0, info.secondaryChannel, note2.realValue, 8619),
            new NoteBendEvent(6 * 40, 0, info.secondaryChannel, note2.realValue, 8704),
            new NoteBendEvent(7 * 40, 0, info.secondaryChannel, note2.realValue, 8789),
            new NoteBendEvent(8 * 40, 0, info.secondaryChannel, note2.realValue, 8875),
            new NoteBendEvent(9 * 40, 0, info.secondaryChannel, note2.realValue, 8960),
            new NoteBendEvent(10 * 40, 0, info.secondaryChannel, note2.realValue, 9045),
            new NoteBendEvent(11 * 40, 0, info.secondaryChannel, note2.realValue, 9131),
            new NoteBendEvent(12 * 40, 0, info.secondaryChannel, note2.realValue, 9216),
            new NoteBendEvent(13 * 40, 0, info.secondaryChannel, note2.realValue, 9301),
            new NoteBendEvent(14 * 40, 0, info.secondaryChannel, note2.realValue, 9387),
            new NoteBendEvent(15 * 40, 0, info.secondaryChannel, note2.realValue, 9472),
            new NoteBendEvent(16 * 40, 0, info.secondaryChannel, note2.realValue, 9557),
            new NoteBendEvent(17 * 40, 0, info.secondaryChannel, note2.realValue, 9643),
            new NoteBendEvent(18 * 40, 0, info.secondaryChannel, note2.realValue, 9728),
            new NoteBendEvent(19 * 40, 0, info.secondaryChannel, note2.realValue, 9813),
            new NoteBendEvent(20 * 40, 0, info.secondaryChannel, note2.realValue, 9899),
            new NoteBendEvent(21 * 40, 0, info.secondaryChannel, note2.realValue, 9984),
            new NoteBendEvent(22 * 40, 0, info.secondaryChannel, note2.realValue, 10069),
            new NoteBendEvent(23 * 40, 0, info.secondaryChannel, note2.realValue, 10155),
            // note itself
            new NoteEvent(0, 0, info.secondaryChannel, MidiUtils.toTicks(note2.beat.duration), note2.realValue, note2.dynamics),
            // reset bend
            new NoteBendEvent(960, 0, info.primaryChannel, note1.realValue, 8192),
            new NoteEvent(960, 0, info.primaryChannel, MidiUtils.toTicks(note1.beat.duration), note1.realValue, note1.dynamics),
            // end of track
            new TrackEndEvent(3840, 0) // 3840 = end of bar
        ];
        for (let i = 0; i < handler.midiEvents.length; i++) {
            Logger.info('Test', `i[${i}] ${handler.midiEvents[i]}`);
            if (i < expectedEvents.length) {
                expect(expectedEvents[i].equals(handler.midiEvents[i]))
                    .withContext(`i[${i}] expected[${expectedEvents[i]}] !== actual[${handler.midiEvents[i]}]`)
                    .toEqual(true);
            }
        }
        expect(handler.midiEvents.length).toEqual(expectedEvents.length);
    });
    it('full-bar-rest', () => {
        let tex = '\\ts 3 4 3.3.4 3.3.4 3.3.4 | r.1 | 3.3.4 3.3.4 3.3.4';
        let score = parseTex(tex);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].isFullBarRest).toBeTrue();
        let expectedNoteOnTimes = [
            0 * MidiUtils.QuarterTime,
            1 * MidiUtils.QuarterTime,
            2 * MidiUtils.QuarterTime,
            3 * MidiUtils.QuarterTime,
            6 * MidiUtils.QuarterTime,
            7 * MidiUtils.QuarterTime,
            8 * MidiUtils.QuarterTime, // note 6
        ];
        let noteOnTimes = [];
        let beat = score.tracks[0].staves[0].bars[0].voices[0].beats[0];
        while (beat != null) {
            noteOnTimes.push(beat.absolutePlaybackStart);
            beat = beat.nextBeat;
        }
        expect(noteOnTimes.join(',')).toEqual(expectedNoteOnTimes.join(','));
        let handler = new FlatMidiEventGenerator();
        let generator = new MidiFileGenerator(score, null, handler);
        generator.generate();
        noteOnTimes = [];
        for (const evt of handler.midiEvents) {
            if (evt instanceof NoteEvent) {
                noteOnTimes.push(evt.tick);
            }
            else if (evt instanceof RestEvent) {
                noteOnTimes.push(evt.tick);
            }
        }
        expect(noteOnTimes.join(',')).toEqual(expectedNoteOnTimes.join(','));
    });
    it('time-signature', () => {
        let tex = '\\ts 3 4 3.3.4 3.3.4 3.3.4';
        let score = parseTex(tex);
        let file = new MidiFile();
        let handler = new AlphaSynthMidiFileHandler(file);
        let generator = new MidiFileGenerator(score, null, handler);
        generator.generate();
        let timeSignature = null;
        for (const evt of file.events) {
            if (evt.command === MidiEventType.Meta && evt.data1 === MetaEventType.TimeSignature) {
                timeSignature = evt;
                break;
            }
        }
        expect(timeSignature).toBeTruthy();
        const meta = timeSignature;
        const timeSignatureNumerator = meta.data[0];
        const timeSignatureDenominator = Math.pow(2, meta.data[1]);
        expect(timeSignatureNumerator).toEqual(3);
        expect(timeSignatureDenominator).toEqual(4);
    });
});
//# sourceMappingURL=MidiFileGenerator.test.js.map