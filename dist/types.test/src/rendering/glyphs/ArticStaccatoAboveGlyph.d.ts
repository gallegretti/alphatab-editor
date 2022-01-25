import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { ICanvas } from '@src/platform/ICanvas';
export declare class ArticStaccatoAboveGlyph extends MusicFontGlyph {
    constructor(x: number, y: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
