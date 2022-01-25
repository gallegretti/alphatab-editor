import { JsonHelper } from "@src/io/JsonHelper";
import { CoreSettingsSerializer } from "@src/generated/CoreSettingsSerializer";
import { DisplaySettingsSerializer } from "@src/generated/DisplaySettingsSerializer";
import { NotationSettingsSerializer } from "@src/generated/NotationSettingsSerializer";
import { ImporterSettingsSerializer } from "@src/generated/ImporterSettingsSerializer";
import { PlayerSettingsSerializer } from "@src/generated/PlayerSettingsSerializer";
export class SettingsSerializer {
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
        o.set("core", CoreSettingsSerializer.toJson(obj.core));
        o.set("display", DisplaySettingsSerializer.toJson(obj.display));
        o.set("notation", NotationSettingsSerializer.toJson(obj.notation));
        o.set("importer", ImporterSettingsSerializer.toJson(obj.importer));
        o.set("player", PlayerSettingsSerializer.toJson(obj.player));
        return o;
    }
    static setProperty(obj, property, v) {
        if (["core", ""].indexOf(property) >= 0) {
            CoreSettingsSerializer.fromJson(obj.core, v);
            return true;
        }
        else {
            for (const c of ["core", ""]) {
                if (property.indexOf(c) === 0) {
                    if (CoreSettingsSerializer.setProperty(obj.core, property.substring(c.length), v)) {
                        return true;
                    }
                }
            }
        }
        if (["display", ""].indexOf(property) >= 0) {
            DisplaySettingsSerializer.fromJson(obj.display, v);
            return true;
        }
        else {
            for (const c of ["display", ""]) {
                if (property.indexOf(c) === 0) {
                    if (DisplaySettingsSerializer.setProperty(obj.display, property.substring(c.length), v)) {
                        return true;
                    }
                }
            }
        }
        if (["notation"].indexOf(property) >= 0) {
            NotationSettingsSerializer.fromJson(obj.notation, v);
            return true;
        }
        else {
            for (const c of ["notation"]) {
                if (property.indexOf(c) === 0) {
                    if (NotationSettingsSerializer.setProperty(obj.notation, property.substring(c.length), v)) {
                        return true;
                    }
                }
            }
        }
        if (["importer"].indexOf(property) >= 0) {
            ImporterSettingsSerializer.fromJson(obj.importer, v);
            return true;
        }
        else {
            for (const c of ["importer"]) {
                if (property.indexOf(c) === 0) {
                    if (ImporterSettingsSerializer.setProperty(obj.importer, property.substring(c.length), v)) {
                        return true;
                    }
                }
            }
        }
        if (["player"].indexOf(property) >= 0) {
            PlayerSettingsSerializer.fromJson(obj.player, v);
            return true;
        }
        else {
            for (const c of ["player"]) {
                if (property.indexOf(c) === 0) {
                    if (PlayerSettingsSerializer.setProperty(obj.player, property.substring(c.length), v)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
//# sourceMappingURL=SettingsSerializer.js.map