import { Automation } from "@src/model/Automation";
export declare class AutomationSerializer {
    static fromJson(obj: Automation, m: unknown): void;
    static toJson(obj: Automation | null): Map<string, unknown> | null;
    static setProperty(obj: Automation, property: string, v: unknown): boolean;
}
