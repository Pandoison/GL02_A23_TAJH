describe("Test du parser", function(){
    const parser = require("../lib/parserGift");
    const question =require("../data/question")
    const fs = require("fs")
    const path = require('path');

    beforeAll(function () {
        this.fileNameOfQ = "U8-p84-Voc-Linking_words"
        this.q = new question(
            "U8 p84 TEST", "I applied for the job. _____ , I didn't get it, unfortunately.",
            "Look carefully at how the linking expressions are used in context, including the punctuation. Complete the sentences with the linking following words or phrases) <i>although, as well as, despite, however, in order to, so, that's why, too</i>",
            "MC",
            [{text: "However", isCorrect: true}]
        )

    })

    it("Peut ajouter une question", function(){
        parser.addQuestionToGift(this.fileNameOfQ, this.q)
        const fileContent = fs.readFileSync(path.join(__dirname, `../data/gift/${this.fileNameOfQ}.gift`), {encoding: 'utf8', flag: 'r'})
        expect(fileContent).toContain(this.q.id)
    });

    it("Peut ajouter et supprimer une question", function(){
        parser.deleteQuestionFromGift(this.q.id)
        const fileContent = fs.readFileSync(path.join(__dirname, `../data/gift/${this.fileNameOfQ}.gift`), {encoding: 'utf8', flag: 'r'})
        expect(fileContent).not.toContain(this.q.id)
    });

});