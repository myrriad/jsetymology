// let mw = wtf.default;
// import wtf from 'https://unpkg.com/wtf_wikipedia';
// / <reference path='https://unpkg.com/wtf_wikipedia'/>
(window as any).doc = undefined;
// https://unpkg.com/wtf_wikipedia@9.0.1/builds/wtf_wikipedia-client.min.js
type num= number;
type str = string;
// @ts-ignore
let wth = wtf as typeof wtt.default; // HOLY SH*T THIS ONE LINE IS SO F*CKING OBNOXIOUS
// wtf.extend(require('wtf-plugin-html'))
// @ts-ignore
// wtf.extend(wtfHtml);

const PARTS_OF_SPEECH = [
    "noun", "verb", "adjective", "adverb", "determiner",
    "article", "preposition", "conjunction", "proper noun",
    "letter", "character", "phrase", "proverb", "idiom",
    "symbol", "syllable", "numeral", "initialism", "interjection",
    "definitions", "pronoun",
];

const RELATIONS = [
    "synonyms", "antonyms", "hypernyms", "hyponyms",
    "meronyms", "holonyms", "troponyms", "related terms",
    "coordinate terms",
]

function assert(x: any, message='', hard=true) {
    if(!x) if(hard) throw TypeError(message); else console.warn(message);
}
type Section = wtt.default.Section;
class DictEntry {
    defn;
    deriv;
    constructor(defn: Section, deriv?: Section) {
        this.defn = defn;
        this.deriv = deriv;
    }
}
class EtyEntry {
    defns; ety;
    constructor(defns: DictEntry[], ety?: Section) {
        this.defns = defns;
        this.ety = ety;
    }
}

function gofetch(word: string, lang='', reconstr=false, callback?: (etys: EtyEntry[]) => void) {
    if(!word) throw "You didn't pass a word in to search!";
    // @ts-ignore
    let qy = reconstr ? `Reconstruction:${lang.replace(' ', '-')}/${decodeWord(word, lang)}` : decodeWord(word, lang); // anti-macron here and nowhere else
    wth.fetch(qy, {
        lang: 'en',
        wiki: 'wiktionary'
    }, function (err, doc2) {
        // doc.
        // let doc3 = doc2[0];
        let doc = doc2 instanceof Array ? doc2[0] : doc2;
        if(!doc) {
            alert(`Could not find the document for ${word}, ${lang}!`);
            return;
        }
        doc = doc as wtt.default.Document;
        // console.log(doc);

        (window as any).doc = doc;
        let myety = undefined;
        let etylist = [];
        let dictEntries = [];

        
        let toplvl = doc.sections()[0] as wtt.default.Section | null;
        
        let skiplang= false;
        // auto-inferral
        while (toplvl && toplvl?.title() === '') toplvl = toplvl.nextSibling(); // skip the {{also|preció}} template-only stuff.
        if(toplvl ) {
            // @ts-ignore
            assert(toplvl.depth() === 0);
            if(!lang) {
                if(!toplvl.nextSibling()) {
                    skiplang = true;
                 // if there's only 1 lang, then we infer lang.
                } else {

                    friendlyError("More than 1 lang, cannot auto-infer!");
                    throw "More than 1 lang, cannot auto-infer!";
                }
            }
        }
        let flag = false;
        let multiEtyMode = undefined;


        for (;toplvl; toplvl=toplvl.nextSibling()) {
            // console.log(toplvl);
            if(toplvl.title().toLowerCase() === lang?.toLowerCase() || skiplang) {
                
                flag = true;
                for (let lvl2=toplvl.sections()[0] as wtt.default.Section|null; lvl2; lvl2=lvl2.nextSibling()) {
                    // console.log(lvl2);
                    if (/Etymology \d+/.test(lvl2.title())) {
                        multiEtyMode = true;
                        let myDictEntries = [];
                        for (let lvl3 = lvl2.sections()[0] as wtt.default.Section | null; lvl3; lvl3 = lvl3.nextSibling()) {
                            if (PARTS_OF_SPEECH.indexOf(lvl3.title().toLowerCase()) >= 0) {
                                myDictEntries.push(parseDictEntry(lvl3));
                            }
                        }
                        etylist.push(new EtyEntry(myDictEntries, lvl2));
                        

                    } else if (lvl2.title() === 'Etymology') {
                        assert(!multiEtyMode);
                        myety = lvl2;
                        multiEtyMode = false;
                    } else if(PARTS_OF_SPEECH.indexOf(lvl2.title().toLowerCase()) >= 0) {
                        assert(!multiEtyMode);
                        dictEntries.push(parseDictEntry(lvl2));
                    }
                        
                }
            }
        }
        let etys = multiEtyMode ? etylist : [new EtyEntry(dictEntries, myety)];
        assert(flag, "No section found or parsed?", false)
        if (callback) callback(etys);
        // let members = doc.get('etymology'); // doc.infobox().get('current members')
        // members.links().map((l) => l.page())
        //['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood'...]
    });

}

function parseDictEntry(sec: Section): DictEntry {
    let defn = sec;
    let derivs = [];
    for (let sec2 = sec.sections()[0] as wtt.default.Section | null; sec2; sec2 = sec2.nextSibling()) {
        if (sec2.title() === 'Derived terms') {
            derivs.push(sec2);
        }

    }
    assert(derivs.length <= 1, 'more than 1 deriv? ' + derivs, false);

    return new DictEntry(defn, derivs ? derivs[0] : undefined);
}

function getIndices(sec: wtt.default.Section, temps?: wtt.default.Template[]) {
    if(!temps) temps = sec.templates();
    let i=0;
    let idxs = [];
    let str = sec.wikitext();
    for(let temp of temps) {
        let i2 = str.indexOf(temp.wikitext(), i);
        assert(i2 >= 0, 'template not found! ' + temp.wikitext(), false);
        if(i2 === -1) i2 = 0; 
        else i = i2;
        idxs.push(i);
    }
    return idxs;
}

// gofetch('leaflet', 'english')
// @ts-ignore
// gofetch('lead', 'english', (x)=>window.x = x);

function friendlyError(str: string, override=true) {
    if(override) $('#closeinspect')[0].innerHTML = '';

    let txt = document.createTextNode(str);
    let span = document.createElement('span');
    span.setAttribute('style', 'color: red;'); // font-style: italic; 
    span.appendChild(txt);
    $('#closeinspect')[0].appendChild(span);

}

function plop(entry: Section | EtyEntry, override=true) {
    // TODO plop a link here for easy access
    if(!entry || entry instanceof EtyEntry && !entry.ety) {
        $('#closeinspect')[0].innerHTML = '<i>No etymology found. (Perhaps it\'s lemmatized?)</i>';
        return;
    }
    let sec = entry instanceof EtyEntry ? entry.ety! : entry;
    
    let t = sec!.wikitext();
    // t = t.replace(/#/g, '\n');
    // $('#closeinspect')[0].textContent = t ? t : '';
    // let temps = sec!.templates();
    // let idxs = getIndices(sec!);

    let [idxs, lens] = getTemplates(t);

    let start=0, end = 0;
    assert(idxs.length === idxs.length);
    if(override) {
        $('#closeinspect')[0].innerHTML = '';
     } else {
        $('#closeinspect')[0].appendChild(document.createElement('br'));

     }
    for(let i=0;i<idxs.length;i++) {
        let idx = idxs[i];
        end = idx;
        let text = document.createTextNode(t.slice(start, end));
        let textbox = document.createElement('span');
        textbox.appendChild(text);
        $('#closeinspect')[0].appendChild(textbox);

        start = end;
        end = start + lens[i];
        let ttext = t.slice(start, end);
        let ttextNode = document.createTextNode(ttext);
        let template = document.createElement('span');
        // template.setAttribute('style', 'background-color: #FF000022;');
        template.appendChild(ttextNode);
        template.classList.add('template');
        template.classList.add(findRelevance(ttext) ? 't-active' : 't-inactive');
        template.onclick = () => onTemplateClicked(template);
        $('#closeinspect')[0].appendChild(template);
        start = end;
    }
}

function templTknr(inp: string, startidx: number, nests: string[]): [str, num] {
    assert(inp[startidx] === '{' && inp[startidx + 1] === '{');
    for(let i=startidx+2;i<inp.length;i++) {
        let c = inp[i];
        if(c === '{') {
            if(inp[i+1] && inp[i+1] === '{') {
                let [segm, newidx] = templTknr(inp, i, nests);
                if(segm) {
                    nests.push(segm);
                } else {
                    throw "bad template!";
                }
                i = newidx;
            } else continue;
        } else if(c === '}') {
            if (inp[i + 1] && inp[i + 1] === '}') {
                return [inp.substring(startidx, i+2), i+2];
            } else continue;
        }
    }
    return ['', startidx];
}
function getTemplates(sec: Section | string) {
    // somehow this custom naive function works better
    let plain = typeof sec === 'string' ? sec : sec.wikitext();
    let idxs = [];
    let lens = [];
    for (let i = 0; i < plain.length; i++) {
        let char = plain[i];
        if (char === '{' && plain[i+1] && plain[i + 1] === '{') {
            let nests: string[] = [];
            let [templ, newidx] = templTknr(plain, i, nests);
            if(templ) {
                idxs.push(i);
                lens.push(templ.length);

                i = newidx;
            }
            continue;

        }
    }
    return [idxs, lens];
}



function onTemplateClicked(templ: HTMLSpanElement) {

    if (!$('#tb-toggle').is(':checked')) return;

    // templ.setAttribute('style', 'background-color: #FF000022;');
    let isActive = !!templ.classList.contains('t-active');
    if(isActive) templ.classList.remove('t-active');
    if(!isActive) templ.classList.remove('t-inactive');
    templ.classList.add(isActive ? 't-inactive' : 't-active');

}

function onCheckbox() {
    if($('#tb-toggle').is(':checked')) {
        // $('.template').addClass('noSelect');
    } else {
        $('.template').removeClass('noSelect');
    }
}

function findRelevance(templatestr: str) {
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

    if (etys.includes(ttype)) return true; // Whitelist.


    if (['syn', 'label', 'qualifier', 'ux', 'uxi', 'head', 'ws', // Blacklist.
        'Wikipedia', 'slim-wikipedia', 'Wikisource', 'Wikibooks', 'w', 'pedialite',
        'IPA', 'rfap', 'rfp'].includes(ttype)) return false;

    for (let comb of ['quote', 'R:', 'Swadesh', 'ws ']) if (ttype.startsWith(comb)) return false;

    // Form of.
    let templPOS = ['adj', 'adv', 'con', 'det', 'interj', 'noun', 'num', 'part', 'postp', 'prep', 'pron', 'proper noun', 'verb'];
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
    for (let pos of templPOS) if (frag.endsWith('-' + pos)) return true;

    if (ttype.endsWith(' of')) return true; // many POSs end with ' of'.
    // https://en.wiktionary.org/wiki/Wiktionary:Templates#Etymology

    if (['delete', 'rfd', 'rfd-redundant', 'rfv', 'rfv-sense', 't-needed', 'rfscript', 'rfap', 'rfc', 'rfdate', 'rfdef', 'rfe', 'rfp', 'rfi',
        'tea room', 'rfv-passed', 'rfv-failed', 'rfv-archived', 'rfd-passed', 'rfd-failed', 'rfd-archived'].includes(ttype)) return false;

    if (templatestr.includes('-')) return true; // if it has a hyphen, there's a pretty good chance it's a lemma

    // requests: https://en.wiktionary.org/wiki/Wiktionary:Templates#Requests

    return false;
}

function saveWiktEntry() {
    let html = $('#closeinspect').html();
    console.log(html);
}
