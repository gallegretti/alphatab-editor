import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export declare class TrillGlyph extends EffectGlyph {
    constructor(x: number, y: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
