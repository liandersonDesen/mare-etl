import fs from "fs";
import path from "path";

// ---------- ARGUMENTOS ----------
const ANO = process.argv[2];
const AMIGO_PATH = process.argv[3];

if (!ANO || !AMIGO_PATH) {
  console.error(
    "❌ Uso: npm run validar <ano> <caminho-json-amigo>"
  );
  process.exit(1);
}

// ---------- CAMINHOS ----------
const oficialPath = path.resolve(
  "mares",
  ANO,
  `mare-pecem-${ANO}.json`
);

const amigoPath = path.resolve(AMIGO_PATH);

// ---------- VALIDACOES DE EXISTENCIA ----------
if (!fs.existsSync(oficialPath)) {
  console.error(`❌ JSON oficial não encontrado: ${oficialPath}`);
  process.exit(1);
}

if (!fs.existsSync(amigoPath)) {
  console.error(`❌ JSON do amigo não encontrado: ${amigoPath}`);
  process.exit(1);
}

// ---------- LOAD ----------
function carregarJSON(p) {
  return JSON.parse(fs.readFileSync(p, "utf-8"));
}

const oficial = carregarJSON(oficialPath);
const amigo = carregarJSON(amigoPath);

// ---------- VALIDADOR (SEU CÓDIGO, AJUSTADO) ----------
function validar(oficial, amigo) {
  const erros = [];

  const mapaOficial = new Map(
    oficial.map(dia => [dia.data, dia.dados])
  );

  for (const diaAmigo of amigo) {
    const dadosOficial = mapaOficial.get(diaAmigo.data);

    if (!dadosOficial) {
      erros.push(`❌ Data inexistente no oficial: ${diaAmigo.data}`);
      continue;
    }

    if (dadosOficial.length !== diaAmigo.dados.length) {
      erros.push(
        `⚠️ Quantidade diferente em ${diaAmigo.data} (oficial: ${dadosOficial.length}, amigo: ${diaAmigo.dados.length})`
      );
    }

    diaAmigo.dados.forEach((evento, i) => {
      const ref = dadosOficial[i];

      if (!ref) {
        erros.push(`❌ Evento extra em ${diaAmigo.data} às ${evento.hora}`);
        return;
      }

      if (evento.hora !== ref.hora) {
        erros.push(
          `❌ Hora diferente em ${diaAmigo.data}: ${evento.hora} ≠ ${ref.hora}`
        );
      }

      if (evento.altura !== ref.altura) {
        erros.push(
          `❌ Altura diferente em ${diaAmigo.data} ${evento.hora}: ${evento.altura} ≠ ${ref.altura}`
        );
      }
    });
  }

  return erros;
}

// ---------- EXECUCAO ----------
const resultado = validar(oficial, amigo);

if (resultado.length === 0) {
  console.log("✅ JSON do amigo está 100% compatível com o oficial");
  console.log(`📅 Ano validado: ${ANO}`);
} else {
  console.log("❌ Diferenças encontradas:\n");
  resultado.forEach(e => console.log(e));
  console.log(`\n📅 Ano analisado: ${ANO}`);
  console.log(`📊 Total de divergências: ${resultado.length}`);
}
