import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class RepeatCloseGlyph extends Glyph {
    constructor(x: number, y: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
