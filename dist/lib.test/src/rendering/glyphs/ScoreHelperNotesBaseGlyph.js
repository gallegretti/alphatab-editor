import { Glyph } from '@src/rendering/glyphs/Glyph';
import { BeamDirection } from '@src/rendering/utils/BeamDirection';
import { TieGlyph } from './TieGlyph';
export class ScoreHelperNotesBaseGlyph extends Glyph {
    constructor() {
        super(...arguments);
        this.BendNoteHeads = [];
    }
    drawBendSlur(canvas, x1, y1, x2, y2, down, scale, slurText) {
        TieGlyph.drawBendSlur(canvas, x1, y1, x2, y2, down, scale, slurText);
    }
    doLayout() {
        super.doLayout();
        this.width = 0;
        for (let noteHeads of this.BendNoteHeads) {
            noteHeads.doLayout();
            this.width += noteHeads.width + 10 * this.scale;
        }
    }
    getTieDirection(beat, noteRenderer) {
        // invert direction (if stems go up, ties go down to not cross them)
        switch (noteRenderer.getBeatDirection(beat)) {
            case BeamDirection.Up:
                return BeamDirection.Down;
            default:
                return BeamDirection.Up;
        }
    }
}
ScoreHelperNotesBaseGlyph.EndPadding = ((10 / 2) | 0) + 3;
//# sourceMappingURL=ScoreHelperNotesBaseGlyph.js.map