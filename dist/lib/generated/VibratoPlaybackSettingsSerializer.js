import { JsonHelper } from "@src/io/JsonHelper";
export class VibratoPlaybackSettingsSerializer {
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
        o.set("noteWideLength", obj.noteWideLength);
        o.set("noteWideAmplitude", obj.noteWideAmplitude);
        o.set("noteSlightLength", obj.noteSlightLength);
        o.set("noteSlightAmplitude", obj.noteSlightAmplitude);
        o.set("beatWideLength", obj.beatWideLength);
        o.set("beatWideAmplitude", obj.beatWideAmplitude);
        o.set("beatSlightLength", obj.beatSlightLength);
        o.set("beatSlightAmplitude", obj.beatSlightAmplitude);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "notewidelength":
                obj.noteWideLength = v;
                return true;
            case "notewideamplitude":
                obj.noteWideAmplitude = v;
                return true;
            case "noteslightlength":
                obj.noteSlightLength = v;
                return true;
            case "noteslightamplitude":
                obj.noteSlightAmplitude = v;
                return true;
            case "beatwidelength":
                obj.beatWideLength = v;
                return true;
            case "beatwideamplitude":
                obj.beatWideAmplitude = v;
                return true;
            case "beatslightlength":
                obj.beatSlightLength = v;
                return true;
            case "beatslightamplitude":
                obj.beatSlightAmplitude = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=VibratoPlaybackSettingsSerializer.js.map