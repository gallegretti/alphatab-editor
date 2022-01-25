import { JsonHelper } from "@src/io/JsonHelper";
import { LogLevel } from "@src/LogLevel";
export class CoreSettingsSerializer {
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
        /*@target web*/
        o.set("scriptFile", obj.scriptFile);
        /*@target web*/
        o.set("fontDirectory", obj.fontDirectory);
        /*@target web*/
        o.set("file", obj.file);
        /*@target web*/
        o.set("tex", obj.tex);
        /*@target web*/
        o.set("tracks", obj.tracks);
        o.set("enableLazyLoading", obj.enableLazyLoading);
        o.set("engine", obj.engine);
        o.set("logLevel", obj.logLevel);
        o.set("useWorkers", obj.useWorkers);
        o.set("includeNoteBounds", obj.includeNoteBounds);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            /*@target web*/
            case "scriptfile":
                obj.scriptFile = v;
                return true;
            /*@target web*/
            case "fontdirectory":
                obj.fontDirectory = v;
                return true;
            /*@target web*/
            case "file":
                obj.file = v;
                return true;
            /*@target web*/
            case "tex":
                obj.tex = v;
                return true;
            /*@target web*/
            case "tracks":
                obj.tracks = v;
                return true;
            case "enablelazyloading":
                obj.enableLazyLoading = v;
                return true;
            case "engine":
                obj.engine = v;
                return true;
            case "loglevel":
                obj.logLevel = JsonHelper.parseEnum(v, LogLevel);
                return true;
            case "useworkers":
                obj.useWorkers = v;
                return true;
            case "includenotebounds":
                obj.includeNoteBounds = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=CoreSettingsSerializer.js.map