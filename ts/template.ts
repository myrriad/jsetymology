let decodeTemplate: (templstr: str) => Templated | undefined;
let decodeWord;

class Templated {
    ttype: str;
    lang: string;
    word: str;
    self_lang?: str;
    constructor(ttype: str, word: str, lang: str, self_lang?: str) {
        this.ttype = ttype;
        this.word = word;
        this.lang = lang;
        this.self_lang = self_lang;
    }
}
(function() {
    
    function _templSwitch(ttype: str, rest: str[]): str[] | undefined {
        let lang;
        let word;
        let self_lang;
        switch(ttype) { // Again I hardcode the values. It's just easier to implement than a dynamic behavior-changing system
            
            case 'derived':
            case 'der':
            case 'inherited':
            case 'inh':
            case 'borrowed':
            case 'bor':
            case 'learned borrowing':
            case 'lbor':
            case 'orthographic borrowing':
            case 'obor':
            case 'calque':
            case 'cal':
            case 'clq':
            case 'semantic loan':
            case 'sl':
            case 'phono-semantic matching':
            case 'psm':
                self_lang = rest[0]; // |1=
                lang = rest[1]; // |2=
                word = rest[2]; // |3=
                break;
            case 'clipping':
            case 'short for':
            case 'back-formation':
            case 'back-form':
            case 'bf':
            case 'mention':
            case 'm': // More complicated. https://en.wiktionary.org/wiki/Template:mention
            case 'cognate':
            case 'cog':
            case 'noncognate':
            case 'noncog':
            case 'ncog':
            case 'nc':
            
                lang = rest[0];
                word = rest[1];
                break;
            // TODO: multi-term templates: root, affix, blend, doublet
            // TODO: onom, named-after
            default:
                lang = '';
                word = '';
                break;

        };
        if(!lang && !word) {
            if(ttype.endsWith(' of')) {
                lang = rest[0];
                word = rest[1];
            } else if(ttype.endsWith('-form')) {
                word = rest[0]; // la-verb-form
            } else {
                console.log(`Unprepared template type ${ttype}!`);
            }
        }
        if(lang && word) return [word, lang]; //`${lang}, ${word}`;
        return undefined;
    }
    decodeTemplate = function(templstr: str) {
        assert(templstr.startsWith('{{') && templstr.endsWith('}}'));
        let ttxt = templstr.slice(2, -2);
        let parts = ttxt.trim().split('|');
        let ttype = parts[0];
        let rest = parts.slice(1);
        let result = _templSwitch(ttype, rest);
        if(result) {
            return new Templated(ttype, result[0], result[1]);
        }
        return undefined;
    }
    decodeWord = function(word: str, lang: str) {
        if(lang === 'Latin') {
            let macrons = ['Ā', 'ā', 'Ē', 'ē', 'Ī', 'ī', 'Ō', 'ō', 'Ū', 'ū', 'Ȳ', 'ȳ'];
            let norms = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u', 'Y', 'y'];
            for(let i=0;i<macrons.length;i++) {
                word = word.replace(macrons[i], norms[i]);
            } 
        }
        return word;
    }
}());
