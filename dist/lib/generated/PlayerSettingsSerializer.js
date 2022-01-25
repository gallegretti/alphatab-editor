import { JsonHelper } from "@src/io/JsonHelper";
import { VibratoPlaybackSettingsSerializer } from "@src/generated/VibratoPlaybackSettingsSerializer";
import { SlidePlaybackSettingsSerializer } from "@src/generated/SlidePlaybackSettingsSerializer";
import { ScrollMode } from "@src/PlayerSettings";
export class PlayerSettingsSerializer {
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
        o.set("soundFont", obj.soundFont);
        o.set("scrollElement", obj.scrollElement);
        o.set("enablePlayer", obj.enablePlayer);
        o.set("enableCursor", obj.enableCursor);
        o.set("enableAnimatedBeatCursor", obj.enableAnimatedBeatCursor);
        o.set("enableElementHighlighting", obj.enableElementHighlighting);
        o.set("enableUserInteraction", obj.enableUserInteraction);
        o.set("scrollOffsetX", obj.scrollOffsetX);
        o.set("scrollOffsetY", obj.scrollOffsetY);
        o.set("scrollMode", obj.scrollMode);
        o.set("scrollSpeed", obj.scrollSpeed);
        /*@target web*/
        o.set("nativeBrowserSmoothScroll", obj.nativeBrowserSmoothScroll);
        o.set("songBookBendDuration", obj.songBookBendDuration);
        o.set("songBookDipDuration", obj.songBookDipDuration);
        o.set("vibrato", VibratoPlaybackSettingsSerializer.toJson(obj.vibrato));
        o.set("slide", SlidePlaybackSettingsSerializer.toJson(obj.slide));
        o.set("playTripletFeel", obj.playTripletFeel);
        return o;
    }
    static setProperty(obj, property, v) {
        switch (property) {
            case "soundfont":
                obj.soundFont = v;
                return true;
            case "scrollelement":
                obj.scrollElement = v;
                return true;
            case "enableplayer":
                obj.enablePlayer = v;
                return true;
            case "enablecursor":
                obj.enableCursor = v;
                return true;
            case "enableanimatedbeatcursor":
                obj.enableAnimatedBeatCursor = v;
                return true;
            case "enableelementhighlighting":
                obj.enableElementHighlighting = v;
                return true;
            case "enableuserinteraction":
                obj.enableUserInteraction = v;
                return true;
            case "scrolloffsetx":
                obj.scrollOffsetX = v;
                return true;
            case "scrolloffsety":
                obj.scrollOffsetY = v;
                return true;
            case "scrollmode":
                obj.scrollMode = JsonHelper.parseEnum(v, ScrollMode);
                return true;
            case "scrollspeed":
                obj.scrollSpeed = v;
                return true;
            /*@target web*/
            case "nativebrowsersmoothscroll":
                obj.nativeBrowserSmoothScroll = v;
                return true;
            case "songbookbendduration":
                obj.songBookBendDuration = v;
                return true;
            case "songbookdipduration":
                obj.songBookDipDuration = v;
                return true;
            case "playtripletfeel":
                obj.playTripletFeel = v;
                return true;
        }
        if (["vibrato"].indexOf(property) >= 0) {
            VibratoPlaybackSettingsSerializer.fromJson(obj.vibrato, v);
            return true;
        }
        else {
            for (const c of ["vibrato"]) {
                if (property.indexOf(c) === 0) {
                    if (VibratoPlaybackSettingsSerializer.setProperty(obj.vibrato, property.substring(c.length), v)) {
                        return true;
                    }
                }
            }
        }
        if (["slide"].indexOf(property) >= 0) {
            SlidePlaybackSettingsSerializer.fromJson(obj.slide, v);
            return true;
        }
        else {
            for (const c of ["slide"]) {
                if (property.indexOf(c) === 0) {
                    if (SlidePlaybackSettingsSerializer.setProperty(obj.slide, property.substring(c.length), v)) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
}
//# sourceMappingURL=PlayerSettingsSerializer.js.map