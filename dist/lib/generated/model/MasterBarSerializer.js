import { JsonHelper } from "@src/io/JsonHelper";
import { SectionSerializer } from "@src/generated/model/SectionSerializer";
import { AutomationSerializer } from "@src/generated/model/AutomationSerializer";
import { FermataSerializer } from "@src/generated/model/FermataSerializer";
import { KeySignature } from "@src/model/KeySignature";
import { KeySignatureType } from "@src/model/KeySignatureType";
import { TripletFeel } from "@src/model/TripletFeel";
import { Section } from "@src/model/Section";
import { Automation } from "@src/model/Automation";
import { Fermata } from "@src/model/Fermata";
export class MasterBarSerializer {
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
        o.set("alternateEndings", obj.alternateEndings);
        o.set("keySignature", obj.keySignature);
        o.set("keySignatureType", obj.keySignatureType);
        o.set("isDoubleBar", obj.isDoubleBar);
        o.set("isRepeatStart", obj.isRepeatStart);
        o.set("repeatCount", obj.repeatCount);
        o.set("timeSignatureNumerator", obj.timeSignatureNumerator);
        o.set("timeSignatureDenominator", obj.timeSignatureDenominator);
        o.set("timeSignatureCommon", obj.timeSignatureCommon);
        o.set("tripletFeel", obj.tripletFeel);
        o.set("section", SectionSerializer.toJson(obj.section));
        o.set("tempoAutomation", AutomationSerializer.toJson(obj.tempoAutomation));
        {
            const m = new Map();
            o.set("fermata", m);
            for (const [k, v] of obj.fermata) {
                m.set(k.toString(), FermataSerializer.toJson(v));
            }
        }
        o.set("start", obj.start);
        o.set("isAnacrusis", obj.isAnacrusis);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "alternateendings":
                obj.alternateEndings = v;
                return true;
            case "keysignature":
                obj.keySignature = JsonHelper.parseEnum(v, KeySignature);
                return true;
            case "keysignaturetype":
                obj.keySignatureType = JsonHelper.parseEnum(v, KeySignatureType);
                return true;
            case "isdoublebar":
                obj.isDoubleBar = v;
                return true;
            case "isrepeatstart":
                obj.isRepeatStart = v;
                return true;
            case "repeatcount":
                obj.repeatCount = v;
                return true;
            case "timesignaturenumerator":
                obj.timeSignatureNumerator = v;
                return true;
            case "timesignaturedenominator":
                obj.timeSignatureDenominator = v;
                return true;
            case "timesignaturecommon":
                obj.timeSignatureCommon = v;
                return true;
            case "tripletfeel":
                obj.tripletFeel = JsonHelper.parseEnum(v, TripletFeel);
                return true;
            case "fermata":
                obj.fermata = new Map();
                JsonHelper.forEach(v, (v, k) => {
                    const i = new Fermata();
                    FermataSerializer.fromJson(i, v);
                    obj.fermata.set(parseInt(k), i);
                });
                return true;
            case "start":
                obj.start = v;
                return true;
            case "isanacrusis":
                obj.isAnacrusis = v;
                return true;
        }
        if (["section"].indexOf(property) >= 0) {
            if (v) {
                obj.section = new Section();
                SectionSerializer.fromJson(obj.section, v);
            }
            else {
                obj.section = null;
            }
            return true;
        }
        if (["tempoautomation"].indexOf(property) >= 0) {
            if (v) {
                obj.tempoAutomation = new Automation();
                AutomationSerializer.fromJson(obj.tempoAutomation, v);
            }
            else {
                obj.tempoAutomation = null;
            }
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=MasterBarSerializer.js.map