// const { data } = require("jquery");

function URL(str, controller="default", domain="welcome") {
    return domain + "/" + controller + "/" + str;
}

function reLayout(cy) {
    if(!cy) cy = window.cytograph;
    let options = {
        name: 'dagre',

        fit: true, // whether to fit the viewport to the graph
        padding: 30, // padding used on fit
        boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
        avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
        avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
        nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
        spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
        condense: false, // uses all available space on false, uses minimal space on true
        rows: undefined, // force num of rows in the grid
        cols: undefined, // force num of columns in the grid
        position: function( node ){}, // returns { row, col } for element
        sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        animateFilter: function ( node, i ){ return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: function (node, position ){ return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
    };

    var layout = cy.layout( options );
    layout.run();
}

function print(obj, str='', sep='<br>') {
    if(str) {
        console.log(str);
    }
    if(obj) {
        console.log(obj);
    }
    return;
}
function formatQuery(q1, qlang) {
    if(!q1 instanceof String) {
        throw "q1 isn't a string !?";
    }
    var qypts = q1.split('#');
    if(qypts.length === 1) {
        var word = qypts[0];
        if(!word) throw "Query cannot be empty?";
        // if(!qlang) throw "Language cannot be empty?" // Language CAN be empty if we want the program to do the infer
        if(!qlang) {
            return word.toString(); // in the event that language is empty, only return word
        } else {
            return word.toString() + "#" + qlang.toString();
        }
    } else if (qypts.length === 2) {

        return q1;
    } else {
        throw "Unexpected character '#'";
        return false;
    }
}

function onSubmit(qy, qlang, downward) {
    if (qy === undefined) qy = $('#q1').val();
    if (qlang === undefined) qlang = $('#qlang').val();
    if (downward === undefined) downward = false;


    // alert($('#q1')[0]);
    // Temporarily disable URL request for debugging.
    
    gofetch(qy, qlang, function ondata(data2) {
        // alert(data);
        let idx;
        if(data2.length > 1) {
            let str = prompt(`${data2.length} different etymologies found! Pick one: `, '1');
            idx = parseInt(str);
            idx = isNaN(idx) ? 1 : idx;
            idx = Math.max(1, Math.min(idx, data2.length));
        } else if (data2.length === 1) {
            idx = 1;
        } else throw "No entries found!";
        let etyentry = data2[idx - 1]; // idx start at 0 instead of 1.
        // $('#target').text(data2);
        plop(etyentry.ety, true);
        for (let defn of etyentry.defns) plop(defn.defn, false);
        onCheckbox();
    });
    
        // var graph = ondata();
    // clickToQuery();

}
function submitGraph() {
    // homebrew graph creation.
    // relies on second.ts
    for(let temp of $('span.template.t-active')) {
        // if(temp)
    }
}
function testGraph(node_count) {
    var cy = window.cytograph;
    var obj = {
       "elements": {
          "nodes": [
             {
                "data": {"id": "a"},
                "position": {"x": 64.833336,"y": 249}
             },
             {
                "data": {"id": "b"},
                "position": {"x": 194.5,"y": 249}
             }
          ],
          "edges": [
             {
                "data": {"id": "ab", "source": "a", "target": "b"},
                "position": {"x": 0,"y": 0},
             }
          ]
       },
       "data": []
    };
    if(node_count >= 3) {
        obj['elements']['nodes'].push({
                "data": {"id": "c"}
             });
    }
    if(node_count >= 4) {
        obj['elements']['nodes'].push({
                "data": {"id": "d"},
                "position": {"x": 324.16666,"y": 260}
            });
    }
    // cy.json(obj);
    return obj;
}
function defaultGraph() {
    return {
                elements: [ // list of graph elements to start with
                { // node a
                  data: { id: 'a' }
                },
                { // node b
                  data: { id: 'b' }
                },
                { // node c
                   data: { id: 'c' }
                },
                { // edge ab
                  data: { id: 'ab', source: 'a', target: 'b' }
                }
                ]
            };
}
function initiable(obj, restyle=true) {
    if(!obj.hasOwnProperty("container")) {
        obj["container"] = document.getElementById('cy'); // container to render in
    } else if(!obj.hasOwnProperty("layout")) {
        obj["layout"] = {name: 'dagre'} // , rows: 1}; // dagre
    }
    if(restyle) {
        obj.style = [ // the stylesheet for the graph
                    {
                      selector: 'node',
                      style: {
                        // 'background-color': '#666',
                        'label': 'data(id)'
                      }
                    },
                    {
                      selector: 'edge',
                      style: {
                        'width': 3,
                        'line-color': '#ccc',
                        'target-arrow-color': '#ccc',
                        'target-arrow-shape': 'triangle',
                        'curve-style': 'bezier'
                      }
                    }
                ];
    }
    obj.wheelSensitivity = 0.5;
    return obj;
}
// require("/welcome/static/js/node_modules/cytoscape/dist/cytoscape.esm.min.js");
// import cytoscape from "/welcome/static/js/node_modules/cytoscape/dist/cytoscape.esm.min.js";
// import dagre from "/welcome/static/js/node_modules/cytoscape-dagre/cytoscape-dagre.js";
// cytoscape.use(dagre);
function extendG(data, newdata) {

    for (var attrname in newdata) {
        if(attrname == "elements") {
            data["elements"].push(...newdata[attrname]);
        } else {
            data[attrname] = newdata[attrname];
        }

    }
    return data

}

function removeCyto() {
    cy().remove(cy().elements());
    
}

function createCyto(data, merge=true, relayout=false) {
    // alert("hi");
    /** @type {cytoscape.Core} */
    var cy = window.cytograph;
    if(!data) {
        data = defaultGraph();
    }
    if(merge) { // "new" behavior
        var tograph = data;
        if(cy) { // merge graph with old graph
            var jsonify, elems;
            print(jsonify = cy.json(), "prior:");// to json
            
            // cy.$('*[loadBatch=50]')

            print(data, "data:");
            print(elems = data["elements"], "elements:");// get elements of the new data

            for (let elem of elems.nodes) {
                elem.data.batchIndex = window.universe.batchIndex;
            }

            for (let elem of elems.edges) {
                elem.data.batchIndex = window.universe.batchIndex;
            }

            cy.add(elems); // add data
            print(tograph = cy.json(), "posterior:");

            // formerly if !relayout
            reLayout(cy);
            window.cytograph = cy;
            bindTooltips();
            return cy;


        } else { // if it's the first time
            // formerly if relayout
            print(tograph, "data:");
            tograph = initiable(tograph, true);
            print(tograph, "graphing:");
            cy = cytoscape(tograph); // json back to cyobject, because I don't know how to make cytoscape automatically recalculate positions.
            reLayout(cy);
        }
    } else { // "old" behavior warning: crappy
        // var merged = $.extend(predata, data);
        // var merged = extendG(predata, data);
        // var tograph = initiable(data, true);
        // cy = cytoscape(tograph);
    }
    // the following only gets executed on initialization.
    window.cytograph = cy; // endpoint for modules. TODO: explore alternatives to global state
    window.cy = function() {
        return window.cytograph;
    }
    clickToQuery();
    bindTooltips();
    return cy;
}
window.createCyto = createCyto;




function bindTooltips() {
    // https://stackoverflow.com/questions/54352041/how-can-i-change-the-color-an-individual-node-in-a-grid-of-cytoscape-js
    // https://stackoverflow.com/questions/54547927/show-and-hide-node-info-on-mouseover-in-cytoscape/54556015
    
    // popper doesn't seem to be working so let's exit. TODO fix this.
    var cy = window.cy();
    // cy.ready(function() {
    cy.elements().forEach(function(ele) {
        makePopper(ele);
    });
    // });

    cy.elements().unbind('mouseover');
    cy.elements().bind('mouseover', (event) => event.target.tippy.show());

    cy.elements().unbind('mouseout');
    cy.elements().bind('mouseout', (event) => event.target.tippy.hide());
}

function makePopper(ele) {
    
    let ref = ele.popperRef(); // used only for positioning

    ele.tippy = tippy(ref, { // tippy options:
        content: () => {
            let content = document.createElement('div');

            content.innerHTML = ele.data("value"); // .id()

            return content;
            },
            trigger: 'manual' // probably want manual mode
        });
}

function onCollector() {
    let cy = window.cytograph;
    let clang = $("#clang").val();
    let cword = $("#cquery").val();
    if(clang) {
        let nodes = cy.nodes();
        nodes.style({'background-color': ''});
        let colorable = nodes.filter('[langname = "' + clang.toString() + '"]');
        console.log(colorable);
        colorable.style({
          'background-color': 'red'
        });
    }

}
function clickToQuery() {
    let cy = window.cytograph;
    cy.unbind('click');  // unbind before binding an event to prevent binding it twice/multiple times
    cy.bind('click', 'node, edge', function(event) {
        // console.log("hi");
        // TODO: query
        let target = event.target;
      if (target.isEdge()) {
        target.style('line-color', 'green');
      } else {
        // target.style({
        //   'background-color': 'white',
        //   'border-color': 'blue'
        // });
        console.log(target);
        let id = target[0]._private.data.id;
        console.log(id);
        let as = id.split(", ");
        onSubmit(as[0], as[1]);
      }
    });
    cy.on('cxttap', "node", function (event) {

    });

}
$(document).ready(function(){
    // let field = window.getElementById("q1");
    let values =["llegaron", "precio", "vaca", "tomar", "empezar", "ballena", 'cadeaux'];
    let langs = ["", "", "Spanish", "Spanish", "Spanish", "Spanish", 'French']
    let r = Math.floor(Math.random() * values.length);
    // field.value = r;
    $("#q1").val(values[r]);
    $("#qlang").val(langs[r]);
});
