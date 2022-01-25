var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { StaveProfile } from '@src/StaveProfile';
import { TabRhythmMode } from '@src/NotationSettings';
import { Settings } from '@src/Settings';
import { VisualTestHelper } from '@test/visualTests/VisualTestHelper';
describe('GuitarTabsTests', () => {
    it('rhythm', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Tab;
        settings.notation.rhythmMode = TabRhythmMode.ShowWithBars;
        yield VisualTestHelper.runVisualTest('guitar-tabs/rhythm.gp', settings);
    }));
    it('rhythm-with-beams', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Tab;
        settings.notation.rhythmMode = TabRhythmMode.ShowWithBeams;
        yield VisualTestHelper.runVisualTest('guitar-tabs/rhythm-with-beams.gp', settings);
    }));
    it('string-variations', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Tab;
        yield VisualTestHelper.runVisualTest('guitar-tabs/string-variations.gp', settings);
    }));
});
//# sourceMappingURL=GuitarTabs.test.js.map