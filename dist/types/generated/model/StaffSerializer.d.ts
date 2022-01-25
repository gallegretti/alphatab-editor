import { Staff } from "@src/model/Staff";
export declare class StaffSerializer {
    static fromJson(obj: Staff, m: unknown): void;
    static toJson(obj: Staff | null): Map<string, unknown> | null;
    static setProperty(obj: Staff, property: string, v: unknown): boolean;
}
