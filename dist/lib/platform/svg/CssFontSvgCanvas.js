import { TextAlign } from '@src/platform/ICanvas';
import { SvgCanvas } from '@src/platform/svg/SvgCanvas';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
/**
 * This SVG canvas renders the music symbols by adding a CSS class 'at' to all elements.
 */
export class CssFontSvgCanvas extends SvgCanvas {
    constructor() {
        super();
    }
    fillMusicFontSymbol(x, y, scale, symbol, centerAtPosition) {
        if (symbol === MusicFontSymbol.None) {
            return;
        }
        this.fillMusicFontSymbolText(x, y, scale, `&#${symbol};`, centerAtPosition);
    }
    fillMusicFontSymbols(x, y, scale, symbols, centerAtPosition) {
        let s = '';
        for (let symbol of symbols) {
            if (symbol !== MusicFontSymbol.None) {
                s += `&#${symbol};`;
            }
        }
        this.fillMusicFontSymbolText(x, y, scale, s, centerAtPosition);
    }
    fillMusicFontSymbolText(x, y, scale, symbols, centerAtPosition) {
        this.buffer += `<g transform="translate(${x} ${y})" class="at" ><text`;
        if (scale !== 1) {
            this.buffer += ` style="font-size: ${scale * 100}%; stroke:none"`;
        }
        else {
            this.buffer += ' style="stroke:none"';
        }
        if (this.color.rgba !== '#000000') {
            this.buffer += ` fill="${this.color.rgba}"`;
        }
        if (centerAtPosition) {
            this.buffer += ' text-anchor="' + this.getSvgTextAlignment(TextAlign.Center) + '"';
        }
        this.buffer += `>${symbols}</text></g>`;
    }
}
//# sourceMappingURL=CssFontSvgCanvas.js.map