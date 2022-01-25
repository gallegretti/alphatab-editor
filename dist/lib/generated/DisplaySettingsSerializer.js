import { JsonHelper } from "@src/io/JsonHelper";
import { RenderingResourcesSerializer } from "@src/generated/RenderingResourcesSerializer";
import { LayoutMode } from "@src/LayoutMode";
import { StaveProfile } from "@src/StaveProfile";
export class DisplaySettingsSerializer {
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
        o.set("scale", obj.scale);
        o.set("stretchForce", obj.stretchForce);
        o.set("layoutMode", obj.layoutMode);
        o.set("staveProfile", obj.staveProfile);
        o.set("barsPerRow", obj.barsPerRow);
        o.set("startBar", obj.startBar);
        o.set("barCount", obj.barCount);
        o.set("barCountPerPartial", obj.barCountPerPartial);
        o.set("resources", RenderingResourcesSerializer.toJson(obj.resources));
        o.set("padding", obj.padding);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "scale":
                obj.scale = v;
                return true;
            case "stretchforce":
                obj.stretchForce = v;
                return true;
            case "layoutmode":
                obj.layoutMode = JsonHelper.parseEnum(v, LayoutMode);
                return true;
            case "staveprofile":
                obj.staveProfile = JsonHelper.parseEnum(v, StaveProfile);
                return true;
            case "barsperrow":
                obj.barsPerRow = v;
                return true;
            case "startbar":
                obj.startBar = v;
                return true;
            case "barcount":
                obj.barCount = v;
                return true;
            case "barcountperpartial":
                obj.barCountPerPartial = v;
                return true;
            case "padding":
                obj.padding = v;
                return true;
        }
        if (["resources"].indexOf(property) >= 0) {
            RenderingResourcesSerializer.fromJson(obj.resources, v);
            return true;
        }
        else {
            for (const c of ["resources"]) {
                if (property.indexOf(c) === 0) {
                    if (RenderingResourcesSerializer.setProperty(obj.resources, property.substring(c.length), v)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
//# sourceMappingURL=DisplaySettingsSerializer.js.map