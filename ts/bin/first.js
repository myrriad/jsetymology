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
function friendlyError(str, override = true) {
    if (override)
        $('#closeinspect')[0].innerHTML = '';
    let txt = document.createTextNode(str);
    let span = document.createElement('span');
    span.setAttribute('style', 'color: red;'); // font-style: italic; 
    span.appendChild(txt);
    $('#closeinspect')[0].appendChild(span);
}
// let mw = wtf.default;
