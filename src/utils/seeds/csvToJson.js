const fs = require("fs");
const Papa = require("papaparse");

const csvFile = fs.readFileSync("comics.csv", "utf8");

const parsedData = Papa.parse(csvFile, {
  header: true,
  skipEmptyLines: true
});

const jsonData = parsedData.data;

fs.writeFileSync("comicsSeed.json", JSON.stringify(jsonData, null, 2));

console.log(`✅ Semilla JSON creada: comicsSeed.json`);
console.log(`Total de registros: ${jsonData.length}`);