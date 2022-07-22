// current cached words: ballena, cadeaux, empezar, llegaron, precio, tomar, vaca


describe("Wiktionary", function() {
    it("queries correctly for ballena", function() {
        let result;
        Wiktionary.fetchEtyEntry('ballena', 'Spanish').then((out) => { result = out });
        expect(result[0]).toEqual(jasmine.objectContaining({}));
    });
});