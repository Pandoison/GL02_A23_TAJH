const fs = require('fs');
const path = require('path');
const prompt = require('prompt-sync')();
const auth = require('./loginLogout');

let examenChoisiDetails;

// Obtenez le nom de l'utilisateur connecté en utilisant la fonction login du module auth
const loggedInUser = auth.login();

// Vérifiez si l'utilisateur est connecté
if (loggedInUser) {
    const infoEtudiantPath = path.join(__dirname, '..', 'data', 'infoEtudiant.json');

    // Lire le contenu du fichier infoEtudiant.json
    fs.readFile(infoEtudiantPath, 'utf8', (err, data) => {
        if (err) {
            console.error('Erreur lors de la lecture du fichier infoEtudiant.json :', err);
            return;
        }

        try {
            const infoEtudiant = JSON.parse(data);

            // Trouver l'étudiant correspondant à loggedInUser
            const etudiant = infoEtudiant.etudiants.find(etudiant => etudiant.nom === loggedInUser);

            if (etudiant) {
                console.log(`Bienvenue, ${etudiant.prenom} ${etudiant.nom}!`);
                console.log('Voici la liste des examens auxquels vous avez accès :');

                etudiant.examens.forEach((examen, index) => {
                    console.log(`[${index + 1}] - ${examen.examNom}`);
                });

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
                fs.readdir(examenFolderPath, (err, files) => {
                    if (err) {
                        console.error('Erreur lors de la lecture du dossier Examen :', err);
                        return;
                    }

                    // Parcourir les fichiers pour trouver le détail de l'examen choisi
                    const examenFileName = examenChoisi;
                    if (files.includes(examenFileName)) {
                        const filePath = path.join(examenFolderPath, examenFileName);

                        // Lire le contenu de l'examen choisi
                        fs.readFile(filePath, 'utf8', (err, data) => {
                            if (err) {
                                console.error(`Erreur lors de la lecture du fichier ${examenFileName} :`, err);
                                return;
                            }


                            try {
                                examenChoisiDetails = JSON.parse(data);
                                // accès à la durée d'un examen
                                console.log(`Durée de l'examen : ${examenChoisiDetails.duree} minutes`);
                                let score = 0
                               // const tempsRestant = examenChoisiDetails.examen.duree; // en minutes
                                //let tempsEcoule = 0;

                                //demarrerChrono(tempsEcoule,tempsRestant)

                                console.log('Questions :');

                                 examenChoisiDetails.questions.forEach(question => {
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
                                     afficherQuestionDescription(question);
                                     break;
                                 default:
                                 console.log('Type de question non reconnu.');
                                 }
                                 });
                                 afficherScoreFinal(score,examenChoisi,etudiant);


                            } catch (jsonErr) {
                                console.error(`Erreur lors de la conversion du fichier ${examenFileName} en JSON :`, jsonErr);
                            }




                        });
                    } else {
                        console.log(`L'examen ${examenChoisi} n'existe pas ou n'est pas accessible.`);
                    }
                });
            } else {
                console.log(`Aucune information trouvée pour l'étudiant ${loggedInUser}.`);
            }
        } catch (jsonErr) {
            console.error('Erreur lors de la conversion du fichier infoEtudiant.json en JSON :', jsonErr);
        }
    });
} else {
    console.log('Utilisateur non connecté. Connectez-vous d\'abord.');
}


function afficherScoreFinal(score, examenChoisi, etudiant) {
    if (etudiant) {
        // Charger le contenu actuel du fichier JSON
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
                fs.writeFileSync('../data/infoEtudiant.json', JSON.stringify(etudiantsData, null, 2));

                console.log(`Note de l'élève mise à jour : ${etudiantsData.etudiants[indexEtudiant].examens[examenIndex].examNote}`);
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

function demarrerChrono(tempsE,tempsR) {
    let timer = setInterval(() => {
        tempsE++;

        // Vérifiez si le temps imparti est écoulé
        if (tempsE >= tempsR) {
            clearInterval(timer);
            console.log('Temps écoulé. Vous ne pouvez plus répondre à de nouvelles questions.');
        }
    }, 60000); // Mettez à jour toutes les 60 secondes (1 minute)
}
function afficherQuestionMC(question) {
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
        return 1;
    } else {
        console.log(`Mauvaise réponse. La réponse correcte est : Réponse ${question.reponses.findIndex(reponse => reponse.isCorrect) + 1}`);
        question.reponses.forEach(reponse => {
            if (reponse.isCorrect) {
                console.log(`- ${reponse.text}`);
            }
        });
        return 0;
    }
}



function afficherQuestionEssay(question) {
    console.log(`- ${question.consigne}`);
    console.log(`- ${question.indication}`);

    let reponseEleve = prompt('Votre réponse (doit contenir au moins 20 lettres) : ');

    // Demandez à l'élève de réessayer jusqu'à ce que la réponse soit d'au moins 20 lettres
    while (reponseEleve.length < 20) {
        console.log('Votre réponse doit contenir au moins 20 lettres. Réessayez.');
        reponseEleve = prompt('Votre réponse : ');
    }

    console.log('Réponse enregistrée !');
    return 1;
}



function afficherQuestionMatching(question) {
    console.log(`- ${question.consigne}`);
    question.reponses.forEach((reponse, index) => {
        console.log(`${index + 1}. ${reponse.texte}`);
    });
    return 1;
}

function afficherQuestionShort(question) {
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


function afficherQuestionDescription(question) {
    console.log(`- ${question.consigne}`);
    console.log(`- ${question.indication}`);
}

function verifierReponseShort(question, reponseEleve) {
    if (!reponseEleve || reponseEleve.trim() === '') {
        return false; // L'élève n'a pas répondu à la question
    }
    return question.reponses.some(reponse => reponse.text.toLowerCase() === reponseEleve.toLowerCase());
}




