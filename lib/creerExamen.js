const fs = require('fs');
const prompt = require('prompt-sync')();

function creerExam(){

    //charger kes comptes étudiants
    const datacomptes = fs.readFileSync('comptes.json');
    const comptes = JSON.parse(datacomptes);

    //charger les questions
    //const questions = fs.readFileSync('../data/question.js');
    //const questions = JSON.parse(dataquestions);

    //demander la matiere de l'examen
    const matiere = prompt("Entrez le code de la matière pour laquelle vous désirez créer un examen: ");

    //questions associées à ce cours : 
    const toutesquestions = parserGift.generateQuestion();
    //vérifier les codes d'ue, et insérer les questions des fichiers des bonnes ue dans une liste 

    const questions = []

    //afficher les questions associées au cours
    console.log(`Voici la liste de questions possibles associés au cours ${matiere}$ `);
    questions.forEach((question, index) => {
        console.log(`${index + 1}. ${question}`);
    });
    
    //nombre de questions de l'examen
    let numQuestions;
    do {
      numQuestions = parseInt(prompt('Entrez le nombre de questions (entre 15 et 20) : '),10);
    } while (isNaN(numQuestions) || numQuestions < 15 || numQuestions > 20);


    // Initialiser la liste des questions de l'examen
    const examQuestions = [];

    // Demander les identifiants des questions
    for (let i = 0; i < numQuestions; i++) {
        const questionIndex = parseInt(prompt(`Entrez le numéro de la question ${i + 1} : `), 10);
    
        // Vérifier que l'index est valide
        if (questionIndex >= 1 && questionIndex <= questions.length) {
            const selectedQuestion = questions[questionIndex - 1];
            examQuestions.push(selectedQuestion.id);
        } else {
            console.log('Numéro de question invalide. Réessayez.');
            i--; // Décrémenter i pour redemander la même question
        }
    }

    //durée de l'examen
    const temps = prompt("Entrez la durée de l'examen (en minutes): ");

    //Nom de l'examen
    const nom_exam = prompt("Entrez le nom que portera votre examen: ");
    
     // Créer le fichier GIFT
     const giftContent = `::${nom_exam}::[${matiere}]\n\n`;
     examQuestions.forEach((question, index) => {
         giftContent += `::Q${index + 1}:: ${question.texte}\n`;
     });
     giftContent += `\n::DUREE:: ${temps} minutes\n`;
 
     // Écrire dans le fichier
     const filename = `${matiere}_${nom_exam}_examen.gift`;
     fs.writeFileSync(filename, giftContent, 'utf8');
 
     console.log(`L'examen a été créé avec succès. Les données ont été enregistrées dans le fichier "${filename}".`);
}



creerExam();
