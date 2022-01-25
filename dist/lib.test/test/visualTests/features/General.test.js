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
import { Settings } from '@src/Settings';
import { VisualTestHelper } from '@test/visualTests/VisualTestHelper';
describe('GeneralTests', () => {
    it('song-details', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('general/song-details.gp');
    }));
    it('repeats', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Score;
        yield VisualTestHelper.runVisualTest('general/repeats.gp', settings);
    }));
    it('alternate-endings', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.staveProfile = StaveProfile.Score;
        yield VisualTestHelper.runVisualTest('general/alternate-endings.gp', settings, undefined, undefined, 1.5);
    }));
    it('tuning', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('general/tuning.gp');
    }));
});
//# sourceMappingURL=General.test.js.map