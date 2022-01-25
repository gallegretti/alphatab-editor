import { FermataType } from '@src/model/Fermata';
import { ICanvas } from '@src/platform/ICanvas';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class FermataGlyph extends MusicFontGlyph {
    constructor(x: number, y: number, fermata: FermataType);
    private static getSymbol;
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
