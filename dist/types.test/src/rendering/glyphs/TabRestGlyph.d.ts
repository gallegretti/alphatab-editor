import { Duration } from '@src/model/Duration';
import { ICanvas } from '@src/platform/ICanvas';
import { MusicFontGlyph } from '@src/rendering/glyphs/MusicFontGlyph';
import { BeamingHelper } from '@src/rendering/utils/BeamingHelper';
export declare class TabRestGlyph extends MusicFontGlyph {
    private _isVisibleRest;
    private _duration;
    beamingHelper: BeamingHelper;
    constructor(x: number, y: number, isVisibleRest: boolean, duration: Duration);
    doLayout(): void;
    updateBeamingHelper(cx: number): void;
    paint(cx: number, cy: number, canvas: ICanvas): void;
}
