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
function assert(x: any, message = '', hard = true) {
    if (!x) if (hard) throw TypeError(message); else console.warn(message);
}

function clearDiv() {
    $('#closeinspect')[0].innerHTML = '';
}
function friendlyElement(htmltype: str, str?: string, top = false, color?: str): void {

    let span = document.createElement(htmltype);

    if(str) {
        let txt = document.createTextNode(str);
        span.appendChild(txt);
    }
    if(color) span.setAttribute(`style`, `color: ${color}`); // font-style: italic; 
    if (top) {
        $('#closeinspect')[0].prepend(span); // put as first child
    } else {
        $('#closeinspect')[0].appendChild(span);
    }

}
function friendlyBreak(top = false) {
    friendlyElement('br', undefined, top);
}
function friendlyInfo(str: string, override = false, top = false, color = 'black;'): void {
    if (override) clearDiv();
    friendlyElement('span', str, top, color);

}

function friendlyError(str: string, override = true, top=true, ital=false, newline=false) {
    friendlyInfo(str, override, top, `red;${ital ? ' font-style=italic;' : ''}`);

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