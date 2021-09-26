"use strict";
let decipherTemplate;
class Templated {
    constructor(ttype, word, lang, self_lang) {
        this.ttype = ttype;
        this.word = word;
        this.lang = lang;
        this.self_lang = self_lang;
    }
}
(function () {
    function _templSwitch(ttype, rest) {
        let lang;
        let word;
        let self_lang;
        switch (ttype) { // Again I hardcode the values. It's just easier to implement than a dynamic behavior-changing system
            case 'derived':
            case 'der':
            case 'inherited':
            case 'inh':
            case 'borrowed':
            case 'bor':
            case 'learned borrowing':
            case 'lbor':
            case 'orthographic borrowing':
            case 'obor':
            case 'calque':
            case 'cal':
            case 'clq':
            case 'semantic loan':
            case 'sl':
            case 'phono-semantic matching':
            case 'psm':
                self_lang = rest[0]; // |1=
                lang = rest[1]; // |2=
                word = rest[2]; // |3=
                break;
            case 'clipping':
            case 'short for':
            case 'back-formation':
            case 'back-form':
            case 'bf':
            case 'mention':
            case 'm': // More complicated. https://en.wiktionary.org/wiki/Template:mention
            case 'cognate':
            case 'cog':
            case 'noncognate':
            case 'noncog':
            case 'ncog':
            case 'nc':
                lang = rest[0];
                word = rest[1];
                break;
            // TODO: multi-term templates: root, affix, blend, doublet
            // TODO: onom, named-after
            default:
                lang = '';
                word = '';
                break;
        }
        ;
        if (!lang && !word) {
            if (ttype.endsWith(' of')) {
                lang = rest[0];
                lang = rest[1];
            }
            else {
                console.log(`Unprepared template type ${ttype}!`);
            }
        }
        if (lang && word)
            return [word, lang]; //`${lang}, ${word}`;
        return undefined;
    }
    decipherTemplate = function (templstr) {
        assert(templstr.startsWith('{{') && templstr.endsWith('}}'));
        let ttxt = templstr.slice(2, -2);
        let parts = ttxt.trim().split('|');
        let ttype = parts[0];
        let rest = parts.slice(1);
        let result = _templSwitch(ttype, rest);
        if (result) {
            return new Templated(ttype, result[0], result[1]);
        }
        return undefined;
    };
}());
