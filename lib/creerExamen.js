const fs = require('fs');
const prompt = require('prompt-sync')();
const parser = require('./parserGift');
const path = require('path');
 

function creerExam(professeur){

    //charger kes comptes étudiants
    const datacomptes = fs.readFileSync('comptes.json');
    const comptes = JSON.parse(datacomptes);


    //demander la matiere de l'examen et vérifier si elle existe
    const matiereexistante = ["U1","U2","U3","U4","U5","U6","U7","U8","U9","U10","U11","EM-U5","EM-U6"];
    let matiere = prompt("Entrez le code de la matière pour laquelle vous désirez créer un examen: ");

    while (matiere.toLowerCase() !== "Exit" && !matiereexistante.includes(matiere)) {
        // La matière n'existe pas dans la liste
        console.log("La matière rentrée n'est pas valide, réessayez.");
        matiere = prompt("Entrez le code de la matière pour laquelle vous désirez créer un examen (ou tapez 'Exit' pour quitter) : ");
    }
    
    // Vérifier si l'utilisateur a entré "Exit"
    if (matiere.toLowerCase() === "Exit") {
        console.log("Création de l'examen annulée.");
    }


    //questions associées à ce cours : 
    const toutesquestions = parser.generateQuestion();

    //vérifier les codes d'ue, et insérer les questions des fichiers des bonnes ue dans une liste 

    const questions = []
    for(let i=0; i<toutesquestions.length;i++){
        let quest = toutesquestions[i].id;
        if(quest.includes(matiere)){
            questions.push(toutesquestions[i]);
            //console.log(toutesquestions[i]);
        }
    }
// console.log(questions);

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
    
        // Vérifier si l'utilisateur veut quitter
        if (selectedQuestion.toLowerCase() === 'exit') {
            console.log("Création de l'examen annulée");
            return; // Sortir de la boucle
        }

    // Vérifier que l'identifiant est valide
    if (questions.some(question => question.id === selectedQuestion)) {
        // Vérifier si la question est déjà dans la liste d'examQuestions
        if (examQuestions.some(examQuestion => examQuestion.id === selectedQuestion)) {
            console.log("Vous avez déjà sélectionné cette question. Réessayez. (Entrez 'Exit' pour quitter)");
            i--; 
        } else {
            let questionTrouvee = questions.find(question => question.id === selectedQuestion);
            examQuestions.push(questionTrouvee);
        }
    } else {
        console.log("Identifiant de question invalide. Réessayez. (Entrez 'Exit' pour quitter)");
        i--; // Décrémenter i pour redemander la même question
    }
    }

    //durée de l'examen
    const temps = prompt("Entrez la durée de l'examen (en minutes): ");

    //Nom de l'examen
    const nom_exam = prompt("Entrez le nom que portera votre examen: ");
    
    //Vcard de l'enseignant 
    const pathToContacts = path.join(__dirname, '../data/Contact');
    const fichiers = fs.readdirSync(pathToContacts);
    fichiers.forEach(file => {
        const filepath = path.join(pathToContacts, file);
        if (file.includes(professeur)) {
            const prof = (filepath);
        }
    });


    const examData = {
        nom: nom_exam,
        matiere: matiere,
        duree: `${temps} minutes`,
        questions: examQuestions,
        vcard_professeur : prof,
    };

    // Spécifier le chemin complet du fichier dans le dossier ../data/Examen
    const folderPath = path.join(__dirname, '../data/Examen');
    const filename = `${matiere}_${nom_exam}_examen.json`;
    const filePath = path.join(folderPath, filename);

    // Écrire dans le fichier
    fs.writeFileSync(filePath, JSON.stringify(examData, null, 2), 'utf8');

    console.log(`L'examen a été créé avec succès. Les données ont été enregistrées dans le fichier "${filename}".`);
     
}

//nom_prenom.verify Vcards
//ajouter chemin vcards à la fin

//console.log(parser.generateQuestion());
creerExam();
