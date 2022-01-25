import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
export class DeadNoteHeadGlyph extends MusicFontGlyph {
    constructor(x, y, isGrace) {
        super(x, y, isGrace ? NoteHeadGlyph.GraceScale : 1, MusicFontSymbol.NoteheadXOrnate);
        this._isGrace = isGrace;
    }
    doLayout() {
        this.width = 9 * (this._isGrace ? NoteHeadGlyph.GraceScale : 1) * this.scale;
        this.height = NoteHeadGlyph.NoteHeadHeight * this.scale;
    }
}
//# sourceMappingURL=DeadNoteHeadGlyph.js.map