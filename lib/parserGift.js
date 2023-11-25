const fs = require('fs');
const parse = require('gift-pegjs').parse;
const question = require('../data/question');

const generateQuestion = () => {
    convertAllGIFTtoJSON()
    return convertAllJSONtoQuestion();
}

function convertAllJSONtoQuestion() {
    let questions = []
    let files = fs.readdirSync(`../data/json`)
    files.forEach(file => {
        const data = fs.readFileSync(`../data/json/${file}`, { encoding: 'utf8', flag: 'r' })
        const objData = JSON.parse(data
            .replace(/<[^>]*>/g, ' ')
            .replace(/\[[\w,/\s]*\]/g, ' ')
        )

        // =============== récupérer la consigne des questions ===============
        let i = 0;
        let consigne = null
        let stop = false
        while(i<objData.length && stop) {
            if(objData[i+1] !== undefined && objData[i+1].type !== 'Description' && objData[i].type === 'Description'){
                consigne = objData[i].stem.text;
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
                    })
                });
            }
            questions.push(new question(consigne, objData[i].stem.text, objData[i].type, resp))
        }


    });
    return questions
}


function convertAllGIFTtoJSON() {
    const files = fs.readdirSync(`../data/gift`)
    files.forEach(file => {
        convertGIFTtoJSON(file);
    })
}


const convertGIFTtoJSON = (giftFileName) =>{
    const data = fs.readFileSync(`../data/gift/${giftFileName}`, { encoding: 'utf8', flag: 'r' })
    try {
        const jsonContent = parse(data
                .replace(/~(?==)/g, '')
                .replace(/(?<!:):(?!:)/g, ')')
                .replace(/:/g, ' ')
            // .replace(/(?<={)\d+\w+/g, '')
            // .replace(/(?<=}.*)\s(?={)/g, '\n\n')
        );
        fs.writeFileSync(`../data/json/${giftFileName.replace(/\..*/g, '')}.json`, JSON.stringify(jsonContent, null, 2))
    } catch(err) {
        // console.log(`error converting ${giftFileName}`)
        console.log(err)
    }
}

module.exports = generateQuestion

// =============== ALTERNATIVE PEGJS (gift-parser-ide) ===============
// const Parser = require('gift-parser-ide').default
// let parse = new Parser()
// parse.update(data);
// fs.writeFileSync(`../data/json/${giftFileName}.json`, JSON.stringify(parse.result(), null, 2))
