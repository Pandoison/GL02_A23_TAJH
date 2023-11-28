const prompt = require('prompt-sync')();

const MATCHING = 'Matching';
const MC = 'Mc';
const ESSAY = 'Essay';
const SHORT = 'Short';

// a.1) choisissez le type de question
// a.2) entrez la question
// a.3) définir la réponse
// a.4) Définir le cours auquel elle appartient
// a.5) Valider la sélection
let ajouterQuestion = () => {
    // a.1) choisissez le type de question
    let typeQuestion = afficherQuestionAvecReponse("Choisissez le type de question.", [MATCHING, MC, ESSAY, SHORT])
    // a.2) entrez la question
    let question = afficherQuestionReponseLibre("Entrez la question")
    while( (typeQuestion === MC|| typeQuestion === ESSAY) && !question.includes('_____')){
        question = afficherQuestionReponseLibre("Ce type de question doit inclure la chaine \'_____\' (5 fois _). Veuillez saisir à nouveau")
    }
    // a.3) définir la réponse
    let reponses = []
    let nbReponses = afficherQuestionReponseLibre( typeQuestion === MATCHING ? "Combien de paires voulez-vous créer ?" : "Combien de réponses voulez-vous créer ?")
    for(let i = 0; i<nbReponses; i++){
        if(typeQuestion === MATCHING) {
            reponses.push({
                sousQuestion: afficherQuestionReponseLibre(`r.${i+1} Quel est la sousQuestion ?`),
                sousReponse: afficherQuestionReponseLibre("  Quel est la sousRéponse ?")
            });
        } else {
            reponses.push({
                text: afficherQuestionReponseLibre(`r.${i + 1} Quel est la réponses ?`),
                isCorrect: afficherQuestionAvecReponse(`Est elle correcte ?`, ["oui", "non"]) === "oui"
            });
        }

    }
    // a.4) Définir le cours auquel elle appartient
    

    console.log(question)
    console.log(reponses)

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


module.exports = ajouterQuestion, editerQuestion, supprimerQuestion;