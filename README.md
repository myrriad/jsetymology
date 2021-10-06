# jsetymology

Rewrite of pyetymology in js. 
Extracts etymological data from Wiktioanry and displays it in a convenient tree graph.

Now with a convenient document browser.

Live demo is available at accyl.github.io/jsetymology

Left click on node to query Wiktionary and add tree data.
Right click node to remove.
Green node = already processed.

![Fun sample image: ](https://github.com/accyl/jsetymology/blob/master/ballena2.png?raw=true)


TODO
 - [x] Major refactor - get rid of second.ts vs graph.js confusion
 - [ ] Note - wtf_wikipedia doesn't recognize the {{cog}} template. Therefore, TODO move towards reimplementing custom template parser.
 - [ ] Capture downwards vs capture upwards
 - [ ] dagre rewrite (sideways, specify exact layer)
 - [x] Cache every request, not just the sample queries (to save on requests to wiktionary)
 - [ ] Support other language wiktionaries, not just english
 - [x] inh, der inheritances being properly chained (kind of)
 - [ ] The "form of" template parsing is horrendously broad and error-prone
 - [ ] Allownace to manually add in a custom node/edge.
 - [ ] Save graphs via list of nodes which can be included in the url (as a parse string) for easy access