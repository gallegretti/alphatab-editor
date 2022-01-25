import { Glyph } from '@src/rendering/glyphs/Glyph';
import { TieGlyph } from '@src/rendering/glyphs/TieGlyph';
export class GhostParenthesisGlyph extends Glyph {
    constructor(isOpen) {
        super(0, 0);
        this._isOpen = isOpen;
    }
    doLayout() {
        super.doLayout();
        this.width = GhostParenthesisGlyph.Size * this.scale;
    }
    paint(cx, cy, canvas) {
        if (this._isOpen) {
            TieGlyph.paintTie(canvas, this.scale, cx + this.x + this.width, cy + this.y + this.height, cx + this.x + this.width, cy + this.y, false, 6, 3);
        }
        else {
            TieGlyph.paintTie(canvas, this.scale, cx + this.x, cy + this.y, cx + this.x, cy + this.y + this.height, false, 6, 3);
        }
    }
}
GhostParenthesisGlyph.Size = 6;
//# sourceMappingURL=GhostParenthesisGlyph.js.map