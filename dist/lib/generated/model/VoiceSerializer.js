import { JsonHelper } from "@src/io/JsonHelper";
import { BeatSerializer } from "@src/generated/model/BeatSerializer";
import { Beat } from "@src/model/Beat";
export class VoiceSerializer {
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
        o.set("beats", obj.beats.map(i => BeatSerializer.toJson(i)));
        o.set("isEmpty", obj.isEmpty);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "id":
                obj.id = v;
                return true;
            case "beats":
                obj.beats = [];
                for (const o of v) {
                    const i = new Beat();
                    BeatSerializer.fromJson(i, o);
                    obj.addBeat(i);
                }
                return true;
            case "isempty":
                obj.isEmpty = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=VoiceSerializer.js.map