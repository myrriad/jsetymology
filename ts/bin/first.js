"use strict";
window.universe = { batchIndex: 0 };
window.doc = undefined;
const cognatus = {
    showEdgeLabels: true,
    autoGraphTemplates: true,
    // mode: 'explore', // 'explore', 'move', 'edge'
    toolbar: {
        mode: 'explore',
        updown: 'up'
    },
    historyIndex: 0,
    aggressiveTemplateInclusion: false
};
;
function assert(x, message = '', hard = true, hardest = false) {
    if (!x)
        if (hard || hardest) {
            let er = new TypeError(message);
            alert(message + "\n\n " + er.stack);
            console.trace(message);
            if (hardest)
                throw er;
        }
        else {
            console.trace(message);
        }
}
function clearDiv() {
    $('#sidebar')[0].innerHTML = '';
}
function displayElement(div, htmltype, str, top = false, color) {
    if (!div)
        div = $('#sidebar div').last()[0];
    let span = document.createElement(htmltype);
    if (str) {
        let txt = document.createTextNode(str);
        span.appendChild(txt);
    }
    if (color)
        span.setAttribute(`style`, `color: ${color}`); // font-style: italic; 
    if (top) {
        div.prepend(span); // put as first child
    }
    else {
        div.appendChild(span);
    }
}
function displayBreak(div, top = false) {
    displayElement(div, 'br', undefined, top);
}
function displayInfo(div, str, override = false, top = false, color = 'black;', newline = true) {
    if (override)
        clearDiv();
    if (top && newline)
        displayBreak(div, true);
    displayElement(div, 'span', str, top, color);
    if (!top && newline)
        displayBreak(div, false);
}
function displayError(div, str, override = true, top = true, ital = false, newline = true) {
    displayInfo(div, str, override, top, `red;${ital ? ' font-style=italic;' : ''}`, newline);
}
function _parse(...strs) {
    let ret = new Array(strs.length);
    for (let i = 0; i < strs.length; i++) {
        let str = strs[i];
        if (!str) {
            ret[i] = '';
            continue;
        }
        str = str.replace('"', 'quote'); // https://js.cytoscape.org/#selectors/notes-amp-caveats
        str = str.replace('\\', 'backslash');
        str = str.replace(',', 'comma');
        str = str.replace('$', 'dsign');
        str = str.replace(',', 'comma');
        str = str.replace(',', 'comma');
        str = str.replace(',', 'comma');
        ret[i] = str;
    }
    if (ret.length === 1)
        return ret[0];
    return ret;
}
// let mw = wtf.default;
function a(obj) {
    return obj ? [obj.x, obj.y] : [0, 0];
}
let showCognates = true;
let twhitelist = [];
let tblacklist = [];
// const deleteCookie = (name: str, path: str) => {
// setCookie(name, '', -1, path);
// }
let wls = [];
wls._wlstrcache = '?';
wls.addwl = function (word, lang) {
    for (let wl of wls) {
        if (wl[0] === word && wl[1] === lang) {
            // OH MY GOD it's a race condition ;-;
            // actually nvm it isn't
            return;
        }
    }
    if (wls.length >= 1) {
        wls._wlstrcache += '&';
    }
    wls._wlstrcache += `${word}=${lang}`;
    wls.push([word, lang]);
};
wls.toURLQuery = function () {
    let ret = '?';
    for (let i = 0; i < wls.length - 1; i++) {
        let wl = wls[i];
        ret = ret + `${wl[0]}=${wl[1]}&`;
    }
    let wl = wls[wls.length - 1];
    ret = ret + `${wl[0]}=${wl[1]}`;
    wls._wlstrcache = ret;
    return ret;
};
