import { TextBaseline } from "@src/platform/ICanvas";
import { Duration } from "./Duration";
import { MusicFontSymbol } from "./MusicFontSymbol";
/**
 * Describes an instrument articulation which is used for percussions.
 * @json
 */
export class InstrumentArticulation {
    constructor(elementType = "", staffLine = 0, outputMidiNumber = 0, noteHeadDefault = MusicFontSymbol.None, noteHeadHalf = MusicFontSymbol.None, noteHeadWhole = MusicFontSymbol.None, techniqueSymbol = MusicFontSymbol.None, techniqueSymbolPlacement = TextBaseline.Middle) {
        this.elementType = elementType;
        this.outputMidiNumber = outputMidiNumber;
        this.staffLine = staffLine;
        this.noteHeadDefault = noteHeadDefault;
        this.noteHeadHalf = noteHeadHalf !== MusicFontSymbol.None ? noteHeadHalf : noteHeadDefault;
        this.noteHeadWhole = noteHeadWhole !== MusicFontSymbol.None ? noteHeadWhole : noteHeadDefault;
        this.techniqueSymbol = techniqueSymbol;
        this.techniqueSymbolPlacement = techniqueSymbolPlacement;
    }
    getSymbol(duration) {
        switch (duration) {
            case Duration.Whole:
                return this.noteHeadWhole;
            case Duration.Half:
                return this.noteHeadHalf;
            default:
                return this.noteHeadDefault;
        }
    }
}
//# sourceMappingURL=InstrumentArticulation.js.map