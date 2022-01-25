import { VibratoType } from '@src/model/VibratoType';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { GroupedEffectGlyph } from '@src/rendering/glyphs/GroupedEffectGlyph';
export class BeatVibratoGlyph extends GroupedEffectGlyph {
    constructor(type) {
        super(BeatXPosition.EndBeat);
        this._stepSize = 0;
        this._type = type;
    }
    doLayout() {
        super.doLayout();
        switch (this._type) {
            case VibratoType.Slight:
                this._stepSize = 12 * this.scale;
                break;
            case VibratoType.Wide:
                this._stepSize = 23 * this.scale;
                break;
        }
        this.height = 18 * this.scale;
    }
    paintGrouped(cx, cy, endX, canvas) {
        let startX = cx + this.x;
        let width = endX - startX;
        let loops = Math.max(1, width / this._stepSize);
        canvas.beginPath();
        canvas.moveTo(startX, cy + this.y);
        for (let i = 0; i < loops; i++) {
            canvas.lineTo(startX + this._stepSize / 2, cy + this.y + this.height);
            canvas.lineTo(startX + this._stepSize, cy + this.y);
            startX += this._stepSize;
        }
        canvas.stroke();
    }
}
//# sourceMappingURL=BeatVibratoGlyph.js.map