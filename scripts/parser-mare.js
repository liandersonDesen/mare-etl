import fs from "fs";

const MESES = [
  { nome: "Janeiro", numero: "01" },
  { nome: "Fevereiro", numero: "02" },
  { nome: "Março", numero: "03" },
  { nome: "Abril", numero: "04" },
  { nome: "Maio", numero: "05" },
  { nome: "Junho", numero: "06" },
  { nome: "Julho", numero: "07" },
  { nome: "Agosto", numero: "08" },
  { nome: "Setembro", numero: "09" },
  { nome: "Outubro", numero: "10" },
  { nome: "Novembro", numero: "11" },
  { nome: "Dezembro", numero: "12" }
];

export function gerarMeses(textoCompleto, ano, outputDir) {
  textoCompleto = textoCompleto
    .replace(/\s+/g, " ")
    .replace(/(-?\d+\.)\s+(\d+)/g, "$1$2");

  for (let m = 0; m < MESES.length; m++) {
    const mesAtual = MESES[m];
    const proximoMes = MESES[m + 1];

    if (!textoCompleto.includes(mesAtual.nome)) continue;

    let blocoMes = textoCompleto.split(mesAtual.nome)[1];
    if (proximoMes) {
      blocoMes = blocoMes.split(proximoMes.nome)[0];
    }

    const tokens = blocoMes.split(" ");
    const dias = {};
    let diaAtual = null;

    for (let i = 0; i < tokens.length; i++) {
      if (/^\d{2}$/.test(tokens[i]) && Number(tokens[i]) <= 31) {
        diaAtual = `${ano}-${mesAtual.numero}-${tokens[i]}`;
        if (!dias[diaAtual]) dias[diaAtual] = [];
        continue;
      }

      if (/^\d{4}$/.test(tokens[i]) && diaAtual) {
        const hora = tokens[i].slice(0, 2) + ":" + tokens[i].slice(2, 4);
        const altura = Number(tokens[i + 1]);
        if (!isNaN(altura)) {
          dias[diaAtual].push({ hora, altura });
        }
      }
    }

    const jsonFinal = Object.entries(dias)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([data, dados]) => ({ data, dados }));

    fs.writeFileSync(
      `${outputDir}/${ano}-${mesAtual.numero}.json`,
      JSON.stringify(jsonFinal, null, 2)
    );

    console.log(`✅ Gerado: ${ano}-${mesAtual.numero}.json`);
  }
}
