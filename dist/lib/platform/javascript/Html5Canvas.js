import { Environment } from '@src/Environment';
import { Color } from '@src/model/Color';
import { Font, FontStyle } from '@src/model/Font';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { TextAlign, TextBaseline } from '@src/platform/ICanvas';
/**
 * A canvas implementation for HTML5 canvas
 * @target web
 */
export class Html5Canvas {
    constructor() {
        this._canvas = null;
        this._color = new Color(0, 0, 0, 0xff);
        this._font = new Font('Arial', 10, FontStyle.Plain);
        this._lineWidth = 0;
        let fontElement = document.createElement('span');
        fontElement.classList.add('at');
        document.body.appendChild(fontElement);
        let style = window.getComputedStyle(fontElement);
        let family = style.fontFamily;
        if (family.startsWith('"') || family.startsWith("'")) {
            family = family.substr(1, family.length - 2);
        }
        this._musicFont = new Font(family, parseFloat(style.fontSize), FontStyle.Plain);
        this._measureCanvas = document.createElement('canvas');
        this._measureCanvas.width = 10;
        this._measureCanvas.height = 10;
        this._measureCanvas.style.width = '10px';
        this._measureCanvas.style.height = '10px';
        this._measureContext = this._measureCanvas.getContext('2d');
        this._measureContext.textBaseline = 'hanging';
    }
    onRenderFinished() {
        return null;
    }
    beginRender(width, height) {
        this._canvas = document.createElement('canvas');
        this._canvas.width = (width * Environment.HighDpiFactor) | 0;
        this._canvas.height = (height * Environment.HighDpiFactor) | 0;
        this._canvas.style.width = width + 'px';
        this._canvas.style.height = height + 'px';
        this._context = this._canvas.getContext('2d');
        this._context.textBaseline = 'hanging';
        this._context.scale(Environment.HighDpiFactor, Environment.HighDpiFactor);
        this._context.lineWidth = this._lineWidth;
    }
    endRender() {
        let result = this._canvas;
        this._canvas = null;
        return result;
    }
    get color() {
        return this._color;
    }
    set color(value) {
        if (this._color.rgba === value.rgba) {
            return;
        }
        this._color = value;
        this._context.strokeStyle = value.rgba;
        this._context.fillStyle = value.rgba;
    }
    get lineWidth() {
        return this._lineWidth;
    }
    set lineWidth(value) {
        this._lineWidth = value;
        if (this._context) {
            this._context.lineWidth = value;
        }
    }
    fillRect(x, y, w, h) {
        if (w > 0) {
            this._context.fillRect((x | 0), (y | 0), w, h);
        }
    }
    strokeRect(x, y, w, h) {
        this._context.strokeRect((x | 0), (y | 0), w, h);
    }
    beginPath() {
        this._context.beginPath();
    }
    closePath() {
        this._context.closePath();
    }
    moveTo(x, y) {
        this._context.moveTo(x, y);
    }
    lineTo(x, y) {
        this._context.lineTo(x, y);
    }
    quadraticCurveTo(cpx, cpy, x, y) {
        this._context.quadraticCurveTo(cpx, cpy, x, y);
    }
    bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y) {
        this._context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
    }
    fillCircle(x, y, radius) {
        this._context.beginPath();
        this._context.arc(x, y, radius, 0, Math.PI * 2, true);
        this.fill();
    }
    strokeCircle(x, y, radius) {
        this._context.beginPath();
        this._context.arc(x, y, radius, 0, Math.PI * 2, true);
        this.stroke();
    }
    fill() {
        this._context.fill();
        this._context.beginPath();
    }
    stroke() {
        this._context.stroke();
        this._context.beginPath();
    }
    get font() {
        return this._font;
    }
    set font(value) {
        this._font = value;
        if (this._context) {
            this._context.font = value.toCssString(this.settings.display.scale);
        }
        this._measureContext.font = value.toCssString(this.settings.display.scale);
    }
    get textAlign() {
        switch (this._context.textAlign) {
            case 'left':
                return TextAlign.Left;
            case 'center':
                return TextAlign.Center;
            case 'right':
                return TextAlign.Right;
            default:
                return TextAlign.Left;
        }
    }
    set textAlign(value) {
        switch (value) {
            case TextAlign.Left:
                this._context.textAlign = 'left';
                break;
            case TextAlign.Center:
                this._context.textAlign = 'center';
                break;
            case TextAlign.Right:
                this._context.textAlign = 'right';
                break;
        }
    }
    get textBaseline() {
        switch (this._context.textBaseline) {
            case 'hanging':
                return TextBaseline.Top;
            case 'middle':
                return TextBaseline.Middle;
            case 'bottom':
                return TextBaseline.Bottom;
            default:
                return TextBaseline.Top;
        }
    }
    set textBaseline(value) {
        switch (value) {
            case TextBaseline.Top:
                this._context.textBaseline = 'hanging';
                break;
            case TextBaseline.Middle:
                this._context.textBaseline = 'middle';
                break;
            case TextBaseline.Bottom:
                this._context.textBaseline = 'bottom';
                break;
        }
    }
    beginGroup(_) {
        // not supported
    }
    endGroup() {
        // not supported
    }
    fillText(text, x, y) {
        this._context.fillText(text, x, y);
    }
    measureText(text) {
        return this._measureContext.measureText(text).width;
    }
    fillMusicFontSymbol(x, y, scale, symbol, centerAtPosition = false) {
        if (symbol === MusicFontSymbol.None) {
            return;
        }
        this.fillMusicFontSymbolText(x, y, scale, String.fromCharCode(symbol), centerAtPosition);
    }
    fillMusicFontSymbols(x, y, scale, symbols, centerAtPosition = false) {
        let s = '';
        for (let symbol of symbols) {
            if (symbol !== MusicFontSymbol.None) {
                s += String.fromCharCode(symbol);
            }
        }
        this.fillMusicFontSymbolText(x, y, scale, s, centerAtPosition);
    }
    fillMusicFontSymbolText(x, y, scale, symbols, centerAtPosition = false) {
        let textAlign = this._context.textAlign;
        let baseLine = this._context.textBaseline;
        let font = this._context.font;
        this._context.font = this._musicFont.toCssString(scale);
        this._context.textBaseline = 'middle';
        if (centerAtPosition) {
            this._context.textAlign = 'center';
        }
        else {
            this._context.textAlign = 'left';
        }
        this._context.fillText(symbols, x, y);
        this._context.textBaseline = baseLine;
        this._context.font = font;
        this._context.textAlign = textAlign;
    }
    beginRotate(centerX, centerY, angle) {
        this._context.save();
        this._context.translate(centerX, centerY);
        this._context.rotate((angle * Math.PI) / 180.0);
    }
    endRotate() {
        this._context.restore();
    }
}
//# sourceMappingURL=Html5Canvas.js.map