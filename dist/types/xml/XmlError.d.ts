import { AlphaTabError } from "@src/AlphaTabError";
export declare class XmlError extends AlphaTabError {
    xml: string;
    pos: number;
    constructor(message: string, xml: string, pos: number);
}
