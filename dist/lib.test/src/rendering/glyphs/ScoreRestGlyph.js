import { Duration } from '@src/model/Duration';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export class ScoreRestGlyph extends MusicFontGlyph {
    constructor(x, y, duration) {
        super(x, y, 1, ScoreRestGlyph.getSymbol(duration));
        this._duration = duration;
    }
    static getSymbol(duration) {
        switch (duration) {
            case Duration.QuadrupleWhole:
                return MusicFontSymbol.RestLonga;
            case Duration.DoubleWhole:
                return MusicFontSymbol.RestDoubleWhole;
            case Duration.Whole:
                return MusicFontSymbol.RestWhole;
            case Duration.Half:
                return MusicFontSymbol.RestHalf;
            case Duration.Quarter:
                return MusicFontSymbol.RestQuarter;
            case Duration.Eighth:
                return MusicFontSymbol.RestEighth;
            case Duration.Sixteenth:
                return MusicFontSymbol.RestSixteenth;
            case Duration.ThirtySecond:
                return MusicFontSymbol.RestThirtySecond;
            case Duration.SixtyFourth:
                return MusicFontSymbol.RestSixtyFourth;
            case Duration.OneHundredTwentyEighth:
                return MusicFontSymbol.RestOneHundredTwentyEighth;
            case Duration.TwoHundredFiftySixth:
                return MusicFontSymbol.RestTwoHundredFiftySixth;
            default:
                return MusicFontSymbol.None;
        }
    }
    static getSize(duration) {
        switch (duration) {
            case Duration.QuadrupleWhole:
            case Duration.DoubleWhole:
            case Duration.Whole:
            case Duration.Half:
            case Duration.Quarter:
            case Duration.Eighth:
            case Duration.Sixteenth:
                return 9;
            case Duration.ThirtySecond:
                return 12;
            case Duration.SixtyFourth:
                return 14;
            case Duration.OneHundredTwentyEighth:
            case Duration.TwoHundredFiftySixth:
                return 20;
        }
        return 10;
    }
    doLayout() {
        this.width = ScoreRestGlyph.getSize(this._duration) * this.scale;
    }
    updateBeamingHelper(cx) {
        if (this.beamingHelper) {
            this.beamingHelper.registerBeatLineX('score', this.beat, cx + this.x + this.width / 2, cx + this.x + this.width / 2);
        }
    }
}
//# sourceMappingURL=ScoreRestGlyph.js.map