import { CrescendoType } from '@src/model/CrescendoType';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { GroupedEffectGlyph } from '@src/rendering/glyphs/GroupedEffectGlyph';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
export class CrescendoGlyph extends GroupedEffectGlyph {
    constructor(x, y, crescendo) {
        super(BeatXPosition.EndBeat);
        this._crescendo = CrescendoType.None;
        this._crescendo = crescendo;
        this.x = x;
        this.y = y;
    }
    doLayout() {
        super.doLayout();
        this.height = 17 * this.scale;
    }
    paintGrouped(cx, cy, endX, canvas) {
        let startX = cx + this.x;
        let height = this.height * this.scale;
        canvas.beginPath();
        if (this._crescendo === CrescendoType.Crescendo) {
            endX -= CrescendoGlyph.Padding * this.scale;
            canvas.moveTo(endX, cy + this.y);
            canvas.lineTo(startX, cy + this.y + height / 2);
            canvas.lineTo(endX, cy + this.y + height);
        }
        else {
            endX -= CrescendoGlyph.Padding * this.scale;
            canvas.moveTo(startX, cy + this.y);
            canvas.lineTo(endX, cy + this.y + height / 2);
            canvas.lineTo(startX, cy + this.y + height);
        }
        canvas.stroke();
    }
}
CrescendoGlyph.Padding = (NoteHeadGlyph.QuarterNoteHeadWidth / 2) | 0;
//# sourceMappingURL=CrescendoGlyph.js.map