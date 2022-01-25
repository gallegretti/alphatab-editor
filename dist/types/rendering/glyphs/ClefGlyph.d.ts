import { Clef } from '@src/model/Clef';
import { Ottavia } from '@src/model/Ottavia';
import { ICanvas } from '@src/platform/ICanvas';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class ClefGlyph extends MusicFontGlyph {
    private _clef;
    private _clefOttava;
    constructor(x: number, y: number, clef: Clef, clefOttava: Ottavia);
    doLayout(): void;
    private static getSymbol;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
