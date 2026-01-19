import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import { gerarMeses } from "./parser-mare.js";

const ANO = process.argv[2];
if (!ANO) {
  console.error("❌ Uso: npm run extrair <ano>");
  process.exit(1);
}

const baseDir = path.resolve("mares", ANO);
const pdfPath = path.join(baseDir, "pdf", `pecem-${ANO}.pdf`);
const outputDir = path.join(baseDir, "oficial");

fs.mkdirSync(outputDir, { recursive: true });

const buffer = fs.readFileSync(pdfPath);
const data = await pdfParse(buffer);

gerarMeses(data.text, ANO, outputDir);

console.log(`🎉 Extração COMPLETA do ano ${ANO}`);
