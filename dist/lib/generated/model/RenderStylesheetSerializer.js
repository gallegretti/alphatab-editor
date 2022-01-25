import { JsonHelper } from "@src/io/JsonHelper";
export class RenderStylesheetSerializer {
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
        o.set("hideDynamics", obj.hideDynamics);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "hidedynamics":
                obj.hideDynamics = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=RenderStylesheetSerializer.js.map