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
describe('EffectsAndAnnotationsTests', () => {
    it('markers', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/markers.gp');
    }));
    it('tempo', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/tempo.gp');
    }));
    it('text', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/text.gp');
    }));
    it('chords', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/chords.gp');
    }));
    it('vibrato', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/vibrato.gp');
    }));
    it('dynamics', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/dynamics.gp');
    }));
    it('tap', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/tap.gp');
    }));
    it('fade-in', () => __awaiter(void 0, void 0, void 0, function* () {
        // quadratic curve rendering in SkiaSharp is edgy with m80,
        // tolerance compensates this
        yield VisualTestHelper.runVisualTest('effects-and-annotations/fade-in.gp', undefined, undefined, undefined, 2);
    }));
    it('let-ring', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/let-ring.gp');
    }));
    it('palm-mute', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/palm-mute.gp');
    }));
    it('bends', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/bends.gp');
    }));
    it('tremolo-bar', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/tremolo-bar.gp');
    }));
    it('tremolo-picking', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/tremolo-picking.gp');
    }));
    it('brush', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/brush.gp');
    }));
    it('slides', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/slides.gp');
    }));
    it('trill', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/trill.gp');
    }));
    it('pickStroke', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/pick-stroke.gp');
    }));
    it('tuplets', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/tuplets.gp');
    }));
    it('tuplets-advanced', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/tuplets-advanced.gp', undefined, [0, 1, 2]);
    }));
    it('fingering', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/fingering.gp');
    }));
    it('triplet-feel', () => __awaiter(void 0, void 0, void 0, function* () {
        yield VisualTestHelper.runVisualTest('effects-and-annotations/triplet-feel.gp');
    }));
});
//# sourceMappingURL=EffectsAndAnnotations.test.js.map