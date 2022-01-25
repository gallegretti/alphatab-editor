import { TextAlign } from '@src/platform/ICanvas';
import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
import { Glyph } from './Glyph';
export declare class RowGlyphContainer extends GlyphGroup {
    private _glyphWidth;
    private _align;
    constructor(x: number, y: number, align?: TextAlign);
    doLayout(): void;
    addGlyphToRow(glyph: Glyph): void;
}
