const prompt = require('prompt-sync')();
const {chooseTypeAccount} = require("./lib/creerCompte");
const {login, logout} = require("./lib/loginLogout");
const {VCardExist, creationVCard} = require("./lib/genererVCard");
const {recupererInfoEtu, afficherInfoEtudiant} = require("./lib/gestionTableauBord");
const {ajouterQuestion, editerQuestion, supprimerQuestion} = require("./lib/gestionQuestions");

const creerExam = require("./lib/creerExamen").creerExam;
const assignerExam = require("./lib/attribuerExamen");
const realiserExam = require("./lib/realiserExamen");


let ended = false;
let loggedUser = null;

function affichageAccueil(){
    console.log("#-------------------------------------#");
    console.log("1 - Se connecter");
    console.log("2 - Créer un compte");
    console.log("3 - Quitter");
    let indexOption = prompt ("Veuillez choisir une option : ");
    switch (indexOption) {
        case "1" :
            console.log("#-------------------------------------#");
            loggedUser = login()
            break;
        case "2" :
            console.log("#-------------------------------------#");
            chooseTypeAccount();
            break;
        case "3" :
            console.log("#-------------------------------------#");
            exit();
            break;
        default :
            console.log("Réponse inconnue, veuillez recommencer.");
    }
}

function affichageEtudiant(){
    console.log("#-------------------------------------#");
    console.log(`Etudiant : ${loggedUser.nom} ${loggedUser.prenom}`);
    console.log(`Mail : ${loggedUser.adresse}, telephone : ${loggedUser.tel}`)
    console.log("#-------------------------------------#");
    console.log("1 - Tableau de bord");
    console.log("2 - Participer à un examen");
    console.log("3 - Se déconnecter");
    let indexOption = prompt ("Veuillez choisir une option : ");
    switch (indexOption) {
        case "1" :
            console.log("#-------------------------------------#");
            let infoEtu = recupererInfoEtu(loggedUser);
            afficherInfoEtudiant(infoEtu);
            break;
        case "2" :
            console.log("#-------------------------------------#");
            realiserExam(loggedUser);
            break;
        case "3" :
            console.log("#-------------------------------------#");
            logout();
            loggedUser = null;
            break;
        default :
            console.log("Réponse inconnue, veuillez recommencer.");
    }
}

function affichageEnseignant(){
    console.log("#-------------------------------------#");
    if(!VCardExist(loggedUser.nom,loggedUser.prenom)){
        console.log("VCard du compte inexistante, tentative de création de VCard...");
        creationVCard("enseignant", loggedUser.nom, loggedUser.prenom, loggedUser.adresse, loggedUser.tel)
    }
    console.log(`Enseignant : ${loggedUser.nom} ${loggedUser.prenom}`);
    console.log(`Mail : ${loggedUser.adresse}, telephone : ${loggedUser.tel}`)
    console.log("#-------------------------------------#");
    console.log("1 - Créer un examen");
    console.log("2 - Attribuer un examen");
    console.log("3 - Gérer la base de question");
    console.log("4 - Se déconnecter");
    let indexOption1 = prompt ("Veuillez choisir une option : ");
    switch (indexOption1) {
        case "1" :
            console.log("#-------------------------------------#");
            creerExam(loggedUser);
            break;
        case "2" :
            console.log("#-------------------------------------#");
            assignerExam()
            break;
        case "3" :
            let ended1 = false;
            while(!ended1){
                console.log("#-------------------------------------#");
                console.log("a - Ajouter une question");
                console.log("b - Éditer une question");
                console.log("c - Supprimer une question");
                console.log("d - Retour");
                let indexOption2 = prompt("Veuillez choisir une option : ")
                switch (indexOption2){
                    case "a" :
                        ajouterQuestion();
                        ended1 = true;
                        break;
                    case "b" :
                        editerQuestion();
                        ended1 = true;
                        break;
                    case "c" :
                        supprimerQuestion();
                        ended1 = true;
                        break;
                    case "d" :
                        ended1 = true;
                        break;
                    default :
                        console.log("Réponse inconnue, veuillez recommencer.");
                        break;
                }
            }
            break;
        case "4" :
            console.log("#-------------------------------------#");
            logout();
            loggedUser = null;
            break;
        default :
            console.log("Réponse inconnue, veuillez recommencer.");
    }
}

function affichageGestionnaire(){
    console.log("#-------------------------------------#");
    if(!VCardExist(loggedUser.nom,loggedUser.prenom)){
        console.log("VCard du compte inexistante, tentative de création de VCard...");
        creationVCard("gestionnaire", loggedUser.nom, loggedUser.prenom, loggedUser.adresse, loggedUser.tel)
    }
    console.log(`Gestionaire : ${loggedUser.nom} ${loggedUser.prenom}`);
    console.log(`Mail : ${loggedUser.adresse}, telephone : ${loggedUser.tel}`)
    console.log("#-------------------------------------#");
    console.log("1 - Créer un examen");
    console.log("2 - Gérer la base de question");
    console.log("3 - Se déconnecter");
    let indexOption1 = prompt ("Veuillez choisir une option : ");
    switch (indexOption1) {
        case "1" :
            console.log("#-------------------------------------#");
            //pb, besoin d'un export convenable
            creerExam(loggedUser);
            break;
        case "2" :
            let ended1 = false;
            while(!ended1){
                console.log("#-------------------------------------#");
                console.log("a - Ajouter une question");
                console.log("b - Éditer une question");
                console.log("c - Supprimer une question");
                console.log("d - Retour");
                let indexOption2 = prompt("Veuillez choisir une option : ")
                switch (indexOption2){
                    case "a" :
                        ajouterQuestion();
                        ended1 = true;
                        break;
                    case "b" :
                        editerQuestion();
                        ended1 = true;
                        break;
                    case "c" :
                        supprimerQuestion();
                        ended1 = true;
                        break;
                    case "d" :
                        ended1 = true;
                        break;
                    default :
                        console.log("Réponse inconnue, veuillez recommencer.");
                        break;
                }
            }
            break;
        case "3" :
            console.log("#-------------------------------------#");
            logout();
            loggedUser = null;
            break;
        default :
            console.log("Réponse inconnue, veuillez recommencer.");
    }
}

function affichageChoix(){
    if (loggedUser != null){
        switch(loggedUser.type){
            case "étudiant" :
                affichageEtudiant();
                break;
            case "enseignant" :
                affichageEnseignant();
                break;
            case "gestionnaire" :
                affichageGestionnaire();
                break;
        }
    }
    else{
        affichageAccueil();
    }
}

function exit(){
    ended = true;
    //throw new Error("Vous quittez le logiciel.");
}

console.log("Bienvenue !");
while(!ended){
    affichageChoix();
}
