describe("Les verification fonctionnent", function(){

    beforeAll(function () {
        const verificateur = require("../lib/creerCompte");
        this.crashTestVerificateur = verificateur;
    })

    it("verification de nom OK", function(){
        expect(this.crashTestVerificateur.nomValide("Nom")).toEqual(true);
    });

    it("verification de prenom OK", function(){
        expect(this.crashTestVerificateur.prenomValide("Prenom")).toEqual(true);
    });

    it("verification de mail OK", function(){
        expect(this.crashTestVerificateur.emailValide("mailTest@utt.fr")).toEqual(true);
    });

    it("verification de tel OK", function(){
        expect(this.crashTestVerificateur.telValide("0000000000")).toEqual(true);
    });

    it("verification de mot de passe OK", function(){
        expect(this.crashTestVerificateur.mdpValide("MotDePasseTest1")).toEqual(true);
    });

});