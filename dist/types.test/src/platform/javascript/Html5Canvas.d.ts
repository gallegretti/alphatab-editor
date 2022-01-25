import { Color } from '@src/model/Color';
import { Font } from '@src/model/Font';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { ICanvas, TextAlign, TextBaseline } from '@src/platform/ICanvas';
import { Settings } from '@src/Settings';
/**
 * A canvas implementation for HTML5 canvas
 * @target web
 */
export declare class Html5Canvas implements ICanvas {
    private _measureCanvas;
    private _measureContext;
    private _canvas;
    private _context;
    private _color;
    private _font;
    private _musicFont;
    private _lineWidth;
    settings: Settings;
    constructor();
    onRenderFinished(): unknown;
    beginRender(width: number, height: number): void;
    endRender(): unknown;
    get color(): Color;
    set color(value: Color);
    get lineWidth(): number;
    set lineWidth(value: number);
    fillRect(x: number, y: number, w: number, h: number): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    beginPath(): void;
    closePath(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    bezierCurveTo(cp1x: number, cp1y: number, cp2x: number, cp2y: number, x: number, y: number): void;
    fillCircle(x: number, y: number, radius: number): void;
    strokeCircle(x: number, y: number, radius: number): void;
    fill(): void;
    stroke(): void;
    get font(): Font;
    set font(value: Font);
    get textAlign(): TextAlign;
    set textAlign(value: TextAlign);
    get textBaseline(): TextBaseline;
    set textBaseline(value: TextBaseline);
    beginGroup(_: string): void;
    endGroup(): void;
    fillText(text: string, x: number, y: number): void;
    measureText(text: string): number;
    fillMusicFontSymbol(x: number, y: number, scale: number, symbol: MusicFontSymbol, centerAtPosition?: boolean): void;
    fillMusicFontSymbols(x: number, y: number, scale: number, symbols: MusicFontSymbol[], centerAtPosition?: boolean): void;
    private fillMusicFontSymbolText;
    beginRotate(centerX: number, centerY: number, angle: number): void;
    endRotate(): void;
}
