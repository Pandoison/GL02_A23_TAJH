var vCardsJS = require('vcards-js');
const prompt = require('prompt-sync')();

let type = "test";
let prenom = "test";
let nom = "test";
let email = "test";
let tel = "test";

function creationVCard(type, nom, prenom, email, tel){
    var vCard = vCardsJS();
    vCard.type = type;
    vCard.prenom = prenom;
    vCard.nom = nom;
    vCard.email = email;
    vCard.tel = tel;
    vCard.saveToFile(`./Contact/${nom}_${prenom}.vcf`);
    console.log('VCard créee avec succès !')
}


console.log(`Type : ${type}\nNom : ${nom}\nPrenom : ${prenom}\nEmail : ${email}\nTel : ${tel}`)
let verifDonnees = prompt('Les données correspondent-elles ? (y)/(n) : ')
switch (verifDonnees){
    case 'y':
        creationVCard(type,nom,prenom,email,tel);
        break;
    case 'n':
        break;
    default:
        console.log('Réponse inconnue.');
}

