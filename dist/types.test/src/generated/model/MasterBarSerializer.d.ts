import { MasterBar } from "@src/model/MasterBar";
export declare class MasterBarSerializer {
    static fromJson(obj: MasterBar, m: unknown): void;
    static toJson(obj: MasterBar | null): Map<string, unknown> | null;
    static setProperty(obj: MasterBar, property: string, v: unknown): boolean;
}
