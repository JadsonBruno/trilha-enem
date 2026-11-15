// Gera drawmol.gen.mjs: o desenho de moléculas (drawMol) recortado de trilha.js, do mesmo jeito de sempre,
// agora como módulo ES de verdade (importa chem.mjs). Não altera trilha.js. Rodado por build-show.mjs e test-motor.mjs.
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as chem from "./chem.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
export function genDrawMol() {
  const trilha = readFileSync(join(HERE, "trilha.js"), "utf8");
  const cut = (a, b) => { const i = trilha.indexOf(a), j = trilha.indexOf(b); if (i < 0 || j < i) throw new Error("trecho não encontrado em trilha.js: " + a); return trilha.slice(i, j); };
  const draw = cut("const $ =", "const store = {") + cut("// ----------------------------------------------------------------------------- desenho de moléculas", "const specMol");
  const names = Object.keys(chem).join(", ");
  const out = `// GERADO por gen-drawmol.mjs a partir de trilha.js. Não editar.\nimport { ${names} } from "./chem.mjs";\n${draw}\nexport { drawMol, r1, esc };\n`;
  const file = join(HERE, "drawmol.gen.mjs");
  let old = ""; try { old = readFileSync(file, "utf8"); } catch {}
  if (old !== out) writeFileSync(file, out);
  return file;
}
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) console.log("gerado", genDrawMol());
