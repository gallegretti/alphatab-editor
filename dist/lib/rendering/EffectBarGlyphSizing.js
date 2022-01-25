/**
 * Lists all sizing types of the effect bar glyphs
 */
export var EffectBarGlyphSizing;
(function (EffectBarGlyphSizing) {
    /**
     * The effect glyph is placed above the pre-beat glyph which is before
     * the actual note in the area where also accidentals are renderered.
     */
    EffectBarGlyphSizing[EffectBarGlyphSizing["SinglePreBeat"] = 0] = "SinglePreBeat";
    /**
     * The effect glyph is placed above the on-beat glyph which is where
     * the actual note head glyphs are placed.
     */
    EffectBarGlyphSizing[EffectBarGlyphSizing["SingleOnBeat"] = 1] = "SingleOnBeat";
    /**
     * The effect glyph is placed above the on-beat glyph which is where
     * the actual note head glyphs are placed. The glyph will size to the end of
     * the applied beat.
     */
    EffectBarGlyphSizing[EffectBarGlyphSizing["SingleOnBeatToEnd"] = 2] = "SingleOnBeatToEnd";
    /**
     * The effect glyph is placed above the on-beat glyph and expaded to the
     * on-beat position of the next beat.
     */
    EffectBarGlyphSizing[EffectBarGlyphSizing["GroupedOnBeat"] = 3] = "GroupedOnBeat";
    /**
     * The effect glyph is placed above the on-beat glyph and expaded to the
     * on-beat position of the next beat. The glyph will size to the end of
     * the applied beat.
     */
    EffectBarGlyphSizing[EffectBarGlyphSizing["GroupedOnBeatToEnd"] = 4] = "GroupedOnBeatToEnd";
    /**
     * The effect glyph is placed on the whole bar covering the whole width
     */
    EffectBarGlyphSizing[EffectBarGlyphSizing["FullBar"] = 5] = "FullBar";
})(EffectBarGlyphSizing || (EffectBarGlyphSizing = {}));
//# sourceMappingURL=EffectBarGlyphSizing.js.map