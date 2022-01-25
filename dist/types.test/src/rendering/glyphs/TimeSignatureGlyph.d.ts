import { GlyphGroup } from '@src/rendering/glyphs/GlyphGroup';
export declare abstract class TimeSignatureGlyph extends GlyphGroup {
    private _numerator;
    private _denominator;
    private _isCommon;
    constructor(x: number, y: number, numerator: number, denominator: number, isCommon: boolean);
    protected abstract get commonScale(): number;
    protected abstract get numberScale(): number;
    doLayout(): void;
}
