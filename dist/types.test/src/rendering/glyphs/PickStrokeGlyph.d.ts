import { PickStroke } from '@src/model/PickStroke';
import { ICanvas } from '@src/platform/ICanvas';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class PickStrokeGlyph extends MusicFontGlyph {
    constructor(x: number, y: number, pickStroke: PickStroke);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    private static getSymbol;
}
