const fs = require('fs');
const prompt = require('prompt-sync')();
const pathToExamen = "../data/Examen";
const pathToUser = "./comptes.json";
const pathToInfoEtu = "../data/infoEtudiant.json";


function recupererExamens(){
    let examList = [];
    const files = fs.readdirSync(`${pathToExamen}`)
    files.forEach(file => {
        examList.push(file);
    })
    return examList;
}
function affichageExamen(examList){
    console.log("Voici les differentes examens disponibles : ")
    let i = 0;
    examList.forEach(exam => {
        console.log(i + " - " + exam);
        i++;
    })
}

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

function recupererEtudiants(){
    let etudiantList = [];
    const dataUser = fs.readFileSync(pathToUser, 'utf8');
    const contenuJson = JSON.parse(dataUser);
    const users = contenuJson.users;
    users.forEach(user => {
        if(user.type === "étudiant") {
            etudiantList.push(user);
        }
    })
    return etudiantList
}

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

function choixEtudiant(){
    let indexEtudiant = 0;
    let participantList = [];
    let etudiantList = recupererEtudiants();
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

function estInscrit(participantList, nouvelInscrit){
    let bool = false;
    if (participantList.length === 0){
        return false;
    }
    participantList.forEach(participant => {
        if(participant.adresse === nouvelInscrit.adresse){
            bool = true;
        }
    })
    return bool;
}


function possedeInfoEtudiant(users,etudiant){
    let bool = false;
    users.forEach(user => {
        if(user.adresse === etudiant.adresse){
            bool = true;
        }
    })
    return bool;
}

function creerInfoEtudiant(users,contenuJson,etudiant){
    const info = {
        nom : etudiant.nom,
        prenom : etudiant.prenom,
        adresse : etudiant.adresse,
        examens : [

        ]
    };
    users.push(info);
    fs.writeFileSync(pathToInfoEtu, JSON.stringify(contenuJson, null, 2));
    console.log(`Espace étudiant créé avec succès.`);
}

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
    return bool
}
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

function assignerExam(){
    const exam = choixExamen();
    const participantList = choixEtudiant();
    const data = fs.readFileSync(pathToInfoEtu, 'utf8');
    const contenuJson = JSON.parse(data);
    const users = contenuJson.etudiants;
    participantList.forEach(participant => {
        if(!possedeInfoEtudiant(users,participant)){
            creerInfoEtudiant(users, contenuJson, participant)
        }
        if(!possedeExamen(users, exam, participant)){
            ajouterExamen(users, contenuJson, exam, participant);
        }
        //notify mail
    })

}

assignerExam();

