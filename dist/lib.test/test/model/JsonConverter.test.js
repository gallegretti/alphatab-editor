var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LayoutMode } from "@src/LayoutMode";
import { LogLevel } from "@src/LogLevel";
import { StaveProfile } from "@src/StaveProfile";
import { Settings } from "@src/Settings";
import { SettingsSerializer } from "@src/generated/SettingsSerializer";
import { ScoreLoader } from "@src/importer/ScoreLoader";
import { Color } from "@src/model/Color";
import { Font, FontStyle } from "@src/model/Font";
import { JsonConverter } from "@src/model/JsonConverter";
import { NotationElement, TabRhythmMode, NotationMode, FingeringMode } from "@src/NotationSettings";
import { TestPlatform } from "@test/TestPlatform";
import { ComparisonHelpers } from "./ComparisonHelpers";
describe('JsonConverterTest', () => {
    const loadScore = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield TestPlatform.loadFile('test-data/' + name);
        try {
            return ScoreLoader.loadScoreFromBytes(data);
        }
        catch (e) {
            return null;
        }
    });
    const testRoundTripEqual = (name) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const expected = yield loadScore(name);
            if (!expected) {
                return;
            }
            const expectedJson = JsonConverter.scoreToJsObject(expected);
            const actual = JsonConverter.jsObjectToScore(expectedJson);
            const actualJson = JsonConverter.scoreToJsObject(actual);
            ComparisonHelpers.expectJsonEqual(expectedJson, actualJson, '<' + name.substr(name.lastIndexOf('/') + 1) + '>', null);
        }
        catch (e) {
            fail(e);
        }
    });
    const testRoundTripFolderEqual = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const files = yield TestPlatform.listDirectory(`test-data/${name}`);
        for (const file of files) {
            yield testRoundTripEqual(`${name}/${file}`);
        }
    });
    it('importer', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripFolderEqual('guitarpro7');
    }));
    it('visual-effects-and-annotations', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripFolderEqual('visual-tests/effects-and-annotations');
    }));
    it('visual-general', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripFolderEqual('visual-tests/general');
    }));
    it('visual-guitar-tabs', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripFolderEqual('visual-tests/guitar-tabs');
    }));
    it('visual-layout', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripFolderEqual('visual-tests/layout');
    }));
    it('visual-music-notation', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripFolderEqual('visual-tests/music-notation');
    }));
    it('visual-notation-legend', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripFolderEqual('visual-tests/notation-legend');
    }));
    it('visual-special-notes', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripFolderEqual('visual-tests/special-notes');
    }));
    it('visual-special-tracks', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripFolderEqual('visual-tests/special-tracks');
    }));
    it('settings', () => {
        const expected = new Settings();
        // here we modifiy some properties of each level and some special ones additionally
        // to ensure all properties are considered properly
        /**@target web*/
        expected.core.scriptFile = 'script';
        /**@target web*/
        expected.core.fontDirectory = 'font';
        /**@target web*/
        expected.core.tex = true;
        /**@target web*/
        expected.core.tracks = [1, 2, 3];
        expected.core.enableLazyLoading = false;
        expected.core.engine = "engine";
        expected.core.logLevel = LogLevel.Error;
        expected.core.useWorkers = false;
        expected.core.includeNoteBounds = true;
        expected.display.scale = 10;
        expected.display.stretchForce = 2;
        expected.display.staveProfile = StaveProfile.ScoreTab;
        expected.display.barCountPerPartial = 14;
        expected.display.resources.copyrightFont = new Font('copy', 15, FontStyle.Plain);
        expected.display.resources.staffLineColor = new Color(255, 0, 0, 100);
        expected.display.padding = [1, 2, 3, 4];
        expected.notation.notationMode = NotationMode.SongBook;
        expected.notation.fingeringMode = FingeringMode.ScoreForcePiano;
        expected.notation.elements.set(NotationElement.EffectCapo, false);
        expected.notation.elements.set(NotationElement.ZerosOnDiveWhammys, true);
        expected.notation.rhythmMode = TabRhythmMode.ShowWithBars;
        expected.notation.rhythmHeight = 100;
        expected.notation.transpositionPitches = [1, 2, 3, 4];
        expected.notation.displayTranspositionPitches = [5, 6, 7, 8];
        expected.notation.extendBendArrowsOnTiedNotes = false;
        expected.notation.extendLineEffectsToBeatEnd = true;
        expected.notation.slurHeight = 50;
        expected.importer.encoding = 'enc';
        expected.importer.mergePartGroupsInMusicXml = false;
        expected.player.soundFont = 'soundfont';
        expected.player.scrollElement = 'scroll';
        expected.player.vibrato.noteSlightAmplitude = 10;
        expected.player.slide.simpleSlideDurationRatio = 8;
        const expectedJson = JsonConverter.settingsToJsObject(expected);
        const actual = JsonConverter.jsObjectToSettings(expectedJson);
        const actualJson = JsonConverter.settingsToJsObject(actual);
        ComparisonHelpers.expectJsonEqual(expectedJson, actualJson, '', null);
    });
    it('settings-from-map', () => {
        const settings = new Settings();
        const raw = new Map();
        // json_on_parent
        raw.set('enableLazyLoading', false);
        // string enum 
        raw.set('logLevel', 'error');
        raw.set('displayLayoutMode', 1.0);
        // nested
        const display = new Map();
        display.set('scale', 5.0);
        raw.set('display', display);
        // json_partial_names
        raw.set('notationRhythmMode', 'sHoWWITHbArs');
        // immutable
        raw.set('displayResourcesCopyrightFont', 'italic 18px Roboto');
        SettingsSerializer.fromJson(settings, raw);
        expect(settings.core.enableLazyLoading).toEqual(false);
        expect(settings.core.logLevel).toEqual(LogLevel.Error);
        expect(settings.display.layoutMode).toEqual(LayoutMode.Horizontal);
        expect(settings.display.scale).toEqual(5);
        expect(settings.notation.rhythmMode).toEqual(TabRhythmMode.ShowWithBars);
        expect(settings.display.resources.copyrightFont.family).toEqual('Roboto');
        expect(settings.display.resources.copyrightFont.size).toEqual(18);
        expect(settings.display.resources.copyrightFont.style).toEqual(FontStyle.Italic);
    });
    /*@target web*/
    it('settings-from-object', () => {
        const settings = new Settings();
        const raw = {
            // json_on_parent
            enableLazyLoading: false,
            // string enum 
            logLevel: 'error',
            displayLayoutMode: 1.0,
            // nested
            display: {
                scale: 5.0
            },
            // json_partial_names
            notationRhythmMode: 'sHoWWITHbArs',
            // immutable
            displayResourcesCopyrightFont: 'italic 18px Roboto'
        };
        SettingsSerializer.fromJson(settings, raw);
        expect(settings.core.enableLazyLoading).toEqual(false);
        expect(settings.core.logLevel).toEqual(LogLevel.Error);
        expect(settings.display.layoutMode).toEqual(LayoutMode.Horizontal);
        expect(settings.display.scale).toEqual(5);
        expect(settings.notation.rhythmMode).toEqual(TabRhythmMode.ShowWithBars);
        expect(settings.display.resources.copyrightFont.family).toEqual('Roboto');
        expect(settings.display.resources.copyrightFont.size).toEqual(18);
        expect(settings.display.resources.copyrightFont.style).toEqual(FontStyle.Italic);
    });
});
//# sourceMappingURL=JsonConverter.test.js.map