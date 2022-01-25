import { JsonHelper } from "@src/io/JsonHelper";
export class TuningSerializer {
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
        o.set("isStandard", obj.isStandard);
        o.set("name", obj.name);
        o.set("tunings", obj.tunings);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "isstandard":
                obj.isStandard = v;
                return true;
            case "name":
                obj.name = v;
                return true;
            case "tunings":
                obj.tunings = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=TuningSerializer.js.map