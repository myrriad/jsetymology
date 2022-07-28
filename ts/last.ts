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
function autoGraphTemplates() {
    let val = cognatus.autoGraphTemplates;
    cognatus.autoGraphTemplates = !val;
}
function toggleEdges(on?:bool) {
    // let edges = cy().edges();
    // if(on === undefined) on = (document.getElementById('edges-toggle') as HTMLInputElement).checked;
    let val = cognatus.showEdgeLabels;
    cognatus.showEdgeLabels = !val;
    cy().edges().toggleClass('showLabel');

    // @ts-ignore
    // for(let edge of edges) {
    //     if(on) {
    //         edge.data().displaylabel = true;
    //     } else {
    //         edge.data().displaylabel = false;
    //     }
    // }
}
function onLeftClick(event: cytoscape.EventObject) {
    // TODO: query
    let target = event.target;
    if (target.isEdge()) {

        target.style('line-color', 'green');
    } else {
        // is Node
        cy().$('node[lastClicked]').forEach(x => x.data().lastClicked = undefined);
        target.data().lastClicked = true;
        if (cognatus.toolbar.mode === 'explore') {

            if (target && target.length) target = target[0];
            let id = target.data().id;
            let as = id.split(", ");

            $('#qword').val(as[0]);
            $('#qlang').val(as[1]); // TODO this is the DUMBEST CODE OF ALL TIME. it sets the val of an element, because
            // it later reads this to deduce the origin. 
            // Cue dumb bugs from race conditions. 

            // TODO. There is a simple solution. just call cy().$('node[lastClicked])' and use that to retrieve word/lang. implement.
            // TODO shy away from using word/lang combos everywhere for id.
            // instead, store word and lang separately in cy().$('node').data()

            Graph.wlToTree(as[0], as[1], target); // target.data().langcode, target.data().isRecon);
        } else if (cognatus.toolbar.mode === 'edge') {
            
        }
    }
} 
/**
 * TODO:
 * I want to change Rclick behavior to rclick -> add nodes in the opposite direction as the toolbar mode indicates. 
 * (so kinda like subjunctive mood)
 * @param event 
 */
function onRightClick(event: cytoscape.EventObject) {
    if(cognatus.toolbar.mode === 'explore') {
        let target = event.target;
        cy().remove(target);
    }
}
function onKeyTapped(e: KeyboardEvent) {

    if(e.ctrlKey) {
        // console.log(e);

        if (e.key === 'z') {
            // console.log('undo!');

            Graph.History.undo();
        } else if (e.key === 'y') {
            Graph.History.redo();
        }
    }

}
function clickToQuery() {
    let c = cy();
    c.unbind('click');  // unbind before binding an event to prevent binding it twice/multiple times
    c.bind('tap', 'node, edge', onLeftClick); // tap is a combined click and touchstart that works with both mouse and touchscreen
    c.on('cxttap', "node, edge", onRightClick); // right click to remove nodes and edges

    // on keypress  
    document.addEventListener('keydown', onKeyTapped);
}
function pruneSinglets() {
    cy().filter(function (element, i) {return element.isNode() && element.degree(false) < 1}).remove();
}
const SAMPLE = function () {
    let ret = {} as any;
    ret.words = ["llegaron", "precio", "vaca", "tomar", "empezar", "ballena", 'cadeaux']; //, 'board'];
    ret.langs = ["", "", "Spanish", "Spanish", "Spanish", "Spanish", 'French']; // , 'English'];
    ret.random = function () {
        let r = Math.floor(Math.random() * ret.words.length);
        return [SAMPLE.words[r], SAMPLE.langs[r]];
    }
    return ret;
}() as {words: str[], langs: str[], random: () => str};
function loadRandom() {
    let [w, l] = SAMPLE.random(); // populate sample
    $("#qword").val(w);
    $("#qlang").val(l);
}
window.addEventListener("load", function () {
    // let field = window.getElementById("qword");
    // field.value = r;
    loadRandom();
    // let's look for url query params.

    let searchParams = new URLSearchParams(window.location.search);
    let i=0;

    let twhitelist = localStorage.getItem('twhitelist');
    if (twhitelist) $('#twhitelist').val(twhitelist);
    let tblacklist = localStorage.getItem('tblacklist');
    if (tblacklist) $('#tblacklist').val(tblacklist);
    Templates.updateCustomTemplateWhitelists();


    // let whitelist = ['?ballena=Spanish&phallus=English&%CF%86%CE%AC%CE%BB%CE%BB%CE%B1%CE%B9%CE%BD%CE%B1=Ancient+Greek'];
    //myrriad.github.io/jsetymology?ballena=Spanish&phallus=English&%CF%86%CE%AC%CE%BB%CE%BB%CE%B1%CE%B9%CE%BD%CE%B1=Ancient+Greek
    // if (!whitelist.includes(window.location.search)) return; // WARNING: OH MY GOD THIS IS TERRIBLE FOR XSS
    for(let wl of searchParams.entries()) { 
        Graph.wlToTree(wl[0], wl[1]);
        if(i>10) break;
        i++;
    }
    cy().fit();

    $('#lang-native').val(getNativeLanguage());


});

function shareResults() {
    $('#my-popup-modal')[0].style.display = 'block';
    $('#shareurl').text(`${window.location.href}${wls.toURLQuery()}`);
}
function saveNativeLanguage(e: HTMLInputElement) {
    // var id = e.id;  // get the sender's id to save it . 
    var val = e.value; // get the value. 
    localStorage.setItem('nativeLang', val);// Every time user writing something, the localStorage's value will override . 
}
function getNativeLanguage() {
    let stored = localStorage.getItem('nativeLang');
    if(stored === null) return 'English';
    return stored;
}
