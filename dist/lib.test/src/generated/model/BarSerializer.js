import { JsonHelper } from "@src/io/JsonHelper";
import { VoiceSerializer } from "@src/generated/model/VoiceSerializer";
import { Clef } from "@src/model/Clef";
import { Ottavia } from "@src/model/Ottavia";
import { Voice } from "@src/model/Voice";
import { SimileMark } from "@src/model/SimileMark";
export class BarSerializer {
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
        o.set("id", obj.id);
        o.set("clef", obj.clef);
        o.set("clefOttava", obj.clefOttava);
        o.set("voices", obj.voices.map(i => VoiceSerializer.toJson(i)));
        o.set("simileMark", obj.simileMark);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "id":
                obj.id = v;
                return true;
            case "clef":
                obj.clef = JsonHelper.parseEnum(v, Clef);
                return true;
            case "clefottava":
                obj.clefOttava = JsonHelper.parseEnum(v, Ottavia);
                return true;
            case "voices":
                obj.voices = [];
                for (const o of v) {
                    const i = new Voice();
                    VoiceSerializer.fromJson(i, o);
                    obj.addVoice(i);
                }
                return true;
            case "similemark":
                obj.simileMark = JsonHelper.parseEnum(v, SimileMark);
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=BarSerializer.js.map