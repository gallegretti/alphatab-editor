import { InstrumentArticulation } from "@src/model/InstrumentArticulation";
import { Note } from "@src/model/Note";
export declare class PercussionMapper {
    private static gp6ElementAndVariationToArticulation;
    static articulationFromElementVariation(element: number, variation: number): number;
    static instrumentArticulations: Map<number, InstrumentArticulation>;
    static getArticulation(n: Note): InstrumentArticulation | null;
    static getElementAndVariation(n: Note): number[];
    static getArticulationByValue(midiNumber: number): InstrumentArticulation | null;
}
