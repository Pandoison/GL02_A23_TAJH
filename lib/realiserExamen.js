const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();
const auth = require('./loginLogout');
const etudiantsData = require("../data/infoEtudiant.json");

let examenChoisiDetails;

// fonction principale pour passer un examen
var realiserExam = function(loggedInUser) {
    
    let tempsEcoule = 0;

    const infoEtudiantPath = path.join(__dirname, '..', 'data', 'infoEtudiant.json');

    // Lire le contenu du fichier infoEtudiant.json
    const data = fs.readFileSync(infoEtudiantPath, 'utf8');
    const infoEtudiant = JSON.parse(data);

    // Trouver l'étudiant correspondant à loggedInUser
    const etudiant = infoEtudiant.etudiants.find(etudiant => etudiant.nom === loggedInUser.nom);


    if (etudiant) {
        console.log(`Bienvenue, ${etudiant.prenom} ${etudiant.nom}!`);

        console.log('Voici la liste des examens auxquels vous avez accès :');

        // si l'étudiant n'a aucun examen a passer
        if (etudiant.examens.length === 0) {
            console.log('Aucun examen disponible pour le moment.');
            return
        } else {
            etudiant.examens.forEach((examen, index) => {
                console.log(`[${index + 1}] - ${examen.examNom}`);
            });
        }

        let examenChoisiIndex;
        do {
            const choix = prompt('Entrez le numéro de l\'examen que vous souhaitez réaliser : ');

            // Vérifier si le choix est un nombre et correspond à un index valide
            examenChoisiIndex = parseInt(choix) - 1;
        } while (isNaN(examenChoisiIndex) || examenChoisiIndex < 0 || examenChoisiIndex >= etudiant.examens.length);

        const examenChoisi = etudiant.examens[examenChoisiIndex].examNom;

        console.log(`Vous avez choisi de réaliser l'examen : ${examenChoisi}`);
        const examenFolderPath = path.join(__dirname, '..', 'data', 'Examen');

        // Lire le contenu du dossier
        const files = fs.readdirSync(examenFolderPath);

        // Parcourir les fichiers pour trouver le détail de l'examen choisi
        const examenFileName = examenChoisi;
        if (files.includes(examenFileName)) {
            const filePath = path.join(examenFolderPath, examenFileName);

            // Lire le contenu de l'examen choisi
            const data1 = fs.readFileSync(filePath, 'utf8');
            try {
                examenChoisiDetails = JSON.parse(data1);
                // accès à la durée d'un examen
                console.log(`Durée de l'examen : ${examenChoisiDetails.duree} minutes`);
                let score = 0
                const dureeExamenMinutes = examenChoisiDetails.duree; // en minutes
                const tempsRestant = dureeExamenMinutes * 60  //convertissez en secondes
                let tempsEcoule = 0;

                //demarrerChrono(tempsEcoule,tempsRestant)

                // switch selon le type de questions
                examenChoisiDetails.questions.forEach(question => {
                    const tempsDebutQuestion = new Date();
                    if (tempsEcoule >= tempsRestant) {
                        console.log('Temps écoulé. Fin de l\'examen.');
                        return      // si le temps est dépassé on arrete tout
                    }
                    switch (question.type) {
                        case 'MC':
                            score += afficherQuestionMC(question);
                            break;
                        case 'Essay':
                            score += afficherQuestionEssay(question);
                            break;
                        case 'Matching':
                            score += afficherQuestionMatching(question);
                            break;
                        case 'Short':
                            score += afficherQuestionShort(question);
                            break;
                        case 'Description':
                            afficherQuestionDescription(question);     // le type description n'est pas une question donc pas de score
                            break;
                        default:
                            console.log('Type de question non reconnu.');
                    }
                    const tempsFinQuestion = new Date();
                    const tempsEcouleDepuisDerniereQuestion = (tempsFinQuestion - tempsDebutQuestion) / 1000; // en secondes
                    tempsEcoule += tempsEcouleDepuisDerniereQuestion;       // on recalcule le temps ecoule a la fin de chaque question
                   
                });

setTimeout(() => {
    console.log('Temps imparti écoulé. Fin de l\'examen.');
                // un fois l'examen passé on affiche le score de l'étudiant et on le met dans le fichier infoEtudiant.json
                console.log("Temps écoulé ou examen terminé")
                afficherScoreFinal(score, examenChoisi, etudiant);
                afficherRelecture(examenChoisiDetails);     // on affiche également une relecture
    }, tempsRestant * 1000);




            } catch (jsonErr) {
                console.error(`Erreur lors de la conversion du fichier ${examenFileName} en JSON :`, jsonErr);
            }


        } else {
            console.log(`L'examen ${examenChoisi} n'existe pas ou n'est pas accessible.`);
        }
    }
}

function afficherRelecture(examenDetails) {
    console.log('\nRelecture des questions :\n');

    // on affiche la consigne
    examenDetails.questions.forEach((question, index) => {
        console.log(`[${index + 1}] ${question.consigne}`);

        // on affiche les réponses en fonction du type de question
        switch (question.type) {
            case 'MC':
                console.log('  Réponses possibles :');
                question.reponses.forEach((reponse, i) => {
                    console.log(`    [${i + 1}] ${reponse.text}`);
                });
                console.log(`  Réponse(s) correcte(s) : ${question.reponses.filter(r => r.isCorrect).map((r, i) => `${r.text}`).join(', ')}`);
                break;
            case 'Matching':
                console.log('  Associez les propositions suivantes aux réponses correspondantes :');
                    question.reponses.forEach((pair, i) => {
                        console.log(`    [${i + 1}] ${pair.sousQuestion}`);
                    });
                    console.log('  Réponses associées :');
                    question.reponses.forEach((pair, i) => {
                        console.log(`    [${i + 1}] ${pair.sousReponse}`);
                    });

                break;
            case 'Short':
                console.log('  Réponses correctes :');
                question.reponses.forEach(reponse => {
                    if (reponse.isCorrect) {
                        console.log(`- ${reponse.text}`);
                    }
                });
                break;
            case 'Essay':
                console.log('  (Question de type "Essay", pas de bonne réponse spécifique)');
                break;
        }

        console.log('\n');
    });
}

// fonction qui affiche le score final et qui l'écrit dans le fichier infoEtudiant.json
function afficherScoreFinal(score, examenChoisi, etudiant) {
    if (etudiant) {
        //on charge le contenu actuel du fichier JSON
        const etudiantsData = require('../data/infoEtudiant.json');
        // Trouver l'index de l'étudiant en fonction du nom et prénom de l'étudiant connecté
        const indexEtudiant = etudiantsData.etudiants.findIndex(e =>
            e.nom === etudiant.nom && e.prenom === etudiant.prenom
        );
        if (indexEtudiant !== -1) {
            // Trouver l'index de l'examen en fonction du nom de l'examen
            const examenIndex = etudiantsData.etudiants[indexEtudiant].examens.findIndex(exam =>
                exam.examNom === examenChoisi
            );

            if (examenIndex !== -1) {
                // Mettre à jour la note de l'examen
                etudiantsData.etudiants[indexEtudiant].examens[examenIndex].examNote = `${score}/${examenChoisiDetails.questions.length}`;

                // Réécrire le fichier avec la nouvelle note
                fs.writeFileSync(__dirname + '/../data/infoEtudiant.json', JSON.stringify(etudiantsData, null, 2));

                console.log(`Vous avez obtenu : ${etudiantsData.etudiants[indexEtudiant].examens[examenIndex].examNote}`);
            } else {
                console.log("Examen non trouvé pour l'étudiant spécifié.");
            }
        } else {
            console.log("Étudiant non trouvé.");
        }
    } else {
        console.log("Étudiant non trouvé.");
    }
}

// fonction qui affiche et traite les questions de type MC (multiple choice)
function afficherQuestionMC(question) {
    console.log('------------------ Questions : ------------------------')

    // on affiche la consigne
    console.log(`- ${question.consigne}`);

    // Afficher toutes les réponses avec des numéros
    question.reponses.forEach((reponse, index) => {
        console.log(`${index + 1}. ${reponse.text}`);
    });

    let choixUtilisateur;

    // Demander à l'utilisateur de choisir une réponse jusqu'à ce qu'une réponse valide soit donnée
    do {
        choixUtilisateur = prompt('Choisissez le numéro de la réponse : ');

        // Vérifier si l'entrée de l'utilisateur est un nombre valide et correspond à une réponse existante
        if (isNaN(choixUtilisateur) || choixUtilisateur < 1 || choixUtilisateur > question.reponses.length) {
            console.log('Veuillez entrer un numéro de réponse valide.');
        }

    } while (isNaN(choixUtilisateur) || choixUtilisateur < 1 || choixUtilisateur > question.reponses.length);

    const reponseChoisie = question.reponses[choixUtilisateur - 1];

    // Vérifier si la réponse choisie est correcte
    if (reponseChoisie.isCorrect) {
        console.log(`Bonne réponse ! Réponse ${choixUtilisateur}`);
        return 1;    // return 1 point
    } else {
        console.log(`Mauvaise réponse. La réponse correcte est : Réponse ${question.reponses.findIndex(reponse => reponse.isCorrect) + 1}`);
        question.reponses.forEach(reponse => {
            if (reponse.isCorrect) {
                console.log(`- ${reponse.text}`);
            }
        });
        return 0;    // return 0 point
    }
}


// fonction qui affiche et traite les questions de type essay
function afficherQuestionEssay(question) {
    console.log('------------------ Questions : ------------------------')

    // on affiche la consigne et l'indication
    console.log(`- ${question.consigne}`);
    console.log(`- ${question.indication}`);

    let reponseEleve = prompt('Votre réponse (doit contenir au moins 20 lettres) : ');

    // Demandez à l'élève de réessayer jusqu'à ce que la réponse soit d'au moins 20 lettres
    while (reponseEleve.length < 20) {
        console.log('Votre réponse doit contenir au moins 20 lettres. Réessayez.');
        reponseEleve = prompt('Votre réponse : ');
    }

    console.log('Réponse enregistrée !');
    return 1;   // return toujours 1 point
}


// fonction qui affiche et traite les questions de type matching
function afficherQuestionMatching(question) {
    console.log('------------------ Questions : ------------------------')
    console.log(`ID: ${question.id}`);
    console.log(`Consigne: ${question.consigne}`);
    console.log(`Indication: ${question.indication}`);
    console.log(`Type: ${question.type}`);
    console.log(`\nConsidérez les propositions suivantes et associez-les aux réponses correspondantes :\n`);

    // on affiche toutes les sous questions
    question.reponses.forEach((pair, index) => {
        console.log(`${index + 1}. ${pair.sousQuestion}`);
    });

    // on affiche toutes les sous réponses
    console.log('\nRéponses :');
    question.reponses.forEach((pair, index) => {
        console.log(`${index + 1}. ${pair.sousReponse}`);
    });

    const choixUtilisateur = [];

    // Demandez à l'utilisateur de fournir des paires pour chaque sous-question
    for (let i = 0; i < question.reponses.length; i++) {
        let choixUtilisateurSousQuestion;
        let choixUtilisateurSousReponse;

        // Continuer à demander jusqu'à ce que l'utilisateur fournisse un nombre valide
        while (true) {
            choixUtilisateurSousQuestion = prompt(`Choisissez le numéro de la sous-question ${i + 1} : `);
            choixUtilisateurSousReponse = prompt(`Choisissez le numéro de la sous-réponse ${i + 1} : `);

            // Valider les choix de l'utilisateur
            if (
                choixUtilisateurSousQuestion >= 1 &&
                choixUtilisateurSousQuestion <= question.reponses.length &&
                choixUtilisateurSousReponse >= 1 &&
                choixUtilisateurSousReponse <= question.reponses.length
            ) {
                break; // Sortir de la boucle si les choix sont valides
            } else {
                console.log("Choix invalide. Veuillez choisir un numéro valide.");
            }
        }

        const indexChoixUtilisateurSousQuestion = choixUtilisateurSousQuestion - 1;
        const indexChoixUtilisateurSousReponse = choixUtilisateurSousReponse - 1;

        const sousQuestionChoisie = question.reponses[indexChoixUtilisateurSousQuestion].sousQuestion;
        const sousReponseCorrespondante = question.reponses[indexChoixUtilisateurSousReponse].sousReponse;

        choixUtilisateur.push({
            sousQuestion: sousQuestionChoisie,
            sousReponse: sousReponseCorrespondante
        });
    }

    // Valider les réponses de l'utilisateur
    let toutesLesReponsesCorrectes = true;
    for (let i = 0; i < choixUtilisateur.length; i++) {
        if (choixUtilisateur[i].sousReponse !== question.reponses[i].sousReponse) {
            toutesLesReponsesCorrectes = false;
            console.log(`Incorrect pour la paire ${i + 1}. La réponse correcte était : ${question.reponses[i].sousReponse}`);
            return 0
        }
    }

    if (toutesLesReponsesCorrectes) {
        console.log("Toutes les réponses sont correctes !");
        return 1
    }
}

//fonction qui affiche les questions de type short
function afficherQuestionShort(question) {
    console.log('------------------ Questions : ------------------------')

    // on affiche la consigne et l'indication
    console.log(`- ${question.consigne}`);
    console.log(`- ${question.indication}`);
    const reponseEleve = prompt('Votre réponse : ');

    const isCorrect = verifierReponseShort(question, reponseEleve);
    if (isCorrect) {
        console.log('Bonne réponse !');
        return 1;
    } else {
        console.log('Mauvaise réponse. La réponse correcte est :');
        question.reponses.forEach(reponse => {
            if (reponse.isCorrect) {
                console.log(`- ${reponse.text}`);
            }
        });
        return 0;
    }
}
// fonction qui affiche les description entre les questions
function afficherQuestionDescription(question) {
    console.log(`- ${question.consigne}`);
    console.log(`- ${question.indication}`);
}

// fonction qui traite les réponses des questions de type short
function verifierReponseShort(question, reponseEleve) {
    if (!reponseEleve || reponseEleve.trim() === '') {
        return false; // L'élève n'a pas répondu à la question
    }
    return question.reponses.some(reponse => reponse.text.toLowerCase() === reponseEleve.toLowerCase());
}

module.exports = realiserExam;
