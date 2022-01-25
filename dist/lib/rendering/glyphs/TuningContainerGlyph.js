import { TextAlign } from '@src/platform/ICanvas';
import { RowContainerGlyph } from './RowContainerGlyph';
import { TuningGlyph } from './TuningGlyph';
export class TuningContainerGlyph extends RowContainerGlyph {
    constructor(x, y) {
        super(x, y, TextAlign.Left);
    }
    addTuning(tuning, trackLabel) {
        if (tuning.tunings.length > 0) {
            let tuningGlyph = new TuningGlyph(0, 0, tuning, trackLabel);
            tuningGlyph.renderer = this.renderer;
            tuningGlyph.doLayout();
            this.glyphs.push(tuningGlyph);
        }
    }
}
//# sourceMappingURL=TuningContainerGlyph.js.map