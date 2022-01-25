var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GpxFileSystem } from '@src/importer/GpxFileSystem';
import { GpxImporter } from '@src/importer/GpxImporter';
import { ByteBuffer } from '@src/io/ByteBuffer';
import { Settings } from '@src/Settings';
import { Logger } from '@src/Logger';
import { GpImporterTestHelper } from '@test/importer/GpImporterTestHelper';
import { TestPlatform } from '@test/TestPlatform';
describe('GpxImporterTest', () => {
    const prepareGpxImporterWithFile = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield TestPlatform.loadFile('test-data/' + name);
        return prepareGpxImporterWithBytes(data);
    });
    const prepareGpxImporterWithBytes = (buffer) => {
        let readerBase = new GpxImporter();
        readerBase.init(ByteBuffer.fromBuffer(buffer), new Settings());
        return readerBase;
    };
    it('file-system-compressed', () => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield TestPlatform.loadFile('test-data/guitarpro6/file-system-compressed.gpx');
        let fileSystem = new GpxFileSystem();
        fileSystem.load(ByteBuffer.fromBuffer(data));
        let names = [
            'score.gpif',
            'misc.xml',
            'BinaryStylesheet',
            'PartConfiguration',
            'LayoutConfiguration'
        ];
        let sizes = [8488, 130, 12204, 20, 12];
        for (let i = 0; i < fileSystem.files.length; i++) {
            let file = fileSystem.files[i];
            Logger.info('Test', `${file.fileName} - ${file.fileSize}`);
            expect(file.fileName).toEqual(names[i]);
            expect(file.fileSize).toEqual(sizes[i]);
        }
    }));
    it('score-info', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/score-info.gpx');
        let score = reader.readScore();
        expect(score.title).toEqual('Title');
        expect(score.subTitle).toEqual('Subtitle');
        expect(score.artist).toEqual('Artist');
        expect(score.album).toEqual('Album');
        expect(score.words).toEqual('Words');
        expect(score.music).toEqual('Music');
        expect(score.copyright).toEqual('Copyright');
        expect(score.tab).toEqual('Tab');
        expect(score.instructions).toEqual('Instructions');
        expect(score.notices).toEqual('Notice1\nNotice2');
        expect(score.masterBars.length).toEqual(5);
        expect(score.tracks.length).toEqual(2);
        expect(score.tracks[0].name).toEqual('Track 1');
        expect(score.tracks[1].name).toEqual('Track 2');
    }));
    it('notes', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/notes.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkNotes(score);
    }));
    it('time-signatures', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/time-signatures.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkTimeSignatures(score);
    }));
    it('dead', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/dead.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkDead(score);
    }));
    it('grace', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/grace.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkGrace(score);
    }));
    it('accentuations', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/accentuations.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkAccentuations(score, true);
    }));
    it('harmonics', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/harmonics.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkHarmonics(score);
    }));
    it('hammer', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/hammer.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkHammer(score);
    }));
    it('bends', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/bends.gpx');
        let score = reader.readScore();
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0].bendPoints.length).toEqual(2);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0].bendPoints[0].offset).toBeCloseTo(0);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0].bendPoints[0].value).toEqual(0);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0].bendPoints[1].offset).toBeCloseTo(60);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].notes[0].bendPoints[1].value).toEqual(4);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[1].notes[0].bendPoints.length).toEqual(2);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[1].notes[0].bendPoints[0].offset).toBeCloseTo(0);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[1].notes[0].bendPoints[0].value).toEqual(0);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[1].notes[0].bendPoints[1].offset).toBeCloseTo(60);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[1].notes[0].bendPoints[1].value).toEqual(4);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].notes[0].bendPoints.length).toEqual(3);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].notes[0].bendPoints[0].offset).toBeCloseTo(0);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].notes[0].bendPoints[0].value).toEqual(0);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].notes[0].bendPoints[0].offset).toBeCloseTo(0);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].notes[0].bendPoints[0].value).toEqual(0);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].notes[0].bendPoints[1].offset).toBeCloseTo(30);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].notes[0].bendPoints[1].value).toEqual(12);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].notes[0].bendPoints[2].offset).toBeCloseTo(60);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].notes[0].bendPoints[2].value).toEqual(6);
    }));
    it('tremolo', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/tremolo.gpx');
        let score = reader.readScore();
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].whammyBarPoints.length).toEqual(3);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].whammyBarPoints[0].offset).toBeCloseTo(0);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].whammyBarPoints[0].value).toEqual(0);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].whammyBarPoints[1].offset).toBeCloseTo(30);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].whammyBarPoints[1].value).toEqual(-4);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].whammyBarPoints[2].offset).toBeCloseTo(60);
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].whammyBarPoints[2].value).toEqual(0);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].whammyBarPoints.length).toEqual(2);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].whammyBarPoints[0].offset).toBeCloseTo(0);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].whammyBarPoints[0].value).toEqual(-4);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].whammyBarPoints[1].offset).toBeCloseTo(60);
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].whammyBarPoints[1].value).toEqual(0);
        expect(score.tracks[0].staves[0].bars[2].voices[0].beats[0].whammyBarPoints.length).toEqual(3);
        expect(score.tracks[0].staves[0].bars[2].voices[0].beats[0].whammyBarPoints[0].offset).toBeCloseTo(0);
        expect(score.tracks[0].staves[0].bars[2].voices[0].beats[0].whammyBarPoints[0].value).toEqual(0);
        expect(score.tracks[0].staves[0].bars[2].voices[0].beats[0].whammyBarPoints[1].offset).toBeCloseTo(30);
        expect(score.tracks[0].staves[0].bars[2].voices[0].beats[0].whammyBarPoints[1].value).toEqual(-4);
        expect(score.tracks[0].staves[0].bars[2].voices[0].beats[0].whammyBarPoints[2].offset).toBeCloseTo(60);
        expect(score.tracks[0].staves[0].bars[2].voices[0].beats[0].whammyBarPoints[2].value).toEqual(-4);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].whammyBarPoints.length).toEqual(4);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].whammyBarPoints[0].offset).toBeCloseTo(0);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].whammyBarPoints[0].value).toEqual(-4);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].whammyBarPoints[1].offset).toBeCloseTo(15);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].whammyBarPoints[1].value).toEqual(-12);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].whammyBarPoints[2].offset).toBeCloseTo(30.6);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].whammyBarPoints[2].value).toEqual(-12);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].whammyBarPoints[3].offset).toBeCloseTo(45);
        expect(score.tracks[0].staves[0].bars[3].voices[0].beats[0].whammyBarPoints[3].value).toEqual(0);
    }));
    it('slides', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/slides.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkSlides(score);
    }));
    it('vibrato', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/vibrato.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkVibrato(score, true);
    }));
    it('trills', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/trills.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkTrills(score);
    }));
    it('other-effects', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/other-effects.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkOtherEffects(score, true);
    }));
    it('fingering', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/fingering.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkFingering(score);
    }));
    it('stroke', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/strokes.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkStroke(score);
    }));
    it('tuplets', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/tuplets.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkTuplets(score);
    }));
    it('ranges', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/ranges.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkRanges(score);
    }));
    it('effects', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/effects.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkEffects(score);
    }));
    it('serenade', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/serenade.gpx');
        reader.readScore();
        // only Check reading
    }));
    it('strings', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/strings.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkStrings(score);
    }));
    it('key-signatures', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/key-signatures.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkKeySignatures(score);
    }));
    it('chords', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/chords.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkChords(score);
    }));
    it('colors', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield prepareGpxImporterWithFile('guitarpro6/colors.gpx');
        let score = reader.readScore();
        GpImporterTestHelper.checkColors(score);
    }));
});
//# sourceMappingURL=GpxImporter.test.js.map