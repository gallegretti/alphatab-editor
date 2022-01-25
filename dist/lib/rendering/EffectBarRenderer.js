import { BarRendererBase } from '@src/rendering/BarRendererBase';
import { EffectBand } from '@src/rendering/EffectBand';
import { EffectBandSizingInfo } from '@src/rendering/EffectBandSizingInfo';
import { BeatContainerGlyph } from '@src/rendering/glyphs/BeatContainerGlyph';
import { BeatGlyphBase } from '@src/rendering/glyphs/BeatGlyphBase';
import { BeatOnNoteGlyphBase } from '@src/rendering/glyphs/BeatOnNoteGlyphBase';
/**
 * This renderer is responsible for displaying effects above or below the other staves
 * like the vibrato.
 */
export class EffectBarRenderer extends BarRendererBase {
    constructor(renderer, bar, infos) {
        super(renderer, bar);
        this._bands = [];
        this._bandLookup = new Map();
        this.sizingInfo = null;
        this._infos = infos;
    }
    updateSizes() {
        this.topOverflow = 0;
        this.bottomOverflow = 0;
        this.topPadding = 0;
        this.bottomPadding = 0;
        this.updateHeight();
        super.updateSizes();
    }
    finalizeRenderer() {
        super.finalizeRenderer();
        this.updateHeight();
    }
    updateHeight() {
        if (!this.sizingInfo) {
            return;
        }
        let y = 0;
        for (let slot of this.sizingInfo.slots) {
            slot.shared.y = y;
            for (let band of slot.bands) {
                band.y = y;
                band.height = slot.shared.height;
            }
            y += slot.shared.height;
        }
        this.height = y;
    }
    applyLayoutingInfo() {
        if (!super.applyLayoutingInfo()) {
            return false;
        }
        // we create empty slots for the same group
        if (this.index > 0) {
            let previousRenderer = this.previousRenderer;
            this.sizingInfo = previousRenderer.sizingInfo;
        }
        else {
            this.sizingInfo = new EffectBandSizingInfo();
        }
        for (let effectBand of this._bands) {
            effectBand.alignGlyphs();
            if (!effectBand.isEmpty) {
                // find a slot that ended before the start of the band
                this.sizingInfo.register(effectBand);
            }
        }
        this.updateHeight();
        return true;
    }
    scaleToWidth(width) {
        super.scaleToWidth(width);
        for (let effectBand of this._bands) {
            effectBand.alignGlyphs();
        }
    }
    createBeatGlyphs() {
        this._bands = [];
        this._bandLookup = new Map();
        for (let voice of this.bar.voices) {
            if (this.hasVoiceContainer(voice)) {
                for (let info of this._infos) {
                    let band = new EffectBand(voice, info);
                    band.renderer = this;
                    band.doLayout();
                    this._bands.push(band);
                    this._bandLookup.set(voice.index + '.' + info.effectId, band);
                }
            }
        }
        for (let voice of this.bar.voices) {
            if (this.hasVoiceContainer(voice)) {
                this.createVoiceGlyphs(voice);
            }
        }
        for (let effectBand of this._bands) {
            if (effectBand.isLinkedToPrevious) {
                this.isLinkedToPrevious = true;
            }
        }
    }
    createVoiceGlyphs(v) {
        for (let b of v.beats) {
            // we create empty glyphs as alignment references and to get the
            // effect bar sized
            let container = new BeatContainerGlyph(b, this.getVoiceContainer(v));
            container.preNotes = new BeatGlyphBase();
            container.onNotes = new BeatOnNoteGlyphBase();
            this.addBeatGlyph(container);
            for (let effectBand of this._bands) {
                effectBand.createGlyph(b);
            }
        }
    }
    paint(cx, cy, canvas) {
        this.paintBackground(cx, cy, canvas);
        // canvas.color = new Color(255, 0, 0, 100);
        // canvas.fillRect(cx + this.x, cy + this.y, this.width, this.height);
        for (let effectBand of this._bands) {
            canvas.color =
                effectBand.voice.index === 0 ? this.resources.mainGlyphColor : this.resources.secondaryGlyphColor;
            if (!effectBand.isEmpty) {
                effectBand.paint(cx + this.x, cy + this.y, canvas);
            }
        }
    }
    getBand(voice, effectId) {
        let id = voice.index + '.' + effectId;
        if (this._bandLookup.has(id)) {
            return this._bandLookup.get(id);
        }
        return null;
    }
}
//# sourceMappingURL=EffectBarRenderer.js.map