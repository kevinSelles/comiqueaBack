import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const inputArg = process.argv[2] || path.join(__dirname, "comics.csv");
const outputArg = process.argv[3] || path.join(__dirname, "comics.json");

const inputPath = path.isAbsolute(inputArg) ? inputArg : path.join(process.cwd(), inputArg);

function parseCSVLine(line) {
  const result = [];
  let current = "";
  let insideQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"' && nextChar === '"') {
      current += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

function csvToJson(csvString) {
  const lines = csvString.split(/\r?\n/).filter(l => l.trim() !== "");
  if (lines.length < 2) return [];

  const headers = parseCSVLine(lines[0]);

  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      let val = values[i] || "";

      if (h === "authors") {
        val = val.split(",").map(s => s.trim()).filter(Boolean);
      }

      obj[h] = val;
    });
    return obj;
  });
}

try {
  const rawCSV = fs.readFileSync(inputPath, "utf8");
  const json = csvToJson(rawCSV);
  fs.writeFileSync(outputArg, JSON.stringify(json, null, 2), "utf8");
  console.log(`✅ JSON generado correctamente: ${outputArg}`);
} catch (err) {
  console.error("❌ Error al convertir CSV a JSON:", err.message);
  process.exit(1);
}