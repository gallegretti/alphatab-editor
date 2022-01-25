/**
 * A classes inheriting from this base can provide the
 * data needed by a EffectBarRenderer to create effect glyphs dynamically.
 */
export class EffectBarRendererInfo {
    /**
     * Gets the unique effect name for this effect. (Used for grouping)
     */
    get effectId() {
        return this.notationElement.toString();
    }
}
//# sourceMappingURL=EffectBarRendererInfo.js.map