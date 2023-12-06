const prompt = require('prompt-sync')();
const parser = require('./parserGift')
const question = require('../data/question');
const fs = require("fs");

const MATCHING = 'Matching';
const MC = 'Mc';
const ESSAY = 'Essay';
const SHORT = 'Short';

const pathToGift = __dirname+'/../data/gift';

let listeQuestion = parser.generateQuestion()

// Permet d'afficher une question et les réponses voulu à cette question
// Récupère le choix de l'utilisateur, et le renvoie
function afficherQuestionAvecReponse(question, reponses){
    console.log(question)
    for (let i = 0 ;i < reponses.length;i++){
        console.log(`${i+1}) ${reponses[i]}`)
    }
    let input = prompt()

    while (isNaN(input) || parseInt(input)>reponses.length || parseInt(input)<1) {
        input = prompt("Saisi invalide, veuillez saisir à nouveau :");
    }
    return reponses[input-1];
}

// Permet d'afficher une question à reponse libre
function afficherQuestionReponseLibre(question, min = undefined, max = undefined){
    let input = prompt(`${question} : `)
    if(min !== undefined && max !== undefined){
        while (input>max || input<min){
            input = prompt('Saisie invalide, veuillez saisir à nouveau : ')
        }
    }
    return input;
}

// Permet de créer les réponses d'une question à insérer dans la banque de données
function creerReponse(typeQuestion) {
    typeQuestion = typeQuestion.toUpperCase();
    let reponses = []
    if (typeQuestion !== ESSAY.toUpperCase()) {
        let nbReponses = afficherQuestionReponseLibre(typeQuestion === MATCHING ? "Combien de paires voulez-vous créer ?" : "Combien de réponses voulez-vous créer ?")
        for (let i = 0; i < nbReponses; i++) {
            if (typeQuestion === MATCHING.toUpperCase()) {
                reponses.push({
                    sousQuestion: afficherQuestionReponseLibre(`r.${i + 1} Quel est la sousQuestion ?`),
                    sousReponse: afficherQuestionReponseLibre("  Quel est la sousRéponse ?")
                });
            }
            if (typeQuestion === MC.toUpperCase() || typeQuestion === SHORT.toUpperCase()) {
                reponses.push({
                    text: afficherQuestionReponseLibre(`r.${i + 1} Quel est la réponses ?`),
                    isCorrect: afficherQuestionAvecReponse(`Est elle correcte ?`, ["oui", "non"]) === "oui"
                });
            }
        }
    } else {
        console.log("Ce type de question ne peut pas avoir de réponse.")
    }
    return reponses;
}

// Demande à l'utilisateur de saisir un cours valide (existant dans la banque de question)
function demanderUnCour() {
    let courAppartenant = afficherQuestionReponseLibre('A quel cours appartient cette question ? / HELP pour voir la liste des cours')
    let nomCours = fs.readdirSync(`${pathToGift}`).map(c => c.replace(/\.gift/g, ''))
    while (!nomCours.includes(courAppartenant)) {
        if (courAppartenant.toUpperCase() === 'HELP') {
            nomCours.forEach(n => console.log(n))
            courAppartenant = afficherQuestionReponseLibre(`A quel cours appartient cette question ?`)
        } else {
            courAppartenant = afficherQuestionReponseLibre(`Ce cours n'existe pas, veuillez saisir à nouveau`)
        }
    }
    return courAppartenant;
}

// Demande à l'utilisateur de rentrer une question correctement former (en fonction du type)
function demanderQuestion(typeQuestion) {
    typeQuestion = typeQuestion.toUpperCase();
    let intituleQuestion = afficherQuestionReponseLibre("Entrez la question")
    while ((typeQuestion === MC.toUpperCase() || typeQuestion === ESSAY.toUpperCase() || typeQuestion === SHORT.toUpperCase()) && (!intituleQuestion.includes('_____') || intituleQuestion.includes('______'))) {
        intituleQuestion = afficherQuestionReponseLibre("Ce type de question doit inclure la chaine \'_____\' (5 fois _). Veuillez saisir à nouveau")
    }
    return intituleQuestion;
}

let ajouterQuestion = () => {
    // =============== choisissez le type de question ===============
    let typeQuestion = afficherQuestionAvecReponse("Choisissez le type de question.", [MATCHING, MC, ESSAY, SHORT])
    // =============== entrez la question ===============
    let intituleQuestion = demanderQuestion(typeQuestion);
    // =============== définir la réponse ===============
    let reponses = creerReponse(typeQuestion);
    // =============== Définir le cours auquel elle appartient ===============
    let courAppartenant = demanderUnCour();

    let id = Math.random()*10;
    const createdQuestion = new question(`${courAppartenant.replace(/-/g, ' ')} - ${id}`, null, intituleQuestion, typeQuestion, reponses)

    parser.addQuestionToGift(courAppartenant, createdQuestion) === 0 ? console.log("Question ajouter avec succès !") :  console.error("Erreur lors de l'ajout de la question ...");
    listeQuestion = parser.generateQuestion()
}

// Permet de récupérer le nom du fichier GIFT ou est contenu une question au format GIFT
function getFileNameOf(question) {
    const files = fs.readdirSync(`${pathToGift}`);
    let fileName = ''
    files.forEach(file => {
        const data = fs.readFileSync(`${pathToGift}/${file}`, {encoding: 'utf8', flag: 'r'})
        if (data.includes(question.id)) {
            fileName = file
        }
    });
    return fileName;
}

// Permet d'afficher correctement une réponse dans le terminal
function afficherResponse(reponses) {
    let res = ''
    reponses.forEach(r => {
        if ('sousQuestion' in r){
            res += `${r.sousQuestion} -> ${r.sousReponse}\n`
        } else {
            res += `${r.text} (${r.isCorrect === true ? 'Correct' : 'Incorrect'})\n`
        }
    })
    return res
}

let editerQuestion = () => {
    // =============== Sélection de la question ===============
    const idQuestion = getIdOfExistingQuestion();
    const question = listeQuestion.find(q => q.id===idQuestion);
    const typeDeModifications = ["Intitulé de la question", 'Type', 'Réponses', 'Cours appartenant']
    let typeModificationChoisi = afficherQuestionAvecReponse("Que voulez-vous modifier sur cette question ?", typeDeModifications)
    switch (typeModificationChoisi){
        // =============== possibilité de modifier la question ===============
        case typeDeModifications[0]:
            console.log(`Voici l'intitulé actuel de la question :\n${question.consigne}`)
            const nouvelIntitule = demanderQuestion(question.id)
            console.log(parser.convertQuestionToGiftFormat(question))
            parser.deleteQuestionFromGift(question.id, parser.convertQuestionToGiftFormat(question))
            break
        // =============== possibilité de modifier le type de question ===============
        case typeDeModifications[1]:
            console.log(`Voici le type actuel de la question :\n${question.type}`)
            const nouveauType = afficherQuestionAvecReponse("Choisissez le nouveau type de la question", [MATCHING, MC, ESSAY, SHORT])
            question.type = nouveauType
            parser.deleteQuestionFromGift(question.id, parser.convertQuestionToGiftFormat(question))
            break
        // =============== possibilité de modifier la réponse ===============
        case typeDeModifications[2]:
            console.log(`Voici le/les réponses actuelles de la question :\n${question.reponses.length === 0 ? 'Aucune' : afficherResponse(question.reponses)}`)
            const nouvelleReponses = creerReponse(question.type)
            question.reponses = nouvelleReponses
            parser.deleteQuestionFromGift(question.id, parser.convertQuestionToGiftFormat(question))
            break
        // =============== possibilité de modifier le cours auquel elle appartient ===============
        case typeDeModifications[3]:
            let fileName = getFileNameOf(question);
            console.log(`Voici le cours auquel appartient actuellement la question : ${fileName.replace(/\.gift/g, '')}`)
            const nouveauCourAppartenant = demanderUnCour()
            const ancienId = question.id
            let nouveauID = `${nouveauCourAppartenant.replace(/-/g, ' ')} - ${Math.random()*10}`
            question.id = nouveauID
            parser.deleteQuestionFromGift(ancienId)
            parser.addQuestionToGift(nouveauCourAppartenant.replace(/\.gift/g, ''), question)
            break
    }
    listeQuestion = parser.generateQuestion()
}

// Demande à l'utilisateur de saisir un nom de question existant dans la banque de données
function getIdOfExistingQuestion() {
    const listeNomQuestion = listeQuestion.map(q => {
        return q.id
    });
    let idQuestion = afficherQuestionReponseLibre("Entrez le nom de la question / HELP pour voir la liste des questions")
    while (!listeNomQuestion.includes(idQuestion)) {
        if (idQuestion.toUpperCase() === 'HELP') {
            listeNomQuestion.forEach(q => console.log(q))
            idQuestion = afficherQuestionReponseLibre("Entrez le nom de la question")
        } else {
            idQuestion = afficherQuestionReponseLibre("Cette question n'existe pas, veuillez saisir à nouveau")
        }

    }
    return idQuestion;
}

let supprimerQuestion = () => {
    // =============== Sélection de la question ===============
    let idQuestion = getIdOfExistingQuestion();
    // =============== Suppression de la question ===============
    parser.deleteQuestionFromGift(idQuestion) === 0 ? console.log("Question supprimer avec succès !") : console.log("Une erreur c'est produite lors de la suppression ...")
    listeQuestion = parser.generateQuestion()
}

module.exports = {ajouterQuestion, editerQuestion, supprimerQuestion};