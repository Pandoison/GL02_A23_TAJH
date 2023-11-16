const fs = require('fs');
const parse = require('gift-pegjs').parse;
// const Parser = require('gift-parser-ide').default
// let parse = new Parser()

const convertGIFTtoJSON = (giftFileName) =>{
    fs.readFile(`../data/gift/${giftFileName}`, 'utf-8', function(err, data){
        try {
            // parse.update(data);
            // fs.writeFileSync(`../data/json/${giftFileName}.json`, JSON.stringify(parse.result(), null, 2))
            const jsonContent = parse(data);
            fs.writeFileSync(`../data/json/${giftFileName}.json`, JSON.stringify(jsonContent, null, 2))
        } catch {
            //ignore errors of parsing GIFT file
            console.log(`error converting ${giftFileName}.gift`)
        }
    });
}
const convertJSONtoGIFT = (jsonObject) => {

}

fs.readdir(`../data/gift`, (err, files) => {
    if (err)
        console.log(err);
    else {
        console.log("\nCurrent directory filenames:");
        files.forEach(file => {
            convertGIFTtoJSON(file);
        })
    }
})


