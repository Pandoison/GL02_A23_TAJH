// créer objet personne et le convertir en json
const fs = require('fs');
const prompt = require('prompt-sync')();

function nomValide(nom){
    const caractereAutorise = /^[a-zA-Z]+$/;
    return caractereAutorise.test(nom);
}
function isEmailUnique(users, email) {
    for (const userName in users) {
        const user = users[userName];
        if (user.adresse === email) {
            console.log("L'adresse mail existe déjà.");
            return false;
        }
    }
    return true;
}

function createAccount(type) {
    let nom;
    do{
        nom = prompt(`Entrez le nom de l'${type} (lettres uniquement) : `);
    }while(!nomValide(nom));

    const mdp = prompt(`Entrez le mot de passe du compte'${type} : `);
    const tel = prompt(`Entrez le tel de l' ${type} : `);
    const adresseMail = prompt(`Entrez l'adresse mail de l' ${type} : `);


    const data = fs.readFileSync('comptes.json', 'utf8');
    const contenuJson = JSON.parse(data);
    const users = contenuJson.users;
    if (isEmailUnique(users, adresseMail)) {
        const account = {
            type: type,
            nom: nom,
            mdp: mdp,
            tel: tel,
            adresse: adresseMail
        };

        contenuJson.users.push(account);

        fs.writeFileSync('comptes.json', JSON.stringify(contenuJson, null, 2));
        console.log(`${type} '${nom}' créé avec succès.`);
    }



}


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