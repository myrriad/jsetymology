# jsetymology

Rewrite of pyetymology in js. 
Extracts etymological data from Wiktioanry and displays it in a convenient tree graph.

Now with a convenient inline Wiktionary browser.

Live demo is available at [myrriad.github.io/jsetymology](myrriad.github.io/jsetymology)

Left click on node to query Wiktionary and add tree data.
Right click node to remove.
Green node = already processed.

![Sample image: ](https://github.com/myrriad/jsetymology/blob/master/ballena2.png?raw=true)
![Sample image: ](https://github.com/myrriad/jsetymology/blob/master/course.png?raw=true)


## How does it work? (General overview)

1. Data is pulled from the corresponding fields, and a query to Wiktionary is made. (fetchEtyEntry() in etyentry.ts)
1b. Sometimes the word doesn't match the url exactly, like Latin macrons (decodeWord in template.ts). This is again hardcoded, but a dynamic version involves running the mediawiki lua interpreter and is kinda hard. If you can find a way to non-hardcode it, please please PR.
2. The data from Wiktionary (the mediawiki wikitext) is compiled and turned into an EtyEntry object. (ondoc() in etyentry.ts)
3. This EtyEntry object is compiled and parsed; templates are extracted. (onEtyEntry() in graph.ts)
4. Wikitext, found templates are pushed to the div in the right. (combination of plopSectionToDiv() in templatediv.ts; friendlyInfo() in first.ts)
5. Templates are found again and are either highlighted grey or green. Grey templates are ignored; green templates are
considered for inclusion. The function that makes this decision is findRelevance() in template.ts and is hardcoded.
5b. A non-hardcoded, user-configurable method to decide template inclusion is in the works. It involves a whitelist and blacklist stored as a cookie.
6. When "Add to graph" is clicked, all of the green templates are added to the graph (Graph.wlToTree(), Graph.createTreeFromSidebar() in graph.ts)
7. (6b) Each template (stored as a string) is converted to a Templated object. (decodeTemplate in template.ts, called in createTree())
8. (6c) These Templated objects know which word, lang combination to connect to because of another hardcoded function: _templSwitch() in template.ts (there really isn't an alternative because templates are arbitrary and user defined and the alternative is web scraping the wiktionary template definitions page.)
9. NB: When the button "Submit" is clicked, steps 1 through 6 are automatically called, so the data is added to the graph automatically.

bin/cytostart.js, relayout.ts, last.ts: contains a bunch of cytoscape stuff. Cytoscape is the graph drawing library.

## TODO (major)
 - [ ] Transliteration
 - [ ] dagre rewrite (sideways, specify exact layer). KEY: "position: function (node: any) { }, // returns { row, col } for element"
 - [ ] inh, der, cog correct chaining (!!)
 - [ ] Compound nodes, a la https://js.cytoscape.org/demos/compound-nodes/
 - [ ] Modules, Requirejs
 - [ ] option for reworked tiering system that only on basis of languages 
 - [ ] Instead of a tree view, have a linear view: a much simpler display of word relations especially for something linear like Spanish -> English (also, a UI to indicate this type of search: from one language to another)
 - [ ] Stop the relayouting from jumping so much
## TODO (minor)
 - [X] Capture downwards vs capture upwards
 - [ ] Easy way to cache a given SAMPLE request
 - [ ] Support other language wiktionaries, not just english
 - [ ] Sometimes, templates like {{la-verb}} that indicate a non-lemma form contains hard-to-process output like {{la-verb|1+.p3inf.poet-sync-perf|neg??}}
 - [ ] Allowance to manually add in a custom edge.
 - [x] Save graphs via list of nodes which can be included in the url (as a parse string) for easy access
 - [x] When multiple etymologies are found, display them all at the same time (Fix conenction when crossing between different numbered etymologies)
 - [ ] multiple definitions need multiple distinct nodes?
 - [ ] iframe in the wiktionary entry
 - [ ] unabbreviate the edge labels
 - [ ] button to automatically click nodes
 - [ ] undo button
 - [ ] audience: etymology, foreign language learners
 - [ ] macron
 - [x] !! SHARE BUTTON! (kinda)
 - [ ] !! RANDOM BUTTON! https://en.wiktionary.org/wiki/Wiktionary:Random_page
 - [ ] "Don't show again" tour dialog box
 - [ ] {{see desc}} indicates many more descendants
 - [X] different colors for up/down
 - [ ] Instead of showing raw templates, show an interpreted version (with the name of language nad word) with the full template info revealed on hover
 - [ ] Remove all not containing relevant languages button (all languages before opening descendants )
 Buttons for auto-infer
http://jsfiddle.net/AndreaLigios/jtLbpy62/2281/



abrigar#Spanish

words that don't work
 alchemy, Tagalog
litera#Spanish and litter#English
acorn#English
{{m|gem-pro|*[[nehw]] [[ainaz]]||nor one}}
{{de-verb|brauchen<brauchte,gebraucht,brauchte[prescribed]:br??uchte[used exclusively in speech, common in writing]>}}
https://en.wiktionary.org/wiki/Reconstruction:Proto-Indo-European/-*-yeti (PIE suffix error)
{{la-verb|1+.p3inf.poet-sync-perf|neg??}}
{{cln|ine-pro|ordinal numbers}}: *per-#P.I.E