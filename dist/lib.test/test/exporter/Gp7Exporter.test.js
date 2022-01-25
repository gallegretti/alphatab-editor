var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Gp7Importer } from '@src/importer/Gp7Importer';
import { ByteBuffer } from '@src/io/ByteBuffer';
import { Settings } from '@src/Settings';
import { TestPlatform } from '@test/TestPlatform';
import { Gp7Exporter } from '@src/exporter/Gp7Exporter';
import { JsonConverter } from '@src/model/JsonConverter';
import { ScoreLoader } from '@src/importer/ScoreLoader';
import { ComparisonHelpers } from '@test/model/ComparisonHelpers';
import { AlphaTexImporter } from '@src/importer/AlphaTexImporter';
describe('Gp7ExporterTest', () => {
    const loadScore = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield TestPlatform.loadFile('test-data/' + name);
        try {
            return ScoreLoader.loadScoreFromBytes(data);
        }
        catch (e) {
            return null;
        }
    });
    const prepareGp7ImporterWithBytes = (buffer) => {
        let readerBase = new Gp7Importer();
        readerBase.init(ByteBuffer.fromBuffer(buffer), new Settings());
        return readerBase;
    };
    const exportGp7 = (score) => {
        return new Gp7Exporter().export(score, null);
    };
    const testRoundTripEqual = (name, ignoreKeys = null) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const expected = yield loadScore(name);
            if (!expected) {
                return;
            }
            const fileName = name.substr(name.lastIndexOf('/') + 1);
            const exported = exportGp7(expected);
            const actual = prepareGp7ImporterWithBytes(exported).readScore();
            const expectedJson = JsonConverter.scoreToJsObject(expected);
            const actualJson = JsonConverter.scoreToJsObject(actual);
            if (!ComparisonHelpers.expectJsonEqual(expectedJson, actualJson, '<' + fileName + '>', ignoreKeys)) {
                yield TestPlatform.saveFile(fileName, exported);
            }
        }
        catch (e) {
            fail(e);
        }
    });
    const testRoundTripFolderEqual = (name) => __awaiter(void 0, void 0, void 0, function* () {
        const files = yield TestPlatform.listDirectory(`test-data/${name}`);
        for (const file of files) {
            yield testRoundTripEqual(`${name}/${file}`, null);
        }
    });
    // Note: we just test all our importer and visual tests to cover all features
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
    it('gp5-to-gp7', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripEqual(`conversion/full-song.gp5`, [
            'accidentalMode',
            'percussionArticulations',
            'automations' // volume automations are not yet supported in gpif
        ]);
    }));
    it('gp6-to-gp7', () => __awaiter(void 0, void 0, void 0, function* () {
        yield testRoundTripEqual(`conversion/full-song.gpx`, [
            'accidentalMode',
            'percussionArticulations',
            'percussionArticulation', // gets added
        ]);
    }));
    it('alphatex-to-gp7', () => {
        const tex = `\\title "Canon Rock"
        \\subtitle "JerryC"
        \\tempo 90
        .
        :2 19.2{v f} 17.2{v f} | 
        15.2{v f} 14.2{v f}| 
        12.2{v f} 10.2{v f}| 
        12.2{v f} 14.2{v f}.4 :8 15.2 17.2 |
        14.1.2 :8 17.2 15.1 14.1{h} 17.2 | 
        15.2{v d}.4 :16 17.2{h} 15.2 :8 14.2 14.1 17.1{b(0 4 4 0)}.4 |
        15.1.8 :16 14.1{tu 3} 15.1{tu 3} 14.1{tu 3} :8 17.2 15.1 14.1 :16 12.1{tu 3} 14.1{tu 3} 12.1{tu 3} :8 15.2 14.2 | 
        12.2 14.3 12.3 15.2 :32 14.2{h} 15.2{h} 14.2{h} 15.2{h}14.2{h} 15.2{h}14.2{h} 15.2{h}14.2{h} 15.2{h}14.2{h} 15.2{h}14.2{h} 15.2{h}14.2{h} 15.2{h}
        `;
        const importer = new AlphaTexImporter();
        importer.initFromString(tex, new Settings());
        const expected = importer.readScore();
        const exported = exportGp7(expected);
        const actual = prepareGp7ImporterWithBytes(exported).readScore();
        const expectedJson = JsonConverter.scoreToJsObject(expected);
        const actualJson = JsonConverter.scoreToJsObject(actual);
        ComparisonHelpers.expectJsonEqual(expectedJson, actualJson, '<alphatex>', ['accidentalMode']);
    });
});
//# sourceMappingURL=Gp7Exporter.test.js.map