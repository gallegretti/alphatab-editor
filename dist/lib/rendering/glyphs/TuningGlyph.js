import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { Tuning } from '@src/model/Tuning';
import { TextAlign } from '@src/platform/ICanvas';
import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
import { TextGlyph } from '@src/rendering/glyphs/TextGlyph';
import { MusicFontGlyph } from './MusicFontGlyph';
export class TuningGlyph extends GlyphGroup {
    constructor(x, y, tuning, trackLabel) {
        super(x, y);
        this._tuning = tuning;
        this._trackLabel = trackLabel;
        this.glyphs = [];
    }
    doLayout() {
        if (this.glyphs.length > 0) {
            return;
        }
        this.createGlyphs(this._tuning);
        for (const g of this.glyphs) {
            g.renderer = this.renderer;
            g.doLayout();
        }
    }
    createGlyphs(tuning) {
        const scale = this.renderer.scale;
        const res = this.renderer.resources;
        this.height = 0;
        const rowHeight = 15 * scale;
        // Track name
        if (this._trackLabel.length > 0) {
            this.addGlyph(new TextGlyph(0, this.height, this._trackLabel, res.effectFont, TextAlign.Left));
            this.height += rowHeight;
        }
        // Name
        this.addGlyph(new TextGlyph(0, this.height, tuning.name, res.effectFont, TextAlign.Left));
        const stringColumnWidth = 64 * scale;
        this.renderer.scoreRenderer.canvas.font = res.effectFont;
        this.width = Math.max(this.renderer.scoreRenderer.canvas.measureText(this._trackLabel) * scale, Math.max(this.renderer.scoreRenderer.canvas.measureText(tuning.name) * scale, 2 * stringColumnWidth));
        this.height += rowHeight;
        if (!tuning.isStandard) {
            const circleScale = 0.7;
            const circleHeight = TuningGlyph.CircleNumberHeight * circleScale * scale;
            // Strings
            let stringsPerColumn = Math.ceil(tuning.tunings.length / 2.0) | 0;
            let currentX = 0;
            let currentY = this.height;
            for (let i = 0, j = tuning.tunings.length; i < j; i++) {
                const symbol = (MusicFontSymbol.GuitarString0 + (i + 1));
                this.addGlyph(new MusicFontGlyph(currentX, currentY + circleHeight / 1.2, circleScale, symbol));
                const str = '= ' + Tuning.getTextForTuning(tuning.tunings[i], false);
                this.addGlyph(new TextGlyph(currentX + circleHeight + 1 * scale, currentY, str, res.effectFont, TextAlign.Left));
                currentY += rowHeight;
                if (i === stringsPerColumn - 1) {
                    currentY = this.height;
                    currentX += stringColumnWidth;
                }
            }
            this.height += stringsPerColumn * rowHeight;
        }
        this.width += 15 * scale;
    }
}
/**
 * The height of the GuitarString# glyphs at scale 1
 */
TuningGlyph.CircleNumberHeight = 20;
//# sourceMappingURL=TuningGlyph.js.map