var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GpImporterTestHelper } from '@test/importer/GpImporterTestHelper';
describe('Gp4ImporterTest', () => {
    it('score-info', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/score-info.gp4');
        let score = reader.readScore();
        expect(score.title).toEqual('Title');
        expect(score.subTitle).toEqual('Subtitle');
        expect(score.artist).toEqual('Artist');
        expect(score.album).toEqual('Album');
        expect(score.words).toEqual('Music'); // no words in gp4
        expect(score.music).toEqual('Music');
        expect(score.copyright).toEqual('Copyright');
        expect(score.tab).toEqual('Tab');
        expect(score.instructions).toEqual('Instructions');
        expect(score.notices).toEqual('Notice1\r\nNotice2');
        expect(score.masterBars.length).toEqual(5);
        expect(score.tracks.length).toEqual(1);
        expect(score.tracks[0].name).toEqual('Track 1');
    }));
    it('notes', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/notes.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkNotes(score);
    }));
    it('time-signatures', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/time-signatures.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkTimeSignatures(score);
    }));
    it('dead', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/dead.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkDead(score);
    }));
    it('grace', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/grace.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkGrace(score);
    }));
    it('accentuations', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/accentuations.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkAccentuations(score, false);
    }));
    it('harmonics', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/harmonics.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkHarmonics(score);
    }));
    it('hammer', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/hammer.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkHammer(score);
    }));
    it('bend', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/bends.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkBend(score);
    }));
    it('tremolo', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/tremolo.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkTremolo(score);
    }));
    it('slides', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/slides.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkSlides(score);
    }));
    it('vibrato', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/vibrato.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkVibrato(score, true);
    }));
    it('trills', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/trills.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkTrills(score);
    }));
    it('otherEffects', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/other-effects.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkOtherEffects(score, false);
    }));
    it('fingering', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/fingering.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkFingering(score);
    }));
    it('stroke', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/strokes.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkStroke(score);
    }));
    it('tuplets', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/tuplets.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkTuplets(score);
    }));
    it('ranges', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/ranges.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkRanges(score);
    }));
    it('effects', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/effects.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkEffects(score);
    }));
    it('strings', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/strings.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkStrings(score);
    }));
    it('colors', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('guitarpro4/colors.gp4');
        let score = reader.readScore();
        GpImporterTestHelper.checkColors(score);
    }));
});
//# sourceMappingURL=Gp4Importer.test.js.map