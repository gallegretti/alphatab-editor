import { BendPoint } from "@src/model/BendPoint";
export declare class BendPointSerializer {
    static fromJson(obj: BendPoint, m: unknown): void;
    static toJson(obj: BendPoint | null): Map<string, unknown> | null;
    static setProperty(obj: BendPoint, property: string, v: unknown): boolean;
}
