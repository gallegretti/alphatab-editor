import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
export declare class NumberGlyph extends GlyphGroup {
    static readonly numberHeight: number;
    private _number;
    private _scale;
    constructor(x: number, y: number, num: number, scale?: number);
    doLayout(): void;
}
