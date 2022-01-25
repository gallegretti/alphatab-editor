import { JsonHelper } from "@src/io/JsonHelper";
export class SlidePlaybackSettingsSerializer {
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
        o.set("simpleSlidePitchOffset", obj.simpleSlidePitchOffset);
        o.set("simpleSlideDurationRatio", obj.simpleSlideDurationRatio);
        o.set("shiftSlideDurationRatio", obj.shiftSlideDurationRatio);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "simpleslidepitchoffset":
                obj.simpleSlidePitchOffset = v;
                return true;
            case "simpleslidedurationratio":
                obj.simpleSlideDurationRatio = v;
                return true;
            case "shiftslidedurationratio":
                obj.shiftSlideDurationRatio = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=SlidePlaybackSettingsSerializer.js.map