import { JsonHelper } from "@src/io/JsonHelper";
import { NotationMode } from "@src/NotationSettings";
import { FingeringMode } from "@src/NotationSettings";
import { NotationElement } from "@src/NotationSettings";
import { TabRhythmMode } from "@src/NotationSettings";
export class NotationSettingsSerializer {
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
        o.set("notationMode", obj.notationMode);
        o.set("fingeringMode", obj.fingeringMode);
        {
            const m = new Map();
            o.set("elements", m);
            for (const [k, v] of obj.elements) {
                m.set(k.toString(), v);
            }
        }
        o.set("rhythmMode", obj.rhythmMode);
        o.set("rhythmHeight", obj.rhythmHeight);
        o.set("transpositionPitches", obj.transpositionPitches);
        o.set("displayTranspositionPitches", obj.displayTranspositionPitches);
        o.set("smallGraceTabNotes", obj.smallGraceTabNotes);
        o.set("extendBendArrowsOnTiedNotes", obj.extendBendArrowsOnTiedNotes);
        o.set("extendLineEffectsToBeatEnd", obj.extendLineEffectsToBeatEnd);
        o.set("slurHeight", obj.slurHeight);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "notationmode":
                obj.notationMode = JsonHelper.parseEnum(v, NotationMode);
                return true;
            case "fingeringmode":
                obj.fingeringMode = JsonHelper.parseEnum(v, FingeringMode);
                return true;
            case "elements":
                obj.elements = new Map();
                JsonHelper.forEach(v, (v, k) => {
                    obj.elements.set(JsonHelper.parseEnum(k, NotationElement), v);
                });
                return true;
            case "rhythmmode":
                obj.rhythmMode = JsonHelper.parseEnum(v, TabRhythmMode);
                return true;
            case "rhythmheight":
                obj.rhythmHeight = v;
                return true;
            case "transpositionpitches":
                obj.transpositionPitches = v;
                return true;
            case "displaytranspositionpitches":
                obj.displayTranspositionPitches = v;
                return true;
            case "smallgracetabnotes":
                obj.smallGraceTabNotes = v;
                return true;
            case "extendbendarrowsontiednotes":
                obj.extendBendArrowsOnTiedNotes = v;
                return true;
            case "extendlineeffectstobeatend":
                obj.extendLineEffectsToBeatEnd = v;
                return true;
            case "slurheight":
                obj.slurHeight = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=NotationSettingsSerializer.js.map