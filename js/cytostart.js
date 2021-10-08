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
function testGraph(node_count) {
    var obj = {
        "elements": {
            "nodes": [
                {
                    "data": { "id": "a" },
                    "position": { "x": 64.833336, "y": 249 }
                },
                {
                    "data": { "id": "b" },
                    "position": { "x": 194.5, "y": 249 }
                }
            ],
            "edges": [
                {
                    "data": { "id": "ab", "source": "a", "target": "b" },
                    "position": { "x": 0, "y": 0 },
                }
            ]
        },
        "data": []
    };
    if (node_count >= 3) {
        obj['elements']['nodes'].push({
            "data": { "id": "c" }
        });
    }
    if (node_count >= 4) {
        obj['elements']['nodes'].push({
            "data": { "id": "d" },
            "position": { "x": 324.16666, "y": 260 }
        });
    }
    // cy.json(obj);
    return obj;
}
function initiable(obj, restyle = true) {
    if (!obj.hasOwnProperty("container")) {
        obj["container"] = document.getElementById('cy'); // container to render in
    } else if (!obj.hasOwnProperty("layout")) {
        obj["layout"] = { name: 'dagre' } // , rows: 1}; // dagre
    }
    if (restyle) {
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
                    'curve-style': 'bezier',
                    'font-size': '10px',
                    'color': '#FF0000'
                }
            },
            {
                selector: 'edge[label]',
                style: {
                    'label': 'data(label)' // maps to data.label
                }
            },
            {
                selector: 'edge[undirected]',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'curve-style': 'bezier'
                }
            }
        ];
    }
    obj.wheelSensitivity = 0.5;
    return obj;
}
function relayout(cy, fromScratch) {
    if (!cy) cy = window.cytograph;
    else window.cytograph = cy;
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
        position: function (node) { }, // returns { row, col } for element
        sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        animateFilter: function (node, i) { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: function (node, position) { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
    };
    let zoomTo = cy.zoom();// we need to make a shallow copy
    // the current pan location we know is the location of the mouse, which is where the 
    // searched node used to be
    let p1 = p();

    let r1 = r();
    let r2;
    // HOLY CRAP IMPORTANT! renderedPosition() instead of position()
    var layout = cy.layout(options);
    layout.run();
    cy.zoom(zoomTo); // VITAL!!!!!! put the zoom RIGHT AT THE BEGINNING or else ALL THE PANNING CALCS WILL MESS UP!!!

    // we want to keep the moused node under the mouse throughout the transition to make it smooth.
    // therefore, we want node.renderedPosition() to remain constant.
    // to do this, we calculate change in renderedPosition()
    // and pan the camera by an additional renderedPosition() to offset
    // mouseAtOld - nodeAtOld = mouseAtNew - nodeAtNew

        // assert(nodeOld.id() === nodeNew.id());
        // cy.pan({ x: viewPanOld.x - nodeOldAt.x + nodeNewAt.x, y: viewPanOld.y - nodeOldAt.y + nodeNewAt.y});

    if (fromScratch) { // they're all 0
        cy.fit(undefined, 50);
    } else {
        cy.pan(p1)
        r2 = r();
        console.log('GOAL: ' + a(r1));
        console.log('CURRENT: ' + a(r2));

        // let dr = r2 - r1
        // cy.pan(p1 - dr)
        // let dr = { x: (r2.x - r1.x), y: (r2.y - r1.y)};
        // panIncr(dr, cy);
        cy.pan({ x: p1.x - (r2.x - r1.x), y: p1.y - (r2.y - r1.y)})
        // cy.pan({ x: -P1.x + N1.x - N2.x, y: -P1.y + N1.y - N2.y  });
        // console.log(`P1: ${a(P1)} N2: ${a(N2)} N1: ${a(N1)} P2: ${a(cy.pan())}`)
    // it works if it's backwords. WWWWHYHWYHYHYHYHYYYYYYYYYY !?!?!?!?!?!??!?!?!?!?!?!?
        console.log('CURRENT: ' + a(r()));

    }
    // console.log(`Old difference: ${nodeOldAt.x - viewPanOld.x} ${nodeOldAt.y - viewPanOld.y}`);
    // console.log(`New difference: ${nodeNewAt.x - cy.pan().x} ${nodeNewAt.y - cy.pan().y}`);

    // cy.pan(viewPanOld);


    // get the location of the searched node. then pan over there
    // cy.viewport(viewportAt); // prevent the relayout from resetting viewport
}
function panIncr(plus, cy) {
    if (!cy) cy = window.cytograph;
    let now =  { ...cy.pan() }
    cy.pan({x: now.x + plus.x, y: now.y + plus.y});
}
function p(cy) {
    if (!cy) cy = window.cytograph;
    return { ...cy.pan() }
}
function r(cy) {
    if (!cy) cy = window.cytograph;
    let arr = cy.$('node[lastSearched]');
    if(!arr.length) return;
    assert(arr.length === 1, "More than one selected?", false);
    return {...arr[0].renderedPosition()} 
}
function s0() { cy().pan({ x: 0, y: 0 })}
let p1, p2, r1, r2;
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
function bindTooltips() {
    // https://stackoverflow.com/questions/54352041/how-can-i-change-the-color-an-individual-node-in-a-grid-of-cytoscape-js
    // https://stackoverflow.com/questions/54547927/show-and-hide-node-info-on-mouseover-in-cytoscape/54556015

    var cy = window.cy();
    // cy.ready(function() {
    cy.elements().forEach(function (ele) {
        makePopper(ele);
    });
    // });

    cy.elements().unbind('mouseover');
    cy.elements().bind('mouseover', (event) => event.target.tippy.show());

    cy.elements().unbind('mouseout');
    cy.elements().bind('mouseout', (event) => event.target.tippy.hide());
}

function createCyto(data, reLayout = false) {
    // alert("hi");
    /** @type {cytoscape.Core} */
    var cy = window.cytograph;
    if (!data) {
        data = defaultGraph();
    }
    var tograph = data;
    if (cy) { // merge graph with old graph
        var jsonify, elems;
        // print(jsonify = cy.json(), "prior:");// to json

        // cy.$('*[loadBatch=50]')

        // print(data, "data:");
        // print(elems = data["elements"], "elements:");// get elements of the new data

        for (let elem of elems.nodes) {
            elem.data.batchIndex = window.universe.batchIndex;
        }

        for (let elem of elems.edges) {
            elem.data.batchIndex = window.universe.batchIndex;
        }

        cy.add(elems); // add data
        // print(tograph = cy.json(), "posterior:");

        if (!reLayout) relayout(cy, true);
        window.cytograph = cy;
        bindTooltips();
        return cy;

    } else { // if it's the first time
        // formerly if relayout
        // print(tograph, "data:");
        tograph = initiable(tograph, true);
        // print(tograph, "graphing:");
        cy = cytoscape(tograph); // json back to cyobject, because I don't know how to make cytoscape automatically recalculate positions.
        relayout(cy, true);
    }

    // the following only gets executed on initialization.
    window.cytograph = cy; // endpoint for modules. TODO: explore alternatives to global state
    window.cy = function () {
        return window.cytograph;
    }
    clickToQuery();
    bindTooltips();
    let nav = cy.panzoom();
    return cy;
}
window.createCyto = createCyto;

function removeCyto() {
    cy().remove(cy().elements());
}
window.onload = () => {
    if (!window.cytograph) {
        createCyto(testGraph());
        removeCyto();
    }
};