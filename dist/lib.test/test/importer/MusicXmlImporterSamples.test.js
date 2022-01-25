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
describe('MusicXmlImporterSamplesTests', () => {
    it('BeetAnGeSample', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/BeetAnGeSample.xml');
    }));
    it('Binchois', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/Binchois.xml');
    }));
    it('BrahWiMeSample', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/BrahWiMeSample.xml');
    }));
    it('BrookeWestSample', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/BrookeWestSample.xml');
    }));
    it('Chant', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/Chant.xml');
    }));
    it('DebuMandSample', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/DebuMandSample.xml');
    }));
    it('Dichterliebe01', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/Dichterliebe01.xml');
    }));
    it('Echigo', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/Echigo.xml');
    }));
    it('FaurReveSample', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/FaurReveSample.xml');
    }));
    it('MahlFaGe4Sample', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/MahlFaGe4Sample.xml');
    }));
    it('MozaChloSample', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/MozaChloSample.xml');
    }));
    it('MozartPianoSonata', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/MozartPianoSonata.xml');
    }));
    it('MozartTrio', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/MozartTrio.xml');
    }));
    it('MozaVeilSample', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/MozaVeilSample.xml');
    }));
    it('Saltarello', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/Saltarello.xml');
    }));
    it('SchbAvMaSample', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/SchbAvMaSample.xml');
    }));
    it('Telemann', () => __awaiter(void 0, void 0, void 0, function* () {
        yield MusicXmlImporterTestHelper.testReferenceFile('test-data/musicxml-samples/Telemann.xml');
    }));
});
//# sourceMappingURL=MusicXmlImporterSamples.test.js.map