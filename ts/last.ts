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
            // is Node
            cy().$('node[lastClicked]').forEach(x => x.data().lastClicked = undefined);
            target.data().lastClicked = true;

            if (target && target.length) target = target[0];
            let id = target.data().id;
            let as = id.split(", ");



            $('#qword').val(as[0]);
            $('#qlang').val(as[1]); // TODO this is the DUMBEST CODE OF ALL TIME. it sets the val of an element, because
            // it later reads this to deduce the origin. 
            // Cue dumb bugs from race conditions. 

            // TODO. There is a simple solution. just call cy().$('node[lastClicked])' and use that to retrieve word/lang
            // TODO implement.
            // TODO shy away from using word/lang combos everywhere for id.
            // instead, store word and lang separately in cy().$('node').data()

            wlToTree(as[0], as[1], target); // target.data().langcode, target.data().isRecon);
        }
    });
    c.on('cxttap', "node, edge", function (event) { // right click to remove nodes and edges
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
window.addEventListener("load", function () {
    // let field = window.getElementById("qword");
    // field.value = r;
    let [w, l] = SAMPLE.random(); // populate sample
    $("#qword").val(w);
    $("#qlang").val(l);
    // let's look for url query params.

    let searchParams = new URLSearchParams(window.location.search);
    let i=0;

    let whitelist = ['?ballena=Spanish&phallus=English&%CF%86%CE%AC%CE%BB%CE%BB%CE%B1%CE%B9%CE%BD%CE%B1=Ancient%20Greek'];
    //myrriad.github.io/jsetymology?ballena=Spanish&phallus=English&%CF%86%CE%AC%CE%BB%CE%BB%CE%B1%CE%B9%CE%BD%CE%B1=Ancient%20Greek
    if (!whitelist.includes(window.location.search)) return; // WARNING: OH MY GOD THIS IS TERRIBLE FOR XSS
    for(let wl of searchParams.entries()) { 
        wlToTree(wl[0], wl[1]);
        if(i>10) break;
        i++;
    }
    cy().fit();
    

});