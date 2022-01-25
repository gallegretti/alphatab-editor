import { JsonHelper } from '@src/io/JsonHelper';
/**
 * A very basic font parser which parses the fields according to
 * https://www.w3.org/TR/CSS21/fonts.html#propdef-font
 */
class FontParserToken {
    constructor(text, startPos, endPos) {
        this.text = text;
        this.startPos = startPos;
        this.endPos = endPos;
    }
}
class FontParser {
    constructor(input) {
        this.style = 'normal';
        this.variant = 'normal';
        this.weight = 'normal';
        this.stretch = 'normal';
        this.lineHeight = 'normal';
        this.size = '1rem';
        this.families = [];
        this._currentTokenIndex = -1;
        this._input = '';
        this._currentToken = null;
        this._input = input;
        this._tokens = this.splitToTokens(input);
    }
    splitToTokens(input) {
        const tokens = [];
        let startPos = 0;
        while (startPos < input.length) {
            let endPos = startPos;
            while (endPos < input.length && input.charAt(endPos) !== ' ') {
                endPos++;
            }
            if (endPos > startPos) {
                tokens.push(new FontParserToken(input.substring(startPos, endPos), startPos, endPos));
            }
            startPos = endPos + 1;
        }
        return tokens;
    }
    parse() {
        var _a;
        this.reset();
        // default font flags
        if (this._tokens.length === 1) {
            switch ((_a = this._currentToken) === null || _a === void 0 ? void 0 : _a.text) {
                case 'caption':
                case 'icon':
                case 'menu':
                case 'message-box':
                case 'small-caption':
                case 'status-bar':
                case 'inherit':
                    return;
            }
        }
        this.fontStyleVariantWeight();
        this.fontSizeLineHeight();
        this.fontFamily();
    }
    fontFamily() {
        if (!this._currentToken) {
            throw new Error(`Missing font list`);
        }
        const familyListInput = this._input.substr(this._currentToken.startPos).trim();
        let pos = 0;
        while (pos < familyListInput.length) {
            let c = familyListInput.charAt(pos);
            if (c === ' ' || c == ',') {
                // skip whitespace and quotes
                pos++;
            }
            else if (c === '"' || c === "'") {
                // quoted
                const endOfString = this.findEndOfQuote(familyListInput, pos + 1, c);
                this.families.push(familyListInput
                    .substring(pos + 1, endOfString)
                    .split('\\' + c)
                    .join(c));
                pos = endOfString + 1;
            }
            else {
                // until comma
                const endOfString = this.findEndOfQuote(familyListInput, pos + 1, ',');
                this.families.push(familyListInput.substring(pos, endOfString).trim());
                pos = endOfString + 1;
            }
        }
    }
    findEndOfQuote(s, pos, quoteChar) {
        let escaped = false;
        while (pos < s.length) {
            const c = s.charAt(pos);
            if (!escaped && c === quoteChar) {
                return pos;
            }
            if (!escaped && c === '\\') {
                escaped = true;
            }
            else {
                escaped = false;
            }
            pos += 1;
        }
        return s.length;
    }
    fontSizeLineHeight() {
        if (!this._currentToken) {
            throw new Error(`Missing font size`);
        }
        const parts = this._currentToken.text.split('/');
        if (parts.length >= 3) {
            throw new Error(`Invalid font size '${this._currentToken}' specified`);
        }
        this.nextToken();
        if (parts.length >= 2) {
            if (parts[1] === '/') {
                // size/ line-height (space after slash)
                if (!this._currentToken) {
                    throw new Error('Missing line-height after font size');
                }
                this.lineHeight = this._currentToken.text;
                this.nextToken();
            }
            else {
                // size/line-height (no spaces)
                this.size = parts[0];
                this.lineHeight = parts[1];
            }
        }
        else if (parts.length >= 1) {
            this.size = parts[0];
            if (this._currentToken &&
                this._currentToken.text.indexOf('/') === 0) {
                // size / line-height (with spaces befor and after slash)
                if (this._currentToken.text === '/') {
                    this.nextToken();
                    if (!this._currentToken) {
                        throw new Error('Missing line-height after font size');
                    }
                    this.lineHeight = this._currentToken.text;
                    this.nextToken();
                }
                else {
                    this.lineHeight = this._currentToken.text.substr(1);
                    this.nextToken();
                }
            }
        }
        else {
            throw new Error(`Missing font size`);
        }
    }
    nextToken() {
        this._currentTokenIndex++;
        if (this._currentTokenIndex < this._tokens.length) {
            this._currentToken = this._tokens[this._currentTokenIndex];
        }
        else {
            this._currentToken = null;
        }
    }
    fontStyleVariantWeight() {
        let hasStyle = false;
        let hasVariant = false;
        let hasWeight = false;
        let valuesNeeded = 3;
        let ambiguous = [];
        while (true) {
            if (!this._currentToken) {
                return;
            }
            let text = this._currentToken.text;
            switch (text) {
                // ambiguous
                case 'normal':
                case 'inherit':
                    ambiguous.push(text);
                    valuesNeeded--;
                    this.nextToken();
                    break;
                // style
                case 'italic':
                case 'oblique':
                    this.style = text;
                    hasStyle = true;
                    valuesNeeded--;
                    this.nextToken();
                    break;
                // variant
                case 'small-caps':
                    this.variant = text;
                    hasVariant = true;
                    valuesNeeded--;
                    this.nextToken();
                    break;
                // weight
                case 'bold':
                case 'bolder':
                case 'lighter':
                case '100':
                case '200':
                case '300':
                case '400':
                case '500':
                case '600':
                case '700':
                case '800':
                case '900':
                    this.weight = text;
                    hasWeight = true;
                    valuesNeeded--;
                    this.nextToken();
                    break;
                default:
                    // unknown token -> done with this part
                    return;
            }
            if (valuesNeeded === 0) {
                break;
            }
        }
        while (ambiguous.length > 0) {
            const v = ambiguous.pop();
            if (!hasWeight) {
                this.weight = v;
            }
            else if (!hasVariant) {
                this.variant = v;
            }
            else if (!hasStyle) {
                this.style = v;
            }
        }
    }
    reset() {
        this._currentTokenIndex = -1;
        this.nextToken();
    }
}
/**
 * Lists all flags for font styles.
 */
export var FontStyle;
(function (FontStyle) {
    /**
     * No flags.
     */
    FontStyle[FontStyle["Plain"] = 0] = "Plain";
    /**
     * Font is italic.
     */
    FontStyle[FontStyle["Italic"] = 1] = "Italic";
})(FontStyle || (FontStyle = {}));
/**
 * Lists all font weight values.
 */
export var FontWeight;
(function (FontWeight) {
    /**
     * Not bold
     */
    FontWeight[FontWeight["Regular"] = 0] = "Regular";
    /**
     * Font is bold
     */
    FontWeight[FontWeight["Bold"] = 1] = "Bold";
})(FontWeight || (FontWeight = {}));
/**
 * @json_immutable
 */
export class Font {
    /**
     * Initializes a new instance of the {@link Font} class.
     * @param family The family.
     * @param size The size.
     * @param style The style.
     * @param weight The weight.
     */
    constructor(family, size, style = FontStyle.Plain, weight = FontWeight.Regular) {
        this._cssScale = 0.0;
        this._family = family;
        this._size = size;
        this._style = style;
        this._weight = weight;
        this._css = this.toCssString();
    }
    reset() {
        this._cssScale = 0;
        this._css = this.toCssString();
    }
    /**
     * Gets the font family name.
     */
    get family() {
        return this._family;
    }
    /**
     * Sets the font family name.
     */
    set family(value) {
        this._family = value;
        this.reset();
    }
    /**
     * Gets the font size in pixels.
     */
    get size() {
        return this._size;
    }
    /**
     * Sets the font size in pixels.
     */
    set size(value) {
        this._size = value;
        this.reset();
    }
    /**
     * Gets the font style.
     */
    get style() {
        return this._style;
    }
    /**
     * Sets the font style.
     */
    set style(value) {
        this._style = value;
        this.reset();
    }
    /**
     * Gets the font weight.
     */
    get weight() {
        return this._weight;
    }
    /**
     * Gets or sets the font weight.
     */
    set weight(value) {
        this._weight = value;
        this.reset();
    }
    get isBold() {
        return this.weight === FontWeight.Bold;
    }
    get isItalic() {
        return this.style === FontStyle.Italic;
    }
    toCssString(scale = 1) {
        if (!this._css || !(Math.abs(scale - this._cssScale) < 0.01)) {
            let buf = '';
            if (this.isBold) {
                buf += 'bold ';
            }
            if (this.isItalic) {
                buf += 'italic ';
            }
            buf += this.size * scale;
            buf += 'px ';
            buf += "'";
            buf += this.family;
            buf += "'";
            this._css = buf;
            this._cssScale = scale;
        }
        return this._css;
    }
    static fromJson(v) {
        switch (typeof v) {
            case 'undefined':
                return null;
            case 'object': {
                const m = v;
                let family = m.get('family');
                // tslint:disable-next-line: no-unnecessary-type-assertion
                let size = m.get('size');
                let style = JsonHelper.parseEnum(m.get('style'), FontStyle);
                let weight = JsonHelper.parseEnum(m.get('weight'), FontWeight);
                return new Font(family, size, style, weight);
            }
            case 'string': {
                const parser = new FontParser(v);
                parser.parse();
                let family = parser.families[0];
                if ((family.startsWith("'") && family.endsWith("'")) ||
                    (family.startsWith('"') && family.endsWith('"'))) {
                    family = family.substr(1, family.length - 2);
                }
                let fontSizeString = parser.size.toLowerCase();
                let fontSize = 0;
                // as per https://websemantics.uk/articles/font-size-conversion/
                switch (fontSizeString) {
                    case 'xx-small':
                        fontSize = 7;
                        break;
                    case 'x-small':
                        fontSize = 10;
                        break;
                    case 'small':
                    case 'smaller':
                        fontSize = 13;
                        break;
                    case 'medium':
                        fontSize = 16;
                        break;
                    case 'large':
                    case 'larger':
                        fontSize = 18;
                        break;
                    case 'x-large':
                        fontSize = 24;
                        break;
                    case 'xx-large':
                        fontSize = 32;
                        break;
                    default:
                        try {
                            if (fontSizeString.endsWith('em')) {
                                fontSize = parseFloat(fontSizeString.substr(0, fontSizeString.length - 2)) * 16;
                            }
                            else if (fontSizeString.endsWith('pt')) {
                                fontSize =
                                    (parseFloat(fontSizeString.substr(0, fontSizeString.length - 2)) * 16.0) / 12.0;
                            }
                            else if (fontSizeString.endsWith('px')) {
                                fontSize = parseFloat(fontSizeString.substr(0, fontSizeString.length - 2));
                            }
                            else {
                                fontSize = 12;
                            }
                        }
                        catch (e) {
                            fontSize = 12;
                        }
                        break;
                }
                let fontStyle = FontStyle.Plain;
                if (parser.style === 'italic') {
                    fontStyle = FontStyle.Italic;
                }
                let fontWeight = FontWeight.Regular;
                let fontWeightString = parser.weight.toLowerCase();
                switch (fontWeightString) {
                    case 'normal':
                    case 'lighter':
                        break;
                    default:
                        fontWeight = FontWeight.Bold;
                        break;
                }
                return new Font(family, fontSize, fontStyle, fontWeight);
            }
            default:
                return null;
        }
    }
    static toJson(font) {
        const o = new Map();
        o.set('family', font.family);
        o.set('size', font.size);
        o.set('style', font.style);
        o.set('weight', font.weight);
        return o;
    }
}
//# sourceMappingURL=Font.js.map