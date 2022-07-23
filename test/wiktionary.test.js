// current cached words: ballena, cadeaux, empezar, llegaron, precio, tomar, vaca

// test case for multiple numbered etys: creo#Spanish

// caput: for desc/derived
describe("Wiktionary", function() {
    it("queries ballena (cached)", function() {

        expect(true).toBe(true);
        let result1 = undefined;
        Wiktionary.fetchEtyEntry('ballena', 'Spanish').then((result) => {
            result1 = result;
            // });
            expect(result.length).toBe(2);

            expect(result[0].length).toEqual(1);
            expect(JSON.stringify(result[0][0])).toEqual('{"defns":[{"defn":{},"deriv":{}}],"ety":{},"qy":"ballena"}');

            // DictEntry
            expect(result[0][0].defns[0]['defn'].wikitext())
                .toEqual('\n{{es-noun|f}}\n\n# [[whale]]\n# [[baleen]], [[whalebone]]\n#: {{syn|es|barbas de ballena}}\n');
            expect(result[0][0].defns[0].deriv.wikitext())
                .toEqual('\n{{der3|es|ballena asesina|ballena azul|ballena de aletas|ballena de Groenlandia|ballena franca|ballena gris|ballena jorobada|ballenato|ballenero|barbas de ballena|esperma de ballena|llena como una ballena|tiburón ballena}}\n');

            expect(result[0][0].ety.wikitext())
                .toEqual('\nFrom {{inh|es|osp|ballena}}, from {{der|es|la|ballaena}}, variant of {{m|la|bālaena}} (compare {{cog|ca|balena}}, {{cog|fr|baleine}}, {{cog|gl|balea}}, {{cog|it|balena}}, {{cog|pt|baleia}}, {{cog|ro|balenă}}), from {{der|es|grc|φάλλαινα}}.\n');

            // done();
        });
    });
});