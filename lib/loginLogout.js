// authentification.js
const fs = require('fs');
const prompt = require('prompt-sync')();
const pathToComptes = __dirname + "/comptes.json";

function login() {
    let loggedInUser = null;

    while (!loggedInUser) {
        const email = prompt('Entrez votre adresse mail (ou tapez "exit" pour quitter) : ');

        // Check if the user wants to exit
        if (email.toLowerCase() === 'exit') {
            console.log('Vous avez choisi de quitter.');
            break;
        }

        const mdp = prompt('Entrez votre mot de passe : ');

        const data = fs.readFileSync(pathToComptes, 'utf8');
        const contenuJson = JSON.parse(data);
        const users = contenuJson.users;
        // Check if there is a match with the provided email and password
        for (const user of users) {
            if (user.adresse === email && user.mdp === mdp) {
                console.log('Vous êtes bien connecté !');
                loggedInUser = user; // Stockez les donnees de la personne connectée
                break;
            }
        }

        if (!loggedInUser) {
            console.log('Email ou mot de passe incorrect. Veuillez réessayer.');
        }
    }

    return loggedInUser;
}

function logout() {
    console.log("Vous êtes bien déconnecté");
}

module.exports = { login, logout };
