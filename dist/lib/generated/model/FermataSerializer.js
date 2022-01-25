import { JsonHelper } from "@src/io/JsonHelper";
import { FermataType } from "@src/model/Fermata";
export class FermataSerializer {
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
        o.set("type", obj.type);
        o.set("length", obj.length);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "type":
                obj.type = JsonHelper.parseEnum(v, FermataType);
                return true;
            case "length":
                obj.length = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=FermataSerializer.js.map