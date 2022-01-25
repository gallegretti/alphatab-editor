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
export var XmlNodeType;
(function (XmlNodeType) {
    XmlNodeType[XmlNodeType["None"] = 0] = "None";
    XmlNodeType[XmlNodeType["Element"] = 1] = "Element";
    XmlNodeType[XmlNodeType["Text"] = 2] = "Text";
    XmlNodeType[XmlNodeType["CDATA"] = 3] = "CDATA";
    XmlNodeType[XmlNodeType["Document"] = 4] = "Document";
    XmlNodeType[XmlNodeType["DocumentType"] = 5] = "DocumentType";
})(XmlNodeType || (XmlNodeType = {}));
export class XmlNode {
    constructor() {
        this.nodeType = XmlNodeType.None;
        this.localName = null;
        this.value = null;
        this.childNodes = [];
        this.attributes = new Map();
        this.firstChild = null;
        this.firstElement = null;
    }
    addChild(node) {
        this.childNodes.push(node);
        this.firstChild = node;
        if (node.nodeType === XmlNodeType.Element || node.nodeType === XmlNodeType.CDATA) {
            this.firstElement = node;
        }
    }
    getAttribute(name) {
        if (this.attributes.has(name)) {
            return this.attributes.get(name);
        }
        return '';
    }
    getElementsByTagName(name, recursive = false) {
        let tags = [];
        this.searchElementsByTagName(this.childNodes, tags, name, recursive);
        return tags;
    }
    searchElementsByTagName(all, result, name, recursive = false) {
        for (let c of all) {
            if (c && c.nodeType === XmlNodeType.Element && c.localName === name) {
                result.push(c);
            }
            if (recursive) {
                this.searchElementsByTagName(c.childNodes, result, name, true);
            }
        }
    }
    findChildElement(name) {
        for (let c of this.childNodes) {
            if (c && c.nodeType === XmlNodeType.Element && c.localName === name) {
                return c;
            }
        }
        return null;
    }
    addElement(name) {
        const newNode = new XmlNode();
        newNode.nodeType = XmlNodeType.Element;
        newNode.localName = name;
        this.addChild(newNode);
        return newNode;
    }
    get innerText() {
        var _a, _b;
        if (this.nodeType === XmlNodeType.Element || this.nodeType === XmlNodeType.Document) {
            if (this.firstElement && this.firstElement.nodeType === XmlNodeType.CDATA) {
                return this.firstElement.innerText;
            }
            let txt = '';
            for (let c of this.childNodes) {
                txt += (_a = c.innerText) === null || _a === void 0 ? void 0 : _a.toString();
            }
            let s = txt;
            return s.trim();
        }
        return (_b = this.value) !== null && _b !== void 0 ? _b : '';
    }
    set innerText(value) {
        const textNode = new XmlNode();
        textNode.nodeType = XmlNodeType.Text;
        textNode.value = value;
        this.childNodes = [textNode];
    }
    setCData(s) {
        const textNode = new XmlNode();
        textNode.nodeType = XmlNodeType.CDATA;
        textNode.value = s;
        this.childNodes = [textNode];
    }
}
//# sourceMappingURL=XmlNode.js.map