import { JsonHelper } from "@src/io/JsonHelper";
import { MasterBarSerializer } from "@src/generated/model/MasterBarSerializer";
import { TrackSerializer } from "@src/generated/model/TrackSerializer";
import { RenderStylesheetSerializer } from "@src/generated/model/RenderStylesheetSerializer";
import { MasterBar } from "@src/model/MasterBar";
import { Track } from "@src/model/Track";
export class ScoreSerializer {
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
        o.set("album", obj.album);
        o.set("artist", obj.artist);
        o.set("copyright", obj.copyright);
        o.set("instructions", obj.instructions);
        o.set("music", obj.music);
        o.set("notices", obj.notices);
        o.set("subTitle", obj.subTitle);
        o.set("title", obj.title);
        o.set("words", obj.words);
        o.set("tab", obj.tab);
        o.set("tempo", obj.tempo);
        o.set("tempoLabel", obj.tempoLabel);
        o.set("masterBars", obj.masterBars.map(i => MasterBarSerializer.toJson(i)));
        o.set("tracks", obj.tracks.map(i => TrackSerializer.toJson(i)));
        o.set("stylesheet", RenderStylesheetSerializer.toJson(obj.stylesheet));
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "album":
                obj.album = v;
                return true;
            case "artist":
                obj.artist = v;
                return true;
            case "copyright":
                obj.copyright = v;
                return true;
            case "instructions":
                obj.instructions = v;
                return true;
            case "music":
                obj.music = v;
                return true;
            case "notices":
                obj.notices = v;
                return true;
            case "subtitle":
                obj.subTitle = v;
                return true;
            case "title":
                obj.title = v;
                return true;
            case "words":
                obj.words = v;
                return true;
            case "tab":
                obj.tab = v;
                return true;
            case "tempo":
                obj.tempo = v;
                return true;
            case "tempolabel":
                obj.tempoLabel = v;
                return true;
            case "masterbars":
                obj.masterBars = [];
                for (const o of v) {
                    const i = new MasterBar();
                    MasterBarSerializer.fromJson(i, o);
                    obj.addMasterBar(i);
                }
                return true;
            case "tracks":
                obj.tracks = [];
                for (const o of v) {
                    const i = new Track();
                    TrackSerializer.fromJson(i, o);
                    obj.addTrack(i);
                }
                return true;
        }
        if (["stylesheet"].indexOf(property) >= 0) {
            RenderStylesheetSerializer.fromJson(obj.stylesheet, v);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=ScoreSerializer.js.map