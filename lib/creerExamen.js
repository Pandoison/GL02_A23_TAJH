const fs = require('fs');
const prompt = require('prompt-sync')();
const parser = require('./parserGift');
const path = require('path');

function creerExam(){

    //charger kes comptes étudiants
    const datacomptes = fs.readFileSync('comptes.json');
    const comptes = JSON.parse(datacomptes);

    //demander la matiere de l'examen
    const matiere = prompt("Entrez le code de la matière pour laquelle vous désirez créer un examen: ");

    //questions associées à ce cours : 
    const toutesquestions = parser.generateQuestion();

    //vérifier les codes d'ue, et insérer les questions des fichiers des bonnes ue dans une liste 

    const questions = []
    for(let i=0; i<toutesquestions.length;i++){
        let quest = toutesquestions[i].id;
        if(quest.includes(matiere)){
            questions.push(toutesquestions[i]);
        }
    }


    //afficher les questions associées au cours
    console.log(`Voici la liste de questions possibles associés au cours ${matiere} `);
    console.log(questions);
    
    //nombre de questions de l'examen
    let numQuestions;
    do {
      numQuestions = parseInt(prompt('Entrez le nombre de questions (entre 15 et 20) : '),10);
    } while (isNaN(numQuestions) || numQuestions < 15 || numQuestions > 20);


    // Initialiser la liste des questions de l'examen
    const examQuestions = [];

    // Demander les identifiants des questions
    for (let i = 0; i < numQuestions; i++) {
        const selectedQuestion = prompt(`Entrez l'identifiant de la question ${i + 1} : `);
    
        // Vérifier que l'identifiant est valide
        if (questions.some(question => question.id === selectedQuestion)) {
            examQuestions.push(selectedQuestion);
        } else {
            console.log("Identifiant de question invalide. Réessayez. (Entrez 'Exit' pour quitter ");
            i--; // Décrémenter i pour redemander la même question
        }
    }

    //durée de l'examen
    const temps = prompt("Entrez la durée de l'examen (en minutes): ");

    //Nom de l'examen
    const nom_exam = prompt("Entrez le nom que portera votre examen: ");
    
     // Créer le fichier GIFT
     let giftContent = `${nom_exam} | [${matiere}]\n\n`;
     examQuestions.forEach((question, index) => {
         giftContent += `Q${index + 1} | ${question.texte}\n`;
     });
     giftContent += `\nDUREE | ${temps} minutes\n`;
     
     // Spécifier le chemin complet du fichier dans le dossier ../data/Examen
    const folderPath = path.join(__dirname, '../data/Examen');
    const filename = `${matiere}_${nom_exam}_examen.gift`;
    const filePath = path.join(folderPath, filename);

     // Écrire dans le fichier
     fs.writeFileSync(filePath, giftContent, 'utf8');
     
     console.log(`L'examen a été créé avec succès. Les données ont été enregistrées dans le fichier "${filename}".`);
}



//console.log(parser.generateQuestion());
creerExam();
