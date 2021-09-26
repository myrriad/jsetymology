"use strict";
// <reference path='js/langcodes/gencodes.js'/>
let decodeTemplate;
class Templated {
    constructor(ttype, word, langcode, self_lang) {
        this.ttype = ttype;
        this.word = word;
        this.langcode = langcode;
        // @ts-ignore
        this.lang = LANGCODES.name(langcode);
        if (!this.lang)
            this.lang = this.langcode;
        this.self_lang = self_lang;
    }
    get isRecon() {
        if (this._is_recon === undefined) {
            this._is_recon = isReconstructed(this.word, this.lang, this.langcode);
        }
        return this._is_recon;
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
                word = rest[1];
            }
            else if (ttype.endsWith('-form')) {
                word = rest[0]; // la-verb-form
            }
            else {
                console.log(`Unprepared template type ${ttype}!`);
            }
        }
        if (lang && word)
            return [word, lang]; //`${lang}, ${word}`;
        return undefined;
    }
    decodeTemplate = function (templstr) {
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
function decodeWord(word, lang, langcode, isRecon) {
    if (isRecon === undefined)
        isRecon = isReconstructed(word, lang, langcode);
    if (isRecon && word.startsWith('*')) {
        word = word.slice(1);
    }
    if (lang === 'Latin') {
        let macrons = ['Ā', 'ā', 'Ē', 'ē', 'Ī', 'ī', 'Ō', 'ō', 'Ū', 'ū', 'Ȳ', 'ȳ'];
        let norms = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'Y', 'y'];
        for (let i = 0; i < macrons.length; i++) {
            word = word.replace(macrons[i], norms[i]);
        }
    }
    return word;
}
function isReconstructed(word, lang, langcode) {
    /* hard-coded heuristic*/
    if (langcode && langcode.endsWith('-pro'))
        return true;
    if (lang.startsWith('Proto'))
        return true;
    if (word.startsWith('*')) {
        if (lang.startsWith('Old ') || lang.startsWith('Middle '))
            return true;
        if (lang.includes('Latin'))
            return true;
        if (word.length >= 3)
            return true;
        return false;
        // you know it's probably true. It's better 
    } //
    return false;
}
