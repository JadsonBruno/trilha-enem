// Gera conteudo/_manifesto.gen.mjs com imports estáticos de todo o conteúdo (o bundle de um arquivo só precisa disso).
// Ordem: matérias pela lista de conteudo/indice.mjs; unidades e lições pelo prefixo numérico (01-, 02-…). "_*" é ignorado.
// Uso: node ferramentas/manifesto.mjs  (build.mjs e checks/check-tudo.mjs já chamam)
import { readdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONT = join(RAIZ, "conteudo");
const NUM = /^\d{2}-[a-z0-9-]+$/;

export async function gerarManifesto() {
  const { MATERIAS } = await import(pathToFileURL(join(CONT, "indice.mjs")).href);
  const imps = [], arv = [];
  let n = 0;
  const imp = (rel) => { const v = "m" + n++; imps.push(`import ${v} from "./${rel}";`); return v; };
  for (const mid of MATERIAS) {
    const pm = join(CONT, mid);
    if (!existsSync(join(pm, "materia.mjs"))) { console.warn(`aviso: conteudo/${mid}/materia.mjs ainda não existe (matéria pulada)`); continue; }
    const vm = imp(`${mid}/materia.mjs`);
    const unis = readdirSync(pm).filter((d) => NUM.test(d) && statSync(join(pm, d)).isDirectory()).sort();
    const us = [];
    for (const u of unis) {
      const pu = join(pm, u);
      if (!existsSync(join(pu, "unidade.mjs"))) throw new Error(`conteudo/${mid}/${u}/unidade.mjs não existe`);
      const vu = imp(`${mid}/${u}/unidade.mjs`);
      const ls = readdirSync(pu).filter((f) => /^\d{2}-[a-z0-9-]+\.mjs$/.test(f)).sort().map((f) => imp(`${mid}/${u}/${f}`));
      us.push(`{ ...${vu}, licoes: [${ls.join(", ")}] }`);
    }
    arv.push(`{ ...${vm}, unidades: [\n    ${us.join(",\n    ")}\n  ] }`);
  }
  const src = `// GERADO por ferramentas/manifesto.mjs — não edite à mão.\n${imps.join("\n")}\n\nexport const CONTEUDO = [\n  ${arv.join(",\n  ")}\n];\n`;
  writeFileSync(join(CONT, "_manifesto.gen.mjs"), src);
  return src;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await gerarManifesto();
  console.log("conteudo/_manifesto.gen.mjs gerado");
}
