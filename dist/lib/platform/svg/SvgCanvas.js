import { Color } from '@src/model/Color';
import { Font, FontStyle } from '@src/model/Font';
import { TextAlign, TextBaseline } from '@src/platform/ICanvas';
import { FontSizes } from '@src/platform/svg/FontSizes';
/**
 * A canvas implementation storing SVG data
 */
export class SvgCanvas {
    constructor() {
        this.buffer = '';
        this._currentPath = '';
        this._currentPathIsEmpty = true;
        this.color = new Color(255, 255, 255, 0xff);
        this.lineWidth = 1;
        this.font = new Font('Arial', 10, FontStyle.Plain);
        this.textAlign = TextAlign.Left;
        this.textBaseline = TextBaseline.Top;
    }
    beginRender(width, height) {
        this.buffer = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width | 0}px" height="${height | 0}px" class="at-surface-svg">\n`;
        this._currentPath = '';
        this._currentPathIsEmpty = true;
        this.textBaseline = TextBaseline.Top;
    }
    beginGroup(identifier) {
        this.buffer += `<g class="${identifier}">`;
    }
    endGroup() {
        this.buffer += '</g>';
    }
    endRender() {
        this.buffer += '</svg>';
        return this.buffer;
    }
    fillRect(x, y, w, h) {
        if (w > 0) {
            this.buffer += `<rect x="${x | 0}" y="${y | 0}" width="${w}" height="${h}" fill="${this.color.rgba}" />\n`;
        }
    }
    strokeRect(x, y, w, h) {
        this.buffer += `<rect x="${x | 0}" y="${y | 0}" width="${w}" height="${h}" stroke="${this.color.rgba}"`;
        if (this.lineWidth !== 1) {
            this.buffer += ` stroke-width="${this.lineWidth}"`;
        }
        this.buffer += ' fill="transparent" />\n';
    }
    beginPath() {
        // nothing to do
    }
    closePath() {
        this._currentPath += ' z';
    }
    moveTo(x, y) {
        this._currentPath += ` M${x},${y}`;
    }
    lineTo(x, y) {
        this._currentPathIsEmpty = false;
        this._currentPath += ` L${x},${y}`;
    }
    quadraticCurveTo(cpx, cpy, x, y) {
        this._currentPathIsEmpty = false;
        this._currentPath += ` Q${cpx},${cpy},${x},${y}`;
    }
    bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, x, y) {
        this._currentPathIsEmpty = false;
        this._currentPath += ` C${cp1X},${cp1Y},${cp2X},${cp2Y},${x},${y}`;
    }
    fillCircle(x, y, radius) {
        this._currentPathIsEmpty = false;
        //
        // M0,250 A1,1 0 0,0 500,250 A1,1 0 0,0 0,250 z
        this._currentPath += ` M${x - radius},${y} A1,1 0 0,0 ${x + radius},${y} A1,1 0 0,0 ${x - radius},${y} z`;
        this.fill();
    }
    strokeCircle(x, y, radius) {
        this._currentPathIsEmpty = false;
        //
        // M0,250 A1,1 0 0,0 500,250 A1,1 0 0,0 0,250 z
        this._currentPath += ` M${x - radius},${y} A1,1 0 0,0 ${x + radius},${y} A1,1 0 0,0 ${x - radius},${y} z`;
        this.stroke();
    }
    fill() {
        if (!this._currentPathIsEmpty) {
            this.buffer += `<path d="${this._currentPath}"`;
            if (this.color.rgba !== '#000000') {
                this.buffer += ` fill="${this.color.rgba}"`;
            }
            this.buffer += ' style="stroke: none"/>';
        }
        this._currentPath = '';
        this._currentPathIsEmpty = true;
    }
    stroke() {
        if (!this._currentPathIsEmpty) {
            let s = `<path d="${this._currentPath}" stroke="${this.color.rgba}"`;
            if (this.lineWidth !== 1) {
                s += ` stroke-width="${this.lineWidth}"`;
            }
            s += ' style="fill: none" />';
            this.buffer += s;
        }
        this._currentPath = '';
        this._currentPathIsEmpty = true;
    }
    fillText(text, x, y) {
        if (text === '') {
            return;
        }
        let s = `<text x="${x | 0}" y="${y | 0}" style="stroke: none; font:${this.font.toCssString(this.settings.display.scale)}" ${this.getSvgBaseLine()}`;
        if (this.color.rgba !== '#000000') {
            s += ` fill="${this.color.rgba}"`;
        }
        if (this.textAlign !== TextAlign.Left) {
            s += ` text-anchor="${this.getSvgTextAlignment(this.textAlign)}"`;
        }
        s += `>${SvgCanvas.escapeText(text)}</text>`;
        this.buffer += s;
    }
    static escapeText(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }
    getSvgTextAlignment(textAlign) {
        switch (textAlign) {
            case TextAlign.Left:
                return 'start';
            case TextAlign.Center:
                return 'middle';
            case TextAlign.Right:
                return 'end';
        }
        return '';
    }
    getSvgBaseLine() {
        switch (this.textBaseline) {
            case TextBaseline.Top:
                return `dominant-baseline="hanging"`;
            case TextBaseline.Bottom:
                return `dominant-baseline="bottom"`;
            // case TextBaseline.Middle:
            default:
                // middle is set as default on the SVG tag via css
                return '';
        }
    }
    measureText(text) {
        if (!text) {
            return 0;
        }
        return FontSizes.measureString(text, this.font.family, this.font.size, this.font.style, this.font.weight);
    }
    onRenderFinished() {
        // nothing to do
        return null;
    }
    beginRotate(centerX, centerY, angle) {
        this.buffer += '<g transform="translate(' + centerX + ' ,' + centerY + ') rotate( ' + angle + ')">';
    }
    endRotate() {
        this.buffer += '</g>';
    }
}
//# sourceMappingURL=SvgCanvas.js.map