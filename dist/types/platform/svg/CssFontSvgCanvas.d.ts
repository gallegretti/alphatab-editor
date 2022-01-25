import { SvgCanvas } from '@src/platform/svg/SvgCanvas';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
/**
 * This SVG canvas renders the music symbols by adding a CSS class 'at' to all elements.
 */
export declare class CssFontSvgCanvas extends SvgCanvas {
    constructor();
    fillMusicFontSymbol(x: number, y: number, scale: number, symbol: MusicFontSymbol, centerAtPosition?: boolean): void;
    fillMusicFontSymbols(x: number, y: number, scale: number, symbols: MusicFontSymbol[], centerAtPosition?: boolean): void;
    private fillMusicFontSymbolText;
}
