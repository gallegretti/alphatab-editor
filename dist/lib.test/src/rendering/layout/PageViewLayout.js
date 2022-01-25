import { TextAlign } from '@src/platform/ICanvas';
import { ScoreLayout } from '@src/rendering/layout/ScoreLayout';
import { RenderFinishedEventArgs } from '@src/rendering/RenderFinishedEventArgs';
import { Logger } from '@src/Logger';
import { NotationElement } from '@src/NotationSettings';
/**
 * This layout arranges the bars into a fixed width and dynamic height region.
 */
export class PageViewLayout extends ScoreLayout {
    constructor(renderer) {
        super(renderer);
        this._groups = [];
        this._allMasterBarRenderers = [];
        this._barsFromPreviousGroup = [];
        this._pagePadding = null;
    }
    get name() {
        return 'PageView';
    }
    doLayoutAndRender() {
        this._pagePadding = this.renderer.settings.display.padding;
        if (!this._pagePadding) {
            this._pagePadding = PageViewLayout.PagePadding;
        }
        if (this._pagePadding.length === 1) {
            this._pagePadding = [
                this._pagePadding[0],
                this._pagePadding[0],
                this._pagePadding[0],
                this._pagePadding[0]
            ];
        }
        else if (this._pagePadding.length === 2) {
            this._pagePadding = [
                this._pagePadding[0],
                this._pagePadding[1],
                this._pagePadding[0],
                this._pagePadding[1]
            ];
        }
        let x = this._pagePadding[0];
        let y = this._pagePadding[1];
        this.width = this.renderer.width;
        this._allMasterBarRenderers = [];
        //
        // 1. Score Info
        y = this.layoutAndRenderScoreInfo(x, y, -1);
        //
        // 2. Tunings
        y = this.layoutAndRenderTunings(y, -1);
        //
        // 3. Chord Diagrms
        y = this.layoutAndRenderChordDiagrams(y, -1);
        //
        // 4. One result per StaveGroup
        y = this.layoutAndRenderScore(x, y);
        this.height = y + this._pagePadding[3];
    }
    get supportsResize() {
        return true;
    }
    resize() {
        let x = this._pagePadding[0];
        let y = this._pagePadding[1];
        this.width = this.renderer.width;
        let oldHeight = this.height;
        //
        // 1. Score Info
        y = this.layoutAndRenderScoreInfo(x, y, oldHeight);
        //
        // 2. Tunings
        y = this.layoutAndRenderTunings(y, oldHeight);
        //
        // 3. Chord Digrams
        y = this.layoutAndRenderChordDiagrams(y, oldHeight);
        //
        // 4. One result per StaveGroup
        y = this.resizeAndRenderScore(x, y, oldHeight);
        this.height = y + this._pagePadding[3];
    }
    layoutAndRenderTunings(y, totalHeight = -1) {
        if (!this.tuningGlyph) {
            return y;
        }
        let res = this.renderer.settings.display.resources;
        this.tuningGlyph.width = this.width;
        this.tuningGlyph.doLayout();
        let tuningHeight = this.tuningGlyph.height + 11 * this.scale;
        ;
        y += tuningHeight;
        let canvas = this.renderer.canvas;
        canvas.beginRender(this.width, tuningHeight);
        canvas.color = res.scoreInfoColor;
        canvas.textAlign = TextAlign.Center;
        this.tuningGlyph.paint(this._pagePadding[0], 0, canvas);
        let result = canvas.endRender();
        let e = new RenderFinishedEventArgs();
        e.width = this.width;
        e.height = tuningHeight;
        e.renderResult = result;
        e.totalWidth = this.width;
        e.totalHeight = totalHeight < 0 ? y : totalHeight;
        e.firstMasterBarIndex = -1;
        e.lastMasterBarIndex = -1;
        this.renderer.partialRenderFinished.trigger(e);
        return y;
    }
    layoutAndRenderChordDiagrams(y, totalHeight = -1) {
        if (!this.chordDiagrams) {
            return y;
        }
        let res = this.renderer.settings.display.resources;
        this.chordDiagrams.width = this.width;
        this.chordDiagrams.doLayout();
        let canvas = this.renderer.canvas;
        canvas.beginRender(this.width, this.chordDiagrams.height);
        canvas.color = res.scoreInfoColor;
        canvas.textAlign = TextAlign.Center;
        this.chordDiagrams.paint(0, 0, canvas);
        let result = canvas.endRender();
        y += this.chordDiagrams.height;
        let e = new RenderFinishedEventArgs();
        e.width = this.width;
        e.height = this.chordDiagrams.height;
        e.renderResult = result;
        e.totalWidth = this.width;
        e.totalHeight = totalHeight < 0 ? y : totalHeight;
        e.firstMasterBarIndex = -1;
        e.lastMasterBarIndex = -1;
        this.renderer.partialRenderFinished.trigger(e);
        return y;
    }
    layoutAndRenderScoreInfo(x, y, totalHeight = -1) {
        Logger.debug(this.name, 'Layouting score info');
        let scale = this.scale;
        let res = this.renderer.settings.display.resources;
        let centeredGlyphs = [
            NotationElement.ScoreTitle,
            NotationElement.ScoreSubTitle,
            NotationElement.ScoreArtist,
            NotationElement.ScoreAlbum,
            NotationElement.ScoreWordsAndMusic
        ];
        for (let i = 0; i < centeredGlyphs.length; i++) {
            if (this.scoreInfoGlyphs.has(centeredGlyphs[i])) {
                let glyph = this.scoreInfoGlyphs.get(centeredGlyphs[i]);
                glyph.x = this.width / 2;
                glyph.y = y;
                glyph.textAlign = TextAlign.Center;
                y += glyph.font.size * scale;
            }
        }
        let musicOrWords = false;
        let musicOrWordsHeight = 0;
        if (this.scoreInfoGlyphs.has(NotationElement.ScoreMusic)) {
            let glyph = this.scoreInfoGlyphs.get(NotationElement.ScoreMusic);
            glyph.x = this.width - this._pagePadding[2];
            glyph.y = y;
            glyph.textAlign = TextAlign.Right;
            musicOrWords = true;
            musicOrWordsHeight = glyph.font.size * scale;
        }
        if (this.scoreInfoGlyphs.has(NotationElement.ScoreWords)) {
            let glyph = this.scoreInfoGlyphs.get(NotationElement.ScoreWords);
            glyph.x = x;
            glyph.y = y;
            glyph.textAlign = TextAlign.Left;
            musicOrWords = true;
            musicOrWordsHeight = glyph.font.size * scale;
        }
        if (musicOrWords) {
            y += musicOrWordsHeight;
        }
        y += 17 * this.scale;
        let canvas = this.renderer.canvas;
        canvas.beginRender(this.width, y);
        canvas.color = res.scoreInfoColor;
        canvas.textAlign = TextAlign.Center;
        for (const g of this.scoreInfoGlyphs.values()) {
            g.paint(0, 0, canvas);
        }
        let result = canvas.endRender();
        let e = new RenderFinishedEventArgs();
        e.width = this.width;
        e.height = y;
        e.renderResult = result;
        e.totalWidth = this.width;
        e.totalHeight = totalHeight < 0 ? y : totalHeight;
        e.firstMasterBarIndex = -1;
        e.lastMasterBarIndex = -1;
        this.renderer.partialRenderFinished.trigger(e);
        return y;
    }
    resizeAndRenderScore(x, y, oldHeight) {
        let canvas = this.renderer.canvas;
        // if we have a fixed number of bars per row, we only need to refit them.
        if (this.renderer.settings.display.barsPerRow !== -1) {
            for (let i = 0; i < this._groups.length; i++) {
                let group = this._groups[i];
                this.fitGroup(group);
                group.finalizeGroup();
                y += this.paintGroup(group, oldHeight, canvas);
            }
        }
        else {
            this._groups = [];
            let currentIndex = 0;
            let maxWidth = this.maxWidth;
            let group = this.createEmptyStaveGroup();
            group.index = this._groups.length;
            group.x = x;
            group.y = y;
            while (currentIndex < this._allMasterBarRenderers.length) {
                // if the current renderer still has space in the current group add it
                // also force adding in case the group is empty
                let renderers = this._allMasterBarRenderers[currentIndex];
                if (group.width + renderers.width <= maxWidth || group.masterBarsRenderers.length === 0) {
                    group.addMasterBarRenderers(this.renderer.tracks, renderers);
                    // move to next group
                    currentIndex++;
                }
                else {
                    // if we cannot wrap on the current bar, we remove the last bar
                    // (this might even remove multiple ones until we reach a bar that can wrap);
                    while (renderers && !renderers.canWrap && group.masterBarsRenderers.length > 1) {
                        renderers = group.revertLastBar();
                        currentIndex--;
                    }
                    // in case we do not have space, we create a new group
                    group.isFull = true;
                    group.isLast = this.lastBarIndex === group.lastBarIndex;
                    this._groups.push(group);
                    this.fitGroup(group);
                    group.finalizeGroup();
                    y += this.paintGroup(group, oldHeight, canvas);
                    // note: we do not increase currentIndex here to have it added to the next group
                    group = this.createEmptyStaveGroup();
                    group.index = this._groups.length;
                    group.x = x;
                    group.y = y;
                }
            }
            group.isLast = this.lastBarIndex === group.lastBarIndex;
            // don't forget to finish the last group
            this.fitGroup(group);
            group.finalizeGroup();
            y += this.paintGroup(group, oldHeight, canvas);
        }
        return y;
    }
    layoutAndRenderScore(x, y) {
        let canvas = this.renderer.canvas;
        let startIndex = this.firstBarIndex;
        let currentBarIndex = startIndex;
        let endBarIndex = this.lastBarIndex;
        this._groups = [];
        while (currentBarIndex <= endBarIndex) {
            // create group and align set proper coordinates
            let group = this.createStaveGroup(currentBarIndex, endBarIndex);
            this._groups.push(group);
            group.x = x;
            group.y = y;
            currentBarIndex = group.lastBarIndex + 1;
            // finalize group (sizing etc).
            this.fitGroup(group);
            group.finalizeGroup();
            Logger.debug(this.name, 'Rendering partial from bar ' + group.firstBarIndex + ' to ' + group.lastBarIndex, null);
            y += this.paintGroup(group, y, canvas);
        }
        return y;
    }
    paintGroup(group, totalHeight, canvas) {
        // paint into canvas
        let height = group.height + 20 * this.scale;
        canvas.beginRender(this.width, height);
        this.renderer.canvas.color = this.renderer.settings.display.resources.mainGlyphColor;
        this.renderer.canvas.textAlign = TextAlign.Left;
        // NOTE: we use this negation trick to make the group paint itself to 0/0 coordinates
        // since we use partial drawing
        group.paint(0, -group.y, canvas);
        // calculate coordinates for next group
        totalHeight += height;
        let result = canvas.endRender();
        let args = new RenderFinishedEventArgs();
        args.totalWidth = this.width;
        args.totalHeight = totalHeight;
        args.width = this.width;
        args.height = height;
        args.renderResult = result;
        args.firstMasterBarIndex = group.firstBarIndex;
        args.lastMasterBarIndex = group.lastBarIndex;
        this.renderer.partialRenderFinished.trigger(args);
        return height;
    }
    /**
     * Realignes the bars in this line according to the available space
     */
    fitGroup(group) {
        if (group.isFull || group.width > this.maxWidth) {
            group.scaleToWidth(this.maxWidth);
        }
        this.width = Math.max(this.width, group.width);
    }
    createStaveGroup(currentBarIndex, endIndex) {
        let group = this.createEmptyStaveGroup();
        group.index = this._groups.length;
        let barsPerRow = this.renderer.settings.display.barsPerRow;
        let maxWidth = this.maxWidth;
        let end = endIndex + 1;
        let barIndex = currentBarIndex;
        while (barIndex < end) {
            if (this._barsFromPreviousGroup.length > 0) {
                for (let renderer of this._barsFromPreviousGroup) {
                    group.addMasterBarRenderers(this.renderer.tracks, renderer);
                    barIndex = renderer.masterBar.index;
                }
            }
            else {
                let renderers = group.addBars(this.renderer.tracks, barIndex);
                if (renderers) {
                    this._allMasterBarRenderers.push(renderers);
                }
            }
            this._barsFromPreviousGroup = [];
            let groupIsFull = false;
            // can bar placed in this line?
            if (barsPerRow === -1 && group.width >= maxWidth && group.masterBarsRenderers.length !== 0) {
                groupIsFull = true;
            }
            else if (group.masterBarsRenderers.length === barsPerRow + 1) {
                groupIsFull = true;
            }
            if (groupIsFull) {
                let reverted = group.revertLastBar();
                if (reverted) {
                    this._barsFromPreviousGroup.push(reverted);
                    while (reverted && !reverted.canWrap && group.masterBarsRenderers.length > 1) {
                        reverted = group.revertLastBar();
                        if (reverted) {
                            this._barsFromPreviousGroup.push(reverted);
                        }
                    }
                }
                group.isFull = true;
                group.isLast = false;
                this._barsFromPreviousGroup.reverse();
                return group;
            }
            group.x = 0;
            barIndex++;
        }
        group.isLast = endIndex === group.lastBarIndex;
        return group;
    }
    get maxWidth() {
        return this.renderer.width - this._pagePadding[0] - this._pagePadding[2];
    }
}
PageViewLayout.PagePadding = [40, 40, 40, 40];
PageViewLayout.GroupSpacing = 20;
//# sourceMappingURL=PageViewLayout.js.map