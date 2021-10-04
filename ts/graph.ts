// const { data } = require("jquery");
declare function relayout(cy?: cytoscape.Core): void;
function _parse(...strs: str[]) {

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
    if (ret.length === 1) return ret[0];
    return ret;
}
function query(word: str, lang: str, target?: any, downward?: boolean) {
    if (word === undefined) word = $('#qword').val() as string;
    if (lang === undefined) lang = $('#qlang').val() as string;
    if (downward === undefined) downward = false;
    let [oword, olang] = _parse(word, lang);

    // TODO search for existing node in graph, to extract additional info like langcode, isRecon
    
    if (!target) {
        target = cy().$(`node[id="${oword}, ${olang}"]`);
    }
    let isRecon, langcode;
    if (target && target.length) {
        isRecon = target[0].data().isRecon;
        langcode = target[0].data().langcode;
    } else {
        isRecon = isReconstructed(word, lang, langcode);
        cy().add({
            group: 'nodes',
            data: {
                id: `${oword}, ${olang}`,
            }
        });
    }
    assert(cy().$(`node[id="${oword}, ${olang}"]`)?.length);

    gofetch(word, lang, isRecon, function ondata(data2: EtyEntry[], doc: wtf.Document) {
        // alert(data);
        let idx;
        if (data2.length > 1) {
            let str = prompt(`${data2.length} different etymologies found! Pick one: `, '1');
            str = str ? str : '1';
            idx = parseInt(str);
            idx = isNaN(idx) ? 1 : idx;
            idx = Math.max(1, Math.min(idx, data2.length));
        } else if (data2.length === 1) {
            idx = 1;
        } else throw "No entries found!";
        let etyentry = data2[idx - 1]; // idx start at 0 instead of 1.
        // $('#target').text(data2);
        if (!plop(etyentry.ety, true)) {
            $('#closeinspect')[0].innerHTML += ` https://en.wiktionary.org/wiki/${etyentry.qy}`;
        }
        for (let defn of etyentry.defns) plop(defn.defn, false);
        createTree(oword, olang); // this has createGraph() logic so we must create node in here too
        onCheckbox();
    }, target?.data?.wikitext ? wtf(target.data.wikitext) : undefined);
    // alert($('#q1')[0]);
    // Temporarily disable URL request for debugging.
    

    // var graph = ondata();
    // clickToQuery();

}


function createTree(oword: str, olang: str, doc?: wtf.Document) {
    // homebrew graph creation.
    // relies on second.ts
    // let origin = cy.$('node#origin');
    // target = 
    // assumes oword, olang are already parsed once.
    if (!doc) doc = wtf($('#closeinspect').text()); // TODO FIXME XSS

    if (!oword) oword = _parse($('#qword').val() as str);
    if (!olang) olang = _parse($('#qlang').val() as str);
    let origarr = cy().$(`node[id="${oword}, ${olang}"]`);
    if (!(origarr && origarr.length)) {
        cy().add({
            group: 'nodes',
            data: {
                id: `${oword}, ${olang}`,
                // searched: true
                // data: { weight: 75 },
                // position: { x: 200, y: 200 }
            }
        });
    }
    origarr = cy().$(`node[id="${oword}, ${olang}"]`);
    assert(cy().$(`node[id="${oword}, ${olang}"]`)?.length, "couldn't find node");
    if (origarr && origarr.length) {
        let orig = origarr[0];
        orig.data().wikitext = doc.wikitext();
        orig.data().searched = true;
        orig.style('background-color', 'green');
    }

    let i = 1;
    let lastConnector;

    for (let temptxt of $('span.template.t-active')) {
        // if(temp)
        
        let txt = temptxt.textContent;
        if(!txt) continue;
        let out = decodeTemplate(txt);
        if (!out) continue;
        let temps: Templated[];
        if ((out as any).length) { // quickie to check if it's a non-zero array
            temps = out as Templated[];
        } else temps = [out as Templated];
        for (let temp of temps) {
            let word = _parse(temp.word);
            let langcode = _parse(temp.langcode);
            let lang = _parse(temp.lang);
            if (!lang) lang = langcode;
            if (!word) continue;

            // put the anti-macron on the querying side.
            let targetarr = cy().$(`node[id="${word}, ${lang}"]`);
            let target;
            if (targetarr && targetarr.length) {
                target = targetarr[0];
                target.data().langcode = langcode;
                target.data().isRecon = temp.isRecon;
            } else {
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
                if(prev.textContent.toLowerCase().includes('from') // from
                || prev.textContent === ', ') {
                // || prev.textContent.length >= 2 && /^[^A-Za-z]*$/.test(prev.textContent)) {// is totally nonalphabetical, ie. if it's something like `, `
                    if(prev.previousSibling && prev.previousSibling.textContent?.startsWith('{{root')) {
                        // make an exception for the first thing being a root or ine-root
                    } else {
                        connector = lastConnector;
                    }
                }
            } 
            if (!connector) {
                connector = `${oword}, ${olang}`
            }
            try {
                let me = `${word}, ${lang}`;
                lastConnector = me;
                console.log(`edge ${me};  ${connector}`)
                cy().add({
                    group: 'edges',
                    data: {
                        id: `${_parse(temp.ttype)} || ${oword}, ${olang} || ${connector}; ${me} || ${i++}`,
                        label: `${_parse(temp.ttype)}`,
                        template: `${temp.orig_template}`, // FIXME unparsed. But afaik this is ok???
                        source: me,
                        target: connector,
                    }
                });
                relayout();
            } catch (e) {
                // soft fails. Usually because there is a duplicate edge.
                console.log(e);
            }
        }
    }


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
    c.unbind('click');  // unbind before binding an event to prevent binding it twice/multiple times
    c.bind('click', 'node, edge', function (event) {
        // TODO: query
        let target = event.target;
        if (target.isEdge()) {
            target.style('line-color', 'green');
        } else {
            // target.style({
            //   'background-color': 'white',
            //   'border-color': 'blue'
            // });
            if (target && target.length) target = target[0];
            let id = target.data().id;
            let as = id.split(", ");



            $('#qword').val(as[0]);
            $('#qlang').val(as[1]); // TODO this is the DUMBEST CODE OF ALL TIME. it sets the val of an element, because
            // it later reads this to deduce the origin. 
            // Cue dumb bugs from race conditions. 
            query(as[0], as[1], target, undefined); // target.data().langcode, target.data().isRecon);
        }
    });
    c.on('cxttap', "node", function (event) { // right click to remove
        let target = event.target;
        c.remove(target);

    });

}

const SAMPLE = function () {
    let ret = {} as any;
    ret.words = ["llegaron", "precio", "vaca", "tomar", "empezar", "ballena", 'cadeaux'];
    ret.langs = ["", "", "Spanish", "Spanish", "Spanish", "Spanish", 'French'];
    ret.random = function () {
        let r = Math.floor(Math.random() * ret.words.length);
        return [SAMPLE.words[r], SAMPLE.langs[r]];
    }
    return ret;
}();
$(document).ready(function () {
    // let field = window.getElementById("qword");
    // field.value = r;
    let [w, l] = SAMPLE.random();
    $("#qword").val(w);
    $("#qlang").val(l);
});
