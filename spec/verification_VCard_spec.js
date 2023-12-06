describe("Le verification des VCard fonctionnent", function(){

    beforeAll(function (){
        this.crashTestVCard = require(__dirname + "/../lib/genererVCard");
        this.crashTestVCard.creationVCard("étudiant","DUPONT", "Jean", "JeanDUPONT@utt.fr", "0123456789");
    })

    it("verification de VCard OK", function(){
        expect(this.crashTestVCard.VCardExist("DUPONT", "Jean")).toEqual(true);
    });

    afterAll(function (){
        const fs = require('fs');
        fs.rmSync(__dirname + "/../data/Contact/DUPONT_Jean.vcf");
    })

});