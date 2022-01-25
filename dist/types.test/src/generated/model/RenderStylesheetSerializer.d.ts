import { RenderStylesheet } from "@src/model/RenderStylesheet";
export declare class RenderStylesheetSerializer {
    static fromJson(obj: RenderStylesheet, m: unknown): void;
    static toJson(obj: RenderStylesheet | null): Map<string, unknown> | null;
    static setProperty(obj: RenderStylesheet, property: string, v: unknown): boolean;
}
