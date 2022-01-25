import { Beat } from '@src/model/Beat';
import { Note } from '@src/model/Note';
import { BeatContainerGlyph } from '@src/rendering/glyphs/BeatContainerGlyph';
import { VoiceContainerGlyph } from '@src/rendering/glyphs/VoiceContainerGlyph';
export declare class ScoreBeatContainerGlyph extends BeatContainerGlyph {
    private _bend;
    private _effectSlur;
    private _effectEndSlur;
    constructor(beat: Beat, voiceContainer: VoiceContainerGlyph);
    doLayout(): void;
    protected createTies(n: Note): void;
}
