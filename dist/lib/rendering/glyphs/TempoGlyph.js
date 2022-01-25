import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { NoteHeadGlyph } from '@src/rendering/glyphs/NoteHeadGlyph';
export class TempoGlyph extends EffectGlyph {
    constructor(x, y, tempo) {
        super(x, y);
        this._tempo = 0;
        this._tempo = tempo;
    }
    doLayout() {
        super.doLayout();
        this.height = 25 * this.scale;
    }
    paint(cx, cy, canvas) {
        let res = this.renderer.resources;
        canvas.font = res.markerFont;
        canvas.fillMusicFontSymbol(cx + this.x, cy + this.y + this.height * 0.8, this.scale * NoteHeadGlyph.GraceScale, MusicFontSymbol.NoteQuarterUp, false);
        canvas.fillText('= ' + this._tempo.toString(), cx + this.x + this.height / 2, cy + this.y + canvas.font.size / 2);
    }
}
//# sourceMappingURL=TempoGlyph.js.map