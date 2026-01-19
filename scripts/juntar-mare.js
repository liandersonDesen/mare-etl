import fs from "fs";
import path from "path";

const ANO = process.argv[2];

if (!ANO) {
  console.error("❌ Uso: npm run juntar <ano>");
  process.exit(1);
}

const baseDir = path.resolve("mares", ANO);
const oficialDir = path.join(baseDir, "oficial");
const outputFile = path.join(baseDir, `mare-pecem-${ANO}.json`);

if (!fs.existsSync(oficialDir)) {
  console.error(`❌ Pasta não encontrada: ${oficialDir}`);
  process.exit(1);
}

const arquivos = fs
  .readdirSync(oficialDir)
  .filter(f => f.endsWith(".json"))
  .sort();

if (arquivos.length === 0) {
  console.error("❌ Nenhum JSON mensal encontrado para juntar");
  process.exit(1);
}

let resultadoFinal = [];

for (const arquivo of arquivos) {
  const conteudo = JSON.parse(
    fs.readFileSync(path.join(oficialDir, arquivo), "utf-8")
  );
  resultadoFinal.push(...conteudo);
}

resultadoFinal.sort((a, b) => a.data.localeCompare(b.data));

fs.writeFileSync(
  outputFile,
  JSON.stringify(resultadoFinal, null, 2)
);

console.log(`✅ JSON anual gerado com sucesso:`);
console.log(`📄 ${outputFile}`);
console.log(`📊 Total de dias: ${resultadoFinal.length}`);
