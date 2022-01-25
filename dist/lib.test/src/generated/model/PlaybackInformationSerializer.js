import { JsonHelper } from "@src/io/JsonHelper";
export class PlaybackInformationSerializer {
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
        o.set("volume", obj.volume);
        o.set("balance", obj.balance);
        o.set("port", obj.port);
        o.set("program", obj.program);
        o.set("primaryChannel", obj.primaryChannel);
        o.set("secondaryChannel", obj.secondaryChannel);
        o.set("isMute", obj.isMute);
        o.set("isSolo", obj.isSolo);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "volume":
                obj.volume = v;
                return true;
            case "balance":
                obj.balance = v;
                return true;
            case "port":
                obj.port = v;
                return true;
            case "program":
                obj.program = v;
                return true;
            case "primarychannel":
                obj.primaryChannel = v;
                return true;
            case "secondarychannel":
                obj.secondaryChannel = v;
                return true;
            case "ismute":
                obj.isMute = v;
                return true;
            case "issolo":
                obj.isSolo = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=PlaybackInformationSerializer.js.map