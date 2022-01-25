import { Note } from '@src/model/Note';
import { BeatContainerGlyph } from '@src/rendering/glyphs/BeatContainerGlyph';
import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
export declare class BeatGlyphBase extends GlyphGroup {
    container: BeatContainerGlyph;
    computedWidth: number;
    constructor();
    doLayout(): void;
    protected noteLoop(action: (note: Note) => void): void;
}
