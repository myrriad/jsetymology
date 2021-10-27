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
 - [x] Note - wtf_wikipedia doesn't recognize the {{cog}} template. Therefore, TODO move towards reimplementing custom template parser. Done (kinda)
 - [ ] Capture downwards vs capture upwards
 - [ ] dagre rewrite (sideways, specify exact layer). KEY: "position: function (node: any) { }, // returns { row, col } for element"
 - [ ] Easy way to cache a given SAMPLE request
 - [ ] Support other language wiktionaries, not just english
 - [x] inh, der inheritances being properly chained (kind of)
 - [ ] The "form of" template parsing is error-prone
 - [ ] Allowance to manually add in a custom edge.
 - [x] Save graphs via list of nodes which can be included in the url (as a parse string) for easy access
 - [ ] Compound nodes, a la https://js.cytoscape.org/demos/compound-nodes/
 - [ ] Requirejs
 - [ ] {{m|gem-pro|*[[nehw]] [[ainaz]]||nor one}}
 - [ ] {{de-verb|brauchen<brauchte,gebraucht,brauchte[prescribed]:bräuchte[used exclusively in speech, common in writing]>}}
 - [x] When multiple etymologies are found, display them all at the same time (Fix conenction when crossing between different numbered etymologies)
 - [ ] multiple etymologies need multiple distinct nodes?
 - [ ] Create tests
 - [ ] acorn bug
 - [ ] iframe in the wiktionary entry
 - [ ] unabbreviate the edge labels
 - [ ] button to automatically click nodes
 - [ ] undo button
 - [ ] audience: etymology, foreign language learners
 - [ ] macron
 