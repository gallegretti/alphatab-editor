export declare enum XmlNodeType {
    None = 0,
    Element = 1,
    Text = 2,
    CDATA = 3,
    Document = 4,
    DocumentType = 5
}
export declare class XmlNode {
    nodeType: XmlNodeType;
    localName: string | null;
    value: string | null;
    childNodes: XmlNode[];
    attributes: Map<string, string>;
    firstChild: XmlNode | null;
    firstElement: XmlNode | null;
    addChild(node: XmlNode): void;
    getAttribute(name: string): string;
    getElementsByTagName(name: string, recursive?: boolean): XmlNode[];
    private searchElementsByTagName;
    findChildElement(name: string): XmlNode | null;
    addElement(name: string): XmlNode;
    get innerText(): string;
    set innerText(value: string);
    setCData(s: string): void;
}
