import { JsonHelper } from "@src/io/JsonHelper";
import { AutomationType } from "@src/model/Automation";
export class AutomationSerializer {
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
        o.set("isLinear", obj.isLinear);
        o.set("type", obj.type);
        o.set("value", obj.value);
        o.set("ratioPosition", obj.ratioPosition);
        o.set("text", obj.text);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "islinear":
                obj.isLinear = v;
                return true;
            case "type":
                obj.type = JsonHelper.parseEnum(v, AutomationType);
                return true;
            case "value":
                obj.value = v;
                return true;
            case "ratioposition":
                obj.ratioPosition = v;
                return true;
            case "text":
                obj.text = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=AutomationSerializer.js.map