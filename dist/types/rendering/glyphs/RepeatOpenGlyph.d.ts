import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class RepeatOpenGlyph extends Glyph {
    private _dotOffset;
    private _circleSize;
    constructor(x: number, y: number, circleSize: number, dotOffset: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
