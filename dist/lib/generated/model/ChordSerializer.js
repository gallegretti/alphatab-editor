import { JsonHelper } from "@src/io/JsonHelper";
export class ChordSerializer {
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
        o.set("name", obj.name);
        o.set("firstFret", obj.firstFret);
        o.set("strings", obj.strings);
        o.set("barreFrets", obj.barreFrets);
        o.set("showName", obj.showName);
        o.set("showDiagram", obj.showDiagram);
        o.set("showFingering", obj.showFingering);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "name":
                obj.name = v;
                return true;
            case "firstfret":
                obj.firstFret = v;
                return true;
            case "strings":
                obj.strings = v;
                return true;
            case "barrefrets":
                obj.barreFrets = v;
                return true;
            case "showname":
                obj.showName = v;
                return true;
            case "showdiagram":
                obj.showDiagram = v;
                return true;
            case "showfingering":
                obj.showFingering = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=ChordSerializer.js.map