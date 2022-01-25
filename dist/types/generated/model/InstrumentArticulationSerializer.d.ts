import { InstrumentArticulation } from "@src/model/InstrumentArticulation";
export declare class InstrumentArticulationSerializer {
    static fromJson(obj: InstrumentArticulation, m: unknown): void;
    static toJson(obj: InstrumentArticulation | null): Map<string, unknown> | null;
    static setProperty(obj: InstrumentArticulation, property: string, v: unknown): boolean;
}
