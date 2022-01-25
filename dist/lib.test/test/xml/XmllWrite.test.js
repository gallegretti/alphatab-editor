import { XmlDocument } from '@src/xml/XmlDocument';
describe('XmlWriteTest', () => {
    it('writeSimple', () => {
        let s = '<root></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.toFormattedString()).toEqual('<root/>');
    });
    it('writeSingleAttribute', () => {
        let s = '<root att="v"></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.toFormattedString()).toEqual('<root att="v"/>');
    });
    it('writeMultipleAttributes', () => {
        let s = '<root att="v" att2="v2"></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.toFormattedString()).toEqual('<root att="v" att2="v2"/>');
    });
    it('writeSimpleText', () => {
        let s = '<root>Text</root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.toFormattedString()).toEqual(s);
    });
    it('writeSimpleTextFormatted', () => {
        let s = '<root>Text</root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.toFormattedString("  ")).toEqual(s);
    });
    it('writeChild', () => {
        let s = '<root><cc></cc></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.toFormattedString()).toEqual('<root><cc/></root>');
        expect(xml.toFormattedString("  ")).toEqual('<root>\n  <cc/>\n</root>');
        expect(xml.toFormattedString("    ")).toEqual('<root>\n    <cc/>\n</root>');
    });
    it('writeNumber', () => {
        let s = '<root><cc>0.5</cc></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.toFormattedString()).toEqual('<root><cc>0.5</cc></root>');
    });
    it('writeMultiChild', () => {
        let s = '<root><cc></cc><cc></cc></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.toFormattedString()).toEqual('<root><cc/><cc/></root>');
        expect(xml.toFormattedString("  ")).toEqual('<root>\n  <cc/>\n  <cc/>\n</root>');
        expect(xml.toFormattedString("    ")).toEqual('<root>\n    <cc/>\n    <cc/>\n</root>');
    });
    it('writeXmlHeadTest', () => {
        let s = '<?xml version="1.0" encoding="utf-8"?><root></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.toFormattedString('', true)).toEqual('<?xml version="1.0" encoding="utf-8"?><root/>');
        expect(xml.toFormattedString("  ", true)).toEqual('<?xml version="1.0" encoding="utf-8"?>\n<root/>');
    });
    it('writeDoctype', () => {
        let s = '<!DOCTYPE html><test/>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.toFormattedString()).toEqual(s);
        expect(xml.toFormattedString("  ")).toEqual('<!DOCTYPE html>\n<test/>');
    });
    it('writeEscapedAttributeValues', () => {
        let s = '<test/>';
        let xml = new XmlDocument();
        xml.parse(s);
        xml.firstElement.attributes.set("lt", "<");
        xml.firstElement.attributes.set("gt", ">");
        xml.firstElement.attributes.set("amp", "&");
        xml.firstElement.attributes.set("apos", "'");
        xml.firstElement.attributes.set("quot", "\"");
        expect(xml.toFormattedString()).toEqual('<test lt="&lt;" gt="&gt;" amp="&amp;" apos="&apos;" quot="&quot;"/>');
    });
});
//# sourceMappingURL=XmllWrite.test.js.map