import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { ICanvas } from '@src/platform/ICanvas';
import { BeatGlyphBase } from '@src/rendering/glyphs/BeatGlyphBase';
import { BeatOnNoteGlyphBase } from '@src/rendering/glyphs/BeatOnNoteGlyphBase';
import { Glyph } from '@src/rendering/glyphs/Glyph';
import { VoiceContainerGlyph } from '@src/rendering/glyphs/VoiceContainerGlyph';
import { BarLayoutingInfo } from '@src/rendering/staves/BarLayoutingInfo';
import { BarBounds } from '../utils/BarBounds';
export declare class BeatContainerGlyph extends Glyph {
    static readonly GraceBeatPadding: number;
    voiceContainer: VoiceContainerGlyph;
    beat: Beat;
    preNotes: BeatGlyphBase;
    onNotes: BeatOnNoteGlyphBase;
    ties: Glyph[];
    minWidth: number;
    get onTimeX(): number;
    constructor(beat: Beat, voiceContainer: VoiceContainerGlyph);
    registerLayoutingInfo(layoutings: BarLayoutingInfo): void;
    applyLayoutingInfo(info: BarLayoutingInfo): void;
    doLayout(): void;
    protected updateWidth(): void;
    scaleToWidth(beatWidth: number): void;
    protected createTies(n: Note): void;
    static getGroupId(beat: Beat): string;
    paint(cx: number, cy: number, canvas: ICanvas): void;
    buildBoundingsLookup(barBounds: BarBounds, cx: number, cy: number, isEmptyBar: boolean): void;
}
