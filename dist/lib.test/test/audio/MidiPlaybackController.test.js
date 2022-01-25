var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MidiPlaybackController } from '@src/midi/MidiPlaybackController';
import { AlphaTexImporter } from '@src/importer/AlphaTexImporter';
import { Settings } from '@src/Settings';
import { Logger } from '@src/Logger';
import { GpImporterTestHelper } from '@test/importer/GpImporterTestHelper';
describe('MidiPlaybackControllerTest', () => {
    const testRepeat = (score, expectedIndexes) => {
        let controller = new MidiPlaybackController(score);
        let i = 0;
        while (!controller.finished) {
            let index = controller.index;
            controller.processCurrent();
            if (controller.shouldPlay) {
                Logger.debug('Test', `Checking index ${i}, expected[${expectedIndexes[i]}]`, i, expectedIndexes[i]);
                expect(index).toEqual(expectedIndexes[i]);
                i++;
            }
            controller.moveNext();
        }
        expect(i).toEqual(expectedIndexes.length);
        expect(controller.finished).toBe(true);
    };
    it('repeat-close', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('audio/repeat-close.gp5');
        let score = reader.readScore();
        let expectedIndexes = [0, 1, 0, 1, 2];
        testRepeat(score, expectedIndexes);
    }));
    it('repeat-close-multi', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('audio/repeat-close-multi.gp5');
        let score = reader.readScore();
        let expectedIndexes = [0, 1, 0, 1, 0, 1, 0, 1, 2];
        testRepeat(score, expectedIndexes);
    }));
    it('repeat-close-without-start-at-beginning', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('audio/repeat-close-without-start-at-beginning.gp5');
        let score = reader.readScore();
        let expectedIndexes = [0, 1, 0, 1];
        testRepeat(score, expectedIndexes);
    }));
    it('repeat-close-alternate-endings', () => __awaiter(void 0, void 0, void 0, function* () {
        const reader = yield GpImporterTestHelper.prepareImporterWithFile('audio/repeat-close-alternate-endings.gp5');
        let score = reader.readScore();
        let expectedIndexes = [0, 1, 0, 2, 3, 0, 1, 0, 4];
        testRepeat(score, expectedIndexes);
    }));
    it('repeat-with-alphaTex', () => {
        let tex = '\\ro 1.3 2.3 3.3 4.3 | 5.3 6.3 7.3 8.3 | \\rc 2 1.3 2.3 3.3 4.3 | \\ro \\rc 3 1.3 2.3 3.3 4.3';
        let importer = new AlphaTexImporter();
        importer.initFromString(tex, new Settings());
        let score = importer.readScore();
        let playedBars = [];
        let controller = new MidiPlaybackController(score);
        while (!controller.finished) {
            let index = controller.index;
            playedBars.push(index);
            controller.processCurrent();
            controller.moveNext();
            if (playedBars.length > 50) {
                fail('Too many bars generated');
            }
        }
        let expectedBars = [0, 1, 2, 0, 1, 2, 3, 3, 3];
        expect(playedBars.join(',')).toEqual(expectedBars.join(','));
    });
});
//# sourceMappingURL=MidiPlaybackController.test.js.map