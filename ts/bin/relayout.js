"use strict";
function relayout(cy, fromScratch = true) {
    if (!cy)
        cy = window.cytograph;
    else
        window.cytograph = cy;
    let options = {
        name: 'dagre',
        fit: true,
        padding: 30,
        boundingBox: undefined,
        avoidOverlap: true,
        avoidOverlapPadding: 10,
        nodeDimensionsIncludeLabels: false,
        spacingFactor: undefined,
        condense: false,
        rows: undefined,
        cols: undefined,
        position: function (node) { },
        sort: undefined,
        animate: false,
        animationDuration: 500,
        animationEasing: undefined,
        animateFilter: function (node, i) { return true; },
        ready: undefined,
        stop: undefined,
        transform: function (node, position) { return position; } // transform a given node position. Useful for changing flow direction in discrete layouts
    };
    let zoomTo = cy.zoom(); // we need to make a shallow copy
    // the current pan location we know is the location of the mouse, which is where the 
    // searched node used to be
    // let p1 = p();
    let r1 = r();
    let r2;
    // HOLY CRAP IMPORTANT! renderedPosition() instead of position()
    var layout = cy.layout(options);
    layout.promiseOn('layoutstop').then(function () {
        if (!cy)
            cy = window.cytograph;
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
        }
        else {
            // cy.pan(p1);
            let r1a = a(r1);
            let r2a = a(r2);
            // let p2 = p();
            console.log('GOAL: ' + r1a);
            console.log('CURRENT: ' + r2a);
            let diff = r2a.map((x, i) => r1a[i] - x);
            // let dr = r2 - r1
            console.log(`DIFF: ` + diff);
            // HOLY SH*T. THIS GETS F*CKED UP BECAUSE OF A RACE CONDITION
            cy.panBy({ x: diff[0], y: diff[1] });
            console.log('CURRENT: ' + a(r()));
        }
    });
    layout.run(); // this is ASYNCHRONOUS!!!! Tough bugs because of RACE CONDITIONS!!!
}
function pan(to, cy) {
    if (!cy)
        cy = window.cytograph;
    cy.pan({ x: to[0], y: to[1] });
}
function panIncr(plus, cy) {
    if (!cy)
        cy = window.cytograph;
    let now = Object.assign({}, cy.pan());
    let plus2 = plus;
    if (plus2[0]) {
        cy.pan({ x: now.x + plus2[0], y: now.y + plus2[1] });
    }
    else {
        cy.pan({ x: now.x + plus2.x, y: now.y + plus2.y });
    }
}
function p(cy) {
    if (!cy)
        cy = window.cytograph;
    return Object.assign({}, cy.pan());
}
function r(cy) {
    if (!cy)
        cy = window.cytograph;
    let arr = cy.$('node[lastClicked]');
    if (!arr.length)
        return;
    assert(arr.length === 1, "More than one selected?", false);
    return Object.assign({}, arr[0].renderedPosition());
}
function s0() { cy().pan({ x: 0, y: 0 }); }
let p1, p2, r1, r2;
