"use strict";
// <reference path='js/langcodes/gencodes.js'/>
let decodeTemplate;
function twordRemoveAngleTknr(inp, startidx) {
    let built = '';
    let levels = 0;
    let captureStart = startidx;
    let i = startidx;
    for (; i < inp.length; i++) {
        let charAt = inp[i];
        if (charAt === '<') { // it seems that we should be safe to ignore everything inside these brackets.
            if (levels === 0) {
                // we were capturing. now we entered a dead zone
                built += inp.substring(captureStart, i);
            }
            levels++;
        }
        else if (charAt === '>') {
            levels--;
            if (levels === 0) {
                // we were ignoring. now we must capture again.
                captureStart = i + 1;
            }
        }
    }
    if (levels === 0) {
        // if we are in capture mode at the end, then we must add the remainder
        built += inp.substring(captureStart);
    }
    return built;
}
function twordExtractMultiTknr() {
}
class Templated {
    constructor(ttype, word, langcode, self_lang, orig_template) {
        this.ttype = ttype;
        this.langcode = langcode;
        this.word = word;
        this.lang = LANGCODES.name(langcode);
        if (!this.lang)
            this.lang = this.langcode;
        this.self_lang = self_lang;
        this.orig_template = orig_template;
    }
    static make(ttype, word, langcode, self_lang, orig_template) {
        if (!word || word === '-')
            return undefined;
        let word2 = word.includes('<') || word.includes('>') ? twordRemoveAngleTknr(word, 0) : word;
        return new Templated(ttype, word2, langcode, self_lang, orig_template);
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
    function _multiGetKeyFunc(objin, key, make_temps = false, make_temps_idx = [], error = true) {
        let wtfobj;
        if (typeof objin === 'string') {
            wtfobj = wtf(objin).templates()[0];
        }
        else
            wtfobj = objin;
        let elem;
        let ret = [];
        if (!wtfobj) {
            // console.error('remember to fix the template bug with {{cog}}!');
            let strin = objin;
            let wkstr = strin.substring(strin.indexOf('{{') + 2, strin.lastIndexOf('}}'));
            let parts = wkstr.split('|');
            let ttype = parts[0];
            elem = parts[key];
            if (!make_temps)
                return elem;
            if (make_temps_idx) {
                for (let idx of make_temps_idx) {
                    let word = parts[idx];
                    if (word) { // only push if we actually have a word
                        ret.push(Templated.make(ttype, word, elem, undefined, strin)); // In this case the elem is the lang
                    }
                }
            }
            else {
                for (let i = 1; i < parts.length; i++) {
                    let word = parts[i];
                    if (word) {
                        ret.push(Templated.make(ttype, word, elem, undefined, strin)); // In this case the elem is the lang
                    }
                }
            }
            return undefined;
        }
        let wtfdata = wtfobj.json(); // {list: str[], template: str} & str[];
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
        if (did_list) {
            let words = wtfdata.list.slice(key - 1 + 1); // list only contains unindexed params
            for (let wd of words) {
                let t = Templated.make(wtfdata.template, wd, lang, undefined, wtfobj.wikitext());
                if (t)
                    ret.push(t); // In this case the elem is the lang
            }
        }
        else {
            for (let idx of make_temps_idx) {
                if (!((idx + '') in wtfdata)) {
                    assert(false, 'template-matching failed, given indices didn\'t match!', false);
                    return undefined;
                }
                let wd = wtfdata[(idx + '')];
                let t = Templated.make(wtfdata.template, wd, lang, undefined, wtfobj.wikitext()); // In this case the elem is the lang
                if (t)
                    ret.push(t);
            }
        }
        return ret;
    }
    function _templSwitch(ttype, orig) {
        var _a, _b;
        let lang;
        let word;
        let self_lang;
        let templ;
        let orig_str;
        let wtfobj;
        if (typeof orig === 'string') {
            orig_str = orig;
            templ = wtf(orig).templates()[0];
        }
        else {
            templ = orig.templates()[0];
            orig_str = templ.wikitext();
        }
        wtfobj = templ ? templ : orig_str;
        switch (ttype) { // Again I hardcode the values. It's just easier to implement than a dynamic behavior-changing system
            case 'unk':
            case 'onom':
                return undefined;
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
                self_lang = getFromKey(wtfobj, 1);
                lang = getFromKey(wtfobj, 2); // |2=
                word = getFromKey(wtfobj, 3); // |3=
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
                lang = getFromKey(wtfobj, 1); // this is all according to spec. TODO apply flexible, as shown below as impl. in "form of"
                word = getFromKey(wtfobj, 2);
                break;
            // TODO: multi-term templates: root, affix, blend, doublet
            // TODO: onom, named-after
            case 'form of':
                // weird one
                lang = getFromKey(wtfobj, 1);
                let formof = getFromKey(wtfobj, 2);
                word = getFromKey(wtfobj, 3);
                break;
            default:
                lang = '';
                word = '';
                break;
        }
        ;
        if (!lang && !word) {
            if (ttype.endsWith(' of')) {
                let a = getFromKey(wtfobj, 1);
                let b = getFromKey(wtfobj, 2);
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
                word = getFromKey(wtfobj, 1); // la-verb-form
            }
            else {
                let m;
                switch (ttype) {
                    case 'blend':
                    case 'doublet':
                        return multiParamTemplateParse(wtfobj, 1); // in 1-indexed (wiktionary) terms
                    case 'root':
                        return multiParamTemplateParse(wtfobj, 2);
                    case 'compound':
                        return multiParamTemplateParse(wtfobj, 1, [2, 3]);
                    case 'prefix':
                    case 'pre':
                        m = multiParamTemplateParse(wtfobj, 1, [2, 3]);
                        if (!m[0].word.endsWith('-'))
                            m[0].word = m[0].word + '-';
                        return m;
                    case 'suf':
                    case 'suffix':
                        m = multiParamTemplateParse(wtfobj, 1, [2, 3]);
                        let temp = m[m.length - 1];
                        // if(temp.word == )
                        if (!temp.word.startsWith('-'))
                            temp.word = '-' + temp.word;
                        return m;
                    case 'affix':
                    case 'af':
                    case 'univerbation':
                    case 'univ':
                        m = multiParamTemplateParse(wtfobj, 1); // , [2, 3]);
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
                    let a = getFromKey(wtfobj, 1); // this category is horrendously messy.
                    let b = getFromKey(wtfobj, 2); // TODO improve this
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
                    console.log(`Guessing ${ttype}...`);
                    // try to make a general filler
                    let a = (_a = getFromKey(wtfobj, 1)) === null || _a === void 0 ? void 0 : _a.trim(); // this category is horrendously messy.
                    let b = (_b = getFromKey(wtfobj, 2)) === null || _b === void 0 ? void 0 : _b.trim(); // TODO improve this
                    if (a) { // assume that a is required before b
                        // let the shorter one be the langcode and the longer one the word, with some leniency to the first one.
                        // if(a)
                        if (a.split('-').every(x => 2 <= x.length && x.length <= 3) // all sections are between 2 and 3 letters = right format
                            && LANGCODES.name(a)) { // search for lang
                            // then we know that a corresponds to a langcode. good.
                            lang = a;
                            if (b) {
                                word = b;
                            }
                        }
                        else {
                            // a does not correspond to a language, so assume it's a word
                            word = a;
                            // test b for a language.
                            if (b) {
                                if (b.split('-').every(x => 2 <= x.length && x.length <= 3) // all sections are between 2 and 3 letters = right format
                                    && LANGCODES.name(b)) { // search for lang
                                    lang = b;
                                }
                            }
                        }
                    }
                    if (word && !lang && cognatus.aggressiveTemplateInclusion) {
                        // look for a lang in the templateform
                        let langtest = ttype.slice(0, ttype.indexOf('-'));
                        if (langtest.split('-').every(x => 2 <= x.length && x.length <= 3)
                            && LANGCODES.name(langtest)) {
                            // great!!
                            lang = langtest;
                        }
                    }
                }
            }
        }
        if (lang && word) {
            return Templated.make(ttype, word, lang, self_lang, orig_str);
        }
        return undefined;
        // return [word, lang]; //`${lang}, ${word}`;
        // return undefined;
    }
    decodeTemplate = function (templstr) {
        assert(templstr.startsWith('{{') && templstr.endsWith('}}'), `messed up template ${templstr}`);
        let ttxt = templstr.slice(2, -2);
        let parts = ttxt.trim().split('|');
        let ttype = parts[0];
        // let rest = parts.slice(1);
        return _templSwitch(ttype, templstr);
        // if(result) {
        // return new Templated(ttype, result[0], result[1]);
        // }
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
function toggleCognates() {
    showCognates = !showCognates;
}
function updateCustomTemplateWhitelists() {
    let whitestr = $('#twhitelist').val();
    twhitelist = whitestr.split(',').map(x => $.trim(x));
    let blackstr = $('#tblacklist').val();
    tblacklist = blackstr.split(',').map(x => $.trim(x));
    // whitestr = whitestr.replace()
    setCookie('twhitelist', whitestr);
    setCookie('tblacklist', blackstr);
}
function findRelevance(templatestr) {
    // this is what decides whether a template is green or grey in the sidebar
    // Let's just hard code it. Unless someone wants to make a script that scrapes wiktionary template specs or
    // makes a Mediawiki parser emulator
    assert(templatestr.indexOf('}}') >= 0, `messed up template ${templatestr}`);
    let pipe = templatestr.indexOf('|');
    let end = pipe === -1 ? templatestr.indexOf('}}') : pipe;
    let ttype = templatestr.slice(templatestr.indexOf('{{') + 2, end);
    // let user defined whitelist/ blacklist override.
    if (twhitelist.includes(ttype))
        return true;
    if (tblacklist.includes(ttype))
        return false;
    let etys = ['derived', 'der', 'borrowed', 'bor', 'learned borrowing', 'lbor', 'orthographic borrowing', 'obor', 'inherited', 'inh',
        'PIE root', 'root', 'affix', 'af', 'prefix', 'pre', 'confix', 'con', 'suffix', 'suf', 'compound', 'com', 'blend', 'clipping', 'short for',
        'back-form', 'doublet', 'onomatopoeic', 'onom', 'calque', 'cal', 'semantic loan', 'sl', 'named-after', 'phono-semantic matching',
        'psm', 'mention', 'm', 'noncognate', 'noncog', 'langname-mention', 'm+', 'rfe']; //, 'etystub', 'unknown', 'unk'];
    if (etys.includes(ttype))
        return true; // Whitelist.
    if (['cognate', 'cog'].includes(ttype)) {
        if (showCognates)
            return true;
        return false;
    }
    if (['senseid',
        'syn', 'label', 'qualifier', 'ux', 'uxi', 'head', 'ws',
        'Wikipedia', 'slim-wikipedia', 'Wikisource', 'Wikibooks', 'w', 'pedialite',
        'IPA', 'rfap', 'rfp', 'Q', 'sup', 'topics'].includes(ttype))
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
    if (ttype.endsWith(' of')) {
        // many POSs end with ' of'.
        return templatestr.includes('|'); // but only report as useful if we actually have arguments. 
        // return true; 
    }
    // https://en.wiktionary.org/wiki/Wiktionary:Templates#Etymology
    if (['delete', 'rfd', 'rfd-redundant', 'rfv', 'rfv-sense', 't-needed', 'rfscript', 'rfap', 'rfc', 'rfdate', 'rfdef', 'rfe', 'rfp', 'rfi',
        'tea room', 'rfv-passed', 'rfv-failed', 'rfv-archived', 'rfd-passed', 'rfd-failed', 'rfd-archived'].includes(ttype))
        return false;
    if (templatestr.includes('-')) {
        // return true; // if it has a hyphen, there's a pretty good chance it's a lemma
        return templatestr.includes('|'); // only report as useful if we actually have arguments. 
    }
    // requests: https://en.wiktionary.org/wiki/Wiktionary:Templates#Requests
    return false;
}
