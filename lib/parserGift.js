// import * as fs from 'fs';
// import { parse } from "gift-pegjs";
const fs = require('fs');
const parse = require('gift-pegjs').parse;

fs.readFile("./creerCompte.js", 'utf-8', function(err, data){
    console.log(data)
});

const question = "What is the value of pi (to 3 decimal places)? {#3.141..3.142}."
const quiz = parse(question)



const convertGIFTtoJSON = (pathToGIFT) =>{

}