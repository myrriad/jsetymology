function relayout(cy?: cytoscape.Core, fromScratch=true) {
    if (!cy) cy = (window as any).cytograph as cytoscape.Core;
    else (window as any).cytograph = cy;
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
        position: function (node: cytoscape.NodeSingular) {if(node.neighborhood('node').length == 0) return {row:1, col:undefined}; }, // returns { row, col } for element
        sort: undefined, // a sorting function to order the nodes; e.g. function(a, b){ return a.data('weight') - b.data('weight') }
        animate: false, // whether to transition the node positions
        animationDuration: 500, // duration of animation in ms if enabled
        animationEasing: undefined, // easing of animation if enabled
        animateFilter: function (node: cytoscape.NodeSingular, i: any) { return true; }, // a function that determines whether the node should be animated.  All nodes animated by default on animate enabled.  Non-animated nodes are positioned immediately when the layout starts
        ready: undefined, // callback on layoutready
        stop: undefined, // callback on layoutstop
        transform: function (node: cytoscape.NodeSingular, position: any) { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
    };
    let zoomTo = cy.zoom();// we need to make a shallow copy
    // the current pan location we know is the location of the mouse, which is where the 
    // searched node used to be
    // let p1 = p();

    let r1 = r();
    let r2;
    // HOLY CRAP IMPORTANT! renderedPosition() instead of position()
    var layout = cy.layout(options);
    layout.promiseOn('layoutstop').then(function() {
        if (!cy) cy = (window as any).cytograph as cytoscape.Core;
        cy.zoom(zoomTo); // VITAL!!!!!! put the zoom RIGHT AT THE BEGINNING or else ALL THE PANNING CALCS WILL MESS UP!!!

        // we want to keep the moused node under the mouse throughout the transition to make it smooth.
        // therefore, we want node.renderedPosition() to remain constant.
        // to do this, we calculate change in renderedPosition()
        // and pan the camera by an additional renderedPosition() to offset
        // mouseAtOld - nodeAtOld = mouseAtNew - nodeAtNew

        // assert(nodeOld.id() === nodeNew.id());
        // cy.pan({ x: viewPanOld.x - nodeOldAt.x + nodeNewAt.x, y: viewPanOld.y - nodeOldAt.y + nodeNewAt.y});
        r2 = r();
        if (fromScratch || !r1 || !r2) { // they're all 0
            cy.fit(undefined, 50);
        } else {
            // cy.pan(p1);
            let r1a = a(r1);
            let r2a = a(r2);
            // let p2 = p();
            // console.log('GOAL: ' + r1a);
            // console.log('CURRENT: ' + r2a);
            let diff = r2a.map((x, i) => r1a[i] - x);
            // let dr = r2 - r1
            // console.log(`DIFF: ` + diff);
            // HOLY SH*T. THIS GETS F*CKED UP BECAUSE OF A RACE CONDITION
            cy.panBy({x: diff[0], y: diff[1]});
            // console.log('CURRENT: ' + a(r()));
        }
    });
    layout.run(); // this is ASYNCHRONOUS!!!! Tough bugs because of RACE CONDITIONS!!!

    
}
function pan(to: num[], cy?: cytoscape.Core) {
    if (!cy) cy = (window as any).cytograph as cytoscape.Core;
    cy.pan({ x: to[0] , y: to[1] });

}
function panIncr(plus: num[] | {x: num, y: num}, cy?: cytoscape.Core) { // use cy.panBy()
    if (!cy) cy = (window as any).cytograph as cytoscape.Core;
    let now = { ...cy.pan() }
    let plus2 = plus as any;
    if (plus2[0]) {
        
        cy.pan({ x: now.x + plus2[0], y: now.y + plus2[1] });
    } else {
        cy.pan({ x: now.x + plus2.x, y: now.y + plus2.y });
    }
}
function p(cy?: cytoscape.Core) {
    if (!cy) cy = (window as any).cytograph as cytoscape.Core;
    return { ...cy.pan() }
}
function r(cy?: cytoscape.Core) {
    if (!cy) cy = (window as any).cytograph as cytoscape.Core;
    let arr = cy.$('node[lastClicked]');
    if (!arr.length) return;
    assert(arr.length === 1, "More than one selected?", false);
    return { ...arr[0].renderedPosition() }
}
function s0() { cy().pan({ x: 0, y: 0 }) }
let p1, p2, r1, r2;