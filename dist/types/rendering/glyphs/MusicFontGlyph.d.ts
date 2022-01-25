import { ICanvas } from '@src/platform/ICanvas';
import { EffectGlyph } from '@src/rendering/glyphs/EffectGlyph';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
export declare class MusicFontGlyph extends EffectGlyph {
    protected glyphScale: number;
    protected symbol: MusicFontSymbol;
    constructor(x: number, y: number, glyphScale: number, symbol: MusicFontSymbol);
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
