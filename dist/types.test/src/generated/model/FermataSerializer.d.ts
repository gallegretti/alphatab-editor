import { Fermata } from "@src/model/Fermata";
export declare class FermataSerializer {
    static fromJson(obj: Fermata, m: unknown): void;
    static toJson(obj: Fermata | null): Map<string, unknown> | null;
    static setProperty(obj: Fermata, property: string, v: unknown): boolean;
}
