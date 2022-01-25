import { XmlNode } from './XmlNode';
export declare class XmlWriter {
    static write(xml: XmlNode, indention: string, xmlHeader: boolean): string;
    private _result;
    private _indention;
    private _xmlHeader;
    private _isStartOfLine;
    private _currentIndention;
    constructor(indention: string, xmlHeader: boolean);
    writeNode(xml: XmlNode): void;
    private unindend;
    private indent;
    private writeAttributeValue;
    private write;
    private writeLine;
    toString(): string;
}
