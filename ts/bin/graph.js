"use strict";
// const { data } = require("jquery");
// declare function relayout(cy?: cytoscape.Core, fromScratch?:bool): void;
var Graph;
(function (Graph) {
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
            position: function (node) { if (node.neighborhood('node').length == 0)
                return { row: 1, col: undefined }; },
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
                // console.log('GOAL: ' + r1a);
                // console.log('CURRENT: ' + r2a);
                let diff = r2a.map((x, i) => r1a[i] - x);
                // let dr = r2 - r1
                // console.log(`DIFF: ` + diff);
                // HOLY SH*T. THIS GETS F*CKED UP BECAUSE OF A RACE CONDITION
                cy.panBy({ x: diff[0], y: diff[1] });
                // console.log('CURRENT: ' + a(r()));
            }
        });
        layout.run(); // this is ASYNCHRONOUS!!!! Tough bugs because of RACE CONDITIONS!!!
    }
    Graph.relayout = relayout;
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
})(Graph || (Graph = {}));
(function (Graph) {
    function wlToTree(word, lang, target) {
        var _a;
        if (word === undefined)
            word = $('#qword').val();
        if (lang === undefined)
            lang = $('#qlang').val();
        let [oword, olang] = _parse(word, lang);
        if (window.jsetymologyDebug)
            console.log(`DEBUG ${oword}; ${olang}`);
        // TODO search for existing node in graph, to extract additional info like langcode, isRecon
        if (!target) {
            let targetarr = cy().$(`node[id="${oword}, ${olang}"]`);
            if (targetarr && targetarr.length) {
                target = targetarr[0];
            }
        }
        let isRecon, langcode;
        if (target) {
            isRecon = target.data().isRecon;
            langcode = target.data().langcode;
        }
        else {
            isRecon = Templates.isReconstructed(word, lang, langcode);
            // this fails in case olang is inferred
        }
        let isUp = cognatus.toolbar.updown === 'up' || cognatus.toolbar.updown === 'updown';
        let isDown = cognatus.toolbar.updown === 'down' || cognatus.toolbar.updown === 'updown';
        Wiktionary.fetchEtyEntry(word, lang, isRecon, ((_a = target === null || target === void 0 ? void 0 : target.data()) === null || _a === void 0 ? void 0 : _a.wikitext) ? wtf(target.data().wikitext) : undefined)
            .then(function onEtyEntry(result) {
            if (!result) {
                // there is no document
                // we still must mark the node
                target = target ? target : cy().$(`node[id="${_parse(word)}, ${_parse(lang ? lang : '')}"]`)[0];
                if (isUp)
                    target.data().searchedUp = true;
                if (isDown)
                    target.data().searchedDown = true;
                restyleNode(target);
                return;
            }
            let entries = result.entries;
            let doc = result.doc;
            if (!entries || entries.length === 0)
                throw "No entries found!";
            clearDiv();
            let orig;
            let behavior = cognatus.toolbar.updown;
            Sidebar.transferAllEntries(entries, behavior);
            if (cognatus.autoGraphTemplates)
                orig = Graph.createTreeFromSidebar(oword, olang, undefined); // this has createGraph() logic so we must create node in here too
            // success. save wikitext
            // the node better exist
            if (doc && doc.wikitext())
                orig.data().wikitext = doc.wikitext();
        });
        // Temporarily disable URL request for debugging.
    }
    Graph.wlToTree = wlToTree;
    function restyleNode(node) {
        // green = searched up
        // blue = searched down
        // green-blue = searched up and down
        if (node.data().searchedUp && node.data().searchedDown) {
            node.style('background-color', '#0d98ba');
            return;
        }
        if (node.data().searchedUp) {
            node.style('background-color', 'green');
        }
        if (node.data().searchedDown) {
            node.style('background-color', 'blue');
        }
    }
    Graph.restyleNode = restyleNode;
    /**
     * Homebrew graph creation.
     * Assumes oword, olang are already parsed once.
     * Returns the target node.
     * Uses critical global config variables: cognatus.toolbar.updown, cognatus.historyIndex
     * @param oword target word
     * @param olang target language
     * @param target target node
     * @returns
     */
    function createTreeFromSidebar(oword, olang, target) {
        // let origin = cy.$('node#origin');
        var _a, _b;
        if (!oword)
            oword = _parse($('#qword').val());
        if (!olang)
            olang = _parse($('#qlang').val());
        wls.addwl(oword, olang);
        // let isUp = updownBehavior === 'up';
        let fromScratch = cy().$('node').length === 0;
        if (!target)
            target = cy().$(`node[id="${oword}, ${olang}"]`); // if we didn't get the target as an argument, look for target in graph
        if (!(target && target.length)) { // if target doesn't exist in graph, create it
            cy().add({
                group: 'nodes',
                data: {
                    id: `${oword}, ${olang}`,
                }
            })[0];
            target = cy().$(`node[id="${oword}, ${olang}"]`);
        }
        assert((_a = cy().$(`node[id="${oword}, ${olang}"]`)) === null || _a === void 0 ? void 0 : _a.length, "couldn't find node");
        // !!! per-node config settings
        let isUp = cognatus.toolbar.updown === 'up' || cognatus.toolbar.updown === 'updown';
        let isDown = cognatus.toolbar.updown === 'down' || cognatus.toolbar.updown === 'updown';
        let historyIndex = cognatus.historyIndex++; // used for undo/redo
        Graph.redoCache = {}; // by incrementing historyIndex, we must override the redos
        // !!! end per-node config settings
        if (target && target.length) {
            let orig = target[0];
            if (isUp)
                target.data().searchedUp = true;
            if (isDown)
                target.data().searchedDown = true;
            restyleNode(orig);
        }
        // let headers = $('#sidebar h3');
        let divlets = $('#sidebar div');
        for (let div of divlets) { // code for multi etymologies
            let lastConnector;
            let $div = $(div);
            let isUp = true; // for definitions and etymoloy
            if (div.classList.contains('sidebar-desc')) {
                isUp = false; // only for descendants do we construct the nodes downwards
            }
            // for (let temptxt of etydiv.querySelectorAll('span.template.t-active')) {
            for (let anything of $div.children('span')) {
                let temptxt;
                if (anything.matches('.template.t-active')) {
                    temptxt = anything; // here is a template
                }
                else {
                    continue; // here is text
                }
                let txt = temptxt.textContent;
                if (!txt)
                    continue;
                let out = Templates.decodeTemplate(txt);
                if (!out)
                    continue;
                let temps;
                if (out.length) { // quickie to check if it's a non-zero array
                    temps = out;
                }
                else
                    temps = [out];
                for (let temp of temps) {
                    let word = _parse(temp.word); // we extract the word, lang etc. from the template
                    let langcode = _parse(temp.langcode);
                    let lang = _parse(temp.lang);
                    if (!lang)
                        lang = langcode;
                    if (!word)
                        continue;
                    // put the anti-macron on the querying side.
                    let targetarr = cy().$(`node[id="${word}, ${lang}"]`); // we look for an existing node that matches
                    let target;
                    if (targetarr && targetarr.length) {
                        target = targetarr[0];
                        target.data().langcode = langcode;
                        target.data().isRecon = temp.isRecon;
                    }
                    else {
                        target = cy().add({
                            group: 'nodes',
                            data: {
                                id: `${word}, ${lang}`,
                                langcode: langcode,
                                isRecon: temp.isRecon,
                                historyIndex: historyIndex
                                // data: { weight: 75 },
                                // position: { x: 200, y: 200 }
                            },
                        });
                    }
                    // Now that we have the other word, we need to worry about
                    // what edge to make in order to connect that word to the graph.
                    // This is MESSY - should we attach the edge to the origin, or chain inheritance, etc.?
                    let prev = temptxt.previousSibling;
                    let connector;
                    if (lastConnector && prev && prev.textContent && !prev.textContent.includes('.')) {
                        // if(prev.nodeName === 'H3') {
                        // connector = `${oword}, ${olang}`; // reset origin when crossing etymologies.
                        // Edit: TODO doesn't work
                        // }
                        if (prev.textContent.toLowerCase().includes('from') // from
                            || prev.textContent === ', ') {
                            // || prev.textContent.length >= 2 && /^[^A-Za-z]*$/.test(prev.textContent)) {// is totally nonalphabetical, ie. if it's something like `, `
                            if (prev.previousSibling && ((_b = prev.previousSibling.textContent) === null || _b === void 0 ? void 0 : _b.startsWith('{{root'))) {
                                // make an exception for the first thing being a root or ine-root
                            }
                            else if (temps.length >= 2) { // make an exception for if we're an affixal type. 
                            }
                            else {
                                connector = lastConnector;
                            }
                        }
                    }
                    if (!connector) {
                        connector = `${oword}, ${olang}`;
                    }
                    let me = `${word}, ${lang}`;
                    lastConnector = me;
                    // console.log(`edge ${me};  ${connector}`)
                    let id = `${_parse(temp.ttype)} || ${connector}; ${me}`; //  || ${oword}, ${olang}
                    if (cy().$(`edge[id="${id}"]`).length) {
                        // console.log(`Duplicate edge: ${id}`);
                    }
                    else if (temp.ttype == 'cog') {
                        // make an exception for cognates. Don't add edges
                    }
                    else {
                        try {
                            let classes = cognatus.showEdgeLabels ? 'showLabel' : '';
                            // TODO: we need to attach updown information to each edge
                            // we know whether we're searching up or down because they're 2 completely different
                            // searches in sidebar
                            // in that case, switch source
                            let sourceNode;
                            let targetNode;
                            if (isUp) {
                                sourceNode = me;
                                targetNode = connector;
                            }
                            else {
                                sourceNode = connector;
                                targetNode = me;
                            }
                            cy().add({
                                group: 'edges',
                                data: {
                                    id: id,
                                    // displaylabel: (document.getElementById('edges-toggle') as HTMLInputElement).checked,
                                    label: `${_parse(temp.ttype)}`,
                                    template: `${temp.orig_template}`,
                                    source: sourceNode,
                                    target: targetNode,
                                    historyIndex: historyIndex
                                },
                                classes: classes
                            });
                        }
                        catch (e) {
                            if (e.message.startsWith(`Can not create second element with ID \`${id}`)) {
                                // console.log(`Duplicate edge: ${id}`);
                            }
                            else {
                                // soft fails. Usually because there is a duplicate edge.
                                throw e;
                            }
                        }
                    }
                }
            }
        }
        Graph.relayout(undefined, fromScratch);
        let ret = cy().$(`node[id="${oword}, ${olang}"]`);
        assert(ret === null || ret === void 0 ? void 0 : ret.length, "couldn't find node");
        return ret[0];
    }
    Graph.createTreeFromSidebar = createTreeFromSidebar;
    Graph.redoCache = {};
    function undo(historyIndex) {
        if (historyIndex === undefined)
            historyIndex = cognatus.historyIndex - 1;
        // we undo all actions from [historyIndex, cognatus.historyIndex), moving backwards in time.
        if (historyIndex >= cognatus.historyIndex)
            throw "Cannot undo a future action";
        if (historyIndex < 0)
            return; // soft fail if we reach the undo limit
        let i = cognatus.historyIndex - 1; // we move backwards in time
        while (i >= historyIndex) {
            let thatAction = cy().elements(`[historyIndex=${i}]`); // get all cy nodes with that history index
            thatAction.remove(); // remove them from the graph
            Graph.redoCache[i] = thatAction;
            i--;
        }
        cognatus.historyIndex = i + 1; // undo that last decrement
        Graph.relayout();
    }
    Graph.undo = undo;
    function redo(futureIndex) {
        // we redo all actions from [cognatus.historyIndex, futureIndex]
        // if futureIndex is undefined, then redo only 1 action
        if (futureIndex === undefined)
            futureIndex = cognatus.historyIndex;
        if (futureIndex < cognatus.historyIndex)
            throw "Can't redo an action that occurs before current history index";
        let i = cognatus.historyIndex;
        while (i <= futureIndex) { // (all of the actions from [cognatus.historyIndex, futureIndex])
            let thatAction = Graph.redoCache[futureIndex];
            if (thatAction === undefined) {
                // there's nothing to be redone.
                break;
            }
            thatAction.restore();
            Graph.redoCache[futureIndex] === undefined; // wipe from cache to indicacte it's been dealt with
            i++;
        }
        cognatus.historyIndex = i; // we increment. if cognatus.historyIndex === futureIndex, this is the same as cognatus.historyIndex++;
        Graph.relayout();
    }
    Graph.redo = redo;
})(Graph || (Graph = {}));
