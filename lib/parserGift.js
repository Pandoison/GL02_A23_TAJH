const fs = require('fs');
const parse = require('gift-pegjs').parse;

const convertGIFTtoJSON = (giftFileName) =>{
    fs.readFile(`../data/gift/${giftFileName}`, 'utf-8', function(err, data){
        try {
            const jsonContent = parse(data);
            fs.writeFileSync(`../data/json/${giftFileName}.json`, JSON.stringify(jsonContent, null, 2))
        } catch {
            //ignore errors of parsing GIFT file
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


