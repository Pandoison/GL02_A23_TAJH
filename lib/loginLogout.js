const fs = require('fs');
const prompt = require('prompt-sync')();

function login() {
    let loggedIn = false;

    while (!loggedIn) {
        const email = prompt('Entrez votre adresse mail (ou tapez "exit" pour quitter) : ');

        // Check if the user wants to exit
        if (email.toLowerCase() === 'exit') {
            console.log('Vous avez choisi de quitter.');
            break;
        }

        const mdp = prompt('Entrez votre mot de passe : ');

        const data = fs.readFileSync('comptes.json', 'utf8');
        const contenuJson = JSON.parse(data);
        const users = contenuJson.users;
        // Check if there is a match with the provided email and password
        for (const user of users) {
            if (user.adresse === email && user.mdp === mdp) {
                console.log('Login successful!');
                loggedIn = true;
                break;
            }
        }

        if (!loggedIn) {
            console.log('Email ou mot de passe incorrect. Veuillez réessayer.');
        }
    }
}

function logout(){
    console.log("Vous êtes bien déconnecté");
    login();
}

login();
