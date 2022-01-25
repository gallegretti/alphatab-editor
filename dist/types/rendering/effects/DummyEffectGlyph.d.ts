import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export declare class DummyEffectGlyph extends EffectGlyph {
    private _w;
    private _h;
    constructor(x: number, y: number, w?: number, h?: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
