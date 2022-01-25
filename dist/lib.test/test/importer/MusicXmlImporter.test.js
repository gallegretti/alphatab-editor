var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { MusicXmlImporterTestHelper } from '@test/importer/MusicXmlImporterTestHelper';
describe('MusicXmlImporterTests', () => {
    it('track-volume', () => __awaiter(void 0, void 0, void 0, function* () {
        let score = yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml3/track-volume-balance.musicxml');
        expect(score.tracks[0].playbackInfo.volume).toBe(16);
        expect(score.tracks[1].playbackInfo.volume).toBe(12);
        expect(score.tracks[2].playbackInfo.volume).toBe(8);
        expect(score.tracks[3].playbackInfo.volume).toBe(4);
        expect(score.tracks[4].playbackInfo.volume).toBe(0);
    }));
    it('track-balance', () => __awaiter(void 0, void 0, void 0, function* () {
        let score = yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml3/track-volume-balance.musicxml');
        expect(score.tracks[0].playbackInfo.balance).toBe(0);
        expect(score.tracks[1].playbackInfo.balance).toBe(4);
        expect(score.tracks[2].playbackInfo.balance).toBe(8);
        expect(score.tracks[3].playbackInfo.balance).toBe(12);
        expect(score.tracks[4].playbackInfo.balance).toBe(16);
    }));
    it('full-bar-rest', () => __awaiter(void 0, void 0, void 0, function* () {
        let score = yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml3/full-bar-rest.musicxml');
        expect(score.tracks[0].staves[0].bars[0].voices[0].beats[0].isFullBarRest).toBeTrue();
        expect(score.tracks[0].staves[0].bars[1].voices[0].beats[0].isFullBarRest).toBeTrue();
        expect(score.tracks[0].staves[0].bars[2].voices[0].beats[0].isFullBarRest).toBeTrue();
    }));
});
//# sourceMappingURL=MusicXmlImporter.test.js.map