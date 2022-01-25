import { Tuning } from '@src/model/Tuning';
import { ModelUtils } from '@src/model/ModelUtils';
describe('TuningParserTest', () => {
    it('standard', () => {
        let standard = Tuning.getDefaultTuningFor(6);
        let tuningText = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2'];
        let tuning = new Array(tuningText.length);
        let tuningText2 = new Array(tuningText.length);
        for (let i = 0; i < tuningText.length; i++) {
            tuning[i] = ModelUtils.getTuningForText(tuningText[i]);
            tuningText2[i] = Tuning.getTextForTuning(tuning[i], true);
        }
        expect(tuning.join(',')).toEqual(standard.tunings.join(','));
        expect(tuningText2.join(',')).toEqual(tuningText.join(','));
    });
});
//# sourceMappingURL=TuningParser.test.js.map