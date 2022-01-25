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
import { Settings } from '@src/Settings';
import { VisualTestHelper } from '@test/visualTests/VisualTestHelper';
import { TestPlatform } from '@test/TestPlatform';
import { ScoreLoader } from '@src/importer/ScoreLoader';
describe('NotationLegend', () => {
    it('full-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`full-default.png`, 1, -1, false); }));
    it('full-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`full-songbook.png`, 1, -1, true); }));
    it('bends-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`bends-default.png`, 1, 29, false); }));
    it('bends-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`bends-songbook.png`, 1, 29, true); }));
    it('grace-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`grace-default.png`, 30, 2, false); }));
    it('grace-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`grace-songbook.png`, 30, 2, true); }));
    it('vibrato-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`vibrato-default.png`, 32, 4, false); }));
    it('vibrato-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`vibrato-songbook.png`, 32, 4, true); }));
    it('multi-grace-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`multi-grace-default.png`, 36, 4, false); }));
    it('multi-grace-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`multi-grace-songbook.png`, 36, 4, true); }));
    it('pick-stroke-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`pick-stroke-default.png`, 40, 1, false); }));
    it('pick-stroke-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`pick-stroke-songbook.png`, 40, 1, true); }));
    it('slides-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`slides-default.png`, 41, 8, false); }));
    it('slides-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`slides-songbook.png`, 41, 8, true); }));
    it('hammer-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`hammer-default.png`, 49, 5, false); }));
    it('hammer-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`hammer-songbook.png`, 49, 5, true); }));
    it('accentuations-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`accentuations-default.png`, 54, 4, false); }));
    it('accentuations-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`accentuations-songbook.png`, 44, 4, true); }));
    it('trill-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`trill-default.png`, 58, 2, false); }));
    it('trill-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`trill-songbook.png`, 58, 2, true); }));
    it('dead-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`dead-default.png`, 60, 2, false); }));
    it('dead-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`dead-songbook.png`, 60, 2, true); }));
    it('harmonics-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`harmonics-default.png`, 62, 7, false); }));
    it('harmonics-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`harmonics-songbook.png`, 62, 7, true); }));
    it('repeat-bar-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`tap-riff-default.png`, 69, 4, false); }));
    it('repeat-bar-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`tap-riff-songbook.png`, 69, 4, true); }));
    it('multi-voice-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`multi-voice-default.png`, 73, 1, false); }));
    it('multi-voice-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`multi-voice-songbook.png`, 73, 1, true); }));
    it('arpeggio-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`arpeggio-default.png`, 74, 2, false); }));
    it('arpeggio-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`arpeggio-songbook.png`, 74, 2, true); }));
    it('triplet-feel-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`triplet-feel-default.png`, 76, 3, false); }));
    it('triplet-feel-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`triplet-feel-songbook.png`, 76, 3, true); }));
    it('ottavia-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`ottavia-default.png`, 79, 2, false); }));
    it('ottavia-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`ottavia-songbook.png`, 79, 2, true); }));
    it('crescendo-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`crescendo-default.png`, 81, 1, false); }));
    it('crescendo-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`crescendo-songbook.png`, 81, 1, true); }));
    it('tempo-change-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`tempo-change-default.png`, 81, 5, false); }));
    it('tempo-change-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`tempo-change-songbook.png`, 81, 5, true); }));
    it('slash-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`slash-default.png`, 86, 1, false); }));
    it('slash-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`slash-songbook.png`, 86, 1, true); }));
    it('text-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`text-default.png`, 87, 1, false); }));
    it('text-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`text-songbook.png`, 87, 1, true); }));
    it('chords-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`chords-default.png`, 88, 2, false); }));
    it('chords-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`chords-songbook.png`, 88, 2, true); }));
    it('staccatissimo-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`staccatissimo-default.png`, 90, 1, false); }));
    it('staccatissimo-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`staccatissimo-songbook.png`, 90, 1, true); }));
    it('wah-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`wah-default.png`, 91, 1, false); }));
    it('wah-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`wah-songbook.png`, 91, 1, true); }));
    it('dynamics-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`dynamics-default.png`, 92, 1, false); }));
    it('dynamics-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`dynamics-songbook.png`, 92, 1, true); }));
    it('sweep-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`sweep-default.png`, 93, 1, false); }));
    it('sweep-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`sweep-songbook.png`, 92, 1, true); }));
    it('fingering-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`fingering-default.png`, 94, 2, false, 'notation-legend.gp', 1.5); }));
    it('fingering-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`fingering-songbook.png`, 94, 2, true, 'notation-legend.gp', 1.5); }));
    it('whammy-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`whammy-default.png`, 96, 15, false); }));
    it('whammy-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`whammy-songbook.png`, 96, 15, true); }));
    it('let-ring-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`let-ring-default.png`, 111, 10, false); }));
    it('let-ring-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`let-ring-songbook.png`, 111, 10, true); }));
    it('mixed-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`mixed-default.png`, 121, 7, false); }));
    it('mixed-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`mixed-songbook.png`, 121, 7, true); }));
    it('tied-note-accidentals-default', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`tied-note-accidentals-default.png`, 1, -1, false, 'tied-note-accidentals.gp'); }));
    it('tied-note-accidentals-songbook', () => __awaiter(void 0, void 0, void 0, function* () { yield runNotationLegendTest(`tied-note-accidentals-songbook.png`, 1, -1, true, 'tied-note-accidentals.gp'); }));
    function runNotationLegendTest(referenceFileName, startBar, barCount, songBook, fileName = 'notation-legend.gp', tolerance = 1) {
        return __awaiter(this, void 0, void 0, function* () {
            let settings = new Settings();
            settings.display.layoutMode = LayoutMode.Horizontal;
            settings.display.startBar = startBar;
            settings.display.barCount = barCount;
            if (songBook) {
                settings.setSongBookModeSettings();
            }
            const inputFileData = yield TestPlatform.loadFile(`test-data/visual-tests/notation-legend/${fileName}`);
            let score = ScoreLoader.loadScoreFromBytes(inputFileData, settings);
            yield VisualTestHelper.runVisualTestScore(score, `notation-legend/${referenceFileName}`, settings, [0], undefined, tolerance);
        });
    }
});
//# sourceMappingURL=NotationLegend.test.js.map