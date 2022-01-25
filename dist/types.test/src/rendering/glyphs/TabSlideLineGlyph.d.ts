import { Note } from '@src/model/Note';
import { SlideInType } from '@src/model/SlideInType';
import { SlideOutType } from '@src/model/SlideOutType';
import { ICanvas } from '@src/platform/ICanvas';
import { BeatContainerGlyph } from '@src/rendering/glyphs/BeatContainerGlyph';
import { Glyph } from '@src/rendering/glyphs/Glyph';
export declare class TabSlideLineGlyph extends Glyph {
    private _inType;
    private _outType;
    private _startNote;
    private _parent;
    constructor(inType: SlideInType, outType: SlideOutType, startNote: Note, parent: BeatContainerGlyph);
    doLayout(): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    private paintSlideIn;
    private paintSlideOut;
    private paintSlideLine;
}
