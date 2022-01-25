import { SimileMark } from '@src/model/SimileMark';
import { BeatXPosition } from '@src/rendering/BeatXPosition';
import { LeftToRightLayoutingGlyphGroup } from '@src/rendering/glyphs/LeftToRightLayoutingGlyphGroup';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { VoiceContainerGlyph } from '@src/rendering/glyphs/VoiceContainerGlyph';
import { BarBounds } from '@src/rendering/utils/BarBounds';
import { BarHelpers } from '@src/rendering/utils/BarHelpers';
import { Bounds } from '@src/rendering/utils/Bounds';
/**
 * Lists the different position modes for {@link BarRendererBase.getNoteY}
 */
export var NoteYPosition;
(function (NoteYPosition) {
    /**
     * Gets the note y-position on top of the note stem or tab number.
     */
    NoteYPosition[NoteYPosition["TopWithStem"] = 0] = "TopWithStem";
    /**
     * Gets the note y-position on top of the note head or tab number.
     */
    NoteYPosition[NoteYPosition["Top"] = 1] = "Top";
    /**
     * Gets the note y-position on the center of the note head or tab number.
     */
    NoteYPosition[NoteYPosition["Center"] = 2] = "Center";
    /**
     * Gets the note y-position on the bottom of the note head or tab number.
     */
    NoteYPosition[NoteYPosition["Bottom"] = 3] = "Bottom";
    /**
     * Gets the note y-position on the bottom of the note stem or tab number.
     */
    NoteYPosition[NoteYPosition["BottomWithStem"] = 4] = "BottomWithStem";
})(NoteYPosition || (NoteYPosition = {}));
/**
 * Lists the different position modes for {@link BarRendererBase.getNoteX}
 */
export var NoteXPosition;
(function (NoteXPosition) {
    /**
     * Gets the note x-position on left of the note head or tab number.
     */
    NoteXPosition[NoteXPosition["Left"] = 0] = "Left";
    /**
     * Gets the note x-position on the center of the note head or tab number.
     */
    NoteXPosition[NoteXPosition["Center"] = 1] = "Center";
    /**
     * Gets the note x-position on the right of the note head or tab number.
     */
    NoteXPosition[NoteXPosition["Right"] = 2] = "Right";
})(NoteXPosition || (NoteXPosition = {}));
/**
 * This is the base public class for creating blocks which can render bars.
 */
export class BarRendererBase {
    constructor(renderer, bar) {
        this._preBeatGlyphs = new LeftToRightLayoutingGlyphGroup();
        this._voiceContainers = new Map();
        this._postBeatGlyphs = new LeftToRightLayoutingGlyphGroup();
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
        this.index = 0;
        this.topOverflow = 0;
        this.bottomOverflow = 0;
        /**
         * Gets or sets whether this renderer is linked to the next one
         * by some glyphs like a vibrato effect
         */
        this.isLinkedToPrevious = false;
        /**
         * Gets or sets whether this renderer can wrap to the next line
         * or it needs to stay connected to the previous one.
         * (e.g. when having double bar repeats we must not separate the 2 bars)
         */
        this.canWrap = true;
        this._wasFirstOfLine = false;
        this._appliedLayoutingInfo = 0;
        this.isFinalized = false;
        /**
         * Gets the top padding for the main content of the renderer.
         * Can be used to specify where i.E. the score lines of the notation start.
         * @returns
         */
        this.topPadding = 0;
        /**
         * Gets the bottom padding for the main content of the renderer.
         * Can be used to specify where i.E. the score lines of the notation end.
         */
        this.bottomPadding = 0;
        this.scoreRenderer = renderer;
        this.bar = bar;
        if (bar) {
            this.helpers = new BarHelpers(this);
        }
    }
    get nextRenderer() {
        if (!this.bar || !this.bar.nextBar) {
            return null;
        }
        return this.scoreRenderer.layout.getRendererForBar(this.staff.staveId, this.bar.nextBar);
    }
    get previousRenderer() {
        if (!this.bar || !this.bar.previousBar) {
            return null;
        }
        return this.scoreRenderer.layout.getRendererForBar(this.staff.staveId, this.bar.previousBar);
    }
    get middleYPosition() {
        return 0;
    }
    registerOverflowTop(topOverflow) {
        if (topOverflow > this.topOverflow) {
            this.topOverflow = topOverflow;
        }
    }
    registerOverflowBottom(bottomOverflow) {
        if (bottomOverflow > this.bottomOverflow) {
            this.bottomOverflow = bottomOverflow;
        }
    }
    scaleToWidth(width) {
        // preBeat and postBeat glyphs do not get resized
        let containerWidth = width - this._preBeatGlyphs.width - this._postBeatGlyphs.width;
        for (const container of this._voiceContainers.values()) {
            container.scaleToWidth(containerWidth);
        }
        this._postBeatGlyphs.x = this._preBeatGlyphs.x + this._preBeatGlyphs.width + containerWidth;
        this.width = width;
    }
    get resources() {
        return this.settings.display.resources;
    }
    get settings() {
        return this.scoreRenderer.settings;
    }
    get scale() {
        return this.settings.display.scale;
    }
    get isFirstOfLine() {
        return this.index === 0;
    }
    get isLast() {
        return !this.bar || this.bar.index === this.scoreRenderer.layout.lastBarIndex;
    }
    registerLayoutingInfo() {
        let info = this.layoutingInfo;
        let preSize = this._preBeatGlyphs.width;
        if (info.preBeatSize < preSize) {
            info.preBeatSize = preSize;
        }
        for (const container of this._voiceContainers.values()) {
            container.registerLayoutingInfo(info);
        }
        let postSize = this._postBeatGlyphs.width;
        if (info.postBeatSize < postSize) {
            info.postBeatSize = postSize;
        }
    }
    applyLayoutingInfo() {
        if (this._appliedLayoutingInfo >= this.layoutingInfo.version) {
            return false;
        }
        this._appliedLayoutingInfo = this.layoutingInfo.version;
        // if we need additional space in the preBeat group we simply
        // add a new spacer
        this._preBeatGlyphs.width = this.layoutingInfo.preBeatSize;
        // on beat glyphs we apply the glyph spacing
        let voiceEnd = this._preBeatGlyphs.x + this._preBeatGlyphs.width;
        for (const c of this._voiceContainers.values()) {
            c.x = this._preBeatGlyphs.x + this._preBeatGlyphs.width;
            c.applyLayoutingInfo(this.layoutingInfo);
            let newEnd = c.x + c.width;
            if (voiceEnd < newEnd) {
                voiceEnd = newEnd;
            }
        }
        // on the post glyphs we add the spacing before all other glyphs
        this._postBeatGlyphs.x = Math.floor(voiceEnd);
        this._postBeatGlyphs.width = this.layoutingInfo.postBeatSize;
        this.width = Math.ceil(this._postBeatGlyphs.x + this._postBeatGlyphs.width);
        return true;
    }
    finalizeRenderer() {
        this.isFinalized = true;
    }
    doLayout() {
        if (!this.bar) {
            return;
        }
        this.helpers.initialize();
        this._preBeatGlyphs = new LeftToRightLayoutingGlyphGroup();
        this._preBeatGlyphs.renderer = this;
        this._voiceContainers.clear();
        this._postBeatGlyphs = new LeftToRightLayoutingGlyphGroup();
        this._postBeatGlyphs.renderer = this;
        for (let i = 0; i < this.bar.voices.length; i++) {
            let voice = this.bar.voices[i];
            if (this.hasVoiceContainer(voice)) {
                let c = new VoiceContainerGlyph(0, 0, voice);
                c.renderer = this;
                this._voiceContainers.set(this.bar.voices[i].index, c);
            }
        }
        if (this.bar.simileMark === SimileMark.SecondOfDouble) {
            this.canWrap = false;
        }
        this.createPreBeatGlyphs();
        this.createBeatGlyphs();
        this.createPostBeatGlyphs();
        this.updateSizes();
        // finish up all helpers
        for (const v of this.helpers.beamHelpers) {
            for (const h of v) {
                h.finish();
            }
        }
    }
    hasVoiceContainer(voice) {
        return !voice.isEmpty || voice.index === 0;
    }
    updateSizes() {
        this.staff.registerStaffTop(this.topPadding);
        this.staff.registerStaffBottom(this.height - this.bottomPadding);
        let voiceContainers = this._voiceContainers;
        let beatGlyphsStart = this.beatGlyphsStart;
        let postBeatStart = beatGlyphsStart;
        for (const c of voiceContainers.values()) {
            c.x = beatGlyphsStart;
            c.doLayout();
            let x = c.x + c.width;
            if (postBeatStart < x) {
                postBeatStart = x;
            }
        }
        this._postBeatGlyphs.x = Math.floor(postBeatStart);
        this.width = Math.ceil(this._postBeatGlyphs.x + this._postBeatGlyphs.width);
        this.height += this.layoutingInfo.height * this.scale;
    }
    addPreBeatGlyph(g) {
        g.renderer = this;
        this._preBeatGlyphs.addGlyph(g);
    }
    addBeatGlyph(g) {
        g.renderer = this;
        g.preNotes.renderer = this;
        g.onNotes.renderer = this;
        g.onNotes.beamingHelper = this.helpers.beamHelperLookup[g.beat.voice.index].get(g.beat.index);
        this.getVoiceContainer(g.beat.voice).addGlyph(g);
    }
    getVoiceContainer(voice) {
        return this._voiceContainers.get(voice.index);
    }
    getBeatContainer(beat) {
        var _a, _b;
        return (_b = (_a = this.getVoiceContainer(beat.voice)) === null || _a === void 0 ? void 0 : _a.beatGlyphs) === null || _b === void 0 ? void 0 : _b[beat.index];
    }
    getPreNotesGlyphForBeat(beat) {
        var _a;
        return (_a = this.getBeatContainer(beat)) === null || _a === void 0 ? void 0 : _a.preNotes;
    }
    getOnNotesGlyphForBeat(beat) {
        var _a;
        return (_a = this.getBeatContainer(beat)) === null || _a === void 0 ? void 0 : _a.onNotes;
    }
    paint(cx, cy, canvas) {
        this.paintBackground(cx, cy, canvas);
        canvas.color = this.resources.mainGlyphColor;
        this._preBeatGlyphs.paint(cx + this.x, cy + this.y, canvas);
        for (const c of this._voiceContainers.values()) {
            canvas.color = c.voice.index === 0 ? this.resources.mainGlyphColor : this.resources.secondaryGlyphColor;
            c.paint(cx + this.x, cy + this.y, canvas);
        }
        canvas.color = this.resources.mainGlyphColor;
        this._postBeatGlyphs.paint(cx + this.x, cy + this.y, canvas);
    }
    paintBackground(cx, cy, canvas) {
        this.layoutingInfo.paint(cx + this.x + this._preBeatGlyphs.x + this._preBeatGlyphs.width, cy + this.y + this.height, canvas);
        // canvas.color = Color.random();
        // canvas.fillRect(cx + this.x + this._preBeatGlyphs.x, cy + this.y, this._preBeatGlyphs.width, this.height);
    }
    buildBoundingsLookup(masterBarBounds, cx, cy) {
        let barBounds = new BarBounds();
        barBounds.bar = this.bar;
        barBounds.visualBounds = new Bounds();
        barBounds.visualBounds.x = cx + this.x;
        barBounds.visualBounds.y = cy + this.y + this.topPadding;
        barBounds.visualBounds.w = this.width;
        barBounds.visualBounds.h = this.height - this.topPadding - this.bottomPadding;
        barBounds.realBounds = new Bounds();
        barBounds.realBounds.x = cx + this.x;
        barBounds.realBounds.y = cy + this.y;
        barBounds.realBounds.w = this.width;
        barBounds.realBounds.h = this.height;
        masterBarBounds.addBar(barBounds);
        for (const [index, c] of this._voiceContainers) {
            let isEmptyBar = this.bar.isEmpty && index === 0;
            if (!c.voice.isEmpty || isEmptyBar) {
                for (let i = 0, j = c.beatGlyphs.length; i < j; i++) {
                    let bc = c.beatGlyphs[i];
                    bc.buildBoundingsLookup(barBounds, cx + this.x + c.x, cy + this.y + c.y, isEmptyBar);
                }
            }
        }
    }
    addPostBeatGlyph(g) {
        this._postBeatGlyphs.addGlyph(g);
    }
    createPreBeatGlyphs() {
        this._wasFirstOfLine = this.isFirstOfLine;
    }
    createBeatGlyphs() {
        for (let v = 0; v < this.bar.voices.length; v++) {
            let voice = this.bar.voices[v];
            if (this.hasVoiceContainer(voice)) {
                this.createVoiceGlyphs(this.bar.voices[v]);
            }
        }
    }
    createVoiceGlyphs(v) {
        // filled in subclasses
    }
    createPostBeatGlyphs() {
        // filled in subclasses
    }
    get beatGlyphsStart() {
        return this._preBeatGlyphs.x + this._preBeatGlyphs.width;
    }
    get postBeatGlyphsStart() {
        return this._postBeatGlyphs.x;
    }
    getBeatX(beat, requestedPosition = BeatXPosition.PreNotes) {
        let container = this.getBeatContainer(beat);
        if (container) {
            switch (requestedPosition) {
                case BeatXPosition.PreNotes:
                    return container.voiceContainer.x + container.x;
                case BeatXPosition.OnNotes:
                    return container.voiceContainer.x + container.x + container.onNotes.x;
                case BeatXPosition.MiddleNotes:
                    return container.voiceContainer.x + container.x + container.onTimeX;
                case BeatXPosition.Stem:
                    const offset = container.onNotes.beamingHelper
                        ? container.onNotes.beamingHelper.getBeatLineX(beat)
                        : container.onNotes.x + container.onNotes.width / 2;
                    return container.voiceContainer.x + offset;
                case BeatXPosition.PostNotes:
                    return container.voiceContainer.x + container.x + container.onNotes.x + container.onNotes.width;
                case BeatXPosition.EndBeat:
                    return container.voiceContainer.x + container.x + container.width;
            }
        }
        return 0;
    }
    getNoteX(note, requestedPosition) {
        let container = this.getBeatContainer(note.beat);
        if (container) {
            return (container.voiceContainer.x +
                container.x +
                container.onNotes.x +
                container.onNotes.getNoteX(note, requestedPosition));
        }
        return 0;
    }
    getNoteY(note, requestedPosition) {
        let beat = this.getOnNotesGlyphForBeat(note.beat);
        if (beat) {
            return beat.getNoteY(note, requestedPosition);
        }
        return NaN;
    }
    reLayout() {
        // there are some glyphs which are shown only for renderers at the line start, so we simply recreate them
        // but we only need to recreate them for the renderers that were the first of the line or are now the first of the line
        if ((this._wasFirstOfLine && !this.isFirstOfLine) || (!this._wasFirstOfLine && this.isFirstOfLine)) {
            this._preBeatGlyphs = new LeftToRightLayoutingGlyphGroup();
            this._preBeatGlyphs.renderer = this;
            this.createPreBeatGlyphs();
        }
        this.updateSizes();
        this.registerLayoutingInfo();
    }
    paintSimileMark(cx, cy, canvas) {
        switch (this.bar.simileMark) {
            case SimileMark.Simple:
                canvas.fillMusicFontSymbol(cx + this.x + (this.width - 20 * this.scale) / 2, cy + this.y + this.height / 2, 1, MusicFontSymbol.Repeat1Bar, false);
                break;
            case SimileMark.SecondOfDouble:
                canvas.fillMusicFontSymbol(cx + this.x - (28 * this.scale) / 2, cy + this.y + this.height / 2, 1, MusicFontSymbol.Repeat2Bars, false);
                break;
        }
    }
    completeBeamingHelper(helper) {
        // nothing by default
    }
}
BarRendererBase.LineSpacing = 8;
BarRendererBase.StemWidth = 0.12 /*bravura stemThickness */ * BarRendererBase.LineSpacing;
BarRendererBase.StaffLineThickness = 0.13 /*bravura staffLineThickness */ * BarRendererBase.LineSpacing;
BarRendererBase.BeamThickness = 0.5 /*bravura beamThickness */ * BarRendererBase.LineSpacing;
BarRendererBase.BeamSpacing = 0.25 /*bravura beamSpacing */ * BarRendererBase.LineSpacing;
//# sourceMappingURL=BarRendererBase.js.map