import { Color } from '@src/model/Color';
import { Font } from '@src/model/Font';
import { ICanvas, TextAlign, TextBaseline } from '@src/platform/ICanvas';
import { MusicFontSymbol } from '@src/model/MusicFontSymbol';
import { Settings } from '@src/Settings';
/**
 * A canvas implementation storing SVG data
 */
export declare abstract class SvgCanvas implements ICanvas {
    protected buffer: string;
    private _currentPath;
    private _currentPathIsEmpty;
    color: Color;
    lineWidth: number;
    font: Font;
    textAlign: TextAlign;
    textBaseline: TextBaseline;
    settings: Settings;
    beginRender(width: number, height: number): void;
    beginGroup(identifier: string): void;
    endGroup(): void;
    endRender(): unknown;
    fillRect(x: number, y: number, w: number, h: number): void;
    strokeRect(x: number, y: number, w: number, h: number): void;
    beginPath(): void;
    closePath(): void;
    moveTo(x: number, y: number): void;
    lineTo(x: number, y: number): void;
    quadraticCurveTo(cpx: number, cpy: number, x: number, y: number): void;
    bezierCurveTo(cp1X: number, cp1Y: number, cp2X: number, cp2Y: number, x: number, y: number): void;
    fillCircle(x: number, y: number, radius: number): void;
    strokeCircle(x: number, y: number, radius: number): void;
    fill(): void;
    stroke(): void;
    fillText(text: string, x: number, y: number): void;
    private static escapeText;
    protected getSvgTextAlignment(textAlign: TextAlign): string;
    protected getSvgBaseLine(): string;
    measureText(text: string): number;
    abstract fillMusicFontSymbol(x: number, y: number, scale: number, symbol: MusicFontSymbol, centerAtPosition?: boolean): void;
    abstract fillMusicFontSymbols(x: number, y: number, scale: number, symbols: MusicFontSymbol[], centerAtPosition?: boolean): void;
    onRenderFinished(): unknown;
    beginRotate(centerX: number, centerY: number, angle: number): void;
    endRotate(): void;
}
