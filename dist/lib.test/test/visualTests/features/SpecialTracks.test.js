var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { VisualTestHelper } from '@test/visualTests/VisualTestHelper';
describe('SpecialTracksTests', () => {
    it('drum-tabs', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('special-tracks/drum-tabs.gp');
    }));
    it('percussion', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('special-tracks/percussion.gp', undefined, [0, 1, 2]);
    }));
    it('grand-staff', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('special-tracks/grand-staff.gp');
    }));
});
//# sourceMappingURL=SpecialTracks.test.js.map