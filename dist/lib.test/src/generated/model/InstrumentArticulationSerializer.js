import { JsonHelper } from "@src/io/JsonHelper";
import { MusicFontSymbol } from "@src/model/MusicFontSymbol";
import { TextBaseline } from "@src/platform/ICanvas";
export class InstrumentArticulationSerializer {
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
        o.set("elementType", obj.elementType);
        o.set("staffLine", obj.staffLine);
        o.set("noteHeadDefault", obj.noteHeadDefault);
        o.set("noteHeadHalf", obj.noteHeadHalf);
        o.set("noteHeadWhole", obj.noteHeadWhole);
        o.set("techniqueSymbol", obj.techniqueSymbol);
        o.set("techniqueSymbolPlacement", obj.techniqueSymbolPlacement);
        o.set("outputMidiNumber", obj.outputMidiNumber);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "elementtype":
                obj.elementType = v;
                return true;
            case "staffline":
                obj.staffLine = v;
                return true;
            case "noteheaddefault":
                obj.noteHeadDefault = JsonHelper.parseEnum(v, MusicFontSymbol);
                return true;
            case "noteheadhalf":
                obj.noteHeadHalf = JsonHelper.parseEnum(v, MusicFontSymbol);
                return true;
            case "noteheadwhole":
                obj.noteHeadWhole = JsonHelper.parseEnum(v, MusicFontSymbol);
                return true;
            case "techniquesymbol":
                obj.techniqueSymbol = JsonHelper.parseEnum(v, MusicFontSymbol);
                return true;
            case "techniquesymbolplacement":
                obj.techniqueSymbolPlacement = JsonHelper.parseEnum(v, TextBaseline);
                return true;
            case "outputmidinumber":
                obj.outputMidiNumber = v;
                return true;
        }
        return false;
    }
}
//# sourceMappingURL=InstrumentArticulationSerializer.js.map