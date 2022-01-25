import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export declare class LeftHandTapGlyph extends EffectGlyph {
    private static readonly Padding;
    constructor();
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
