# jsetymology
Rewrite of pyetymology in js. 

TODO
 - [x] Major refactor - get rid of second.ts vs graph.js confusion
 - [ ] Note - wtf_wikipedia doesn't recognize the {{cog}} template. Therefore, TODO move towards reimplementing custom template parser.
 - [ ] Capture downwards vs capture upwards
 - [ ] dagre rewrite (sideways, specify exact layer)
 - [ ] Cache every request, not just the sample queries (to save on requests to wiktionary)
 - [ ] Support other language wiktionaries, not just english
 - [ ] inh, der inheritances being properly chained
 - [ ] The "form of" template parsing is horrendously broad and error-prone