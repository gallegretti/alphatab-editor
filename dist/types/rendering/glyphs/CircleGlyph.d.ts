import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class CircleGlyph extends Glyph {
    private _size;
    constructor(x: number, y: number, size: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
