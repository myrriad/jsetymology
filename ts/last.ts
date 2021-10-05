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
            wlToTree(as[0], as[1], target, undefined); // target.data().langcode, target.data().isRecon);
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