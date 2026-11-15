// Conferência geral da Biologia: node check-bio.mjs
// 1) roda o check de cada lote (modelos e regras do tema); 2) regras do app inteiro (test-motor.mjs);
// 3) distribuição pedida (80 perguntas, 25/32/23); 4) tamanho REAL do texto nas figuras (≥ 11,5 px na tela);
// 5) fonte (ref) ou modelo em cada pergunta.
import { execFileSync } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { SUBJECT } from "./biologia.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
let bad = 0;
const fail = (m) => { bad++; console.log("ERRO  " + m); };
const run = (file) => { try { const out = execFileSync(process.execPath, [join(HERE, file)], { encoding: "utf8", cwd: HERE }); const last = out.trim().split("\n").pop(); console.log(`${file.padEnd(26)} ${last}`); if (!/tudo confere/.test(last)) fail(`${file} não terminou com "tudo confere"`); } catch (e) { fail(`${file} falhou: ${String(e.stdout || e.message).trim().split("\n").slice(-3).join(" | ")}`); } };
for (const f of ["check-bio-ecologia.mjs", "check-bio-genetica.mjs", "check-bio-corpo.mjs", "check-bio-celula.mjs", "test-motor.mjs"]) run(f);

const B = SUBJECT.BANK, lv = [1, 2, 3].map((l) => B.filter((q) => q.lvl === l).length);
console.log(`\nBiologia: ${B.length} perguntas, fácil/média/difícil ${lv.join(" / ")}`);
if (B.length !== 80) fail(`esperava 80 perguntas, há ${B.length}`);
for (const [p, nome] of Object.entries(SUBJECT.PATTERNS)) console.log(`  ${p}. ${nome.padEnd(22)} ${B.filter((q) => q.pat === +p).length}`);

// tamanho real do texto: a figura principal ocupa ~340 px na tela e a alternativa ~150 px
const SHOW = { main: 340, alt: 150 };
let worst = { px: 99 };
for (const q of B) {
  const figs = [...q.fig.map((f) => [f, "main"]), ...q.alts.filter((a) => a.fig).map((a) => [a.fig, "alt"])];
  for (const [f, size] of figs) for (const mode of ["ask", "uni", "reveal"]) {
    const svg = SUBJECT.FIGS[f.kind](f, { mode, size, hint: size === "main" ? q.hint?.mark : undefined });
    const w = +svg.match(/viewBox="[-\d.]+ [-\d.]+ ([\d.]+)/)[1];
    const fonts = [...svg.matchAll(/font-size="([\d.]+)"/g)].map((m) => +m[1]);
    if (!fonts.length) continue;
    const px = (Math.min(...fonts) * SHOW[size]) / w;
    if (px < worst.px) worst = { px, id: q.id, size };
    if (px < 11.5) fail(`${q.id} (${size}, ${mode}): texto com ${px.toFixed(1)} px na tela`);
  }
  if (!q.ref && !q.calc) console.log(`  aviso: ${q.id} sem ref (conferir se é calculada)`);
}
console.log(`  menor texto na tela: ${worst.px.toFixed(1)} px (${worst.id}, ${worst.size})`);
console.log(bad ? `\n${bad} erros` : `\nbiologia: tudo confere (${B.length} perguntas)`);
process.exitCode = bad ? 1 : 0;
