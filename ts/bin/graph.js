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
        Wiktionary.fetchEtyEntry(word, lang, isRecon, ((_a = target === null || target === void 0 ? void 0 : target.data()) === null || _a === void 0 ? void 0 : _a.wikitext) ? wtf(target.data().wikitext) : undefined)
            .then(function onEtyEntry(out) {
            if (!out) {
                // there is no document
                // we still must mark the node
                target = target ? target : cy().$(`node[id="${_parse(word)}, ${_parse(lang ? lang : '')}"]`)[0];
                target.data().searched = true;
                target.style('background-color', 'green');
                return;
            }
            let [entries, doc] = out;
            if (!entries || entries.length === 0)
                throw "No entries found!";
            clearDiv();
            let orig;
            Sidebar.transferAllEntries(entries);
            orig = Graph.createTree(oword, olang); // this has createGraph() logic so we must create node in here too
            // success. save wikitext
            // the node better exist
            if (doc && doc.wikitext())
                orig.data().wikitext = doc.wikitext();
        });
        // Temporarily disable URL request for debugging.
    }
    Graph.wlToTree = wlToTree;
    function createTree(oword, olang, target) {
        // homebrew graph creation.
        // relies on second.ts
        // let origin = cy.$('node#origin');
        // target = 
        // assumes oword, olang are already parsed once.
        // returns the origin.
        var _a, _b;
        if (!oword)
            oword = _parse($('#qword').val());
        if (!olang)
            olang = _parse($('#qlang').val());
        wls.addwl(oword, olang);
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
        if (target && target.length) {
            let orig = target[0];
            orig.data().searched = true;
            orig.style('background-color', 'green');
        }
        // let headers = $('#sidebar h3');
        let divlets = $('#sidebar div.ety');
        for (let etydiv of divlets) { // code for multi etymologies
            let lastConnector;
            let $etydiv = $(etydiv);
            // for (let temptxt of etydiv.querySelectorAll('span.template.t-active')) {
            // if(temp)
            for (let anything of $etydiv.children('span')) {
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
                    let word = _parse(temp.word);
                    let langcode = _parse(temp.langcode);
                    let lang = _parse(temp.lang);
                    if (!lang)
                        lang = langcode;
                    if (!word)
                        continue;
                    // put the anti-macron on the querying side.
                    let targetarr = cy().$(`node[id="${word}, ${lang}"]`);
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
                                isRecon: temp.isRecon
                                // data: { weight: 75 },
                                // position: { x: 200, y: 200 }
                            },
                        });
                    }
                    // we have the other word. Now we want to look for the node to conenct that word to
                    // usually it's the origin, but for chains of inheritance we want to do inheritance.
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
                    let id = `${_parse(temp.ttype)} || ${connector}; ${me}`;
                    //  || ${oword}, ${olang}
                    if (cy().$(`edge[id="${id}"]`).length) {
                        // console.log(`Duplicate edge: ${id}`);
                    }
                    else if (temp.ttype == 'cog') {
                        // make an exception for cognates. dont' add edges
                    }
                    else {
                        try {
                            let classes = cognatus.showEdgeLabels ? 'showLabel' : '';
                            cy().add({
                                group: 'edges',
                                data: {
                                    id: id,
                                    // displaylabel: (document.getElementById('edges-toggle') as HTMLInputElement).checked,
                                    label: `${_parse(temp.ttype)}`,
                                    template: `${temp.orig_template}`,
                                    source: me,
                                    target: connector,
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
    Graph.createTree = createTree;
})(Graph || (Graph = {}));
