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
                selector: 'edge[label].showLabel',
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

function makePopper(ele) {
    let ref = ele.popperRef(); // used only for positioning

    ele.tippy = tippy(ref, { // tippy options:
        content: () => {
            let content = document.createElement('div');

            content.textContent = ele.data("value"); // .id()

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