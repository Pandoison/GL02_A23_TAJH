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
                // .replace(/(?<={)\d+\w+/g, '')
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


// convertGIFTtoJSON('EM-U4-p32_33-Review.gift')


fs.readdir(`../data/gift`, (err, files) => {
    if (err)
        console.log(err);
    else {
        files.forEach(file => {
            convertGIFTtoJSON(file);
        })
    }
})

