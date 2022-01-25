import { Font } from '@src/model/Font';
import { ICanvas, TextAlign } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
export declare class LyricsGlyph extends EffectGlyph {
    private _lines;
    font: Font;
    textAlign: TextAlign;
    constructor(x: number, y: number, lines: string[], font: Font, textAlign?: TextAlign);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
