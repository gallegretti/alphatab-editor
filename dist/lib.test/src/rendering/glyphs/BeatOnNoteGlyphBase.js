import { BeatGlyphBase } from '@src/rendering/glyphs/BeatGlyphBase';
export class BeatOnNoteGlyphBase extends BeatGlyphBase {
    constructor() {
        super(...arguments);
        this.centerX = 0;
    }
    updateBeamingHelper() {
        //
    }
    buildBoundingsLookup(beatBounds, cx, cy) {
        // implemented in subclasses
    }
    getNoteX(note, requestedPosition) {
        return 0;
    }
    getNoteY(note, requestedPosition) {
        return 0;
    }
}
//# sourceMappingURL=BeatOnNoteGlyphBase.js.map