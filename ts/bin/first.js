"use strict";
window.universe = { batchIndex: 0 };
window.doc = undefined;
// function print(obj: any, str = '') {
//     if (str) console.log(str);
//     if (obj) console.log(obj);
// }
function assert(x, message = '', hard = true) {
    if (!x)
        if (hard)
            throw TypeError(message);
        else
            console.warn(message);
}
function clearDiv() {
    $('#closeinspect')[0].innerHTML = '';
}
function friendlyElement(htmltype, str, top = false, color) {
    let span = document.createElement(htmltype);
    if (str) {
        let txt = document.createTextNode(str);
        span.appendChild(txt);
    }
    if (color)
        span.setAttribute(`style`, `color: ${color}`); // font-style: italic; 
    if (top) {
        $('#closeinspect')[0].prepend(span); // put as first child
    }
    else {
        $('#closeinspect')[0].appendChild(span);
    }
}
function friendlyBreak(top = false) {
    friendlyElement('br', undefined, top);
}
function friendlyInfo(str, override = false, top = false, color = 'black;') {
    if (override)
        clearDiv();
    friendlyElement('span', str, top, color);
}
function friendlyError(str, override = true, top = true, ital = false, newline = false) {
    friendlyInfo(str, override, top, `red;${ital ? ' font-style=italic;' : ''}`);
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
const setCookie = (name, value) => {
    // const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value); // expires on browser close+ '; expires=' + expires + '; path=' + path;
};
function getCookie(name) {
    for (let v of document.cookie.split('; ')) {
        const parts = v.split('=');
        if (parts[0] === name)
            return decodeURIComponent(parts[1]);
    }
    return '';
}
// const deleteCookie = (name: str, path: str) => {
// setCookie(name, '', -1, path);
// }
