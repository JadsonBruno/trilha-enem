// Check geral da Trilha ENEM: node checks/check-tudo.mjs
// 1) gera o manifesto; 2) schema + regras de conteúdo (checks/schema.mjs); 3) checks de cada matéria (checks/check-<materia>*.mjs);
// Só uma matéria: node checks/check-tudo.mjs --so quimica
// 4) checks originais do Show (fonte/show-do-enem), que provam que o banco reaproveitado continua íntegro.
import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { execFileSync } from "node:child_process";
import { gerarManifesto } from "../ferramentas/manifesto.mjs";

const AQUI = dirname(fileURLToPath(import.meta.url));
const RAIZ = join(AQUI, "..");
let falhas = 0;

await gerarManifesto();
const { CONTEUDO } = await import(pathToFileURL(join(RAIZ, "conteudo/_manifesto.gen.mjs")).href);
const { FIGURAS } = await import(pathToFileURL(join(RAIZ, "app/figuras/index.js")).href);
const { validar } = await import(pathToFileURL(join(AQUI, "schema.mjs")).href);

const SO = process.argv.includes("--so") ? process.argv[process.argv.indexOf("--so") + 1] : null;
const { erros, avisos, stats } = validar(SO ? CONTEUDO.filter((m) => m.id === SO) : CONTEUDO, FIGURAS);
for (const a of avisos) console.log("aviso  " + a);
for (const e of erros) console.log("ERRO   " + e);
falhas += erros.length;
console.log(`\nschema: ${stats.materias} matérias, ${stats.unidades} unidades, ${stats.licoes} lições, ${stats.cartoes} cartões, ${stats.exercicios} exercícios + ${stats.desafio} no desafio`);
console.log("por tipo: " + Object.entries(stats.porTipo).map(([k, v]) => `${k} ${v}`).join(", "));

const roda = (arq, cwd) => {
  try { execFileSync(process.execPath, [arq], { cwd, stdio: "pipe" }); console.log(`ok     ${arq}`); }
  catch (e) { falhas++; console.log(`FALHOU ${arq}\n${String(e.stdout || "").split("\n").filter((l) => /ERRO|erro|Error|falh/i.test(l)).slice(0, 15).join("\n")}\n${String(e.stderr || "").slice(0, 800)}`); }
};
for (const f of readdirSync(AQUI).filter((f) => /^check-(?!tudo).*\.mjs$/.test(f) && (!SO || f.startsWith(`check-${SO}`))).sort()) roda(join(AQUI, f), RAIZ);
const FONTE = join(RAIZ, "fonte/show-do-enem");
for (const f of ["check-show.mjs", "check-bio.mjs", "check-lin.mjs", "test-motor.mjs"]) roda(f, FONTE);

console.log(falhas ? `\n${falhas} problema(s)` : "\ntudo confere");
process.exitCode = falhas ? 1 : 0;
