// Conferência de lin-enem-figuras.mjs: node check-lin-enem-figuras.mjs. Termina com "tudo confere".
import { QUESTIONS, FIGS, PATTERNS_USED } from "./lin-enem-figuras.mjs";
let bad = 0;
const fail = (m) => { bad++; console.log("ERRO:", m); };
if (QUESTIONS.length !== 13) fail(`13 perguntas, há ${QUESTIONS.length}`);
const lv = { 2: 0, 3: 0 }, ids = new Set(), pos = [0, 0, 0, 0]; let maisLonga = 0;
if (JSON.stringify(PATTERNS_USED) !== "[1]") fail("PATTERNS_USED");
if (Object.keys(FIGS).length) fail("FIGS deve ser {}");
for (const q of QUESTIONS) {
  if (ids.has(q.id)) fail(`id repetido ${q.id}`); ids.add(q.id);
  if (!/^lin-enem-fig-[a-z0-9-]+$/.test(q.id)) fail(`${q.id}: formato do id`);
  if (q.subj !== "linguagens" || q.pat !== 1 || q.enem !== true) fail(`${q.id}: subj/pat/enem`);
  lv[q.lvl] = (lv[q.lvl] || 0) + 1;
  if (![2, 3].includes(q.lvl)) fail(`${q.id}: lvl ${q.lvl}`);
  if (!q.text || q.text.length > 120) fail(`${q.id}: enunciado ${q.text?.length}`);
  if (!q.base?.texto || q.base.texto.length > 450) fail(`${q.id}: base.texto ${q.base?.texto?.length}`);
  if (!q.base?.fonte) fail(`${q.id}: sem base.fonte`);
  if (q.alts.length !== 4) fail(`${q.id}: ${q.alts.length} alternativas`);
  if (new Set(q.alts.map((a) => a.t)).size !== 4) fail(`${q.id}: alternativas repetidas`);
  q.alts.forEach((a, i) => { if (!a.t || a.t.length > 100) fail(`${q.id}: alt ${i} com ${a.t?.length}`); });
  if (!Array.isArray(q.correct) || q.correct.length !== 1 || !(q.correct[0] >= 0 && q.correct[0] < 4)) fail(`${q.id}: correct`); else pos[q.correct[0]]++;
  { const L = q.alts.map((a) => a.t.length), mx = Math.max(...L), c = L[q.correct[0]];
    if (c === mx && L.filter((x) => x === mx).length === 1) maisLonga++;
    if (Math.min(...L) < 0.6 * mx) fail(`${q.id}: alternativa com menos de 60% da maior (${L.join("/")})`);
    if (q.alts.some((a) => a.t.split(/\s+/).length < 4)) fail(`${q.id}: alternativa curta demais (só rótulo?)`); }
  if (!Array.isArray(q.analise) || q.analise.length !== 4 || q.analise.some((l) => !l || l.length < 15)) fail(`${q.id}: analise precisa de 4 linhas`);
  else if (!/^[A-D]\) Certa/.test(q.analise[q.correct[0]]) || q.analise.filter((l) => /^[A-D]\) Certa/.test(l)).length !== 1) fail(`${q.id}: analise não aponta a certa na posição correta`);
  if (!q.hint?.t || !q.hint?.trecho) fail(`${q.id}: hint t/trecho`);
  if (q.hint?.trecho && !q.base.texto.includes(q.hint.trecho)) fail(`${q.id}: hint.trecho fora do texto`);
  if (!q.destaque || !q.base.texto.includes(q.destaque)) fail(`${q.id}: destaque fora do texto`);
  if (!q.why || q.why.length > 150) fail(`${q.id}: why ${q.why?.length}`);
  if (!(q.src === "no estilo do ENEM" || /^como no ENEM \d{4}/.test(q.src))) fail(`${q.id}: src`);
  if (!q.ref || !/https:\/\//.test(q.ref)) fail(`${q.id}: ref sem link`);
  else if (!/https:\/\/pt\.wikisource/.test(q.ref)) fail(`${q.id}: ref sem link do texto-base`);
  if (q.fig) fail(`${q.id}: não deve ter fig`);
}
if (lv[2] !== 7 || lv[3] !== 6) fail(`níveis: esperava 7 médias / 6 difíceis, há ${lv[2]} / ${lv[3]}`);
if (maisLonga > 0.4 * QUESTIONS.length) fail(`a certa é a mais longa em ${maisLonga} de ${QUESTIONS.length} (máx 40%)`);
console.log(`certa estritamente mais longa em ${maisLonga} de ${QUESTIONS.length}`);
console.log(`${QUESTIONS.length} perguntas, médias ${lv[2]}, difíceis ${lv[3]}, posição da certa A/B/C/D: ${pos.join("/")}`);
console.log(bad ? `\n${bad} erros` : "\ntudo confere");
process.exitCode = bad ? 1 : 0;
