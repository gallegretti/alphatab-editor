import { AlphaTabError, AlphaTabErrorType } from "@src/AlphaTabError";
/**
 * @partial
 */
export class JsonHelper {
    /**
     * @target web
     * @partial
     */
    static parseEnum(s, enumType) {
        switch (typeof s) {
            case 'string':
                const num = parseInt(s);
                return isNaN(num)
                    ? enumType[Object.keys(enumType).find(k => k.toLowerCase() === s.toLowerCase())]
                    : num;
            case 'number':
                return s;
            case 'undefined':
            case 'object':
                return null;
        }
        throw new AlphaTabError(AlphaTabErrorType.Format, `Could not parse enum value '${s}'`);
    }
    /**
     * @target web
     * @partial
     */
    static forEach(s, func) {
        if (s instanceof Map) {
            s.forEach(func);
        }
        else if (typeof s === 'object') {
            for (const k in s) {
                func(s[k], k);
            }
        }
        // skip
    }
}
//# sourceMappingURL=JsonHelper.js.map