import { ICanvas } from '@src/platform/ICanvas';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class PictEdgeOfCymbalGlyph extends MusicFontGlyph {
    constructor(x: number, y: number);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
