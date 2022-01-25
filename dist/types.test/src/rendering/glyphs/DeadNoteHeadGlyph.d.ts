import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
export declare class DeadNoteHeadGlyph extends MusicFontGlyph {
    private _isGrace;
    constructor(x: number, y: number, isGrace: boolean);
    doLayout(): void;
}
