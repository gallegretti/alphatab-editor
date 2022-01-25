import { JsonHelper } from "@src/io/JsonHelper";
import { Font } from "@src/model/Font";
import { Color } from "@src/model/Color";
export class RenderingResourcesSerializer {
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
        o.set("copyrightFont", Font.toJson(obj.copyrightFont));
        o.set("titleFont", Font.toJson(obj.titleFont));
        o.set("subTitleFont", Font.toJson(obj.subTitleFont));
        o.set("wordsFont", Font.toJson(obj.wordsFont));
        o.set("effectFont", Font.toJson(obj.effectFont));
        o.set("fretboardNumberFont", Font.toJson(obj.fretboardNumberFont));
        o.set("tablatureFont", Font.toJson(obj.tablatureFont));
        o.set("graceFont", Font.toJson(obj.graceFont));
        o.set("staffLineColor", Color.toJson(obj.staffLineColor));
        o.set("barSeparatorColor", Color.toJson(obj.barSeparatorColor));
        o.set("barNumberFont", Font.toJson(obj.barNumberFont));
        o.set("barNumberColor", Color.toJson(obj.barNumberColor));
        o.set("fingeringFont", Font.toJson(obj.fingeringFont));
        o.set("markerFont", Font.toJson(obj.markerFont));
        o.set("mainGlyphColor", Color.toJson(obj.mainGlyphColor));
        o.set("secondaryGlyphColor", Color.toJson(obj.secondaryGlyphColor));
        o.set("scoreInfoColor", Color.toJson(obj.scoreInfoColor));
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "copyrightfont":
                obj.copyrightFont = Font.fromJson(v);
                return true;
            case "titlefont":
                obj.titleFont = Font.fromJson(v);
                return true;
            case "subtitlefont":
                obj.subTitleFont = Font.fromJson(v);
                return true;
            case "wordsfont":
                obj.wordsFont = Font.fromJson(v);
                return true;
            case "effectfont":
                obj.effectFont = Font.fromJson(v);
                return true;
            case "fretboardnumberfont":
                obj.fretboardNumberFont = Font.fromJson(v);
                return true;
            case "tablaturefont":
                obj.tablatureFont = Font.fromJson(v);
                return true;
            case "gracefont":
                obj.graceFont = Font.fromJson(v);
                return true;
            case "stafflinecolor":
                obj.staffLineColor = Color.fromJson(v);
                return true;
            case "barseparatorcolor":
                obj.barSeparatorColor = Color.fromJson(v);
                return true;
            case "barnumberfont":
                obj.barNumberFont = Font.fromJson(v);
                return true;
            case "barnumbercolor":
                obj.barNumberColor = Color.fromJson(v);
                return true;
            case "fingeringfont":
                obj.fingeringFont = Font.fromJson(v);
                return true;
            case "markerfont":
                obj.markerFont = Font.fromJson(v);
                return true;
            case "mainglyphcolor":
                obj.mainGlyphColor = Color.fromJson(v);
                return true;
            case "secondaryglyphcolor":
                obj.secondaryGlyphColor = Color.fromJson(v);
                return true;
            case "scoreinfocolor":
                obj.scoreInfoColor = Color.fromJson(v);
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=RenderingResourcesSerializer.js.map