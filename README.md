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
