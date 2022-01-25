import { TextBaseline } from "@src/platform/ICanvas";
import { Duration } from "./Duration";
import { MusicFontSymbol } from "./MusicFontSymbol";
/**
 * Describes an instrument articulation which is used for percussions.
 * @json
 */
export declare class InstrumentArticulation {
    /**
     * Gets or sets the type of the element for which this articulation is for.
     */
    elementType: string;
    /**
     * Gets or sets the line the note head should be shown for standard notation
     */
    staffLine: number;
    /**
     * Gets or sets the note head to display by default.
     */
    noteHeadDefault: MusicFontSymbol;
    /**
     * Gets or sets the note head to display for half duration notes.
     */
    noteHeadHalf: MusicFontSymbol;
    /**
     * Gets or sets the note head to display for whole duration notes.
     */
    noteHeadWhole: MusicFontSymbol;
    /**
     * Gets or sets which additional technique symbol should be placed for the note head.
     */
    techniqueSymbol: MusicFontSymbol;
    /**
     * Gets or sets where the technique symbol should be placed.
     */
    techniqueSymbolPlacement: TextBaseline;
    /**
     * Gets or sets which midi number to use when playing the note.
     */
    outputMidiNumber: number;
    constructor(elementType?: string, staffLine?: number, outputMidiNumber?: number, noteHeadDefault?: MusicFontSymbol, noteHeadHalf?: MusicFontSymbol, noteHeadWhole?: MusicFontSymbol, techniqueSymbol?: MusicFontSymbol, techniqueSymbolPlacement?: TextBaseline);
    getSymbol(duration: Duration): MusicFontSymbol;
}
