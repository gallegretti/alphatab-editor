import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
export class BeatGlyphBase extends GlyphGroup {
    constructor() {
        super(0, 0);
        this.computedWidth = 0;
    }
    doLayout() {
        // left to right layout
        let w = 0;
        if (this.glyphs) {
            for (let i = 0, j = this.glyphs.length; i < j; i++) {
                let g = this.glyphs[i];
                g.x = w;
                g.renderer = this.renderer;
                g.doLayout();
                w += g.width;
            }
        }
        this.width = w;
        this.computedWidth = w;
    }
    noteLoop(action) {
        for (let i = this.container.beat.notes.length - 1; i >= 0; i--) {
            action(this.container.beat.notes[i]);
        }
    }
}
//# sourceMappingURL=BeatGlyphBase.js.map