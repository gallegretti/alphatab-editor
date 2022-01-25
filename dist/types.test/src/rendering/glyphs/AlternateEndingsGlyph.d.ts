import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export declare class AlternateEndingsGlyph extends EffectGlyph {
    private static readonly Padding;
    private _endings;
    private _endingsString;
    constructor(x: number, y: number, alternateEndings: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
