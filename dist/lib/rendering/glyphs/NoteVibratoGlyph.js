import { VibratoType } from '@src/model/VibratoType';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { GroupedEffectGlyph } from '@src/rendering/glyphs/GroupedEffectGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class NoteVibratoGlyph extends GroupedEffectGlyph {
    constructor(x, y, type, scale = 1.2, partialWaves = false) {
        super(BeatXPosition.EndBeat);
        this._scale = 0;
        this._symbol = MusicFontSymbol.None;
        this._symbolSize = 0;
        this._type = type;
        this._scale = scale;
        this.x = x;
        this.y = y;
        this._partialWaves = partialWaves;
    }
    doLayout() {
        super.doLayout();
        let symbolHeight = 0;
        switch (this._type) {
            case VibratoType.Slight:
                this._symbol = MusicFontSymbol.WiggleTrill;
                this._symbolSize = 9 * this._scale;
                symbolHeight = 6 * this._scale;
                break;
            case VibratoType.Wide:
                this._symbol = MusicFontSymbol.WiggleVibratoMediumFast;
                this._symbolSize = 10 * this._scale;
                symbolHeight = 10 * this._scale;
                break;
        }
        this.height = symbolHeight * this.scale;
    }
    paintGrouped(cx, cy, endX, canvas) {
        let startX = cx + this.x;
        let width = endX - startX;
        let step = this._symbolSize * this.scale;
        let loops = width / step;
        if (!this._partialWaves) {
            loops = Math.floor(loops);
        }
        if (loops < 1) {
            loops = 1;
        }
        let loopX = 0;
        for (let i = 0; i < loops; i++) {
            canvas.fillMusicFontSymbol(cx + this.x + loopX, cy + this.y + this.height * 2, this._scale * this.scale, this._symbol, false);
            loopX += step;
        }
    }
}
//# sourceMappingURL=NoteVibratoGlyph.js.map