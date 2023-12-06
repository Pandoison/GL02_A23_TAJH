const fs = require("fs");
const pathToInfoEtu = __dirname + "/../data/infoEtudiant.json";

var creerInfoEtudiant = function(etudiant){
    const data = fs.readFileSync(pathToInfoEtu, 'utf8');
    const contenuJson = JSON.parse(data);
    const users = contenuJson.etudiants;
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
    return info;
}

var possedeInfoEtudiant = function(etudiant){
    let bool = false;
    const data = fs.readFileSync(pathToInfoEtu, 'utf8');
    const contenuJson = JSON.parse(data);
    const users = contenuJson.etudiants;
    users.forEach(user => {
        if(user.adresse === etudiant.adresse){
            bool = true;
        }
    })
    return bool;
}

function recupererInfoEtu(etudiant){
    let infoEtu = null;
    const data = fs.readFileSync(pathToInfoEtu, 'utf8');
    const contenuJson = JSON.parse(data);
    const users = contenuJson.etudiants;
    users.forEach(user => {
        if(user.adresse === etudiant.adresse)
        {
            infoEtu = user;
        }
    })
    if(infoEtu === null){
        infoEtu = creerInfoEtudiant(etudiant);
    }
    return infoEtu;
}
var afficherInfoEtudiant = function(etudiantInfo){
    console.log("Nom : " + etudiantInfo.nom);
    console.log("Prenom : " + etudiantInfo.prenom);
    if(etudiantInfo.examens.length === 0){
        console.log("Pas d'examen à venir");
    }
    else{
        console.log("Examen :");
        etudiantInfo.examens.forEach(exam => {
            if (exam.examNote !== ""){
                console.log(exam.examNom + " - Terminé - " + exam.examNote);
            }
            else{
                console.log(exam.examNom + " - Non terminé");
            }
        })
    }



}

module.exports = {creerInfoEtudiant, possedeInfoEtudiant, recupererInfoEtu, afficherInfoEtudiant};


