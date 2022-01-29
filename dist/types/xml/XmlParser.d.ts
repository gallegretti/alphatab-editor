import { XmlNode } from '@src/xml/XmlNode';
export declare class XmlParser {
    static readonly CharCodeLF: number;
    static readonly CharCodeTab: number;
    static readonly CharCodeCR: number;
    static readonly CharCodeSpace: number;
    static readonly CharCodeLowerThan: number;
    static readonly CharCodeAmp: number;
    static readonly CharCodeBrackedClose: number;
    static readonly CharCodeBrackedOpen: number;
    static readonly CharCodeGreaterThan: number;
    static readonly CharCodeExclamation: number;
    static readonly CharCodeUpperD: number;
    static readonly CharCodeLowerD: number;
    static readonly CharCodeMinus: number;
    static readonly CharCodeQuestion: number;
    static readonly CharCodeSlash: number;
    static readonly CharCodeEquals: number;
    static readonly CharCodeDoubleQuote: number;
    static readonly CharCodeSingleQuote: number;
    static readonly CharCodeSharp: number;
    static readonly CharCodeLowerX: number;
    static readonly CharCodeLowerA: number;
    static readonly CharCodeLowerZ: number;
    static readonly CharCodeUpperA: number;
    static readonly CharCodeUpperZ: number;
    static readonly CharCode0: number;
    static readonly CharCode9: number;
    static readonly CharCodeColon: number;
    static readonly CharCodeDot: number;
    static readonly CharCodeUnderscore: number;
    static readonly CharCodeSemi: number;
    private static Escapes;
    static parse(str: string, p: number, parent: XmlNode): number;
    private static isValidChar;
}