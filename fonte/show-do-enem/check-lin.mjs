// Conferência geral de Linguagens: node check-lin.mjs
// 1) roda check-lin-{figuras,funcoes,generos}.mjs que existirem + test-motor.mjs; 2) distribuição (115 perguntas: só aviso enquanto houver esboço; ≥ 30% estilo ENEM);
// 3) tamanho REAL do texto nas figuras (main 310 px, alt 150 px, alt em linha 140 px; ≥ 11,5 px); 4) ref em toda pergunta.
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SUBJECT } from "./linguagens.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
let bad = 0;
const fail = (m) => { bad++; console.log("ERRO  " + m); };
const run = (file) => { try { const out = execFileSync(process.execPath, [join(HERE, file)], { encoding: "utf8", cwd: HERE }); const last = out.trim().split("\n").pop(); console.log(`${file.padEnd(26)} ${last}`); if (!/tudo confere/.test(last)) fail(`${file} não terminou com "tudo confere"`); } catch (e) { fail(`${file} falhou: ${String(e.stdout || e.message).trim().split("\n").slice(-3).join(" | ")}`); } };
for (const f of ["check-lin-figuras.mjs", "check-lin-funcoes.mjs", "check-lin-generos.mjs", "check-lin-enem-figuras.mjs", "check-lin-enem-funcoes.mjs", "check-lin-enem-generos.mjs"]) { if (existsSync(join(HERE, f))) run(f); else console.log(`${f.padEnd(26)} (ainda não existe)`); }
run("test-motor.mjs");

const B = SUBJECT.BANK, esb = B.some((q) => q.id.includes("-esb-")) || B.length < 115, lv = [1, 2, 3].map((l) => B.filter((q) => q.lvl === l).length);
const warn = (m) => console.log("  aviso: " + m);
console.log(`\nLinguagens: ${B.length} perguntas, fácil/média/difícil ${lv.join(" / ")}${esb ? "  [ainda há esboço]" : ""}`);
const dist = (cond, m) => cond && (esb ? warn(m) : fail(m));
dist(B.length !== 115, `esperava 115 perguntas, há ${B.length}`);
const ne = B.filter((q) => q.enem).length, pc = B.length ? (100 * ne) / B.length : 0;
console.log(`  estilo ENEM: ${ne} de ${B.length} (${pc.toFixed(1)}%), meta ≥ 30%`);
dist(pc < 30, `estilo ENEM abaixo da meta de 30% (${pc.toFixed(1)}%)`);
for (const [p, nome] of Object.entries(SUBJECT.PATTERNS)) console.log(`  ${p}. ${nome.padEnd(22)} ${B.filter((q) => q.pat === +p).length}`);

// tamanho real: main ~310 px; alt 150 px na grade, 140 px em linha (alternativas muito largas); hint só na figura principal
const SHOW = { main: [310], alt: [150, 140] };
let worst = { px: 99 };
for (const q of B) {
  if (!q.ref) fail(`${q.id}: sem ref`);
  const figs = [...(q.fig || []).map((f) => [f, "main"]), ...q.alts.filter((a) => a.fig).map((a) => [a.fig, "alt"])];
  for (const [f, size] of figs) for (const mode of ["ask", "uni", "reveal"]) {
    let svg; try { svg = SUBJECT.FIGS[f.kind](f, { mode, size, hint: size === "main" ? q.hint?.mark || ["x"] : undefined }); } catch (e) { fail(`${q.id}: FIGS.${f.kind} lançou ${e.message}`); continue; }
    const w = +svg.match(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+)/)[1];
    const fonts = [...svg.matchAll(/font-size="([\d.]+)"/g)].map((m) => +m[1]);
    if (!fonts.length) continue;
    for (const sw of SHOW[size]) {
      const px = (Math.min(...fonts) * sw) / w;
      if (px < worst.px) worst = { px, id: q.id, size };
      if (px < 11.5) fail(`${q.id} (${size} ${sw}px, ${mode}): texto com ${px.toFixed(1)} px na tela`);
    }
  }
  for (const a of q.alts) if (a.t && a.t.length > (q.enem ? 100 : 46)) fail(`${q.id}: alternativa com ${a.t.length} caracteres (máx ${q.enem ? 100 : 46})`);
}
console.log(`  menor texto na tela: ${worst.px.toFixed(1)} px (${worst.id}, ${worst.size})`);
// estilo ENEM: a certa não pode ser denunciada pelo tamanho (no máximo 40% das vezes a mais longa; nenhuma alternativa < 60% da maior)
const QE = B.filter((q) => q.enem);
if (QE.length) {
  const lens = (q) => q.alts.map((a) => (a.t || "").length);
  const longest = QE.filter((q) => { const L = lens(q), mx = Math.max(...L); return L[q.correct[0]] === mx && L.filter((x) => x === mx).length === 1; }).length;
  console.log(`  estilo ENEM: certa é a mais longa em ${longest} de ${QE.length} (${Math.round((100 * longest) / QE.length)}%), máx 40%`);
  if (longest > 0.4 * QE.length) fail(`estilo ENEM: a certa é a alternativa mais longa em ${longest} de ${QE.length} perguntas (máx 40%)`);
  for (const q of QE) { const L = lens(q); if (Math.min(...L) < 0.6 * Math.max(...L)) fail(`${q.id}: alternativa curta demais perto das outras (denuncia a certa)`); }
}
console.log(bad ? `\n${bad} erros` : `\nlinguagens: tudo confere (${B.length} perguntas${esb ? ", com avisos de esboço" : ""})`);
process.exitCode = bad ? 1 : 0;
