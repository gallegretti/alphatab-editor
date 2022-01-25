import { JsonHelper } from "@src/io/JsonHelper";
import { StaffSerializer } from "@src/generated/model/StaffSerializer";
import { PlaybackInformationSerializer } from "@src/generated/model/PlaybackInformationSerializer";
import { Color } from "@src/model/Color";
import { InstrumentArticulationSerializer } from "@src/generated/model/InstrumentArticulationSerializer";
import { Staff } from "@src/model/Staff";
import { InstrumentArticulation } from "@src/model/InstrumentArticulation";
export class TrackSerializer {
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
        o.set("staves", obj.staves.map(i => StaffSerializer.toJson(i)));
        o.set("playbackInfo", PlaybackInformationSerializer.toJson(obj.playbackInfo));
        o.set("color", Color.toJson(obj.color));
        o.set("name", obj.name);
        o.set("shortName", obj.shortName);
        o.set("percussionArticulations", obj.percussionArticulations.map(i => InstrumentArticulationSerializer.toJson(i)));
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "staves":
                obj.staves = [];
                for (const o of v) {
                    const i = new Staff();
                    StaffSerializer.fromJson(i, o);
                    obj.addStaff(i);
                }
                return true;
            case "color":
                obj.color = Color.fromJson(v);
                return true;
            case "name":
                obj.name = v;
                return true;
            case "shortname":
                obj.shortName = v;
                return true;
            case "percussionarticulations":
                obj.percussionArticulations = [];
                for (const o of v) {
                    const i = new InstrumentArticulation();
                    InstrumentArticulationSerializer.fromJson(i, o);
                    obj.percussionArticulations.push(i);
                }
                return true;
        }
        if (["playbackinfo"].indexOf(property) >= 0) {
            PlaybackInformationSerializer.fromJson(obj.playbackInfo, v);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=TrackSerializer.js.map