"use strict";
// let mw = wtf.default;
// import wtf from 'https://unpkg.com/wtf_wikipedia';
// / <reference path='https://unpkg.com/wtf_wikipedia'/>
// https://unpkg.com/wtf_wikipedia@9.0.1/builds/wtf_wikipedia-client.min.js
var Sidebar;
(function (Sidebar) {
    class GeneralizedSidebar {
    }
    class HTMLSidebar extends GeneralizedSidebar {
        isTemplate(span) {
            return span.matches('.template.t-active');
        }
        yieldDivlets() {
            return $('#sidebar div');
        }
        yieldSpans(defn) {
            return defn.querySelectorAll('span');
        }
        _appendText(text, div) {
            if (!div)
                div = $('#sidebar div').last()[0];
            let node = document.createTextNode(text);
            let textbox = document.createElement('span');
            textbox.appendChild(node);
            div.appendChild(textbox);
            return textbox;
        }
        transferToSidebarDiv(entry, sidebar) {
            if (!sidebar)
                sidebar = $('#sidebar div').last()[0];
            // TODO plop a link here for easy access
            let sec = entry; // instanceof EtyEntry ? entry.ety! : entry;
            let t = sec.wikitext();
            // t = t.replace(/#/g, '\n');
            // $('#sidebar')[0].textContent = t ? t : '';
            // let temps = sec!.templates();
            let [idxs, lens] = getTemplates(t);
            let start = 0, end = 0;
            for (let i = 0; i < idxs.length; i++) {
                let idx = idxs[i];
                end = idx;
                this._appendText(t.slice(start, end), sidebar);
                start = end;
                end = start + lens[i];
                let ttext = t.slice(start, end);
                let template = this._appendText(ttext, sidebar);
                template.classList.add('template');
                template.classList.add(Templates.findRelevance(ttext) ? 't-active' : 't-inactive'); // requires a dependency on template.ts
                template.onclick = () => onTemplateClicked(template);
                sidebar.appendChild(template);
                start = end;
            }
            this._appendText(t.slice(start), sidebar); // don't forget to add the rest of the text
            displayBreak(sidebar, false);
            // return true;
        }
        transferAllEntries(entries, updownBehavior = 'up') {
            // formerly in graph.ts under 
            for (let i = 0; i < entries.length; i++) {
                let etyentry = entries[i];
                let defnDiv = document.createElement('div');
                defnDiv.classList.add('sidebar-defn');
                let etyDiv = undefined;
                let descDiv = undefined;
                if (entries.length > 1) {
                    displayElement(defnDiv, 'h3', `Definition ${i + 1}:`); // 1-index
                }
                displayInfo(defnDiv, `https://en.wiktionary.org/wiki/${etyentry.qy}`);
                displayBreak(defnDiv);
                for (let defn of etyentry.defns)
                    this.transferToSidebarDiv(defn.defn, defnDiv);
                $('#sidebar')[0].appendChild(defnDiv);
                if (updownBehavior === 'up' || updownBehavior === 'updown') {
                    etyDiv = document.createElement('div');
                    etyDiv.classList.add('sidebar-ety');
                    if (etyentry.ety) {
                        this.transferToSidebarDiv(etyentry.ety, etyDiv);
                    }
                    else {
                        displayError(defnDiv, `No etymology found. (Perhaps it\'s lemmatized?)`, true, true, true, true);
                    }
                }
                if (updownBehavior === 'down' || updownBehavior === 'updown') {
                    descDiv = document.createElement('div');
                    descDiv.classList.add('sidebar-desc');
                    for (let defn of etyentry.defns) {
                        if (defn.deriv) {
                            this.transferToSidebarDiv(defn.deriv, descDiv);
                        }
                        if (defn.deriv && defn.desc) {
                            displayBreak(descDiv);
                        }
                        if (defn.desc) {
                            this.transferToSidebarDiv(defn.desc, descDiv);
                        }
                    }
                }
                // onCheckbox();
                $('#sidebar')[0].appendChild(defnDiv);
                if (etyDiv)
                    $('#sidebar')[0].appendChild(etyDiv);
                if (descDiv)
                    $('#sidebar')[0].appendChild(descDiv);
                // Graph.createTree used to be here, back when this for-loop was in graph.ts
            }
        }
    }
    Sidebar.htmlbar = new HTMLSidebar();
    function templateTknr(inp, startidx, nests) {
        // TODO reuse this to recognize cogs
        assert(inp[startidx] === '{' && inp[startidx + 1] === '{', `messed up template!`);
        for (let i = startidx + 2; i < inp.length; i++) {
            let c = inp[i];
            if (c === '{') {
                if (inp[i + 1] && inp[i + 1] === '{') {
                    let [segm, newidx] = templateTknr(inp, i, nests);
                    if (segm) {
                        nests.push(segm);
                        i = newidx;
                    }
                    else {
                        console.warn(`bad template! ${inp.substring(startidx, Math.min(inp.length, startidx + 20))}`);
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
        // This custom naive function works better (ie. {{cog}}) 
        // See https://github.com/spencermountain/wtf_wikipedia/issues/432
        // Actually, this is because wiktionary templates are stored in the plugin wtf-plugin-wiktionary
        // However currently the plugin isn't perfect
        // A major TODO would be refactor the logic into a wtf plugin, because that system
        // once implemented fully would be a lot more streamlined and robust.
        // but that plugin currently has some flaws which is why I'm not using it yet.
        let plain = typeof sec === 'string' ? sec : sec.wikitext();
        let idxs = [];
        let lens = [];
        for (let i = 0; i < plain.length; i++) {
            let char = plain[i];
            if (char === '{' && plain[i + 1] && plain[i + 1] === '{') {
                let nests = [];
                let [templ, newidx] = templateTknr(plain, i, nests);
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
    Sidebar.onTemplateClicked = onTemplateClicked;
})(Sidebar || (Sidebar = {}));
// function onCheckbox() {
//     if($('#tb-toggle').is(':checked')) {
//         // $('.template').addClass('noSelect');
//     } else {
//         $('.template').removeClass('noSelect');
//     }
// }
