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
        assert(wtfobj, 'remember to fix the template bug with {{cog}}!', false);
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
                assert((idx + '') in wtfdata);
                let wd = wtfdata[(idx + '')];
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
            case 'l':
                lang = getFromKey(templ, 1); // this is all according to spec. TODO apply flexible, as shown below as impl. in "form of"
                word = getFromKey(templ, 2);
                break;
            // TODO: multi-term templates: root, affix, blend, doublet
            // TODO: onom, named-after
            case 'form of':
                // weird one
                lang = getFromKey(templ, 1);
                let formof = getFromKey(templ, 2);
                word = getFromKey(templ, 3);
                break;
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
                let m;
                switch (ttype) {
                    case 'blend':
                    case 'doublet':
                        return multiParamTemplateParse(templ, 1); // in 1-indexed (wiktionary) terms
                    case 'root':
                        return multiParamTemplateParse(templ, 2);
                    case 'compound':
                        return multiParamTemplateParse(templ, 1, [2, 3]);
                    case 'prefix':
                    case 'pre':
                        m = multiParamTemplateParse(templ, 1, [2, 3]);
                        if (!m[0].word.endsWith('-'))
                            m[0].word = m[0].word + '-';
                        return m;
                    case 'suf':
                    case 'suffix':
                        m = multiParamTemplateParse(templ, 1, [2, 3]);
                        if (!m[0].word.startsWith('-'))
                            m[0].word = '-' + m[0].word;
                        return m;
                    case 'affix':
                    case 'af':
                    case 'univerbation':
                    case 'univ':
                        m = multiParamTemplateParse(templ, 1); // , [2, 3]);
                        return m;
                }
                let flag = false;
                for (let pos of templPOS) {
                    if (ttype.endsWith('-' + pos)) {
                        flag = true;
                        break;
                    }
                }
                if (flag) {
                    let a = getFromKey(templ, 1); // this category is horrendously messy.
                    let b = getFromKey(templ, 2); // TODO improve this 
                    if (a && b && a.length <= 2 && b.length > a.length)
                        word = b;
                    else
                        word = a;
                    if (word && word.length === 1) {
                        word = ''; // probably
                        lang = '';
                    }
                    else {
                        lang = ttype.slice(0, ttype.indexOf('-')); // this is decently reliable I guess
                    }
                }
                else {
                    console.log(`Unprepared template type ${ttype}!`);
                }
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
    if (lang.includes('Latin') || lang === 'Old English') {
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
function findRelevance(templatestr) {
    // Let's just hard code it. Unless someone wants to make a script that scrapes wiktionary template specs or
    // makes a Mediawiki parser emulator
    assert(templatestr.indexOf('}}') >= 0);
    let pipe = templatestr.indexOf('|');
    let end = pipe === -1 ? templatestr.indexOf('}}') : pipe;
    let ttype = templatestr.slice(templatestr.indexOf('{{') + 2, end);
    let etys = ['derived', 'der', 'borrowed', 'bor', 'learned borrowing', 'lbor', 'orthographic borrowing', 'obor', 'inherited', 'inh',
        'PIE root', 'root', 'affix', 'af', 'prefix', 'pre', 'confix', 'con', 'suffix', 'suf', 'compound', 'com', 'blend', 'clipping', 'short for',
        'back-form', 'doublet', 'onomatopoeic', 'onom', 'calque', 'cal', 'semantic loan', 'sl', 'named-after', 'phono-semantic matching',
        'psm', 'mention', 'm', 'cognate', 'cog', 'noncognate', 'noncog', 'langname-mention', 'm+', 'rfe']; //, 'etystub', 'unknown', 'unk'];
    if (etys.includes(ttype))
        return true; // Whitelist.
    if (['syn', 'label', 'qualifier', 'ux', 'uxi', 'head', 'ws',
        'Wikipedia', 'slim-wikipedia', 'Wikisource', 'Wikibooks', 'w', 'pedialite',
        'IPA', 'rfap', 'rfp', 'Q'].includes(ttype))
        return false;
    for (let comb of ['quote', 'R:', 'Swadesh', 'ws '])
        if (ttype.startsWith(comb))
            return false;
    // Form of.
    // https://en.wiktionary.org/wiki/Category:Form-of_templates
    // https://en.wiktionary.org/wiki/Category:Form-of_templates_by_language
    // https://en.wiktionary.org/wiki/Wiktionary:Templates#Form-of_templates
    let frag = ttype;
    let formFlag = false;
    if (ttype.endsWith('-form')) {
        frag = ttype.slice(-5); // take off the form
        formFlag = true;
        // pretty likely
        console.log('Candidate: ' + ttype);
    }
    for (let pos of templPOS)
        if (frag.endsWith('-' + pos))
            return true; // actually these seem not to be useful
    if (ttype.endsWith(' of'))
        return true; // many POSs end with ' of'.
    // https://en.wiktionary.org/wiki/Wiktionary:Templates#Etymology
    if (['delete', 'rfd', 'rfd-redundant', 'rfv', 'rfv-sense', 't-needed', 'rfscript', 'rfap', 'rfc', 'rfdate', 'rfdef', 'rfe', 'rfp', 'rfi',
        'tea room', 'rfv-passed', 'rfv-failed', 'rfv-archived', 'rfd-passed', 'rfd-failed', 'rfd-archived'].includes(ttype))
        return false;
    if (templatestr.includes('-'))
        return true; // if it has a hyphen, there's a pretty good chance it's a lemma
    // requests: https://en.wiktionary.org/wiki/Wiktionary:Templates#Requests
    return false;
}
