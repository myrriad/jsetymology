"use strict";
// let mw = wtf.default;
// import wtf from 'https://unpkg.com/wtf_wikipedia';
// / <reference path='https://unpkg.com/wtf_wikipedia'/>
// https://unpkg.com/wtf_wikipedia@9.0.1/builds/wtf_wikipedia-client.min.js
// @ts-ignore
// let wth = wtf as typeof wtt.default; // HOLY SH*T THIS ONE LINE IS SO F*CKING OBNOXIOUS
// wtf.extend(require('wtf-plugin-html'))
// @ts-ignore
// wtf.extend(wtfHtml);
const PARTS_OF_SPEECH = [
    "noun", "verb", "adjective", "adverb", "determiner",
    "article", "preposition", "conjunction", "proper noun",
    "letter", "character", "phrase", "proverb", "idiom",
    "symbol", "syllable", "numeral", "initialism", "interjection",
    "definitions", "pronoun",
    "particle", "root" // These POS were found in P-I-E articles
];
const templPOS = ['adj', 'adv', 'con', 'det', 'interj', 'noun', 'num', 'part', 'postp', 'prep', 'pron', 'proper noun', 'verb'];
const RELATIONS = [
    "synonyms", "antonyms", "hypernyms", "hyponyms",
    "meronyms", "holonyms", "troponyms", "related terms",
    "coordinate terms",
];
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
function gofetch(word, lang = '', reconstr = false, callback) {
    if (!word)
        throw "You didn't pass a word in to search!";
    let qy = reconstr ? `Reconstruction:${lang.replace(' ', '-')}/${decodeWord(word, lang)}` : decodeWord(word, lang); // anti-macron here and nowhere else
    wtffetch(qy, {
        lang: 'en',
        wiki: 'wiktionary'
    }, function (err, doc2) {
        // doc.
        // let doc3 = doc2[0];
        if (err) {
            throw err;
        }
        let doc = doc2 instanceof Array ? doc2[0] : doc2;
        if (!doc) {
            friendlyError(`Could not find the document for ${word}, ${lang}! https://en.wiktionary.org/wiki/${qy}`, false);
            let h = cy().$(`node[id="${_parse(word)}, ${_parse(lang)}"]`)[0];
            h.data.searched = true;
            h.style('background-color', 'green');
            return;
        }
        doc = doc;
        // console.log(doc);
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
            // @ts-ignore
            assert(toplvl.depth() === 0);
            if (!lang) {
                if (!toplvl.nextSibling()) {
                    skiplang = true;
                    let lang = toplvl.title();
                    $('#qlang').val(lang); // DUMBEST hack but it works I guess
                    // if there's only 1 lang, then we infer lang.
                }
                else {
                    friendlyError("More than 1 lang, cannot auto-infer!");
                    throw "More than 1 lang, cannot auto-infer!";
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
                            if (PARTS_OF_SPEECH.indexOf(lvl3.title().toLowerCase()) >= 0) {
                                myDictEntries.push(parseDictEntry(lvl3));
                            }
                        }
                        etylist.push(new EtyEntry(myDictEntries, lvl2, qy));
                    }
                    else if (lvl2.title() === 'Etymology') {
                        assert(!multiEtyMode);
                        myety = lvl2;
                        multiEtyMode = false;
                    }
                    else if (PARTS_OF_SPEECH.indexOf(lvl2.title().toLowerCase()) >= 0) {
                        assert(!multiEtyMode);
                        dictEntries.push(parseDictEntry(lvl2));
                    }
                }
            }
        }
        let etys = multiEtyMode ? etylist : [new EtyEntry(dictEntries, myety, qy)];
        assert(flag, "No section found or parsed?", false);
        if (callback)
            callback(etys);
        // let members = doc.get('etymology'); // doc.infobox().get('current members')
        // members.links().map((l) => l.page())
        //['Thom Yorke', 'Jonny Greenwood', 'Colin Greenwood'...]
    });
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
// function getIndices(sec: wtf.default.Section, temps?: wtf.default.Template[]) {
//     if(!temps) temps = sec.templates();
//     let i=0;
//     let idxs = [];
//     let str = sec.wikitext();
//     for(let temp of temps) {
//         let i2 = str.indexOf(temp.wikitext(), i);
//         assert(i2 >= 0, 'template not found! ' + temp.wikitext(), false);
//         if(i2 === -1) i2 = 0; 
//         else i = i2;
//         idxs.push(i);
//     }
//     return idxs;
// }
function plop(entry, override = true) {
    // TODO plop a link here for easy access
    if (!entry || entry instanceof EtyEntry && !entry.ety) {
        $('#closeinspect')[0].innerHTML = `<i>No etymology found. (Perhaps it\'s lemmatized?)</i>`;
        return false;
    }
    let sec = entry instanceof EtyEntry ? entry.ety : entry;
    let t = sec.wikitext();
    // t = t.replace(/#/g, '\n');
    // $('#closeinspect')[0].textContent = t ? t : '';
    // let temps = sec!.templates();
    // let idxs = getIndices(sec!);
    let [idxs, lens] = getTemplates(t);
    let start = 0, end = 0;
    assert(idxs.length === idxs.length);
    if (override) {
        $('#closeinspect')[0].innerHTML = '';
    }
    else {
        $('#closeinspect')[0].appendChild(document.createElement('br'));
    }
    for (let i = 0; i < idxs.length; i++) {
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
        template.classList.add(findRelevance(ttext) ? 't-active' : 't-inactive'); // requires a dependency on template.ts
        template.onclick = () => onTemplateClicked(template);
        $('#closeinspect')[0].appendChild(template);
        start = end;
    }
    return true;
}
function templTknr(inp, startidx, nests) {
    assert(inp[startidx] === '{' && inp[startidx + 1] === '{');
    for (let i = startidx + 2; i < inp.length; i++) {
        let c = inp[i];
        if (c === '{') {
            if (inp[i + 1] && inp[i + 1] === '{') {
                let [segm, newidx] = templTknr(inp, i, nests);
                assert(segm, "bad template!");
                nests.push(segm);
                i = newidx;
            }
            else
                continue;
        }
        else if (c === '}') {
            if (inp[i + 1] && inp[i + 1] === '}') {
                return [inp.substring(startidx, i + 2), i + 2];
            }
            else
                continue;
        }
    }
    return ['', startidx];
}
function getTemplates(sec) {
    // somehow this custom naive function works better, as {{cog}} are ignored. 
    // See https://github.com/spencermountain/wtf_wikipedia/issues/432
    let plain = typeof sec === 'string' ? sec : sec.wikitext();
    let idxs = [];
    let lens = [];
    for (let i = 0; i < plain.length; i++) {
        let char = plain[i];
        if (char === '{' && plain[i + 1] && plain[i + 1] === '{') {
            let nests = [];
            let [templ, newidx] = templTknr(plain, i, nests);
            if (templ) {
                idxs.push(i);
                lens.push(templ.length);
                i = newidx;
            }
            continue;
        }
    }
    return [idxs, lens];
}
function onTemplateClicked(templ) {
    if (!$('#tb-toggle').is(':checked'))
        return;
    // templ.setAttribute('style', 'background-color: #FF000022;');
    let isActive = !!templ.classList.contains('t-active');
    if (isActive)
        templ.classList.remove('t-active');
    if (!isActive)
        templ.classList.remove('t-inactive');
    templ.classList.add(isActive ? 't-inactive' : 't-active');
}
function onCheckbox() {
    if ($('#tb-toggle').is(':checked')) {
        // $('.template').addClass('noSelect');
    }
    else {
        $('.template').removeClass('noSelect');
    }
}
