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
import { NotationElement } from '@src/NotationSettings';
describe('NotationElements', () => {
    it('score-info', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `\\album "Album" \\artist "Artist" \\copyright "Copyright" \\music "Music" \\subtitle "Subtitle" \\title "Title" \\words "Words" . 3.3*4`;
        const allKeys = [
            NotationElement.ScoreAlbum,
            NotationElement.ScoreArtist,
            NotationElement.ScoreCopyright,
            NotationElement.ScoreMusic,
            NotationElement.ScoreSubTitle,
            NotationElement.ScoreTitle,
            NotationElement.ScoreWords,
            NotationElement.ScoreWordsAndMusic
        ];
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        for (const k of allKeys) {
            settings.notation.elements.set(k, false);
        }
        const testCases = new Map();
        testCases.set(NotationElement.ScoreAlbum, 'album');
        testCases.set(NotationElement.ScoreArtist, 'artist');
        testCases.set(NotationElement.ScoreCopyright, 'copyright');
        testCases.set(NotationElement.ScoreMusic, 'music');
        testCases.set(NotationElement.ScoreSubTitle, 'subtitle');
        testCases.set(NotationElement.ScoreTitle, 'title');
        testCases.set(NotationElement.ScoreWords, 'words');
        for (const element of allKeys.filter(k => testCases.has(k))) {
            for (const k of allKeys) {
                settings.notation.elements.set(k, false);
            }
            settings.notation.elements.set(element, true);
            const referenceName = testCases.get(element);
            yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/score-info-${referenceName}.png`, settings, undefined, referenceName);
        }
        for (const k of allKeys) {
            settings.notation.elements.set(k, false);
        }
        settings.notation.elements.set(NotationElement.ScoreWordsAndMusic, true);
        yield VisualTestHelper.runVisualTestTex(`\\album "Album" \\artist "Artist" \\copyright "Copyright" \\music "WordsAndMusic" \\subtitle "Subtitle" \\title "Title" \\words "WordsAndMusic" . 3.3*4`, `notation-elements/score-info-words-and-music.png`, settings, undefined, 'words-and-music');
        // default is all true
        settings.notation.elements.clear();
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/score-info-all.png`, settings, undefined, 'all');
    }));
    it('guitar-tuning-on', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `\\tuning e5 b4 g4 d4 a3 d3 . 3.3*4`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.GuitarTuning, true);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/guitar-tuning-on.png`, settings);
    }));
    it('guitar-tuning-off', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `\\tuning d5 b4 g4 d4 a3 d3 . 3.3*4`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.GuitarTuning, false);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/guitar-tuning-off.png`, settings);
    }));
    it('track-names-off', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `\\track "Track Name" 3.3*4`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.TrackNames, false);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/track-names-off.png`, settings);
    }));
    it('track-names-on', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `\\track "Track Name" 3.3*4`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.TrackNames, true);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/track-names-on.png`, settings);
    }));
    it('chord-diagrams-off', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `\\chord "C" 0 1 0 2 3 x . (0.1 1.2 0.3 2.4 3.5){ch "C"}`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.ChordDiagrams, false);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/chord-diagrams-off.png`, settings);
    }));
    it('chord-diagrams-on', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `\\chord "C" 0 1 0 2 3 x . (0.1 1.2 0.3 2.4 3.5){ch "C"}`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.ChordDiagrams, true);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/chord-diagrams-on.png`, settings);
    }));
    it('parenthesis-on-tied-bends-off', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `3.3{b (0 4 )} -.3`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.ParenthesisOnTiedBends, false);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/parenthesis-on-tied-bends-off.png`, settings);
    }));
    it('parenthesis-on-tied-bends-on', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `3.3{b (0 4 )} -.3`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.ParenthesisOnTiedBends, true);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/parenthesis-on-tied-bends-on.png`, settings);
    }));
    it('tab-notes-on-tied-bends-off', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `3.3{b (0 4 )} -.3{b (4 8)}`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.TabNotesOnTiedBends, false);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/tab-notes-on-tied-bends-off.png`, settings);
    }));
    it('tab-notes-on-tied-bends-on', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `3.3{b (0 4 )} -.3{b (4 8)}`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.TabNotesOnTiedBends, true);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/tab-notes-on-tied-bends-on.png`, settings);
    }));
    it('zeros-on-dive-whammys-off', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `3.3.1{tb (0 -4)}`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.ZerosOnDiveWhammys, false);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/zeros-on-dive-whammys-off.png`, settings);
    }));
    it('zeros-on-dive-whammys-on', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `3.3.1{tb (0 -4)}`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.ZerosOnDiveWhammys, true);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/zeros-on-dive-whammys-on.png`, settings);
    }));
    it('effects-off', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `. \\tempo 180 \\tf t16 3.3*4 | \\tempo 60 \\tf d16 3.3*4`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.EffectTempo, false);
        settings.notation.elements.set(NotationElement.EffectTripletFeel, false);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/effects-off.png`, settings);
    }));
    it('effects-on', () => __awaiter(void 0, void 0, void 0, function* () {
        const tex = `. \\tempo 180 \\tf t16 3.3*4 | \\tempo 60 \\tf d16 3.3*4`;
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.notation.elements.set(NotationElement.EffectTempo, true);
        settings.notation.elements.set(NotationElement.EffectTripletFeel, true);
        yield VisualTestHelper.runVisualTestTex(tex, `notation-elements/effects-on.png`, settings);
    }));
});
//# sourceMappingURL=NotationElements.test.js.map