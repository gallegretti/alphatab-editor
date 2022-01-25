import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export declare class TempoGlyph extends EffectGlyph {
    private _tempo;
    constructor(x: number, y: number, tempo: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
