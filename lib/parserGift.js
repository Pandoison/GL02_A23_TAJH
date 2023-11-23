const fs = require('fs');
const parse = require('gift-pegjs').parse;
// const Parser = require('gift-parser-ide').default
// let parse = new Parser()

const convertGIFTtoJSON = (giftFileName) =>{
    fs.readFile(`../data/gift/${giftFileName}`, 'utf-8', function(err, data){
        try {
            // parse.update(data);
            // fs.writeFileSync(`../data/json/${giftFileName}.json`, JSON.stringify(parse.result(), null, 2))
            const jsonContent = parse(data
                .replace(/~(?==)/g, '')
                .replace(/:/g, '')
                .replace(/(?<={)\d+\w+/g, '')
                // .replace(/(?<=}.*)\s(?={)/g, '\n\n')
            );
            fs.writeFileSync(`../data/json/${giftFileName}.json`, JSON.stringify(jsonContent, null, 2))


        } catch(err) {
            //ignore errors of parsing GIFT file
            console.log(`error converting ${giftFileName}`)
            // console.log(err)
        }

    });
}
const convertJSONtoGIFT = (jsonObject) => {

}

// convertGIFTtoJSON('U9-p95-Third_cond-4.gift')
// convertGIFTtoJSON('U7-p77-6.gift')
// convertGIFTtoJSON('U8-p84-Voc-Linking_words.gift')

// convertGIFTtoJSON('U6-p64-Future-perfect-&-continuous.gift')
// convertGIFTtoJSON('U5-p50-Use_of_English.gift')
// convertGIFTtoJSON('U6-p65-Voc-Expressions_with_get.gift')
// convertGIFTtoJSON('EM-U4-p32_33-Review.gift')
// convertGIFTtoJSON('U3-p33-UoE-Hygge.gift')

// convertGIFTtoJSON('EM-U5-p34-Gra-Expressions_of_quantity.gift')


fs.readdir(`../data/gift`, (err, files) => {
    if (err)
        console.log(err);
    else {
        files.forEach(file => {
            convertGIFTtoJSON(file);
        })
    }
})

