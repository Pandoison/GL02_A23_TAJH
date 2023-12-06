//Importation des modules necessaires
const fs = require('fs');
const prompt = require('prompt-sync')();
const pathToExamen = __dirname + "/../data/Examen";
const pathToUser = __dirname + "/comptes.json";
const pathToInfoEtu = __dirname + "/../data/infoEtudiant.json";
const {creerInfoEtudiant, possedeInfoEtudiant} = require('./gestionTableauBord')

/*Recupere la liste des examen
* return : 
* -examList : List des examens
*/
function recupererExamens(){
    let examList = [];
    const files = fs.readdirSync(pathToExamen);
    files.forEach(file => {
        examList.push(file);
    })
    return examList;
}

/*Affiche la liste des examens
* param : 
* -examList : Liste des examens
*/
function affichageExamen(examList){
    console.log("Voici les differents examens disponibles : ")
    let i = 0;
    examList.forEach(exam => {
        console.log(i + " - " + exam);
        i++;
    })
}

/*Permet à l'utilisateur de choisir un examen disponible
* return :
* -examen : examen choisi
*/
function choixExamen(){
    let indexExamen;
    let examen;
    let examList = recupererExamens();
    do {
        affichageExamen(examList);
        indexExamen = parseInt(prompt("Choisissez un examen : "));
    }
    while(isNaN(indexExamen) || indexExamen >= examList.length);
    examen = examList[indexExamen];
    console.log("Vous avez choisi l'examen " + examen);
    return examen;
}

/*Permet de recuperer tout les étudiants present dans le document 'comptes.json'
* return :
* -etudiantList : Liste des étudiants
*/
function recupererEtudiants(){
    let etudiantList = [];
    const dataUser = fs.readFileSync(pathToUser, 'utf8');
    const contenuJson = JSON.parse(dataUser);
    const users = contenuJson.users;
    users.forEach(user => {     // verifie si cest bien un étudiant
        if(user.type === "étudiant") {
            etudiantList.push(user);
        }
    })
    return etudiantList
}

/*Permet d'afficher les etudiants succeptibles de participer a un examen
* Les eleves participant deja a l'examen ne sont pas affiché
* param :
* -etudiantList : Liste des etudiants
* -participantList : Liste des etudiants participant deja a l'examen, vide par defaut
*/
function affichageEtudiant(etudiantList, participantList = []){
    console.log("Voici les eleves succeptibles de participer à l'examen : ")
    let i = 0;
    etudiantList.forEach(etudiant => {
        if(!estInscrit(participantList, etudiant)) {
            console.log(i + " - " + etudiant.nom + " " + etudiant.prenom);
            i++;
        }
    })
}

/*Permet à l'utilisateur de choisir un etudiant pour l'ajouter un examen
* return :
* -participantList : Liste des etudiants participants a l'examen 
*/
function choixEtudiant(){
    let indexEtudiant = 0;
    let participantList = [];
    let etudiantList = recupererEtudiants();        // on recupère la liste
    while(isNaN(indexEtudiant) ||  (indexEtudiant !== etudiantList.length && etudiantList.length !== 0)) {
        affichageEtudiant(etudiantList, participantList);
        console.log(etudiantList.length + " - " + "Fin de selection");
        indexEtudiant = parseInt(prompt("Choisissez un étudiant a ajouté à l'examen : "));
        if(indexEtudiant < etudiantList.length){
            participantList.push(etudiantList[indexEtudiant]);
            console.log(etudiantList[indexEtudiant].nom + " " + etudiantList[indexEtudiant].prenom + " a été ajouté a l'examen.");
            etudiantList.splice(indexEtudiant,1);
            indexEtudiant = 0;
        }
        else if(indexEtudiant === etudiantList.length){
            console.log("La sélection prend fini.");
        }
        else {
            console.log("Réponse inconnue.");
        }

    }
    return participantList;
}

/*Permet de verifier si un etudiant est deja inscrit a un examen
* param :
* -participantList : Liste des etudiants participants a l'examen 
* -nouvelInscrit : etudiant
* return :
* -inscrit boolean : true si l'eleve participe deja a l'examen, false sinon
*/
function estInscrit(participantList, nouvelInscrit){
    let inscrit = false;
    if (participantList.length === 0){
        return inscrit;
    }
    participantList.forEach(participant => {
        if(participant.adresse === nouvelInscrit.adresse){
            inscrit = true;
        }
    })
    return inscrit;
}

/*Permet de verifié si un etudiant possede un examen dans son tableau de bord
* param :
* -users : comporte l'ensemble des etudiants et leurs informations (doc originaire de 'infoEtudiant.json')
* -exam : comporte un examen et ses informations
* -etudiant : comporte un etudiant et ses informations (doc originaire de 'infoEtudiant.json')
* return :
* -bool boolean : true si l'examen est dans le tableau de bord de l'etudiant, false sinon
*/
function possedeExamen(users, exam, etudiant){
    let bool = false;
    users.forEach(user => {
        if(user.adresse === etudiant.adresse){
            user.examens.forEach(userExam => {
                if(exam === userExam.examNom)
                {
                    bool = true;
                }
            })
        }
    })
    return bool;
}

/*Permet d'ajouter un examen au tableau de bord d'un etudiant
* param :
* -users : comporte l'ensemble des etudiants et leurs informations (doc originaire de 'infoEtudiant.json')
* -contenuJson : nous permet d'ecrire des informations sur 'infoEtudiant.json'
* -exam : comporte un examen et ses informations
* -etudiant : comporte un etudiant et ses informations (doc originaire de 'infoEtudiant.json')
*/
function ajouterExamen(users, contenuJson, exam, etudiant){
    const examInfo = {
        examNom : exam,
        examPath : pathToExamen+"/"+exam,
        examNote : ""
    };
    users.forEach(user => {
        if(user.adresse === etudiant.adresse){
            user.examens.push(examInfo);
            fs.writeFileSync(pathToInfoEtu, JSON.stringify(contenuJson, null, 2));
            console.log(`Examen ajouté avec succès.`);
        }
    })
}

//Permet d'assigner un examen à des eleves
var assignerExam = function(){
    const exam = choixExamen();
    const participantList = choixEtudiant();
    const data = fs.readFileSync(pathToInfoEtu, 'utf8');
    const contenuJson = JSON.parse(data);
    const users = contenuJson.etudiants;
    participantList.forEach(participant => {
        if(!possedeInfoEtudiant(participant)){
            creerInfoEtudiant(users, contenuJson, participant)
        }
        if(!possedeExamen(users, exam, participant)){
            ajouterExamen(users, contenuJson, exam, participant);
        }
        //notify mail
    })
}

// Exportation des methodes :
module.exports = assignerExam;

