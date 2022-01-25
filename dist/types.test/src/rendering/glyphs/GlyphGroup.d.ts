import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
/**
 * This glyph allows to group several other glyphs to be
 * drawn at the same x position
 */
export declare class GlyphGroup extends Glyph {
    protected glyphs: Glyph[] | null;
    get isEmpty(): boolean;
    constructor(x: number, y: number);
    doLayout(): void;
    addGlyph(g: Glyph): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
