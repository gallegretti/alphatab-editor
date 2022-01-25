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
describe('SpecialNotesTests', () => {
    it('tied-notes', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('special-notes/tied-notes.gp');
    }));
    it('grace-notes', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('special-notes/grace-notes.gp');
    }));
    it('grace-notes-advanced', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('special-notes/grace-notes-advanced.gp', undefined, [0, 1]);
    }));
    it('grace-resize', () => __awaiter(void 0, void 0, void 0, function* () {
        // grace resize regression: we have the repeating issue that 
        // grace notes flick around to wrong positions during resizes
        // due to wrong size registrations. (#604)
        yield VisualTestHelper.runVisualTest('special-notes/grace-notes-advanced.gp', undefined, [0, 1], undefined, 1, true);
    }));
    it('dead-notes', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('special-notes/dead-notes.gp');
    }));
    it('ghost-notes', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('special-notes/ghost-notes.gp');
    }));
});
//# sourceMappingURL=SpecialNotes.test.js.map