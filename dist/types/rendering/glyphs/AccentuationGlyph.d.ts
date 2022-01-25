import { AccentuationType } from '@src/model/AccentuationType';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { ICanvas } from '@src/platform/ICanvas';
export declare class AccentuationGlyph extends MusicFontGlyph {
    constructor(x: number, y: number, accentuation: AccentuationType);
    private static getSymbol;
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
