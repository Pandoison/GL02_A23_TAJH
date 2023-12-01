//Importation des modules necessaires
var vCardsJS = require('vcards-js');
const prompt = require('prompt-sync')();
const pathToContact = '../data/Contact';

/*Cree une VCard et la stocke dans un fichier
* param  :
* type String : (étudiant/enseignant/gestionnaire)
* nom String
* prenom String
* email String : ...@..
* tel String : XX-XX-XX-XX-XX (X un chiffre)
*/
var creationVCard = function(type, nom, prenom, email, tel){
    var vCard = vCardsJS();
    vCard.type = type;
    vCard.prenom = prenom;
    vCard.nom = nom;
    vCard.email = email;
    vCard.tel = tel;
    vCard.saveToFile(`${pathToContact}/${nom}_${prenom}.vcf`);
    console.log('VCard créee avec succès !')
}



/*Verifie si les données de l'utilisateur sont correcte afin de lui creer un VCard
* fonction appele dans le cas ou un compte est creer mais n'a pas de VCard,
* Accessible à l'aide d'une option dans le main, l'option s'affiche uniquement si la VCard n'existe pas encore
* param  :
* type String : (etudiant/enseignant/gestionnaire)
* nom String
* prenom String
* email String : ...@...(com/fr)
* tel String : XX-XX-XX-XX-XX (X un chiffre)
*/

var verifCreationVCard = function(type, nom, prenom, email, tel) {
    console.log(`Type : ${type}\nNom : ${nom}\nPrenom : ${prenom}\nEmail : ${email}\nTel : ${tel}`)
    let verifDonnees = prompt('Les données correspondent-elles ? (Y)/(N) : ')
    switch (verifDonnees){
        case 'Y':
            generationVCard(type,nom,prenom,email,tel);
            break;
        case 'N':
            break;
        default:
            console.log('Réponse inconnue.');
}

}

// Exportation des methodes :
module.exports = creationVCard; // A Importer dans creerCompte
module.exports = verifCreationVCard; // A Importer dans le main