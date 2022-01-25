import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class BarNumberGlyph extends Glyph {
    private _number;
    constructor(x: number, y: number, num: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
