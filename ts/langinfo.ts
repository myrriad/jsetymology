

// Possibilities to examine:
// 1. Wiktra uses lua and wraps it in a python API: https://github.com/kbatsuren/wiktra

// already we can use this as a springboard:
// run Wiktra with some free server hosting

// 2. Parsing wikitext locally:
// See: https://en.wiktionary.org/wiki/Wiktionary:Parsing


// 3. Parsing wikitext with the API over internet:

// 4. Querying the html version over the internet, then comparing:
// The API call for this could be https://en.wiktionary.org/w/index.php?title=word&printable=yes

// 5. wiktionary dumps:
// https://dumps.wikimedia.org/enwiktionary/ (all pages, current version only: 1.1 GB)

namespace Wiktionary2 {
    type wiktParseMode = 'lua' | 'api-request' | 'local';
    const mode = 'local' as wiktParseMode;

    export function toText(wikitext: wtf.Document | str) {
        if(mode === 'local') {
            if(typeof wikitext === 'string') wikitext = wtf(wikitext);
            return (wikitext as wtf.Document).text();
        }
    }
}

/* Useful API links:
 * [1] https://en.wiktionary.org/w/api.php?action=parse&prop=wikitext&formatversion=2&format=json&page=velociraptor#English
 * - for most pages
 * [2] https://en.wiktionary.org/w/api.php?action=query&prop=revisions%7Cpageprops&rvprop=content&maxlag=5&rvslots=main&origin=*&format=json&redirects=true&titles={topics}
 * [3] http://en.wiktionary.org/w/api.php?action=query&list=categorymembers&cmtitle={urlpart}&cmprop=title&format=json&cmlimit={cmlimit}#{langtag}
 * - for categories
 * [4] https://www.mediawiki.org/w/api.php?action=parse&text=%7B%7BProject:Sandbox%7D%7D&contentmodel=wikitext
 * - parsing wikitext over API over internet. https://www.mediawiki.org/wiki/API:Parsing_wikitext#API_documentation
 * https://en.wiktionary.org/w/api.php?action=parse&contentmodel=wikitext&text={{%23invoke:moduleName|functionName}}
 * https://en.wiktionary.org/w/api.php?action=parse&contentmodel=wikitext&text=%7B%7B%23invoke:languages/templates|getByCode|en|getFamily%7D%7D
 * - source: https://en.wiktionary.org/wiki/Module:languages/templates
 * --> results in "gmw"
 * https://en.wiktionary.org/w/api.php?action=parse&contentmodel=wikitext&text=%7B%7B%23invoke:languages/templates|getByCode|en|getFamily%7D%7D
 * https://en.wiktionary.org/w/api.php?action=parse&contentmodel=wikitext&text=%7B%7B%23invoke:languages/templates|getByCode|en|getAncestors|1%7D%7D
 * --> results in "enm", which in turn results in "ang", then "gmw-pro" etc.
 * 
 * Useful and necessary features of https://en.wiktionary.org/wiki/Module:languages:
 * 
 * getAncestors(): https://en.wiktionary.org/wiki/Module:languages#Language:getAncestors
 * transliterate(): https://en.wiktionary.org/wiki/Module:languages#Language:transliterate
 */
// Mediawiki scripting iceberg ("Module:languages"):

// [5] https://en.wiktionary.org/wiki/Wiktionary:Scribunto

// As per [5], to go from templates/ wikitext to lua/Scribunto: use "{{#invoke: Module_name | function_name | arg1 | arg2 | arg3 ... }}"

