import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { ScoreRestGlyph } from '@src/rendering/glyphs/ScoreRestGlyph';
export class TabRestGlyph extends MusicFontGlyph {
    constructor(x, y, isVisibleRest, duration) {
        super(x, y, 1, ScoreRestGlyph.getSymbol(duration));
        this._isVisibleRest = isVisibleRest;
        this._duration = duration;
    }
    doLayout() {
        if (this._isVisibleRest) {
            this.width = ScoreRestGlyph.getSize(this._duration) * this.scale;
        }
        else {
            this.width = 10 * this.scale;
        }
    }
    updateBeamingHelper(cx) {
        if (this.beamingHelper && this.beamingHelper.isPositionFrom('tab', this.beat)) {
            this.beamingHelper.registerBeatLineX('tab', this.beat, cx + this.x + this.width / 2, cx + this.x + this.width / 2);
        }
    }
    paint(cx, cy, canvas) {
        if (this._isVisibleRest) {
            super.paint(cx, cy, canvas);
        }
    }
}
//# sourceMappingURL=TabRestGlyph.js.map