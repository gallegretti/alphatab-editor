// This XML parser is based on the XML Parser of the Haxe Standard Library (MIT)
/*
 * Copyright (C)2005-2019 Haxe Foundation
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
import { XmlError } from '@src/xml/XmlError';
import { XmlNode, XmlNodeType } from '@src/xml/XmlNode';
var XmlState;
(function (XmlState) {
    XmlState[XmlState["IgnoreSpaces"] = 0] = "IgnoreSpaces";
    XmlState[XmlState["Begin"] = 1] = "Begin";
    XmlState[XmlState["BeginNode"] = 2] = "BeginNode";
    XmlState[XmlState["TagName"] = 3] = "TagName";
    XmlState[XmlState["Body"] = 4] = "Body";
    XmlState[XmlState["AttribName"] = 5] = "AttribName";
    XmlState[XmlState["Equals"] = 6] = "Equals";
    XmlState[XmlState["AttvalBegin"] = 7] = "AttvalBegin";
    XmlState[XmlState["AttribVal"] = 8] = "AttribVal";
    XmlState[XmlState["Childs"] = 9] = "Childs";
    XmlState[XmlState["Close"] = 10] = "Close";
    XmlState[XmlState["WaitEnd"] = 11] = "WaitEnd";
    XmlState[XmlState["WaitEndRet"] = 12] = "WaitEndRet";
    XmlState[XmlState["Pcdata"] = 13] = "Pcdata";
    XmlState[XmlState["Header"] = 14] = "Header";
    XmlState[XmlState["Comment"] = 15] = "Comment";
    XmlState[XmlState["Doctype"] = 16] = "Doctype";
    XmlState[XmlState["Cdata"] = 17] = "Cdata";
    XmlState[XmlState["Escape"] = 18] = "Escape";
})(XmlState || (XmlState = {}));
export class XmlParser {
    static parse(str, p, parent) {
        var _a;
        let c = str.charCodeAt(p);
        let state = XmlState.Begin;
        let next = XmlState.Begin;
        let start = 0;
        let buf = '';
        let escapeNext = XmlState.Begin;
        let xml = null;
        let aname = null;
        let nbrackets = 0;
        let attrValQuote = 0;
        while (p < str.length) {
            c = str.charCodeAt(p);
            switch (state) {
                case XmlState.IgnoreSpaces:
                    switch (c) {
                        case XmlParser.CharCodeLF:
                        case XmlParser.CharCodeCR:
                        case XmlParser.CharCodeTab:
                        case XmlParser.CharCodeSpace:
                            break;
                        default:
                            state = next;
                            continue;
                    }
                    break;
                case XmlState.Begin:
                    switch (c) {
                        case XmlParser.CharCodeLowerThan:
                            state = XmlState.IgnoreSpaces;
                            next = XmlState.BeginNode;
                            break;
                        default:
                            start = p;
                            state = XmlState.Pcdata;
                            continue;
                    }
                    break;
                case XmlState.Pcdata:
                    if (c === XmlParser.CharCodeLowerThan) {
                        buf += str.substr(start, p - start);
                        let child = new XmlNode();
                        child.nodeType = XmlNodeType.Text;
                        child.value = buf;
                        buf = '';
                        parent.addChild(child);
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.BeginNode;
                    }
                    else if (c === XmlParser.CharCodeAmp) {
                        buf += str.substr(start, p - start);
                        state = XmlState.Escape;
                        escapeNext = XmlState.Pcdata;
                        start = p + 1;
                    }
                    break;
                case XmlState.Cdata:
                    if (c === XmlParser.CharCodeBrackedClose &&
                        str.charCodeAt(p + 1) === XmlParser.CharCodeBrackedClose &&
                        str.charCodeAt(p + 2) === XmlParser.CharCodeGreaterThan) {
                        // ]]>
                        let child = new XmlNode();
                        child.nodeType = XmlNodeType.CDATA;
                        child.value = str.substr(start, p - start);
                        parent.addChild(child);
                        p += 2;
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.BeginNode:
                    switch (c) {
                        case XmlParser.CharCodeExclamation:
                            if (str.charCodeAt(p + 1) === XmlParser.CharCodeBrackedOpen) {
                                p += 2;
                                if (str.substr(p, 6).toUpperCase() !== 'CDATA[') {
                                    throw new XmlError('Expected <![CDATA[', str, p);
                                }
                                p += 5;
                                state = XmlState.Cdata;
                                start = p + 1;
                            }
                            else if (str.charCodeAt(p + 1) === XmlParser.CharCodeUpperD ||
                                str.charCodeAt(p + 1) === XmlParser.CharCodeLowerD) {
                                if (str.substr(p + 2, 6).toUpperCase() !== 'OCTYPE') {
                                    throw new XmlError('Expected <!DOCTYPE', str, p);
                                }
                                p += 8;
                                state = XmlState.Doctype;
                                start = p + 1;
                            }
                            else if (str.charCodeAt(p + 1) !== XmlParser.CharCodeMinus ||
                                str.charCodeAt(p + 2) !== XmlParser.CharCodeMinus) {
                                throw new XmlError('Expected <!--', str, p);
                            }
                            else {
                                p += 2;
                                state = XmlState.Comment;
                                start = p + 1;
                            }
                            break;
                        case XmlParser.CharCodeQuestion:
                            state = XmlState.Header;
                            start = p;
                            break;
                        case XmlParser.CharCodeSlash:
                            if (!parent) {
                                throw new XmlError('Expected node name', str, p);
                            }
                            start = p + 1;
                            state = XmlState.IgnoreSpaces;
                            next = XmlState.Close;
                            break;
                        default:
                            state = XmlState.TagName;
                            start = p;
                            continue;
                    }
                    break;
                case XmlState.TagName:
                    if (!XmlParser.isValidChar(c)) {
                        if (p === start) {
                            throw new XmlError('Expected node name', str, p);
                        }
                        xml = new XmlNode();
                        xml.nodeType = XmlNodeType.Element;
                        xml.localName = str.substr(start, p - start);
                        parent.addChild(xml);
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.Body;
                        continue;
                    }
                    break;
                case XmlState.Body:
                    switch (c) {
                        case XmlParser.CharCodeSlash:
                            state = XmlState.WaitEnd;
                            break;
                        case XmlParser.CharCodeGreaterThan:
                            state = XmlState.Childs;
                            break;
                        default:
                            state = XmlState.AttribName;
                            start = p;
                            continue;
                    }
                    break;
                case XmlState.AttribName:
                    if (!XmlParser.isValidChar(c)) {
                        if (start === p) {
                            throw new XmlError('Expected attribute name', str, p);
                        }
                        let tmp = str.substr(start, p - start);
                        aname = tmp;
                        if (xml.attributes.has(aname)) {
                            throw new XmlError(`Duplicate attribute [${aname}]`, str, p);
                        }
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.Equals;
                        continue;
                    }
                    break;
                case XmlState.Equals:
                    switch (c) {
                        case XmlParser.CharCodeEquals:
                            state = XmlState.IgnoreSpaces;
                            next = XmlState.AttvalBegin;
                            break;
                        default:
                            throw new XmlError('Expected =', str, p);
                    }
                    break;
                case XmlState.AttvalBegin:
                    switch (c) {
                        case XmlParser.CharCodeDoubleQuote:
                        case XmlParser.CharCodeSingleQuote:
                            buf = '';
                            state = XmlState.AttribVal;
                            start = p + 1;
                            attrValQuote = c;
                            break;
                    }
                    break;
                case XmlState.AttribVal:
                    switch (c) {
                        case XmlParser.CharCodeAmp:
                            buf += str.substr(start, p - start);
                            state = XmlState.Escape;
                            escapeNext = XmlState.AttribVal;
                            start = p + 1;
                            break;
                        default:
                            if (c === attrValQuote) {
                                buf += str.substr(start, p - start);
                                let value = buf;
                                buf = '';
                                xml.attributes.set(aname, value);
                                state = XmlState.IgnoreSpaces;
                                next = XmlState.Body;
                            }
                            break;
                    }
                    break;
                case XmlState.Childs:
                    p = XmlParser.parse(str, p, xml);
                    start = p;
                    state = XmlState.Begin;
                    break;
                case XmlState.WaitEnd:
                    switch (c) {
                        case XmlParser.CharCodeGreaterThan:
                            state = XmlState.Begin;
                            break;
                        default:
                            throw new XmlError('Expected >', str, p);
                    }
                    break;
                case XmlState.WaitEndRet:
                    switch (c) {
                        case XmlParser.CharCodeGreaterThan:
                            return p;
                        default:
                            throw new XmlError('Expected >', str, p);
                    }
                case XmlState.Close:
                    if (!XmlParser.isValidChar(c)) {
                        if (start === p) {
                            throw new XmlError('Expected node name', str, p);
                        }
                        let v = str.substr(start, p - start);
                        if (v !== parent.localName) {
                            throw new XmlError('Expected </' + parent.localName + '>', str, p);
                        }
                        state = XmlState.IgnoreSpaces;
                        next = XmlState.WaitEndRet;
                        continue;
                    }
                    break;
                case XmlState.Comment:
                    if (c === XmlParser.CharCodeMinus &&
                        str.charCodeAt(p + 1) === XmlParser.CharCodeMinus &&
                        str.charCodeAt(p + 2) === XmlParser.CharCodeGreaterThan) {
                        p += 2;
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.Doctype:
                    if (c === XmlParser.CharCodeBrackedOpen) {
                        nbrackets++;
                    }
                    else if (c === XmlParser.CharCodeBrackedClose) {
                        nbrackets--;
                    }
                    else if (c === XmlParser.CharCodeGreaterThan && nbrackets === 0) {
                        // >
                        let node = new XmlNode();
                        node.nodeType = XmlNodeType.DocumentType;
                        node.value = str.substr(start, p - start);
                        parent.addChild(node);
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.Header:
                    if (c === XmlParser.CharCodeQuestion && str.charCodeAt(p + 1) === XmlParser.CharCodeGreaterThan) {
                        p++;
                        state = XmlState.Begin;
                    }
                    break;
                case XmlState.Escape:
                    if (c === XmlParser.CharCodeSemi) {
                        let s = str.substr(start, p - start);
                        if (s.charCodeAt(0) === XmlParser.CharCodeSharp) {
                            let code = s.charCodeAt(1) === XmlParser.CharCodeLowerX
                                ? parseInt('0' + s.substr(1, s.length - 1))
                                : parseInt(s.substr(1, s.length - 1));
                            buf += String.fromCharCode(code);
                        }
                        else if (XmlParser.Escapes.has(s)) {
                            buf += XmlParser.Escapes.get(s);
                        }
                        else {
                            buf += (_a = ('&' + s + ';')) === null || _a === void 0 ? void 0 : _a.toString();
                        }
                        start = p + 1;
                        state = escapeNext;
                    }
                    else if (!XmlParser.isValidChar(c) && c !== XmlParser.CharCodeSharp) {
                        buf += '&';
                        buf += str.substr(start, p - start);
                        p--;
                        start = p + 1;
                        state = escapeNext;
                    }
                    break;
            }
            p++;
        }
        if (state === XmlState.Begin) {
            start = p;
            state = XmlState.Pcdata;
        }
        if (state === XmlState.Pcdata) {
            if (p !== start) {
                buf += str.substr(start, p - start);
                let node = new XmlNode();
                node.nodeType = XmlNodeType.Text;
                node.value = buf;
                parent.addChild(node);
            }
            return p;
        }
        if (state === XmlState.Escape && escapeNext === XmlState.Pcdata) {
            buf += '&';
            buf += str.substr(start, p - start);
            let node = new XmlNode();
            node.nodeType = XmlNodeType.Text;
            node.value = buf;
            parent.addChild(node);
            return p;
        }
        throw new XmlError('Unexpected end', str, p);
    }
    static isValidChar(c) {
        return ((c >= XmlParser.CharCodeLowerA && c <= XmlParser.CharCodeLowerZ) ||
            (c >= XmlParser.CharCodeUpperA && c <= XmlParser.CharCodeUpperZ) ||
            (c >= XmlParser.CharCode0 && c <= XmlParser.CharCode9) ||
            c === XmlParser.CharCodeColon ||
            c === XmlParser.CharCodeDot ||
            c === XmlParser.CharCodeUnderscore ||
            c === XmlParser.CharCodeMinus);
    }
}
XmlParser.CharCodeLF = 10;
XmlParser.CharCodeTab = 9;
XmlParser.CharCodeCR = 13;
XmlParser.CharCodeSpace = 32;
XmlParser.CharCodeLowerThan = 60;
XmlParser.CharCodeAmp = 38;
XmlParser.CharCodeBrackedClose = 93;
XmlParser.CharCodeBrackedOpen = 91;
XmlParser.CharCodeGreaterThan = 62;
XmlParser.CharCodeExclamation = 33;
XmlParser.CharCodeUpperD = 68;
XmlParser.CharCodeLowerD = 100;
XmlParser.CharCodeMinus = 45;
XmlParser.CharCodeQuestion = 63;
XmlParser.CharCodeSlash = 47;
XmlParser.CharCodeEquals = 61;
XmlParser.CharCodeDoubleQuote = 34;
XmlParser.CharCodeSingleQuote = 39;
XmlParser.CharCodeSharp = 35;
XmlParser.CharCodeLowerX = 120;
XmlParser.CharCodeLowerA = 97;
XmlParser.CharCodeLowerZ = 122;
XmlParser.CharCodeUpperA = 65;
XmlParser.CharCodeUpperZ = 90;
XmlParser.CharCode0 = 48;
XmlParser.CharCode9 = 57;
XmlParser.CharCodeColon = 58;
XmlParser.CharCodeDot = 46;
XmlParser.CharCodeUnderscore = 95;
XmlParser.CharCodeSemi = 59;
XmlParser.Escapes = new Map([
    ['lt', '<'],
    ['gt', '>'],
    ['amp', '&'],
    ['quot', '"'],
    ['apos', "'"]
]);
//# sourceMappingURL=XmlParser.js.map