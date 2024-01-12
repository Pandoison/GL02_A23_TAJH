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
            // Nouvelle ligne pour afficher les informations supplémentaires
            console.log(`Numéro de téléphone : ${infoEtu.telephone}`);
            console.log(`Type de compte : ${infoEtu.typeCompte}`);
            console.log(`E-mail : ${infoEtu.email}`);
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
    console.log("4 - Supprimer un examen");
    console.log("5 - Se déconnecter");
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
        case "4":
            console.log("#-------------------------------------#");
            supprimerExamen(); // Appel de la fonction de suppression d'examen
            break;   
        case "5" :
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

function supprimerExamen() {
    const dossierExamens = path.join(__dirname, 'data', 'examens');

    // Lire la liste des fichiers d'examens dans le dossier
    const fichiersExamens = fs.readdirSync(dossierExamens);

    if (fichiersExamens.length === 0) {
        console.log("Aucun examen à supprimer.");
        return;
    }

    // Afficher la liste des examens avec leurs noms de fichier
    console.log("Liste des examens :");
    fichiersExamens.forEach((fichier, index) => {
        console.log(`${index + 1} - ${fichier}`);
    });

    // Demander à l'enseignant de choisir l'examen à supprimer
    const indexExamenASupprimer = prompt("Veuillez saisir le numéro de l'examen à supprimer : ");
    const fichierExamenASupprimer = fichiersExamens[indexExamenASupprimer - 1];

    if (fichierExamenASupprimer) {
        const cheminFichierExamenASupprimer = path.join(dossierExamens, fichierExamenASupprimer);

        // Supprimer le fichier d'examen
        fs.unlinkSync(cheminFichierExamenASupprimer);

        console.log(`L'examen "${fichierExamenASupprimer}" a été supprimé avec succès.`);
    } else {
        console.log("Le numéro d'examen saisi n'est pas valide.");
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

