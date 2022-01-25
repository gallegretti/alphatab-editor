import { Duration } from '@src/model/Duration';
import { ICanvas } from '@src/platform/ICanvas';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class NoteHeadGlyph extends MusicFontGlyph {
    static readonly GraceScale: number;
    static readonly NoteHeadHeight: number;
    static readonly QuarterNoteHeadWidth: number;
    private _isGrace;
    private _duration;
    constructor(x: number, y: number, duration: Duration, isGrace: boolean);
    paint(cx: number, cy: number, canvas: ICanvas): void;
    doLayout(): void;
    private static getSymbol;
}
