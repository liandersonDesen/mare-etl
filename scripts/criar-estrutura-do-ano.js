import fs from "fs";
import path from "path";

// ---------- ARGUMENTO ----------
const ANO = process.argv[2];

if (!ANO || !/^\d{4}$/.test(ANO)) {
  console.error("❌ Uso: npm run estrutura <ano>");
  process.exit(1);
}

// ---------- CAMINHOS ----------
const baseDir = path.resolve("mares", ANO);
const pdfDir = path.join(baseDir, "pdf");
const oficialDir = path.join(baseDir, "oficial");

// ---------- CRIAR PASTAS ----------
function criarSeNaoExistir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Criado: ${dir}`);
  } else {
    console.log(`ℹ️ Já existe: ${dir}`);
  }
}

criarSeNaoExistir(baseDir);
criarSeNaoExistir(pdfDir);
criarSeNaoExistir(oficialDir);

console.log(`\n✅ Estrutura criada com sucesso para o ano ${ANO}`);
