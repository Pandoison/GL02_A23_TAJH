const prompt = require('prompt-sync')();
const parser = require('./parserGift')
const question = require('../data/question');
const fs = require("fs");

const MATCHING = 'Matching';
const MC = 'Mc';
const ESSAY = 'Essay';
const SHORT = 'Short';

const listeQuestion = parser.generateQuestion()

let ajouterQuestion = () => {
    // =============== choisissez le type de question ===============
    let typeQuestion = afficherQuestionAvecReponse("Choisissez le type de question.", [MATCHING, MC, ESSAY, SHORT])
    // =============== entrez la question ===============
    let intituleQuestion = afficherQuestionReponseLibre("Entrez la question")
    while( (typeQuestion === MC|| typeQuestion === ESSAY || typeQuestion === SHORT) && (!intituleQuestion.includes('_____') || intituleQuestion.includes('______'))){
        intituleQuestion = afficherQuestionReponseLibre("Ce type de question doit inclure la chaine \'_____\' (5 fois _). Veuillez saisir à nouveau")
    }
    // =============== définir la réponse ===============
    let reponses = []
    if(typeQuestion !== ESSAY) {
        let nbReponses = afficherQuestionReponseLibre( typeQuestion === MATCHING ? "Combien de paires voulez-vous créer ?" : "Combien de réponses voulez-vous créer ?")
    }
    for(let i = 0; i<nbReponses; i++){
        if(typeQuestion === MATCHING) {
            reponses.push({
                sousQuestion: afficherQuestionReponseLibre(`r.${i+1} Quel est la sousQuestion ?`),
                sousReponse: afficherQuestionReponseLibre("  Quel est la sousRéponse ?")
            });
        }
        if(typeQuestion === MC || typeQuestion === SHORT){
            reponses.push({
                text: afficherQuestionReponseLibre(`r.${i + 1} Quel est la réponses ?`),
                isCorrect: afficherQuestionAvecReponse(`Est elle correcte ?`, ["oui", "non"]) === "oui"
            });
        }
    }
    // =============== Définir le cours auquel elle appartient ===============
    let nomCours = fs.readdirSync(`../data/gift`).map(c => c.replace(/\.gift/g, ''))
    let courAppartenant = afficherQuestionReponseLibre('A quel cours appartient cette question ? / HELP pour la liste des cours')
    while(!nomCours.includes(courAppartenant)){
        if(courAppartenant === 'HELP') {
            console.log(nomCours)
            courAppartenant = afficherQuestionReponseLibre(`A quel cours appartient cette question ?`)
        } else {
            courAppartenant = afficherQuestionReponseLibre(`Ce cours n'existe pas, veuillez saisir à nouveau`)
        }
    }

    let id = Math.random()*10;
    const createdQuestion = new question(`${courAppartenant.replace(/-/g, ' ')} - ${id}`, null, intituleQuestion, typeQuestion, reponses)

    parser.convertQuestionToGift(courAppartenant, createdQuestion) === 0 ? console.log("Question ajouter avec succès !") :  console.error("Erreur lors de l'ajout de la question ...");
}

// b.1) Sélection de la question
// b.2) possibilité de modifier le type de question
// b.3) possibilité de modifier la question
// b.4) possibilité de modifier la réponse
// b.5) possibilité de modifier le cours auquel elle appartient
// b.6) Valider la sélection
let editerQuestion = () => {


}

// c.1) Sélection de la question
// c.2) Suppression de la question
let supprimerQuestion = () => {
    const listeNomQuestion = listeQuestion.map(q => {return q.id});
    let idQuestion = afficherQuestionReponseLibre("Entrez le nom de la question à supprimer / HELP pour voir la liste des cours")
    while(!listeNomQuestion.includes(idQuestion)) {
        if(idQuestion === 'HELP'){
            listeNomQuestion.forEach(q => console.log(q))
            idQuestion = afficherQuestionReponseLibre("Entrez le nom de la question à supprimer")
        } else {
            idQuestion = afficherQuestionReponseLibre("Cette question n'existe pas, veuillez saisir à nouveau")
        }

    }

    parser.deleteQuestionFromGift(idQuestion) === 0 ? console.log("Question supprimer avec succès !") : console.log("Une erreur c'est produite lors de la suppression ...")
}


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

function afficherQuestionReponseLibre(question, min = undefined, max = undefined){
    let input = prompt(`${question} : `)
    if(min !== undefined && max !== undefined){
        while (input>max || input<min){
            input = prompt('Saisie invalide, veuillez saisir à nouveau : ')
        }
    }
    return input;
}


ajouterQuestion()


module.exports = {ajouterQuestion, editerQuestion, supprimerQuestion};