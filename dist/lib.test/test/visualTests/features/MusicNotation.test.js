var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LayoutMode } from '@src/LayoutMode';
import { StaveProfile } from '@src/StaveProfile';
import { Settings } from '@src/Settings';
import { VisualTestHelper } from '@test/visualTests/VisualTestHelper';
import { NotationElement } from '@src/NotationSettings';
describe('MusicNotationTests', () => {
    it('clefs', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Score;
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.ScoreAlbum, false);
        settings.notation.elements.set(NotationElement.ScoreArtist, false);
        settings.notation.elements.set(NotationElement.ScoreCopyright, false);
        settings.notation.elements.set(NotationElement.ScoreMusic, false);
        settings.notation.elements.set(NotationElement.ScoreSubTitle, false);
        settings.notation.elements.set(NotationElement.ScoreTitle, false);
        settings.notation.elements.set(NotationElement.ScoreWords, false);
        settings.notation.elements.set(NotationElement.ScoreWordsAndMusic, false);
        yield VisualTestHelper.runVisualTest('music-notation/clefs.gp', settings);
    }));
    it('key-signatures', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Score;
        yield VisualTestHelper.runVisualTest('music-notation/key-signatures.gp', settings);
    }));
    it('time-signatures', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Score;
        yield VisualTestHelper.runVisualTest('music-notation/time-signatures.gp', settings);
    }));
    it('notes-rests-beams', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Score;
        yield VisualTestHelper.runVisualTest('music-notation/notes-rests-beams.gp', settings);
    }));
    it('accidentals', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Score;
        yield VisualTestHelper.runVisualTest('music-notation/accidentals.gp', settings, undefined, undefined, 2.5);
    }));
    it('forced-accidentals', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Score;
        yield VisualTestHelper.runVisualTest('music-notation/forced-accidentals.gp', settings, [0, 1]);
    }));
    it('beams-advanced', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.barsPerRow = 4;
        yield VisualTestHelper.runVisualTest('music-notation/beams-advanced.gp', settings);
    }));
    it('rest-collisions', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('music-notation/rest-collisions.gp');
    }));
});
//# sourceMappingURL=MusicNotation.test.js.map