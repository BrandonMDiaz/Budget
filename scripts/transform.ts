const fs = require("fs");
const cheerio = require("cheerio");

const outputFile = "./extractedData.json";

const json = { "hello": "world" }

fs.writeFileSync(outputFile, JSON.stringify({ json }, null, 2));

console.log("File generated successfully:", outputFile);
