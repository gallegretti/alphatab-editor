import { JsonHelper } from "@src/io/JsonHelper";
export class BendPointSerializer {
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
        o.set("offset", obj.offset);
        o.set("value", obj.value);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "offset":
                obj.offset = v;
                return true;
            case "value":
                obj.value = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=BendPointSerializer.js.map