var LyricsState;
(function (LyricsState) {
    LyricsState[LyricsState["IgnoreSpaces"] = 0] = "IgnoreSpaces";
    LyricsState[LyricsState["Begin"] = 1] = "Begin";
    LyricsState[LyricsState["Text"] = 2] = "Text";
    LyricsState[LyricsState["Comment"] = 3] = "Comment";
    LyricsState[LyricsState["Dash"] = 4] = "Dash";
})(LyricsState || (LyricsState = {}));
/**
 * Represents the lyrics of a song.
 */
export class Lyrics {
    constructor() {
        /**
         * Gets or sets he start bar on which the lyrics should begin.
         */
        this.startBar = 0;
        /**
         * Gets or sets the raw lyrics text in Guitar Pro format.
         * (spaces split word syllables, plus merge syllables, [..] are comments)
         */
        this.text = '';
    }
    finish(skipEmptyEntries = false) {
        this.chunks = [];
        this.parse(this.text, 0, this.chunks, skipEmptyEntries);
    }
    parse(str, p, chunks, skipEmptyEntries) {
        if (!str) {
            return;
        }
        let state = LyricsState.Begin;
        let next = LyricsState.Begin;
        let skipSpace = false;
        let start = 0;
        while (p < str.length) {
            let c = str.charCodeAt(p);
            switch (state) {
                case LyricsState.IgnoreSpaces:
                    switch (c) {
                        case Lyrics.CharCodeLF:
                        case Lyrics.CharCodeCR:
                        case Lyrics.CharCodeTab:
                            break;
                        case Lyrics.CharCodeSpace:
                            if (!skipSpace) {
                                state = next;
                                continue;
                            }
                            break;
                        default:
                            skipSpace = false;
                            state = next;
                            continue;
                    }
                    break;
                case LyricsState.Begin:
                    switch (c) {
                        case Lyrics.CharCodeBrackedOpen:
                            state = LyricsState.Comment;
                            break;
                        default:
                            start = p;
                            state = LyricsState.Text;
                            continue;
                    }
                    break;
                case LyricsState.Comment:
                    switch (c) {
                        case Lyrics.CharCodeBrackedClose:
                            state = LyricsState.Begin;
                            break;
                    }
                    break;
                case LyricsState.Text:
                    switch (c) {
                        case Lyrics.CharCodeDash:
                            state = LyricsState.Dash;
                            break;
                        case Lyrics.CharCodeCR:
                        case Lyrics.CharCodeLF:
                        case Lyrics.CharCodeSpace:
                            let txt = str.substr(start, p - start);
                            this.addChunk(txt, skipEmptyEntries);
                            state = LyricsState.IgnoreSpaces;
                            next = LyricsState.Begin;
                            break;
                    }
                    break;
                case LyricsState.Dash:
                    switch (c) {
                        case Lyrics.CharCodeDash:
                            break;
                        default:
                            let txt = str.substr(start, p - start);
                            this.addChunk(txt, skipEmptyEntries);
                            skipSpace = true;
                            state = LyricsState.IgnoreSpaces;
                            next = LyricsState.Begin;
                            continue;
                    }
                    break;
            }
            p += 1;
        }
        if (state === LyricsState.Text) {
            if (p !== start) {
                this.addChunk(str.substr(start, p - start), skipEmptyEntries);
            }
        }
    }
    addChunk(txt, skipEmptyEntries) {
        txt = this.prepareChunk(txt);
        if (!skipEmptyEntries || (txt.length > 0 && txt !== '-')) {
            this.chunks.push(txt);
        }
    }
    prepareChunk(txt) {
        let chunk = txt.split('+').join(' ');
        // trim off trailing _ like "You____" becomes "You"
        let endLength = chunk.length;
        while (endLength > 0 && chunk.charAt(endLength - 1) === '_') {
            endLength--;
        }
        return endLength !== chunk.length ? chunk.substr(0, endLength) : chunk;
    }
}
Lyrics.CharCodeLF = 10;
Lyrics.CharCodeTab = 9;
Lyrics.CharCodeCR = 13;
Lyrics.CharCodeSpace = 32;
Lyrics.CharCodeBrackedClose = 93;
Lyrics.CharCodeBrackedOpen = 91;
Lyrics.CharCodeDash = 45;
//# sourceMappingURL=Lyrics.js.map