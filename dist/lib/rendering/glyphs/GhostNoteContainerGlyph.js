import { GhostParenthesisGlyph } from '@src/rendering/glyphs/GhostParenthesisGlyph';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { NotationElement } from '@src/NotationSettings';
export class GhostNoteInfo {
    constructor(line, isGhost) {
        this.line = 0;
        this.line = line;
        this.isGhost = isGhost;
    }
}
export class GhostNoteContainerGlyph extends Glyph {
    constructor(isOpen) {
        super(0, 0);
        this._infos = [];
        this._glyphs = [];
        this.isEmpty = true;
        this._isOpen = isOpen;
    }
    addParenthesis(n) {
        let sr = this.renderer;
        let line = sr.getNoteLine(n);
        let hasParenthesis = n.isGhost || (this.isTiedBend(n) && sr.settings.notation.isNotationElementVisible(NotationElement.ParenthesisOnTiedBends));
        this.addParenthesisOnLine(line, hasParenthesis);
    }
    addParenthesisOnLine(line, hasParenthesis) {
        let info = new GhostNoteInfo(line, hasParenthesis);
        this._infos.push(info);
        if (hasParenthesis) {
            this.isEmpty = false;
        }
    }
    isTiedBend(note) {
        if (note.isTieDestination) {
            if (note.tieOrigin.hasBend) {
                return true;
            }
            return this.isTiedBend(note.tieOrigin);
        }
        return false;
    }
    doLayout() {
        let sr = this.renderer;
        this._infos.sort((a, b) => {
            return a.line - b.line;
        });
        let previousGlyph = null;
        let sizePerLine = sr.getScoreHeight(1);
        for (let i = 0, j = this._infos.length; i < j; i++) {
            let g;
            if (!this._infos[i].isGhost) {
                previousGlyph = null;
            }
            else if (!previousGlyph) {
                g = new GhostParenthesisGlyph(this._isOpen);
                g.renderer = this.renderer;
                g.y = sr.getScoreY(this._infos[i].line) - sizePerLine;
                g.height = sizePerLine * 2;
                g.doLayout();
                this._glyphs.push(g);
                previousGlyph = g;
            }
            else {
                let y = sr.getScoreY(this._infos[i].line) + sizePerLine;
                previousGlyph.height = y - previousGlyph.y;
            }
        }
        this.width = this._glyphs.length > 0 ? this._glyphs[0].width : 0;
    }
    paint(cx, cy, canvas) {
        super.paint(cx, cy, canvas);
        for (let g of this._glyphs) {
            g.paint(cx + this.x, cy + this.y, canvas);
        }
    }
}
//# sourceMappingURL=GhostNoteContainerGlyph.js.map