import { JsonHelper } from "@src/io/JsonHelper";
export class SectionSerializer {
    static fromJson(obj, m) {
        if (!m) {
            return;
        }
        JsonHelper.forEach(m, (v, k) => this.setProperty(obj, k.toLowerCase(), v));
    }
    static toJson(obj) {
        if (!obj) {
            return null;
        }
        const o = new Map();
        o.set("marker", obj.marker);
        o.set("text", obj.text);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "marker":
                obj.marker = v;
                return true;
            case "text":
                obj.text = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=SectionSerializer.js.map