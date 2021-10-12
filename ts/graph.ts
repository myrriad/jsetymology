// const { data } = require("jquery");
// declare function relayout(cy?: cytoscape.Core, fromScratch?:bool): void;

function wlToTree(word?: str, lang?: str, target?: cytoscape.NodeSingular, reLayout=true, downward?: boolean) {
    if (word === undefined) word = $('#qword').val() as string;
    if (lang === undefined) lang = $('#qlang').val() as string;
    if (downward === undefined) downward = false;
    let [oword, olang] = _parse(word, lang);
    if ((window as any).jsetymologyDebug) console.log(`DEBUG ${oword}; ${olang}`);
    // TODO search for existing node in graph, to extract additional info like langcode, isRecon


    if (!target) {
        let targetarr = cy().$(`node[id="${oword}, ${olang}"]`);
        if (targetarr && targetarr.length) {
            target = targetarr[0];
        }
    }

    let isRecon, langcode;
    if(target) {
        isRecon = target.data().isRecon;
        langcode = target.data().langcode;
    } else {
        isRecon = isReconstructed(word, lang, langcode);
        // this fails in case olang is inferred

    }

    fetchEtyEntry(word, lang, isRecon, 
        target?.data()?.wikitext ? wtf(target.data().wikitext) : undefined)
    .then(function onEtyEntry(out) {
        if(!out) return;
        let [data2, doc] = out!;
        (window as any).etyentries = data2;
        if(!data2 || data2.length === 0) throw "No entries found!";
        clearDiv();
        let orig: cytoscape.NodeSingular;

        for(let i=0;i<data2.length;i++) {
            let etyentry = data2[i];
            let newdiv = document.createElement('div');
            newdiv.classList.add('ety'); 
            if(data2.length > 1) {
                friendlyElement(newdiv, 'h3', `Etymology ${i + 1}:`); // 1-index
            }
            friendlyInfo(newdiv, `https://en.wiktionary.org/wiki/${etyentry.qy}`);
            friendlyBreak(newdiv);
            if(etyentry.ety) {
                plopSectionToDiv(etyentry.ety, newdiv);
            } else {
                friendlyError(newdiv, `No etymology found. (Perhaps it\'s lemmatized?)`, true, true, true);
                friendlyBreak(newdiv);
            }
            for (let defn of etyentry.defns) plopSectionToDiv(defn.defn, newdiv);
            // onCheckbox();
            $('#closeinspect')[0].appendChild(newdiv); // this must come BEFORE

            orig = createTree(oword, olang); // this has createGraph() logic so we must create node in here too
        }
        // success. save wikitext
        // the node better exist
        if (doc && doc.wikitext()) orig!.data().wikitext = doc.wikitext();
        
    });
    // Temporarily disable URL request for debugging.
}


function createTree(oword: str, olang: str): cytoscape.NodeSingular {
    // homebrew graph creation.
    // relies on second.ts
    // let origin = cy.$('node#origin');
    // target = 
    // assumes oword, olang are already parsed once.
    // returns the origin.

    if (!oword) oword = _parse($('#qword').val() as str);
    if (!olang) olang = _parse($('#qlang').val() as str);
    let origarr = cy().$(`node[id="${oword}, ${olang}"]`);

    let fromScratch = cy().$('node').length === 0;

    if (!(origarr && origarr.length)) {
        let target = cy().add({
            group: 'nodes',
            data: {
                id: `${oword}, ${olang}`,
            }
        })[0];
    }
    origarr = cy().$(`node[id="${oword}, ${olang}"]`);
    assert(cy().$(`node[id="${oword}, ${olang}"]`)?.length, "couldn't find node");
    if (origarr && origarr.length) {
        let orig = origarr[0];
        orig.data().searched = true;
        orig.style('background-color', 'green');
    }

    let i = 1;

    // dumb code for multi etymologies
    // let headers = $('#closeinspect h3');
    let divlets = $('#closeinspect div');
    for(let etydiv of divlets) {
        let lastConnector;


        for (let temptxt of etydiv.querySelectorAll('span.template.t-active')) {
            // if(temp)
            
            let txt = temptxt.textContent;
            if(!txt) continue;
            let out = decodeTemplate(txt);
            if (!out) continue;
            let temps: Templated[];
            if ((out as any).length) { // quickie to check if it's a non-zero array
                temps = out as Templated[];
            } else temps = [out as Templated];
            for (let temp of temps) {
                let word = _parse(temp.word);
                let langcode = _parse(temp.langcode);
                let lang = _parse(temp.lang);
                if (!lang) lang = langcode;
                if (!word) continue;

                // put the anti-macron on the querying side.
                let targetarr = cy().$(`node[id="${word}, ${lang}"]`);
                let target;
                if (targetarr && targetarr.length) {
                    target = targetarr[0];
                    target.data().langcode = langcode;
                    target.data().isRecon = temp.isRecon;
                } else {
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
                    if(prev.textContent.toLowerCase().includes('from') // from
                    || prev.textContent === ', ') {
                    // || prev.textContent.length >= 2 && /^[^A-Za-z]*$/.test(prev.textContent)) {// is totally nonalphabetical, ie. if it's something like `, `
                        if(prev.previousSibling && prev.previousSibling.textContent?.startsWith('{{root')) {
                            // make an exception for the first thing being a root or ine-root
                        } else if (temps.length >= 2) { // make an exception for if we're an affixal type. 
                            
                        } else{
                            connector = lastConnector;
                        }
                    }
                } 
                if (!connector) {
                    connector = `${oword}, ${olang}`
                }
                let me = `${word}, ${lang}`;
                lastConnector = me;
                // console.log(`edge ${me};  ${connector}`)
                let id = `${_parse(temp.ttype)} || ${connector}; ${me}`;
                
                //  || ${oword}, ${olang}
                if(cy().$(`edge[id="${id}"]`).length) {
                    console.log(`Duplicate edge: ${id}`);
                } else if(temp.ttype == 'cog') {
                    // make an exception for cognates. dont' add edges
                } else {
                    try {
                        cy().add({
                            group: 'edges',
                            data: {
                                id: id, // || ${i++}`,
                                label: `${_parse(temp.ttype)}`,
                                template: `${temp.orig_template}`, // FIXME unparsed. But afaik this is ok???
                                source: me,
                                target: connector,
                            }
                        });
                    } catch (e) {
                        if ((e as any).message.startsWith(`Can not create second element with ID \`${id}`)) {
                            console.log(`Duplicate edge: ${id}`);
                        } else {
                        // soft fails. Usually because there is a duplicate edge.
                            throw e;
                        }
                    }
                }
            }
        }
    }
    
    relayout(undefined, fromScratch);

    let ret = cy().$(`node[id="${oword}, ${olang}"]`);
    assert(ret?.length, "couldn't find node");
    return ret[0];

}






