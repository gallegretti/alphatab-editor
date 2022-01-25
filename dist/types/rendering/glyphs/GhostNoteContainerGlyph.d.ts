import { Note } from '@src/model/Note';
import { ICanvas } from '@src/platform/ICanvas';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class GhostNoteInfo {
    line: number;
    isGhost: boolean;
    constructor(line: number, isGhost: boolean);
}
export declare class GhostNoteContainerGlyph extends Glyph {
    private _isOpen;
    private _infos;
    private _glyphs;
    isEmpty: boolean;
    constructor(isOpen: boolean);
    addParenthesis(n: Note): void;
    addParenthesisOnLine(line: number, hasParenthesis: boolean): void;
    private isTiedBend;
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
