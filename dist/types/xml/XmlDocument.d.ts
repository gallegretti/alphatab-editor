import { XmlNode } from '@src/xml/XmlNode';
export declare class XmlDocument extends XmlNode {
    constructor();
    parse(xml: string): void;
    toString(): string;
    toFormattedString(indention?: string, xmlHeader?: boolean): string;
}
