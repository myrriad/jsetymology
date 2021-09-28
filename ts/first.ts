(window as any).universe = { batchIndex: 0 };

(window as any).doc = undefined;

declare function cy(): cytoscape.Core;


type num = number;
type str = string;
type bool = boolean;

type Section = wtf.default.Section;

function print(obj: any, str = '') {
    if (str) console.log(str);
    if (obj) console.log(obj);
}
function assert(x: any, message = '', hard = true) {
    if (!x) if (hard) throw TypeError(message); else console.warn(message);
}

function friendlyError(str: string, override = true) {
    if (override) $('#closeinspect')[0].innerHTML = '';

    let txt = document.createTextNode(str);
    let span = document.createElement('span');
    span.setAttribute('style', 'color: red;'); // font-style: italic; 
    span.appendChild(txt);
    $('#closeinspect')[0].appendChild(span);

}
// let mw = wtf.default;