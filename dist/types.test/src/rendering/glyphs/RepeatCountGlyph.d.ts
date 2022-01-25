import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class RepeatCountGlyph extends Glyph {
    private _count;
    constructor(x: number, y: number, count: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
