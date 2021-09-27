"use strict";
// <reference path='js/langcodes/gencodes.js'/>
let decodeTemplate;
class Templated {
    constructor(ttype, word, langcode, self_lang, orig_template) {
        this.ttype = ttype;
        this.word = word;
        this.langcode = langcode;
        // @ts-ignore
        this.lang = LANGCODES.name(langcode);
        if (!this.lang)
            this.lang = this.langcode;
        this.self_lang = self_lang;
        this.orig_template = orig_template;
    }
    get isRecon() {
        if (this._is_recon === undefined) {
            this._is_recon = isReconstructed(this.word, this.lang, this.langcode);
        }
        return this._is_recon;
    }
}
(function () {
    function getFromKey(templ, key) {
        // @ts-ignore
        return _multiGetKeyFunc(templ, key, false, [], false);
    }
    function multiParamTemplateParse(templ, key, make_temps_idx = []) {
        return _multiGetKeyFunc(templ, key, true, make_temps_idx, true);
    }
    /**
     *
     * @param wtfdata wtf(x).templates()[0]
     * @param key In terms of Wiktionary indices: ie. 1-indexed.
     */
    function _multiGetKeyFunc(wtfobj, key, make_temps = false, make_temps_idx = [], error = true) {
        // @ts-ignore
        if (typeof wtfobj === 'string')
            wtfobj = wtf(wtf_obj).templates()[0];
        let elem;
        let wtfdata = wtfobj.data;
        let did_list = undefined;
        if (wtfdata && wtfdata.list && key - 1 < wtfdata.list.length) {
            elem = wtfdata.list[key - 1];
            did_list = true;
        }
        else {
            did_list = false;
            if ((key + '') in wtfdata) {
                elem = wtfdata[(key + '')];
            }
            else {
                if (error)
                    throw "Cannot find parameter number " + key;
                else
                    return undefined;
            }
        }
        if (!make_temps)
            return elem;
        let lang = elem;
        let ret = [];
        if (did_list) {
            let words = wtfdata.list.slice(key - 1 + 1); // list only contains unindexed params
            for (let wd of words) {
                ret.push(new Templated(wtfdata.template, wd, lang, undefined, wtfobj.wiki)); // In this case the elem is the lang
            }
        }
        else {
            for (let idx of make_temps_idx) {
                assert((key + '') in wtfdata);
                let wd = wtfdata[(key + '')];
                ret.push(new Templated(wtfdata.template, wd, lang, undefined, wtfobj.wiki)); // In this case the elem is the lang
            }
        }
        return ret;
    }
    function _templSwitch(ttype, orig) {
        let lang;
        let word;
        let self_lang;
        let templ;
        let orig_str;
        if (typeof orig === 'string') {
            orig_str = orig;
            // @ts-ignore
            templ = wtf(orig).templates()[0];
        }
        else {
            templ = orig.templates()[0];
            orig_str = templ.wiki;
        }
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
                // self_lang = rest[0]; // |1=
                self_lang = getFromKey(templ, 1);
                lang = getFromKey(templ, 2); // |2=
                word = getFromKey(templ, 3); // |3=
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
                lang = getFromKey(templ, 1); // this is all according to spec. TODO apply flexible, as shown below as impl. in "form of"
                word = getFromKey(templ, 2);
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
                let a = getFromKey(templ, 1);
                let b = getFromKey(templ, 2);
                if (b) {
                    lang = a; // flexible assignment. TODO apply flexible to the above
                    word = b;
                }
                else {
                    word = a;
                    lang = ttype.slice(0, ttype.indexOf('-')); // ie. "es-verb of" => "es"
                }
            }
            else if (ttype.endsWith('-form')) {
                word = getFromKey(templ, 1); // la-verb-form
            }
            else {
                switch (ttype) {
                    case 'blend':
                    case 'doublet':
                        return multiParamTemplateParse(templ, 1); // in 1-indexed (wiktionary) terms
                    case 'root':
                        return multiParamTemplateParse(templ, 2);
                    case 'affix':
                    case 'suffix':
                    case 'compound':
                        return multiParamTemplateParse(templ, 1, [2, 3]);
                }
                console.log(`Unprepared template type ${ttype}!`);
            }
        }
        if (lang && word) {
            return new Templated(ttype, word, lang, self_lang, orig_str);
        }
        return undefined;
        // return [word, lang]; //`${lang}, ${word}`;
        // return undefined;
    }
    decodeTemplate = function (templstr) {
        assert(templstr.startsWith('{{') && templstr.endsWith('}}'));
        let ttxt = templstr.slice(2, -2);
        let parts = ttxt.trim().split('|');
        let ttype = parts[0];
        // let rest = parts.slice(1);
        return _templSwitch(ttype, templstr);
        // if(result) {
        // return new Templated(ttype, result[0], result[1]);
        // }
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
