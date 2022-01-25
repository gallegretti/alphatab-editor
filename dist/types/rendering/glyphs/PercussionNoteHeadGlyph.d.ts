import { ICanvas } from '@src/platform/ICanvas';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { Duration } from '@src/model/Duration';
import { InstrumentArticulation } from '@src/model/InstrumentArticulation';
export declare class PercussionNoteHeadGlyph extends MusicFontGlyph {
    private _isGrace;
    private _articulation;
    constructor(x: number, y: number, articulation: InstrumentArticulation, duration: Duration, isGrace: boolean);
    paint(cx: number, cy: number, canvas: ICanvas): void;
    doLayout(): void;
}
