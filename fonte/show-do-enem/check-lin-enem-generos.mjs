// Conferência dos gêneros no formato ENEM. Termina com "tudo confere".
import { QUESTIONS, FIGS, PATTERNS_USED } from "./lin-enem-generos.mjs";
const erros = [];
const bad = (id, m) => erros.push(`${id}: ${m}`);
if (QUESTIONS.length !== 12) bad("geral", `${QUESTIONS.length} perguntas em vez de 12`);
const lv = [2, 3].map((l) => QUESTIONS.filter((q) => q.lvl === l).length);
if (lv.join() !== "6,6") bad("geral", `níveis ${lv.join("/")} em vez de 6/6`);
if (JSON.stringify(PATTERNS_USED) !== "[3]") bad("geral", "PATTERNS_USED");
if (Object.keys(FIGS).length) bad("geral", "FIGS deve ser {}");
const ids = new Set();
for (const q of QUESTIONS) {
  const id = q.id;
  if (!/^lin-enem-gen-/.test(id)) bad(id, "prefixo");
  if (ids.has(id)) bad(id, "id repetido");
  ids.add(id);
  if (q.subj !== "linguagens" || q.pat !== 3 || q.enem !== true) bad(id, "subj/pat/enem");
  if (![2, 3].includes(q.lvl)) bad(id, "lvl");
  if (!q.text || q.text.length > 120) bad(id, `text ${q.text?.length} > 120`);
  if (!q.why || q.why.length > 150) bad(id, `why ${q.why?.length} > 150`);
  const t = q.base?.texto;
  if (!t || t.length > 450) bad(id, `base.texto ${t?.length} > 450`);
  if (!q.base?.fonte) bad(id, "base sem fonte");
  if (!q.hint?.t || !q.hint.trecho) bad(id, "hint sem t/trecho");
  else if (!t.includes(q.hint.trecho)) bad(id, "hint.trecho fora de base.texto");
  if (!q.destaque || !t.includes(q.destaque)) bad(id, "destaque fora de base.texto");
  if (!q.ref || !/https?:\/\//.test(q.ref)) bad(id, "ref sem link");
  if (!(q.src === "no estilo do ENEM" || /^como no ENEM (2014|2016|2019|2022|2023) \(/.test(q.src))) bad(id, "src: " + q.src);
  if (q.alts?.length !== 4) bad(id, "não tem 4 alternativas");
  else {
    if (new Set(q.alts.map((a) => a.t.toLowerCase())).size !== 4) bad(id, "alternativas repetidas");
    for (const a of q.alts) if (!a.t || a.t.length > 100) bad(id, `alt com ${a.t?.length} caracteres`);
  }
  if (q.correct?.length !== 1 || !(q.correct[0] >= 0 && q.correct[0] < 4)) bad(id, "correct inválido");
  if (q.analise?.length !== 4) bad(id, "analise não tem 4 linhas");
  else q.analise.forEach((l, i) => { if (/Certa/.test(l.slice(0, 12)) !== (i === q.correct[0])) bad(id, "analise incoerente com correct"); });
}
console.log(`${QUESTIONS.length} perguntas, médias/difíceis ${lv.join("/")}; posições certas ${QUESTIONS.map((q) => "ABCD"[q.correct[0]]).join("")}`);
if (erros.length) { console.log(erros.join("\n")); console.log(`\n${erros.length} erros`); process.exitCode = 1; }

// regra de estilo ENEM: certa estritamente a mais longa em no máx. 40%; nenhuma alternativa < 60% da maior
{
  let longest = 0;
  for (const q of QUESTIONS) {
    const L = q.alts.map((a) => a.t.length), mx = Math.max(...L), c = L[q.correct[0]];
    if (c === mx && L.filter((x) => x === mx).length === 1) longest++;
    if (Math.min(...L) < 0.6 * mx) { console.log(`${q.id}: alternativa < 60% da maior`); process.exitCode = 1; }
  }
  console.log(`certa é a mais longa em ${longest} de ${QUESTIONS.length}`);
  if (longest > 0.4 * QUESTIONS.length) { console.log("excede 40%"); process.exitCode = 1; }
}
if (!process.exitCode) console.log("tudo confere");
