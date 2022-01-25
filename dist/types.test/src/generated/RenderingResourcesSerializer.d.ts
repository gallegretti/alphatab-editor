import { RenderingResources } from "@src/RenderingResources";
export declare class RenderingResourcesSerializer {
    static fromJson(obj: RenderingResources, m: unknown): void;
    static toJson(obj: RenderingResources | null): Map<string, unknown> | null;
    static setProperty(obj: RenderingResources, property: string, v: unknown): boolean;
}
