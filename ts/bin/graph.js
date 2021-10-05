"use strict";
function _parse(...strs) {
    let ret = new Array(strs.length);
    for (let i = 0; i < strs.length; i++) {
        let str = strs[i];
        if (!str) {
            ret[i] = '';
            continue;
        }
        str = str.replace('"', 'quote');
        str = str.replace('\\', 'backslash');
        str = str.replace(',', 'comma');
        ret[i] = str;
    }
    if (ret.length === 1)
        return ret[0];
    return ret;
}
function wlToTree(word, lang, target, downward) {
    var _a;
    if (word === undefined)
        word = $('#qword').val();
    if (lang === undefined)
        lang = $('#qlang').val();
    if (downward === undefined)
        downward = false;
    let [oword, olang] = _parse(word, lang);
    // TODO search for existing node in graph, to extract additional info like langcode, isRecon
    if (!target) {
        let targetarr = cy().$(`node[id="${oword}, ${olang}"]`);
        if (targetarr && targetarr.length) {
            target = targetarr[0];
        }
    }
    let isRecon, langcode;
    if (target) {
        isRecon = target.data().isRecon;
        langcode = target.data().langcode;
    }
    else {
        isRecon = isReconstructed(word, lang, langcode);
        // this fails in case olang is inferred
    }
    fetchEtyEntry(word, lang, isRecon, function onEtyEntry(data2, doc) {
        // alert(data);
        let idx;
        if (data2.length > 1) {
            let str = prompt(`${data2.length} different etymologies found! Pick one: `, '1');
            str = str ? str : '1';
            idx = parseInt(str);
            idx = isNaN(idx) ? 1 : idx;
            idx = Math.max(1, Math.min(idx, data2.length));
        }
        else if (data2.length === 1) {
            idx = 1;
        }
        else
            throw "No entries found!";
        let etyentry = data2[idx - 1]; // idx start at 0 instead of 1.
        // $('#target').text(data2);
        // if (!plop(etyentry.ety, true)) {
        // $('#closeinspect')[0].innerHTML += 
        // }
        clearDiv();
        let etyresult = appendToDiv(etyentry.ety);
        friendlyBreak(true);
        if (etyresult) {
            friendlyInfo(`https://en.wiktionary.org/wiki/${etyentry.qy}`, false);
        }
        else {
            friendlyError(`https://en.wiktionary.org/wiki/${etyentry.qy}`, false);
        }
        for (let defn of etyentry.defns)
            appendToDiv(defn.defn);
        let orig = createTree(oword, olang); // this has createGraph() logic so we must create node in here too
        // success. save wikitext
        // the node better exist
        if (doc && doc.wikitext())
            orig.data().wikitext = doc.wikitext();
        onCheckbox();
    }, ((_a = target === null || target === void 0 ? void 0 : target.data()) === null || _a === void 0 ? void 0 : _a.wikitext) ? wtf(target.data().wikitext) : undefined);
    // alert($('#q1')[0]);
    // Temporarily disable URL request for debugging.
    // var graph = ondata();
    // clickToQuery();
}
function createTree(oword, olang) {
    // homebrew graph creation.
    // relies on second.ts
    // let origin = cy.$('node#origin');
    // target = 
    // assumes oword, olang are already parsed once.
    // returns the origin.
    var _a, _b;
    if (!oword)
        oword = _parse($('#qword').val());
    if (!olang)
        olang = _parse($('#qlang').val());
    let origarr = cy().$(`node[id="${oword}, ${olang}"]`);
    if (!(origarr && origarr.length)) {
        cy().add({
            group: 'nodes',
            data: {
                id: `${oword}, ${olang}`,
            }
        });
    }
    origarr = cy().$(`node[id="${oword}, ${olang}"]`);
    assert((_a = cy().$(`node[id="${oword}, ${olang}"]`)) === null || _a === void 0 ? void 0 : _a.length, "couldn't find node");
    if (origarr && origarr.length) {
        let orig = origarr[0];
        orig.data().searched = true;
        orig.style('background-color', 'green');
    }
    let i = 1;
    let lastConnector;
    for (let temptxt of $('span.template.t-active')) {
        // if(temp)
        let txt = temptxt.textContent;
        if (!txt)
            continue;
        let out = decodeTemplate(txt);
        if (!out)
            continue;
        let temps;
        if (out.length) { // quickie to check if it's a non-zero array
            temps = out;
        }
        else
            temps = [out];
        for (let temp of temps) {
            let word = _parse(temp.word);
            let langcode = _parse(temp.langcode);
            let lang = _parse(temp.lang);
            if (!lang)
                lang = langcode;
            if (!word)
                continue;
            // put the anti-macron on the querying side.
            let targetarr = cy().$(`node[id="${word}, ${lang}"]`);
            let target;
            if (targetarr && targetarr.length) {
                target = targetarr[0];
                target.data().langcode = langcode;
                target.data().isRecon = temp.isRecon;
            }
            else {
                target = cy().add({
                    group: 'nodes',
                    data: {
                        id: `${word}, ${lang}`,
                        langcode: langcode,
                        isRecon: temp.isRecon
                        // data: { weight: 75 },
                        // position: { x: 200, y: 200 }
                    },
                });
            }
            // we have the other word. Now we want to look for the node to conenct that word to
            // usually it's the origin, but for chains of inheritance we want to do inheritance.
            let prev = temptxt.previousSibling;
            let connector;
            if (lastConnector && prev && prev.textContent && !prev.textContent.includes('.')) {
                if (prev.textContent.toLowerCase().includes('from') // from
                    || prev.textContent === ', ') {
                    // || prev.textContent.length >= 2 && /^[^A-Za-z]*$/.test(prev.textContent)) {// is totally nonalphabetical, ie. if it's something like `, `
                    if (prev.previousSibling && ((_b = prev.previousSibling.textContent) === null || _b === void 0 ? void 0 : _b.startsWith('{{root'))) {
                        // make an exception for the first thing being a root or ine-root
                    }
                    else {
                        connector = lastConnector;
                    }
                }
            }
            if (!connector) {
                connector = `${oword}, ${olang}`;
            }
            try {
                let me = `${word}, ${lang}`;
                lastConnector = me;
                console.log(`edge ${me};  ${connector}`);
                cy().add({
                    group: 'edges',
                    data: {
                        id: `${_parse(temp.ttype)} || ${oword}, ${olang} || ${connector}; ${me} || ${i++}`,
                        label: `${_parse(temp.ttype)}`,
                        template: `${temp.orig_template}`,
                        source: me,
                        target: connector,
                    }
                });
                relayout();
            }
            catch (e) {
                // soft fails. Usually because there is a duplicate edge.
                console.log(e);
            }
        }
    }
    let ret = cy().$(`node[id="${oword}, ${olang}"]`);
    assert(ret === null || ret === void 0 ? void 0 : ret.length, "couldn't find node");
    return ret[0];
}
function onCollector() {
    let clang = $("#clang").val();
    let cword = $("#cword").val();
    if (clang) {
        let nodes = cy().nodes();
        nodes.style({ 'background-color': '' });
        let colorable = nodes.filter('[langname = "' + clang.toString() + '"]');
        console.log(colorable);
        colorable.style({
            'background-color': 'red'
        });
    }
}
function clickToQuery() {
    let c = cy();
    c.unbind('click'); // unbind before binding an event to prevent binding it twice/multiple times
    c.bind('click', 'node, edge', function (event) {
        // TODO: query
        let target = event.target;
        if (target.isEdge()) {
            target.style('line-color', 'green');
        }
        else {
            // target.style({
            //   'background-color': 'white',
            //   'border-color': 'blue'
            // });
            if (target && target.length)
                target = target[0];
            let id = target.data().id;
            let as = id.split(", ");
            $('#qword').val(as[0]);
            $('#qlang').val(as[1]); // TODO this is the DUMBEST CODE OF ALL TIME. it sets the val of an element, because
            // it later reads this to deduce the origin. 
            // Cue dumb bugs from race conditions. 
            wlToTree(as[0], as[1], target, undefined); // target.data().langcode, target.data().isRecon);
        }
    });
    c.on('cxttap', "node", function (event) {
        let target = event.target;
        c.remove(target);
    });
}
const SAMPLE = function () {
    let ret = {};
    ret.words = ["llegaron", "precio", "vaca", "tomar", "empezar", "ballena", 'cadeaux'];
    ret.langs = ["", "", "Spanish", "Spanish", "Spanish", "Spanish", 'French'];
    ret.random = function () {
        let r = Math.floor(Math.random() * ret.words.length);
        return [SAMPLE.words[r], SAMPLE.langs[r]];
    };
    return ret;
}();
$(document).ready(function () {
    // let field = window.getElementById("qword");
    // field.value = r;
    let [w, l] = SAMPLE.random();
    $("#qword").val(w);
    $("#qlang").val(l);
});
