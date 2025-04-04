const fs = require("fs");
const cheerio = require("cheerio");

const outputFile = "./extractedData.json";
const inputFile = "consent/test.html";

const json = { "hello": "world" }
const test = fs.readFileSync(inputFile, 'utf-8');
console.log(test);

fs.writeFileSync(outputFile, JSON.stringify({ json }, null, 2));

console.log("File generated successfully:", outputFile);
