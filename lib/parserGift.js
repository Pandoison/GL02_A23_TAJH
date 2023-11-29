const pathToGIFT = '../data/gift'
const pathToJSON = '../data/json'
const pathToQuestion = '../data/question'

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
            .replace(/\[[\w,/\s]*\]/g, ' ')
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

const convertQuestionToGift = (fileName, question) => {
    let resp = '{'
    let intituleQuestion = '';
    let resultat = `:: ${question.id} :: `

    switch (question.type){
        case MATCHING :
            question.reponses.forEach(r => {
                resp += `=${r.sousQuestion} -> ${r.sousQuestion},`
            })
            resp += '}'
            resultat += question.consigne + resp;
            break
        case MC : case ESSAY :
            resp += createRespMcShortEssay(question) + '}';
            resultat += question.consigne + resp;
            break
        case SHORT :
            resp += createRespMcShortEssay(question) + '}';
            resultat += question.consigne.replace(/_____/g, resp);
            break
    }
    try {
        fs.appendFileSync(`${pathToGIFT}/${fileName}.gift`, `\n\n${resultat}`)
        return 0
    } catch (err) {
        return 1
    }
}

module.exports = {generateQuestion, convertQuestionToGift}

let q = new question('U9 p95 Third_cond 4 - 5.293187641020431', null, 'dhduza _____ dazjhd', 'Short', [ { text: '1', isCorrect: true }, { text: '2', isCorrect: false } ] )

// console.log(convertQuestionToGift('', q))

// =============== ALTERNATIVE PEGJS (gift-parser-ide) ===============
// const Parser = require('gift-parser-ide').default
// let parse = new Parser()
// parse.update(data);
// fs.writeFileSync(`${pathToJSON}/${giftFileName}.json`, JSON.stringify(parse.result(), null, 2))
