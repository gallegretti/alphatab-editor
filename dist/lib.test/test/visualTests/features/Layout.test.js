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
describe('LayoutTests', () => {
    it('pageLayout', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('layout/page-layout.gp');
    }));
    it('multi-track', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('layout/multi-track.gp', undefined, [0, 3]);
    }));
    it('multi-voice', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('layout/multi-voice.gp');
    }));
    it('page-layout-5barsperrow', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.display.barsPerRow = 5;
        yield VisualTestHelper.runVisualTest('layout/page-layout-5barsperrow.gp', settings);
    }));
    it('page-layout-bar5to8', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Page;
        settings.display.startBar = 5;
        settings.display.barCount = 4;
        yield VisualTestHelper.runVisualTest('layout/page-layout-5to8.gp', settings, undefined, undefined, 1.5);
    }));
    it('horizontal-layout', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Horizontal;
        yield VisualTestHelper.runVisualTest('layout/horizontal-layout.gp', settings);
    }));
    it('horizontal-layout-bar5to8', () => __awaiter(void 0, void 0, void 0, function* () {
        let settings = new Settings();
        settings.display.layoutMode = LayoutMode.Horizontal;
        settings.display.startBar = 5;
        settings.display.barCount = 4;
        yield VisualTestHelper.runVisualTest('layout/horizontal-layout-5to8.gp', settings);
    }));
});
//# sourceMappingURL=Layout.test.js.map