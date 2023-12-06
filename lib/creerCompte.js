//Importation des modules necessaires
const fs = require('fs');
const prompt = require('prompt-sync')();
const {creationVCard} = require('./genererVCard');
const {creerInfoEtudiant} = require('./gestionTableauBord');
const pathToComptes = __dirname + '/comptes.json';


/*Verifie que le nom est valide
* param  :
* nom String
*/
function nomValide(nom){
    const caractereAutorise = /^[a-zA-Z]+$/;
    return caractereAutorise.test(nom);
}

/*Verifie que le prenom est valide
* param  :
* prenom String
*/
function prenomValide(prenom){
    const caractereAutorise = /^[a-zA-Z]+$/;
    return caractereAutorise.test(prenom);
}

/*Verifie que l'email' est valide
* le cahier des charges stipule qu'un email valide doit posseder un @
* param  :
* email String
*/
function emailValide(email){
    return email.includes("@");
}

/*Verifie que le tel est valide
* param  :
* tel String : XX-XX-XX-XX-XX (X un chiffre)
*/
function telValide(tel){
    const caractereAutorise = /^\d{10}$/;
    return caractereAutorise.test(tel);
}

/*Verifie que le mdp est valide
* le cahier des charges stipule qu'un mdp valide doit posseder minimum :
* 8 caract, 1 majuscule, 1 chiffre ou caractere special
* param  :
* mdp String
*/
function mdpValide(mdp){
    const caractereAutorise = /^(?=.*[0-9!@#$%^&*])(?=.*[A-Z]).{8,}$/;
    return caractereAutorise.test(mdp);
}

/*Verifie l'unicité de l'email
* param :
* users : contient plusieurs user de la forme suivante :
* {
        type: type,
        nom: nom,
        prenom: prenom,
        mdp: mdp,
        tel: tel,
        adresse: adresseMail
  }
* email String
*/
function isEmailUnique(users, email) {
    for (const userName in users) {
        const user = users[userName];
        if (user.adresse === email) {
            console.log("Un compte existe déjà à l'adresse saisie. Merci de choisir une adresse e-mail différente.");
            return false;
        }
    }
    return true;
}

//Permet à l'utilisateur de choisir son types de comptes
var chooseTypeAccount = function() {
    let ended = false;
    while(!ended){
        console.log("1 - Compte étudiant.");
        console.log("2 - Compte enseignant.");
        console.log("3 - Compte gestionnaire.");
        console.log("4 - Retour.");
        const accountType = prompt("Veuillez choisir une option : ");
        switch (accountType) {
            case '1':
                createAccount("étudiant", "de l'");
                ended = true;
                break;
            case '2':
                createAccount("enseignant", "de l'");
                ended = true;
                break;
            case '3':
                createAccount("gestionnaire", "du");
                ended = true;
                break;
            case '4':
                console.log("Votre demande a bien été prise en compte.");
                ended = true;
                break;
            default:
                console.log("Type de compte non reconnu.");
                console.log("#-------------------------------------#");
                break;

        }
    }

}


/*Cree un compte en respectant differentes regles pour obtenir un compte valide
* Cree ensuite une VCard si necessaire et sauvegarde les données de ce nouvelle utilisateur
* param :
* type String : (étudiant/enseignant/gestionnaire)
* determinant String : correspond au determinant présent devant le type
*       * "de l'" pour les étudiants et les enseignants
*       * "du" pour les gestionnaires
*/
function createAccount(type, determinant) {
    const data = fs.readFileSync(pathToComptes, 'utf8');
    const contenuJson = JSON.parse(data);
    const users = contenuJson.users;

    let nom = prompt(`Entrez le nom ${determinant}${type} (lettres uniquement) : `);
    while(!nomValide(nom)){
        nom = prompt(`Nom invalide. Merci de recommencer ou quitter avec EXIT : `);
        if(nom === "EXIT")
        {
            console.log("Vous allez être redirigé vers le menu.");
            return;
        }
    }

    let prenom = prompt(`Entrez le prenom ${determinant}${type} (lettres uniquement) : `);
    while(!prenomValide(prenom)){
        prenom = prompt(`Prenom invalide. Merci de recommencer ou quitter avec EXIT : `);
        if(prenom === "EXIT")
        {
            console.log("Vous allez être redirigé vers le menu.");
            return;
        }
    }

    let adresseMail = prompt(`Entrez l'adresse mail ${determinant}${type} : `);
    while(!emailValide(adresseMail) || !isEmailUnique(users, adresseMail)){
        adresseMail = prompt(`Adresse invalide. Merci de recommencer ou quitter avec EXIT : `);
        if(adresseMail === "EXIT")
        {
            console.log("Vous allez être redirigé vers le menu.");
            return;
        }
    }

    let tel = prompt(`Entrez le tel ${determinant}${type} : `);
    while(!telValide(tel)){
        tel = prompt(`Numéro de téléphone invalide. Merci de recommencer sous la forme : “XX XX XX XX XX” ou quitter avec EXIT : `);
        if(tel === "EXIT")
        {
            console.log("Vous allez être redirigé vers le menu.");
            return;
        }
    }

    let mdp = prompt(`Entrez le mot de passe du compte ${type} : `);
    while(!mdpValide(mdp)){
        console.log("Mot de passe invalide (Minimum 8 caractères dont 1 caractère spécial ou 1 chiffre et au moins 1 majuscule).");
        mdp = prompt(`Merci de recommencer ou quitter avec EXIT : `);
        if(mdp === "EXIT")
        {
            console.log("Vous allez être redirigé vers le menu.");
            return;
        }
    }

    const account = {
        type: type,
        nom: nom,
        prenom: prenom,
        mdp: mdp,
        tel: tel,
        adresse: adresseMail
    };
    if(type !== "étudiant") {
        creationVCard(type,nom,prenom,adresseMail,tel);
    }
    else{
        creerInfoEtudiant(account);
    }
    contenuJson.users.push(account);
    fs.writeFileSync(pathToComptes, JSON.stringify(contenuJson, null, 2));
    console.log(`${type} '${nom}' créé avec succès.`);

}

//chooseTypeAccount();
// Exportation des methodes :
module.exports = {chooseTypeAccount}; // A importer dans le main