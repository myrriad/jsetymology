"use strict";
class DictEntry {
    constructor(defn, deriv) {
        this.defn = defn;
        this.deriv = deriv;
    }
}
class EtyEntry {
    constructor(defns, ety, url) {
        this.defns = defns;
        this.ety = ety;
        this.qy = url;
    }
}
var Wiktionary;
(function (Wiktionary) {
    Wiktionary.WIKTIONARY_POS = [
        "noun", "verb", "adjective", "adverb", "determiner",
        "article", "preposition", "conjunction", "proper noun",
        "letter", "character", "phrase", "proverb", "idiom",
        "symbol", "syllable", "numeral", "initialism", "interjection",
        "definitions", "pronoun",
        "particle", "root" // These POS were found in P-I-E articles
    ];
    function fetchEtyEntry(word, lang = '', reconstr = false, cachedDoc, callback) {
        if (!word)
            throw "You didn't pass a word in to search!";
        let qy = reconstr ? `Reconstruction:${lang.replace(' ', '-')}/${Templates.decodeWord(word, lang)}` : Templates.decodeWord(word, lang); // anti-macron here and nowhere else
        return wtffetch(qy, {
            lang: 'en',
            wiki: 'wiktionary'
        }, cachedDoc).then((doc) => {
            let ret = ondoc(doc, word, lang, qy);
            if (ret) {
                let [etys, doc] = ret;
                if (callback)
                    callback(etys, doc);
                return ret;
            }
            else {
                // there is no document
                displayError($('#sidebar')[0], `Could not find the document for ${word}, ${lang}! https://en.wiktionary.org/wiki/${qy}`, false);
                return undefined;
            }
            return undefined;
        });
    }
    Wiktionary.fetchEtyEntry = fetchEtyEntry;
    function ondoc(doc2, word, lang, qy) {
        // let doc3 = doc2[0];
        let doc = (doc2 instanceof Array ? doc2[0] : doc2);
        if (!doc) {
            return undefined;
        }
        // friendlyInfo(`https://en.wiktionary.org/wiki/${qy}`, false);
        window.doc = doc;
        let myety = undefined;
        let etylist = [];
        let dictEntries = [];
        let toplvl = doc.sections()[0];
        let skiplang = false;
        // auto-inferral
        while (toplvl && (toplvl === null || toplvl === void 0 ? void 0 : toplvl.title()) === '')
            toplvl = toplvl.nextSibling(); // skip the {{also|preció}} template-only stuff.
        if (toplvl) {
            assert(toplvl.indentation() === 0);
            if (!lang) {
                if (!toplvl.nextSibling()) {
                    skiplang = true;
                    let lang = toplvl.title();
                    $('#qlang').val(lang);
                    // DUMBEST hack but it works I guess
                    // if there's only 1 lang, then we infer lang.
                }
                else {
                    let langs = doc.sections().filter(x => x.indentation() === 0).map(x => x.title());
                    if (langs.includes('English')) {
                        lang = 'English';
                        $('#qlang').val(lang); // auto-infer English
                    }
                    else {
                        displayError($('#sidebar')[0], `More than 1 lang, cannot auto-infer! ${langs.join(', ')}`);
                        throw "More than 1 lang, cannot auto-infer!";
                    }
                }
            }
        }
        let flag = false;
        let multiEtyMode = undefined;
        for (; toplvl; toplvl = toplvl.nextSibling()) {
            // console.log(toplvl);
            if (toplvl.title().toLowerCase() === (lang === null || lang === void 0 ? void 0 : lang.toLowerCase()) || skiplang) {
                flag = true;
                for (let lvl2 = toplvl.sections()[0]; lvl2; lvl2 = lvl2.nextSibling()) {
                    // console.log(lvl2);
                    if (/Etymology \d+/.test(lvl2.title())) {
                        multiEtyMode = true;
                        let myDictEntries = [];
                        for (let lvl3 = lvl2.sections()[0]; lvl3; lvl3 = lvl3.nextSibling()) {
                            if (Wiktionary.WIKTIONARY_POS.indexOf(lvl3.title().toLowerCase()) >= 0) {
                                myDictEntries.push(parseDictEntry(lvl3));
                            }
                        }
                        etylist.push(new EtyEntry(myDictEntries, lvl2, qy));
                    }
                    else if (lvl2.title() === 'Etymology') {
                        assert(!multiEtyMode, 'very strange situation where we both numbered and unnumbered etymologies');
                        myety = lvl2;
                        multiEtyMode = false;
                    }
                    else if (Wiktionary.WIKTIONARY_POS.indexOf(lvl2.title().toLowerCase()) >= 0) {
                        assert(!multiEtyMode, 'strange situation where we have multiple numbered etymologies but also a definition', false);
                        dictEntries.push(parseDictEntry(lvl2));
                    }
                }
            }
        }
        let etys = multiEtyMode ? etylist : [new EtyEntry(dictEntries, myety, qy)];
        assert(flag, "No section found or parsed?", false);
        // if(flag) console.warn("No section found or parsed?")
        // if (callback) callback(etys, doc);
        return [etys, doc];
        // let members = doc.get('etymology'); // doc.infobox().get('current members')
        // members.links().map((l) => l.page())
        //['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood'...]
    }
    function parseDictEntry(sec) {
        let defn = sec;
        let derivs = [];
        for (let sec2 = sec.sections()[0]; sec2; sec2 = sec2.nextSibling()) {
            if (sec2.title() === 'Derived terms') {
                derivs.push(sec2);
            }
        }
        assert(derivs.length <= 1, 'more than 1 deriv? ' + derivs, false);
        return new DictEntry(defn, derivs ? derivs[0] : undefined);
    }
})(Wiktionary || (Wiktionary = {}));
