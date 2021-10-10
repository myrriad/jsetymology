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


TODO
 - [x] Major refactor - get rid of second.ts vs graph.js confusion
 - [ ] Note - wtf_wikipedia doesn't recognize the {{cog}} template. Therefore, TODO move towards reimplementing custom template parser.
 - [ ] Capture downwards vs capture upwards
 - [ ] dagre rewrite (sideways, specify exact layer). KEY: "position: function (node: any) { }, // returns { row, col } for element"
 - [x] Cache every request, not just the sample queries (to save on requests to wiktionary)
 - [ ] Support other language wiktionaries, not just english
 - [x] inh, der inheritances being properly chained (kind of)
 - [ ] The "form of" template parsing is horrendously broad and error-prone
 - [ ] Allowance to manually add in a custom node/edge.
 - [x] Save graphs via list of nodes which can be included in the url (as a parse string) for easy access
 - [ ] Compound nodes, a la https://js.cytoscape.org/demos/compound-nodes/
 - [ ] Requirejs
 - [ ] Use promises
 - [ ] {{m|gem-pro|*[[nehw]] [[ainaz]]||nor one}}
 - [ ] {{de-verb|brauchen<brauchte,gebraucht,brauchte[prescribed]:bräuchte[used exclusively in speech, common in writing]>}}
 - [ ]