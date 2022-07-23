class DictEntry {
    defn;
    deriv;
    desc;
    constructor(defn: Section, deriv?: Section, desc?: Section) {
        this.defn = defn;
        this.deriv = deriv;
        this.desc = desc;
    }
}
class EtyEntry {
    defns; ety; qy;
    constructor(defns: DictEntry[], ety?: Section, qy?: str) {
        this.defns = defns;
        this.ety = ety;
        this.qy = qy;
    }

}

class WiktionaryResult {
    doc: wtf.Document;
    entries: EtyEntry[];

    /**
     * original query string used
     */
    qy: string;
    constructor(query: string, entries: EtyEntry[], doc: wtf.Document) {
        this.entries = entries;
        this.qy = query;
        this.doc = doc;
    }
}

namespace Wiktionary {
    export const WIKTIONARY_POS = [
        "noun", "verb", "adjective", "adverb", "determiner",
        "article", "preposition", "conjunction", "proper noun",
        "letter", "character", "phrase", "proverb", "idiom", // add particle
        "symbol", "syllable", "numeral", "initialism", "interjection",
        "definitions", "pronoun",
        "particle", "root" // These POS were found in P-I-E articles
    ];

    export function fetchCategories(word: string, lang = '', reconstr = false, cachedDoc?: wtf.Document,
            callback?: (etys: EtyEntry[], doc: wtf.Document) => void) {
                // TODO
    }

    export function fetchEtyEntry(word: string, lang = '', reconstr = false, cachedDoc?: wtf.Document, 
            callback?: (result: WiktionaryResult) => void) {
        if (!word) throw "You didn't pass a word in to search!";
        let qy = reconstr ? `Reconstruction:${lang.replace(' ', '-')}/${Templates.decodeWord(word, lang)}` : Templates.decodeWord(word, lang); // anti-macron here and nowhere else

        return wtffetch(qy, {
            lang: 'en',
            wiki: 'wiktionary'
        }, cachedDoc).then((doc) => {
            let result = ondoc(doc, word, lang, qy);
            if (result) {
                if (callback) {
                    callback(result);
                }
                return result;
            } else {
                // there is no document
                displayError($('#sidebar')[0], `Could not find the document for ${word}, ${lang}! https://en.wiktionary.org/wiki/${qy}`, false);
                return undefined;
            }
            return undefined;
        }); 
    }
    function ondoc(doc2: wtf.Document | wtf.Document[] | null, word: str, lang: str, qy: str): WiktionaryResult | undefined { // (error: unknown, result: wtf.Document | wtf.Document[] | null)
        // let doc3 = doc2[0];
        let doc = (doc2 instanceof Array ? doc2[0] : doc2) as wtf.Document;
        if (!doc) {
            return undefined;
        }
        // friendlyInfo(`https://en.wiktionary.org/wiki/${qy}`, false);

        (window as any).doc = doc;
        let myety = undefined;
        let etylist = [];
        let dictEntries = [];


        let toplvl = doc.sections()[0] as wtf.Section | null;

        let skiplang = false;
        // auto-inferral
        while (toplvl && toplvl?.title() === '') toplvl = toplvl.nextSibling(); // skip the {{also|preció}} template-only stuff.
        if (toplvl) {
            assert(toplvl.indentation() === 0);
            if (!lang) {
                if (!toplvl.nextSibling()) {
                    skiplang = true;
                    let lang = toplvl.title()
                    $('#qlang').val(lang);
                    // DUMBEST hack but it works I guess
                    // if there's only 1 lang, then we infer lang.
                } else {
                    let langs = doc.sections().filter(x => x.indentation() === 0).map(x => x.title());
                    if (langs.includes('English')) {
                        lang = 'English';
                        $('#qlang').val(lang); // auto-infer English
                    } else {
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
            if (toplvl.title().toLowerCase() === lang?.toLowerCase() || skiplang) {

                flag = true;
                for (let lvl2 = (toplvl.sections() as Section[])[0] as wtf.Section | null; lvl2; lvl2 = lvl2.nextSibling()) {
                    // console.log(lvl2);
                    if (/Etymology \d+/.test(lvl2.title())) {
                        multiEtyMode = true;
                        let myDictEntries = [];
                        for (let lvl3 = (lvl2.sections() as Section[])[0] as wtf.Section | null; lvl3; lvl3 = lvl3.nextSibling()) {
                            if (WIKTIONARY_POS.indexOf(lvl3.title().toLowerCase()) >= 0) {
                                myDictEntries.push(parseDictEntry(lvl3));
                            }
                        }
                        etylist.push(new EtyEntry(myDictEntries, lvl2, qy));


                    } else if (lvl2.title() === 'Etymology') {
                        assert(!multiEtyMode, 'very strange situation where we both numbered and unnumbered etymologies');
                        myety = lvl2;
                        multiEtyMode = false;
                    } else if (WIKTIONARY_POS.indexOf(lvl2.title().toLowerCase()) >= 0) {
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
        return new WiktionaryResult(qy, etys, doc);
        // let members = doc.get('etymology'); // doc.infobox().get('current members')
        // members.links().map((l) => l.page())
        //['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood'...]
    }

    function parseDictEntry(sec: Section): DictEntry {
        let defn = sec;
        let derivs = [];
        let descs = [];
        for (let sec2 = (sec.sections() as Section[])[0] as wtf.Section | null; sec2; sec2 = sec2.nextSibling()) {
            if (sec2.title() === 'Derived terms') {
                derivs.push(sec2);
            } else if(sec2.title() === 'Descendants') {
                descs.push(sec2);
            }

        }
        assert(derivs.length <= 1, 'more than 1 derived terms section? ' + derivs, false);
        assert(descs.length <= 1, 'more than 1 descendant section? ' + descs, false);

        return new DictEntry(defn, derivs ? derivs[0] : undefined, descs ? descs[0] : undefined);
    }
}