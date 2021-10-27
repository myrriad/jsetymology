(window as any).universe = { batchIndex: 0 };

(window as any).doc = undefined;

declare function cy(): cytoscape.Core;


type num = number;
type str = string;
type bool = boolean;

type Section = wtf.default.Section;

// function print(obj: any, str = '') {
//     if (str) console.log(str);
//     if (obj) console.log(obj);
// }
function assert(x: any, message = '', hard = true, hardest = false) {
    if (!x) if (hard || hardest) {
        let er = new TypeError(message);
        alert(message + "\n\n " + er.stack);
        console.trace(message);
        if(hardest) throw er;
    }else {
        console.trace(message);
    }
}

function clearDiv() {
    $('#closeinspect')[0].innerHTML = '';
}
function friendlyElement(div: ParentNode | undefined, htmltype: str, str?: string, top = false, color?: str): void {

    if (!div) div = $('#closeinspect div').last()[0];
    let span = document.createElement(htmltype);

    if(str) {
        let txt = document.createTextNode(str);
        span.appendChild(txt);
    }
    if(color) span.setAttribute(`style`, `color: ${color}`); // font-style: italic; 
    if (top) {
        div.prepend(span); // put as first child
    } else {
        div.appendChild(span);
    }

}
function friendlyBreak(div: ParentNode | undefined, top = false) {
    friendlyElement(div, 'br', undefined, top);
}
function friendlyInfo(div: ParentNode | undefined, str: string, override = false, top = false, color = 'black;', newline=true): void {
    if (override) clearDiv();
    if(top && newline) friendlyBreak(div, true);
    friendlyElement(div, 'span', str, top, color);
    if (!top && newline) friendlyBreak(div, false);

}

function friendlyError(div: ParentNode | undefined, str: string, override = true, top=true, ital=false, newline=true) {
    friendlyInfo(div, str, override, top, `red;${ital ? ' font-style=italic;' : ''}`, newline);
}
function _parse(...strs: str[]) {

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
    if (ret.length === 1) return ret[0];
    return ret;
}
// let mw = wtf.default;

function a(obj?: {x: num, y:num}) {
    return obj ? [obj.x, obj.y] : [0, 0];
}

let showCognates: boolean = true;
let twhitelist = [] as str[]; 
let tblacklist = [] as str[]; 

const setCookie = (name: str, value: str) => {//}, days = 7, path = '/') => { // https://stackoverflow.com/questions/4825683/how-do-i-create-and-read-a-value-from-cookie
    // const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) // expires on browser close+ '; expires=' + expires + '; path=' + path;
}

function getCookie (name: str) {
    for(let v of document.cookie.split('; ')) {
        const parts = v.split('=');
        if(parts[0] === name) return decodeURIComponent(parts[1]);
    }
    return '';
}

// const deleteCookie = (name: str, path: str) => {
    // setCookie(name, '', -1, path);
// }
let wls = [] as unknown as [str, str][] & {addwl: (word: str, lang: str) => void, toURLQuery: () => str, _wlstrcache: str};
wls._wlstrcache = '?';
wls.addwl = function(word: str, lang: str) {
    for(let wl of wls) {
        if(wl[0] === word && wl[1] === lang) {
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
}
wls.toURLQuery = function() {
    let ret = '?';
    for(let i=0;i<wls.length-1;i++) {
        let wl = wls[i];
        ret = ret + `${wl[0]}=${wl[1]}&`;
    }
    let wl = wls[wls.length-1];
    ret = ret + `${wl[0]}=${wl[1]}`;
    wls._wlstrcache = ret;
    return ret;
}