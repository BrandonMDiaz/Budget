import fs from 'fs';
import * as cheerio from 'cheerio';
import { dirname, resolve } from 'path'

const outputFile = "./extractedData.json";
const pathToFile = "../documents/test.html";
console.log(dirname)
const test = fs.readFileSync(resolve(__dirname, pathToFile), 'utf-8');
console.log(test);

const json = { "hello": "world" }

fs.writeFileSync(outputFile, JSON.stringify({ json }, null, 2));

console.log("File generated successfully:", outputFile);
