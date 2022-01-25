import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export class GroupedEffectGlyph extends EffectGlyph {
    constructor(endPosition) {
        super();
        this.forceGroupedRendering = false;
        this.endOnBarLine = false;
        this.endPosition = endPosition;
    }
    get isLinkedWithPrevious() {
        return !!this.previousGlyph && this.previousGlyph.renderer.staff.staveGroup === this.renderer.staff.staveGroup;
    }
    get isLinkedWithNext() {
        return (!!this.nextGlyph &&
            this.nextGlyph.renderer.isFinalized &&
            this.nextGlyph.renderer.staff.staveGroup === this.renderer.staff.staveGroup);
    }
    paint(cx, cy, canvas) {
        // if we are linked with the previous, the first glyph of the group will also render this one.
        if (this.isLinkedWithPrevious) {
            return;
        }
        // we are not linked with any glyph therefore no expansion is required, we render a simple glyph.
        if (!this.isLinkedWithNext && !this.forceGroupedRendering) {
            this.paintNonGrouped(cx, cy, canvas);
            return;
        }
        // find last linked glyph that can be
        let lastLinkedGlyph;
        if (!this.isLinkedWithNext && this.forceGroupedRendering) {
            lastLinkedGlyph = this;
        }
        else {
            lastLinkedGlyph = this.nextGlyph;
            while (lastLinkedGlyph.isLinkedWithNext) {
                lastLinkedGlyph = lastLinkedGlyph.nextGlyph;
            }
        }
        // use start position of next beat when possible
        let endBeatRenderer = lastLinkedGlyph.renderer;
        let endBeat = lastLinkedGlyph.beat;
        let position = this.endPosition;
        // calculate end X-position
        let cxRenderer = cx - this.renderer.x;
        let endX = this.calculateEndX(endBeatRenderer, endBeat, cxRenderer, position);
        this.paintGrouped(cx, cy, endX, canvas);
    }
    calculateEndX(endBeatRenderer, endBeat, cx, endPosition) {
        if (!endBeat) {
            return cx + endBeatRenderer.x + this.x + this.width;
        }
        return cx + endBeatRenderer.x + endBeatRenderer.getBeatX(endBeat, endPosition);
    }
    paintNonGrouped(cx, cy, canvas) {
        let cxRenderer = cx - this.renderer.x;
        let endX = this.calculateEndX(this.renderer, this.beat, cxRenderer, this.endPosition);
        this.paintGrouped(cx, cy, endX, canvas);
    }
}
//# sourceMappingURL=GroupedEffectGlyph.js.map