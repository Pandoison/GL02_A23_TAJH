//Importation des modules necessaires
const fs = require('fs');
const prompt = require('prompt-sync')();
const VCardcreator = require('./genererVCard')

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
            console.log("L'adresse mail existe déjà. Merci de choisir une adresse e-mail différente.");
            return false;
        }
    }
    return true;
}

/*Cree un compte en respectant differentes regles pour obtenir un compte valide
* Cree ensuite une VCard si necessaire et sauvegarde les données de ce nouvelle utilisateur
* param :
* type String : (étudiant/enseignant/gestionnaire)
*/
var createAccount = function(type) {
    //Determinant pour l'affichage etudiant/enseignant/gestionnaire
    let determinant = "de l'";
    if ( type === "gestionnaire")
    {
        determinant = "du ";
    }

    const data = fs.readFileSync('comptes.json', 'utf8');
    const contenuJson = JSON.parse(data);
    const users = contenuJson.users;

    let nom = prompt(`Entrez le nom ${determinant}${type} (lettres uniquement) : `);
    while(!nomValide(nom)){
        nom = prompt(`Nom invalide. Merci de recommencer : `);
    }

    let prenom = prompt(`Entrez le prenom ${determinant}${type} (lettres uniquement) : `);
    while(!prenomValide(prenom)){
        prenom = prompt(`Prenom invalide. Merci de recommencer : `);
    }

    let adresseMail = prompt(`Entrez l'adresse mail ${determinant}${type} : `);
    while(!emailValide(adresseMail) || !isEmailUnique(users, adresseMail)){
        adresseMail = prompt(`Adresse invalide. Merci de recommencer : `);
    }

    let tel = prompt(`Entrez le tel ${determinant}${type} : `);
    while(!telValide(tel)){
        tel = prompt(`Numéro de téléphone invalide. Merci de recommencer sous la forme : “XX XX XX XX XX” : `);
    }

    let mdp = prompt(`Entrez le mot de passe du compte ${type} : `);
    while(!mdpValide(mdp)){
        mdp = prompt(`Mot de passe invalide (Minimum 8 caractères dont 1 caractère spécial ou 1 chiffre et au moins 1 majuscule). Merci de recommencer : `);
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
        VCardcreator(type,nom,prenom,adresseMail,tel);
    }
    contenuJson.users.push(account);
    fs.writeFileSync('comptes.json', JSON.stringify(contenuJson, null, 2));
    console.log(`${type} '${nom}' créé avec succès.`);

}

/*Sauvegarde le compte
* Inutilisé ?
*/
function saveAccount(account) {
    try {
        let accounts = [];

        if (fs.existsSync('comptes.json')) {
            const data = fs.readFileSync('comptes.json', 'utf8');

            try {
                // Essayez de parser le contenu du fichier
                accounts = JSON.parse(data);

            } catch (parseError) {
                // Si la lecture du fichier échoue, initialisez accounts avec un tableau vide
                accounts = [];
            }
        }

        accounts.users.push(account);
        fs.writeFileSync('comptes.json', JSON.stringify(accounts, null, 2));
        console.log(`${account.type} créé avec succès.`);

    } catch (err) {
        console.error(err);
    }
}

// Lance la creation de compte en demandant à l'utilisateur d'entrer un type
const accountType = prompt('Quel type de compte voulez-vous créer ? (étudiant/enseignant/gestionnaire) : ');

switch (accountType.toLowerCase()) {
    case 'étudiant':
    case 'enseignant':
    case 'gestionnaire':
        createAccount(accountType);
        break;
    default:
        console.log('Type de compte non reconnu.');
}

// Exportation des methodes :
module.exports = createAccount; // A importer dans le main