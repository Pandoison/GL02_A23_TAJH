const path = require('path');

const pathToGIFT = path.join(__dirname, '../data/gift')
const pathToJSON = path.join(__dirname, '../data/json')
const pathToQuestion = path.join(__dirname, '../data/question');

const MATCHING = 'Matching';
const MC = 'Mc';
const ESSAY = 'Essay';
const SHORT = 'Short';

const fs = require('fs');
const parse = require('gift-pegjs').parse;
const question = require(pathToQuestion);



const convertGIFTtoJSON = (giftFileName) =>{
    const data = fs.readFileSync(`${pathToGIFT}/${giftFileName}`, { encoding: 'utf8', flag: 'r' })
    try {
        const jsonContent = parse(data
                .replace(/~(?==)/g, '')
                .replace(/(?<!:):(?!:)/g, ')')
        );
        fs.writeFileSync(`${pathToJSON}/${giftFileName.replace(/\..*/g, '')}.json`, JSON.stringify(jsonContent, null, 2))
    } catch(err) {
        // =============== Ignore les fichiers générant des erreurs lors  ===============
        // console.log(`error converting ${giftFileName}`)
        // console.log(err)
    }
}

function convertAllGIFTtoJSON() {
    const files = fs.readdirSync(`${pathToGIFT}`)
    files.forEach(file => {
        convertGIFTtoJSON(file);
    })
}

function convertAllJSONtoQuestion() {
    let questions = []
    let files = fs.readdirSync(`${pathToJSON}`)
    files.forEach(file => {
        const data = fs.readFileSync(`${pathToJSON}/${file}`, { encoding: 'utf8', flag: 'r' })
        const objData = JSON.parse(data
            .replace(/<[^>]*>/g, ' ')
            .replace(/\[html\]/g, ' ')
            // .replace(/\[[\w,/\s]*\]/g, ' ')
        )
        // =============== récupérer l'indication des questions ===============
        let i = 0;
        let indication = null
        let stop = false
        while(i<objData.length && !stop) {
            if(objData[i+1] !== undefined && objData[i+1].type !=='Description' && objData[i].type === 'Description'){
                indication = objData[i].stem.text;
                stop = true
            }
            i++;
        }
        // =============== créer les question ===============
        for(i; i<objData.length; i++){
            let resp = []
            if('choices' in objData[i] && objData[i].choices.length>=1){
                objData[i].choices.forEach(choice => {
                    resp.push({
                        text: choice.text.text,
                        isCorrect: choice.isCorrect
                    });
                });
            }
            if('matchPairs' in objData[i]) {
                objData[i].matchPairs.forEach(matchPair => {
                    resp.push({
                        sousQuestion: matchPair.subquestion.text,
                        sousReponse: matchPair.subanswer
                    })
                });
            }
            if(objData[i].type !== 'Description') {
                questions.push(new question(objData[i].title, indication, objData[i].stem.text, objData[i].type, resp))
            }
        }
    });
    return questions
}

const generateQuestion = () => {
    convertAllGIFTtoJSON()
    return convertAllJSONtoQuestion();
}

function createRespMcShortEssay(question) {
    let res = ''
    question.reponses.forEach(resp => {
        let prefix = '~';
        if (resp.isCorrect) {
            prefix = '=';
        }
        res += `${prefix}${resp.text}`
    })
    return res
}

function convertQuestionToGiftFormat(question) {
    let resultat = `::${question.id}:: `
    let resp = '{'
    let intituleQuestion = '';
    switch (question.type.toUpperCase()) {
        case MATCHING.toUpperCase() :
            question.reponses.forEach(r => {
                resp += `=${r.sousQuestion} -> ${r.sousQuestion},`
            })
            resp += '}'
            resultat += question.consigne + resp;
            break
        case MC.toUpperCase() :
        case ESSAY.toUpperCase() :
            resp += createRespMcShortEssay(question) + '}';
            resultat += question.consigne + resp;
            break
        case SHORT.toUpperCase() :
            resp += createRespMcShortEssay(question) + '}';
            resultat += question.consigne.replace(/_____/g, resp);
            break
    }
    return resultat;
}

const addQuestionToGift = (fileName, question) => {
    try {
        fs.appendFileSync(`${pathToGIFT}/${fileName}.gift`, `\n\n${convertQuestionToGiftFormat(question)}`)
        return 0
    } catch (err) {
        return 1
    }
}

const deleteQuestionFromGift = (questionName, replaceWith = '') => {
    // =============== Récupération du nom du fichier contenant la question, et le son contenu ===============
    const files = fs.readdirSync(`${pathToGIFT}`);
    let currentFileContent = ''
    let fileName = ''
    files.forEach(file => {
       const data = fs.readFileSync(`${pathToGIFT}/${file}`,{ encoding: 'utf8', flag: 'r' })
       if(data.includes(questionName)){
           fileName = file
           currentFileContent = data;
       }
    });
    // =============== Création du nouveau contenu du fichier, sans la question ===============
    // ESCAPE SPECIAL CHAR
    questionName = questionName.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
    const re = new RegExp(`(::${questionName}.*\\n)(.+\\n)*`, 'g')
    const newFileContent = currentFileContent.replace(re, replaceWith+'\n')
    // =============== Ré-écriture dans le fichier le nouveau contenu ===============
    try {
        fs.writeFileSync(`${pathToGIFT}/${fileName}`, newFileContent)
        return 0
    } catch (err){
        return 1
    }
}

module.exports = {generateQuestion, addQuestionToGift, deleteQuestionFromGift, convertQuestionToGiftFormat}
