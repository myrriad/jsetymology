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
                    'curve-style': 'bezier'
                }
            },
            {
                selector: 'edge[undirected=true]',
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
function relayout(cy) {
    if (!cy) cy = window.cytograph;
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
    let viewportAt = cy.viewport();
    var layout = cy.layout(options);
    layout.run();
    cy.pan(viewportAt.pan());
    cy.zoom(viewportAt.zoom());
    // cy.viewport(viewportAt); // prevent the relayout from resetting viewport
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

        if (!reLayout) relayout(cy);
        window.cytograph = cy;
        bindTooltips();
        return cy;

    } else { // if it's the first time
        // formerly if relayout
        print(tograph, "data:");
        tograph = initiable(tograph, true);
        print(tograph, "graphing:");
        cy = cytoscape(tograph); // json back to cyobject, because I don't know how to make cytoscape automatically recalculate positions.
        relayout(cy);
    }

    // the following only gets executed on initialization.
    window.cytograph = cy; // endpoint for modules. TODO: explore alternatives to global state
    window.cy = function () {
        return window.cytograph;
    }
    clickToQuery();
    bindTooltips();
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