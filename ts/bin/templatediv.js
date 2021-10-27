"use strict";
// let mw = wtf.default;
// import wtf from 'https://unpkg.com/wtf_wikipedia';
// / <reference path='https://unpkg.com/wtf_wikipedia'/>
// https://unpkg.com/wtf_wikipedia@9.0.1/builds/wtf_wikipedia-client.min.js
function _appendText(text, div) {
    if (!div)
        div = $('#closeinspect div').last()[0];
    let node = document.createTextNode(text);
    let textbox = document.createElement('span');
    textbox.appendChild(node);
    div.appendChild(textbox);
    return textbox;
}
function plopSectionToDiv(entry, div) {
    if (!div)
        div = $('#closeinspect div').last()[0];
    // TODO plop a link here for easy access
    let sec = entry; // instanceof EtyEntry ? entry.ety! : entry;
    let t = sec.wikitext();
    // t = t.replace(/#/g, '\n');
    // $('#closeinspect')[0].textContent = t ? t : '';
    // let temps = sec!.templates();
    let [idxs, lens] = getTemplates(t);
    let start = 0, end = 0;
    for (let i = 0; i < idxs.length; i++) {
        let idx = idxs[i];
        end = idx;
        _appendText(t.slice(start, end), div);
        start = end;
        end = start + lens[i];
        let ttext = t.slice(start, end);
        let template = _appendText(ttext, div);
        template.classList.add('template');
        template.classList.add(findRelevance(ttext) ? 't-active' : 't-inactive'); // requires a dependency on template.ts
        template.onclick = () => onTemplateClicked(template);
        div.appendChild(template);
        start = end;
    }
    _appendText(t.slice(start), div); // don't forget to add the rest of the text
    friendlyBreak(div, false);
    return true;
}
function templTknr(inp, startidx, nests) {
    // TODO reuse this to recognize cogs
    assert(inp[startidx] === '{' && inp[startidx + 1] === '{', `messed up template!`);
    for (let i = startidx + 2; i < inp.length; i++) {
        let c = inp[i];
        if (c === '{') {
            if (inp[i + 1] && inp[i + 1] === '{') {
                let [segm, newidx] = templTknr(inp, i, nests);
                if (segm) {
                    nests.push(segm);
                    i = newidx;
                }
                else {
                    console.warn(`bad template! ${inp.substring(startidx, Math.min(inp.length, startidx + 20))}`, false);
                }
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
// function onCheckbox() {
//     if($('#tb-toggle').is(':checked')) {
//         // $('.template').addClass('noSelect');
//     } else {
//         $('.template').removeClass('noSelect');
//     }
// }
