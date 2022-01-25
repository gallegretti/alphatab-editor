import { BarRendererBase } from '@src/rendering/BarRendererBase';
/**
 * A Staff represents a single line within a StaveGroup.
 * It stores BarRenderer instances created from a given factory.
 */
export class RenderStaff {
    constructor(trackIndex, staff, factory) {
        this._sharedLayoutData = new Map();
        this.barRenderers = [];
        this.x = 0;
        this.y = 0;
        this.height = 0;
        this.index = 0;
        this.staffIndex = 0;
        /**
         * This is the index of the track being rendered. This is not the index of the track within the model,
         * but the n-th track being rendered. It is the index of the {@link ScoreRenderer.tracks} array defining
         * which tracks should be rendered.
         * For single-track rendering this will always be zero.
         */
        this.trackIndex = 0;
        /**
         * This is the visual offset from top where the
         * Staff contents actually start. Used for grouping
         * using a accolade
         */
        this.staveTop = 0;
        this.topSpacing = 20;
        this.bottomSpacing = 5;
        /**
         * This is the visual offset from top where the
         * Staff contents actually ends. Used for grouping
         * using a accolade
         */
        this.staveBottom = 0;
        this.isFirstInAccolade = false;
        this.isLastInAccolade = false;
        this._factory = factory;
        this.trackIndex = trackIndex;
        this.modelStaff = staff;
    }
    get staveId() {
        return this._factory.staffId;
    }
    getSharedLayoutData(key, def) {
        if (this._sharedLayoutData.has(key)) {
            return this._sharedLayoutData.get(key);
        }
        return def;
    }
    setSharedLayoutData(key, def) {
        this._sharedLayoutData.set(key, def);
    }
    get isInAccolade() {
        return this._factory.isInAccolade;
    }
    get isRelevantForBoundsLookup() {
        return this._factory.isRelevantForBoundsLookup;
    }
    registerStaffTop(offset) {
        this.staveTop = offset;
    }
    registerStaffBottom(offset) {
        this.staveBottom = offset;
    }
    addBarRenderer(renderer) {
        renderer.staff = this;
        renderer.index = this.barRenderers.length;
        renderer.reLayout();
        this.barRenderers.push(renderer);
        this.staveGroup.layout.registerBarRenderer(this.staveId, renderer);
    }
    addBar(bar, layoutingInfo) {
        let renderer;
        if (!bar) {
            renderer = new BarRendererBase(this.staveGroup.layout.renderer, bar);
        }
        else {
            renderer = this._factory.create(this.staveGroup.layout.renderer, bar);
        }
        renderer.staff = this;
        renderer.index = this.barRenderers.length;
        renderer.layoutingInfo = layoutingInfo;
        renderer.doLayout();
        renderer.registerLayoutingInfo();
        this.barRenderers.push(renderer);
        if (bar) {
            this.staveGroup.layout.registerBarRenderer(this.staveId, renderer);
        }
    }
    revertLastBar() {
        let lastBar = this.barRenderers[this.barRenderers.length - 1];
        this.barRenderers.splice(this.barRenderers.length - 1, 1);
        this.staveGroup.layout.unregisterBarRenderer(this.staveId, lastBar);
        return lastBar;
    }
    scaleToWidth(width) {
        this._sharedLayoutData = new Map();
        // Note: here we could do some "intelligent" distribution of
        // the space over the bar renderers, for now we evenly apply the space to all bars
        let difference = width - this.staveGroup.width;
        let spacePerBar = difference / this.barRenderers.length;
        for (let i = 0, j = this.barRenderers.length; i < j; i++) {
            this.barRenderers[i].scaleToWidth(this.barRenderers[i].width + spacePerBar);
        }
    }
    get topOverflow() {
        let m = 0;
        for (let i = 0, j = this.barRenderers.length; i < j; i++) {
            let r = this.barRenderers[i];
            if (r.topOverflow > m) {
                m = r.topOverflow;
            }
        }
        return m;
    }
    get bottomOverflow() {
        let m = 0;
        for (let i = 0, j = this.barRenderers.length; i < j; i++) {
            let r = this.barRenderers[i];
            if (r.bottomOverflow > m) {
                m = r.bottomOverflow;
            }
        }
        return m;
    }
    finalizeStaff() {
        let x = 0;
        this.height = 0;
        let topOverflow = this.topOverflow;
        let bottomOverflow = this.bottomOverflow;
        for (let i = 0; i < this.barRenderers.length; i++) {
            this.barRenderers[i].x = x;
            this.barRenderers[i].y = this.topSpacing + topOverflow;
            this.height = Math.max(this.height, this.barRenderers[i].height);
            this.barRenderers[i].finalizeRenderer();
            x += this.barRenderers[i].width;
        }
        if (this.height > 0) {
            this.height += this.topSpacing + topOverflow + bottomOverflow + this.bottomSpacing;
        }
    }
    paint(cx, cy, canvas, startIndex, count) {
        if (this.height === 0 || count === 0) {
            return;
        }
        for (let i = startIndex, j = Math.min(startIndex + count, this.barRenderers.length); i < j; i++) {
            this.barRenderers[i].paint(cx + this.x, cy + this.y, canvas);
        }
    }
}
//# sourceMappingURL=RenderStaff.js.map