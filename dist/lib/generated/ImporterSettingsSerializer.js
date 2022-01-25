import { JsonHelper } from "@src/io/JsonHelper";
export class ImporterSettingsSerializer {
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
        o.set("encoding", obj.encoding);
        o.set("mergePartGroupsInMusicXml", obj.mergePartGroupsInMusicXml);
        o.set("beatTextAsLyrics", obj.beatTextAsLyrics);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "encoding":
                obj.encoding = v;
                return true;
            case "mergepartgroupsinmusicxml":
                obj.mergePartGroupsInMusicXml = v;
                return true;
            case "beattextaslyrics":
                obj.beatTextAsLyrics = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=ImporterSettingsSerializer.js.map