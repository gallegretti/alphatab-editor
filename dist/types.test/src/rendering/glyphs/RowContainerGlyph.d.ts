import { ICanvas, TextAlign } from '@src/platform/ICanvas';
import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
export declare class RowContainerGlyph extends GlyphGroup {
    private static readonly Padding;
    private _rows;
    private _align;
    constructor(x: number, y: number, align?: TextAlign);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
