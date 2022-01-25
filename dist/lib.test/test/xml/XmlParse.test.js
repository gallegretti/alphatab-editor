var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { XmlDocument } from '@src/xml/XmlDocument';
import { XmlNodeType } from '@src/xml/XmlNode';
import { TestPlatform } from '@test/TestPlatform';
describe('XmlParseTest', () => {
    it('parseSimple', () => {
        let s = '<root></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
        expect(xml.firstElement.localName).toEqual('root');
        expect(xml.firstElement.childNodes.length).toEqual(0);
    });
    it('parseShorthand', () => {
        let s = '<root />';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
        expect(xml.firstElement.localName).toEqual('root');
        expect(xml.firstElement.childNodes.length).toEqual(0);
    });
    it('parseSingleAttribute', () => {
        let s = '<root att="v"></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
        expect(xml.firstElement.localName).toEqual('root');
        expect(xml.firstElement.getAttribute('att')).toEqual('v');
        expect(xml.firstElement.childNodes.length).toEqual(0);
    });
    it('parseMultipleAttributes', () => {
        let s = '<root att="v" att2="v2"></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
        expect(xml.firstElement.localName).toEqual('root');
        expect(xml.firstElement.getAttribute('att')).toEqual('v');
        expect(xml.firstElement.getAttribute('att2')).toEqual('v2');
        expect(xml.firstElement.childNodes.length).toEqual(0);
    });
    it('parseSimpleText', () => {
        let s = '<root>Text</root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
        expect(xml.firstElement.localName).toEqual('root');
        expect(xml.firstElement.childNodes.length).toEqual(1);
        expect(xml.firstElement.childNodes[0].nodeType).toEqual(XmlNodeType.Text);
        expect(xml.firstElement.childNodes[0].value).toEqual('Text');
    });
    it('parseChild', () => {
        let s = '<root><cc></cc></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
        expect(xml.firstElement.localName).toEqual('root');
        expect(xml.firstElement.childNodes.length).toEqual(1);
        expect(xml.firstElement.childNodes[0].nodeType).toEqual(XmlNodeType.Element);
        expect(xml.firstElement.childNodes[0].localName).toEqual('cc');
    });
    it('parseMultiChild', () => {
        let s = '<root><cc></cc><cc></cc></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
        expect(xml.firstElement.localName).toEqual('root');
        expect(xml.firstElement.childNodes.length).toEqual(2);
        expect(xml.firstElement.childNodes[0].nodeType).toEqual(XmlNodeType.Element);
        expect(xml.firstElement.childNodes[0].localName).toEqual('cc');
        expect(xml.firstElement.childNodes[1].nodeType).toEqual(XmlNodeType.Element);
        expect(xml.firstElement.childNodes[1].localName).toEqual('cc');
    });
    it('parseComments', () => {
        let s = '<!-- some comment --><test><cc c="d"><!-- some comment --></cc><!-- some comment --><cc>value<!-- some comment --></cc></test><!-- ending -->';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
        expect(xml.firstElement.localName).toEqual('test');
        expect(xml.firstElement.childNodes.length).toEqual(2);
        expect(xml.firstElement.childNodes[0].nodeType).toEqual(XmlNodeType.Element);
        expect(xml.firstElement.childNodes[0].localName).toEqual('cc');
        expect(xml.firstElement.childNodes[0].getAttribute('c')).toEqual('d');
        expect(xml.firstElement.childNodes[1].nodeType).toEqual(XmlNodeType.Element);
        expect(xml.firstElement.childNodes[1].localName).toEqual('cc');
        expect(xml.firstElement.childNodes[1].childNodes.length).toEqual(1);
        expect(xml.firstElement.childNodes[1].childNodes[0].nodeType).toEqual(XmlNodeType.Text);
        expect(xml.firstElement.childNodes[1].childNodes[0].value).toEqual('value');
    });
    it('parseDoctype', () => {
        let s = '<!DOCTYPE html><test><cc></cc><cc></cc></test>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
        expect(xml.firstElement.localName).toEqual('test');
        expect(xml.firstElement.childNodes.length).toEqual(2);
        expect(xml.firstElement.childNodes[0].nodeType).toEqual(XmlNodeType.Element);
        expect(xml.firstElement.childNodes[0].localName).toEqual('cc');
        expect(xml.firstElement.childNodes[1].nodeType).toEqual(XmlNodeType.Element);
        expect(xml.firstElement.childNodes[1].localName).toEqual('cc');
    });
    it('parseXmlHeadTest', () => {
        let s = '<?xml version="1.0" encoding="utf-8"`?><root></root>';
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
        expect(xml.firstElement.localName).toEqual('root');
    });
    it('parseFull', () => __awaiter(void 0, void 0, void 0, function* () {
        const s = yield TestPlatform.loadFileAsString('test-data/xml/GPIF.xml');
        let xml = new XmlDocument();
        xml.parse(s);
        expect(xml.firstElement).toBeTruthy();
    }));
});
//# sourceMappingURL=XmlParse.test.js.map