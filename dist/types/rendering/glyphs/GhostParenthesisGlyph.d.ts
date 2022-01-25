import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class GhostParenthesisGlyph extends Glyph {
    private static readonly Size;
    private _isOpen;
    constructor(isOpen: boolean);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
