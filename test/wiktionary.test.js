// current cached words: ballena, cadeaux, empezar, llegaron, precio, tomar, vaca

// test case for multiple numbered etys: creo#Spanish

// caput: for desc/derived

// to easily cache sample words: use the GUI querier, then call doc.wikitext() then copy-paste it into cached.ts
describe("Wiktionary", function() {
    it("queries ballena (cached)", function() {

        expect(true).toBe(true);
        let result1 = undefined;
        Wiktionary.fetchEtyEntry('ballena', 'Spanish').then((result) => {
            result1 = result;
            // });
            let entries = result.entries;
            expect(entries.length).toEqual(1);
            expect(JSON.stringify(result)).toEqual('{"entries":[{"defns":[{"defn":{},"deriv":{},"desc":{}}],"ety":{},"qy":"ballena"}],"qy":"ballena","doc":{}}');

            // DictEntry
            expect(entries[0].defns[0]['defn'].wikitext())
                .toEqual('\n{{es-noun|f}}\n\n# [[whale]]\n# [[baleen]], [[whalebone]]\n#: {{syn|es|barbas de ballena}}\n');
            expect(entries[0].defns[0].deriv.wikitext())
                .toEqual('\n{{der3|es|ballena asesina|ballena azul|ballena de aletas|ballena de Groenlandia|ballena franca|ballena gris|ballena jorobada|ballenato|ballenero|barbas de ballena|esperma de ballena|llena como una ballena|tiburón ballena}}\n');

            expect(entries[0].ety.wikitext())
                .toEqual('\nFrom {{inh|es|osp|ballena}}, from {{der|es|la|ballaena}}, variant of {{m|la|bālaena}} (compare {{cog|ca|balena}}, {{cog|fr|baleine}}, {{cog|gl|balea}}, {{cog|it|balena}}, {{cog|pt|baleia}}, {{cog|ro|balenă}}), from {{der|es|grc|φάλλαινα}}.\n');

            // done();
        });
    });

    it("finds all of the descendents for caput", function() {
        Wiktionary.fetchEtyEntry('caput', 'Latin').then((result) => {
            let dict = result.entries[0].defns[0];
            // expect string to start with
            expect(dict.defn.wikitext().startsWith('\n{{la-noun|caput/capit<3.N>}}\n\n# {{q|of [[human]]')).toBe(true);
            expect(dict.desc.wikitext()).toEqual("\n{{top2}}\n* Direct reflexes:\n** {{desc|sc|cabudu|cabude|cabide}}\n* {{desc|VL.|capus|der=1}} {{see desc}}\n* Borrowings:\n** {{desc|en|caput|bor=1}}\n** {{desc|pt|caput|bor=1}}\n* Reflexes of ''capita'' and, via back-formation, a new singular *''capitum'':\n** Balkans:\n*** {{desc|rup|capite}}; {{l|ruo|capit}}, {{l|ruo|capitu}}\n*** {{desc|ruo|cåpete}}\n*** {{desc|ro|capete|capăt}}\n** Italy and environs:\n*** Central Italian: {{l|it|capita}}; {{l|it|capitu}}, {{l|it|capito}}\n*** {{desc|lmo|caved}}\n*** {{desc|sc|cabida}}\n{{bottom}}\n");
            expect(dict.deriv.wikitext()).toEqual('\n{{col5|la\n|capitālis\n|capitastrum\n|capitellum\n|capitium\n|capitō\n|capitulum\n|capitulātim\n|capitātiō\n|capitātus\n|capitilavium\n|capitium\n|-ceps\n|sinciput\n|occiput\n|capitāneus}}\n');
        });
        expect(true).toBe(true);

    });
});