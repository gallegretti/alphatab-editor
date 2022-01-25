import { JsonHelper } from "@src/io/JsonHelper";
import { BarSerializer } from "@src/generated/model/BarSerializer";
import { ChordSerializer } from "@src/generated/model/ChordSerializer";
import { TuningSerializer } from "@src/generated/model/TuningSerializer";
import { Bar } from "@src/model/Bar";
import { Chord } from "@src/model/Chord";
export class StaffSerializer {
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
        o.set("bars", obj.bars.map(i => BarSerializer.toJson(i)));
        {
            const m = new Map();
            o.set("chords", m);
            for (const [k, v] of obj.chords) {
                m.set(k.toString(), ChordSerializer.toJson(v));
            }
        }
        o.set("capo", obj.capo);
        o.set("transpositionPitch", obj.transpositionPitch);
        o.set("displayTranspositionPitch", obj.displayTranspositionPitch);
        o.set("stringTuning", TuningSerializer.toJson(obj.stringTuning));
        o.set("showTablature", obj.showTablature);
        o.set("showStandardNotation", obj.showStandardNotation);
        o.set("isPercussion", obj.isPercussion);
        o.set("standardNotationLineCount", obj.standardNotationLineCount);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "bars":
                obj.bars = [];
                for (const o of v) {
                    const i = new Bar();
                    BarSerializer.fromJson(i, o);
                    obj.addBar(i);
                }
                return true;
            case "chords":
                obj.chords = new Map();
                JsonHelper.forEach(v, (v, k) => {
                    const i = new Chord();
                    ChordSerializer.fromJson(i, v);
                    obj.addChord(k, i);
                });
                return true;
            case "capo":
                obj.capo = v;
                return true;
            case "transpositionpitch":
                obj.transpositionPitch = v;
                return true;
            case "displaytranspositionpitch":
                obj.displayTranspositionPitch = v;
                return true;
            case "showtablature":
                obj.showTablature = v;
                return true;
            case "showstandardnotation":
                obj.showStandardNotation = v;
                return true;
            case "ispercussion":
                obj.isPercussion = v;
                return true;
            case "standardnotationlinecount":
                obj.standardNotationLineCount = v;
                return true;
        }
        if (["stringtuning"].indexOf(property) >= 0) {
            TuningSerializer.fromJson(obj.stringTuning, v);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=StaffSerializer.js.map