import { TextAlign } from '@src/platform/ICanvas';
import { ScoreLayout } from '@src/rendering/layout/ScoreLayout';
import { RenderFinishedEventArgs } from '@src/rendering/RenderFinishedEventArgs';
import { Logger } from '@src/Logger';
export class HorizontalScreenLayoutPartialInfo {
    constructor() {
        this.width = 0;
        this.masterBars = [];
    }
}
/**
 * This layout arranges the bars all horizontally
 */
export class HorizontalScreenLayout extends ScoreLayout {
    constructor(renderer) {
        super(renderer);
        this._group = null;
        this._pagePadding = null;
    }
    get name() {
        return 'HorizontalScreen';
    }
    get supportsResize() {
        return false;
    }
    resize() { }
    doLayoutAndRender() {
        this._pagePadding = this.renderer.settings.display.padding;
        if (!this._pagePadding) {
            this._pagePadding = HorizontalScreenLayout.PagePadding;
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
        let score = this.renderer.score;
        let canvas = this.renderer.canvas;
        let startIndex = this.renderer.settings.display.startBar;
        startIndex--; // map to array index
        startIndex = Math.min(score.masterBars.length - 1, Math.max(0, startIndex));
        let currentBarIndex = startIndex;
        let endBarIndex = this.renderer.settings.display.barCount;
        if (endBarIndex <= 0) {
            endBarIndex = score.masterBars.length;
        }
        endBarIndex = startIndex + endBarIndex - 1; // map count to array index
        endBarIndex = Math.min(score.masterBars.length - 1, Math.max(0, endBarIndex));
        this._group = this.createEmptyStaveGroup();
        this._group.isLast = true;
        this._group.x = this._pagePadding[0];
        this._group.y = this._pagePadding[1];
        let countPerPartial = this.renderer.settings.display.barCountPerPartial;
        let partials = [];
        let currentPartial = new HorizontalScreenLayoutPartialInfo();
        while (currentBarIndex <= endBarIndex) {
            let result = this._group.addBars(this.renderer.tracks, currentBarIndex);
            if (result) {
                // if we detect that the new renderer is linked to the previous
                // renderer, we need to put it into the previous partial
                if (currentPartial.masterBars.length === 0 && result.isLinkedToPrevious && partials.length > 0) {
                    let previousPartial = partials[partials.length - 1];
                    previousPartial.masterBars.push(score.masterBars[currentBarIndex]);
                    previousPartial.width += result.width;
                }
                else {
                    currentPartial.masterBars.push(score.masterBars[currentBarIndex]);
                    currentPartial.width += result.width;
                    // no targetPartial here because previous partials already handled this code
                    if (currentPartial.masterBars.length >= countPerPartial) {
                        if (partials.length === 0) {
                            currentPartial.width += this._group.x + this._group.accoladeSpacing;
                        }
                        partials.push(currentPartial);
                        Logger.debug(this.name, 'Finished partial from bar ' +
                            currentPartial.masterBars[0].index +
                            ' to ' +
                            currentPartial.masterBars[currentPartial.masterBars.length - 1].index, null);
                        currentPartial = new HorizontalScreenLayoutPartialInfo();
                    }
                }
            }
            currentBarIndex++;
        }
        // don't miss the last partial if not empty
        if (currentPartial.masterBars.length > 0) {
            if (partials.length === 0) {
                currentPartial.width += this._group.x + this._group.accoladeSpacing;
            }
            partials.push(currentPartial);
            Logger.debug(this.name, 'Finished partial from bar ' +
                currentPartial.masterBars[0].index +
                ' to ' +
                currentPartial.masterBars[currentPartial.masterBars.length - 1].index, null);
        }
        this._group.finalizeGroup();
        this.height = this._group.y + this._group.height + this._pagePadding[3];
        this.width = this._group.x + this._group.width + this._pagePadding[2];
        currentBarIndex = 0;
        for (let i = 0; i < partials.length; i++) {
            let partial = partials[i];
            canvas.beginRender(partial.width, this.height);
            canvas.color = this.renderer.settings.display.resources.mainGlyphColor;
            canvas.textAlign = TextAlign.Left;
            let renderX = this._group.getBarX(partial.masterBars[0].index) + this._group.accoladeSpacing;
            if (i === 0) {
                renderX -= this._group.x + this._group.accoladeSpacing;
            }
            Logger.debug(this.name, 'Rendering partial from bar ' +
                partial.masterBars[0].index +
                ' to ' +
                partial.masterBars[partial.masterBars.length - 1].index, null);
            this._group.paintPartial(-renderX, this._group.y, this.renderer.canvas, currentBarIndex, partial.masterBars.length);
            let result = canvas.endRender();
            let e = new RenderFinishedEventArgs();
            e.totalWidth = this.width;
            e.totalHeight = this.height;
            e.width = partial.width;
            e.height = this.height;
            e.renderResult = result;
            e.firstMasterBarIndex = partial.masterBars[0].index;
            e.lastMasterBarIndex = partial.masterBars[partial.masterBars.length - 1].index;
            this.renderer.partialRenderFinished.trigger(e);
            currentBarIndex += partial.masterBars.length;
        }
    }
}
HorizontalScreenLayout.PagePadding = [20, 20, 20, 20];
HorizontalScreenLayout.GroupSpacing = 20;
//# sourceMappingURL=HorizontalScreenLayout.js.map