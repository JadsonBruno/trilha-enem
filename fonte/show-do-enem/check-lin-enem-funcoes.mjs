// node check-lin-enem-funcoes.mjs
import { QUESTIONS, FIGS, PATTERNS_USED } from "./lin-enem-funcoes.mjs";
let bad = 0;
const fail = (m) => { bad++; console.log("ERRO  " + m); };
const Q = QUESTIONS;
if (Q.length !== 10) fail(`esperava 10 perguntas, há ${Q.length}`);
const lv = (n) => Q.filter((q) => q.lvl === n).length;
if (lv(2) !== 5 || lv(3) !== 5) fail(`níveis ${lv(2)}/${lv(3)} (esperava 5/5)`);
if (PATTERNS_USED.join() !== "2") fail("PATTERNS_USED deve ser [2]");
if (Object.keys(FIGS).length) fail("FIGS deve ser {}");
const ids = new Set();
for (const q of Q) {
  const p = q.id;
  if (!/^lin-enem-fun-/.test(p)) fail(`${p}: id fora do padrão`);
  if (ids.has(p)) fail(`${p}: id repetido`); ids.add(p);
  if (q.subj !== "linguagens" || q.pat !== 2) fail(`${p}: subj/pat`);
  if (q.enem !== true) fail(`${p}: enem != true`);
  if (!q.text || q.text.length > 120) fail(`${p}: text ${q.text?.length}`);
  if (q.alts.length !== 4) fail(`${p}: ${q.alts.length} alternativas`);
  if (new Set(q.alts.map((a) => a.t)).size !== 4) fail(`${p}: alternativas repetidas`);
  for (const a of q.alts) if (!a.t || a.t.length > 100) fail(`${p}: alternativa com ${a.t?.length} caracteres`);
  if (q.correct.length !== 1 || !(q.correct[0] >= 0 && q.correct[0] < 4)) fail(`${p}: correct`);
  const b = q.base;
  if (!b?.texto || b.texto.length > 450) fail(`${p}: base.texto ${b?.texto?.length}`);
  if (!b?.fonte) fail(`${p}: sem base.fonte`);
  if (!Array.isArray(q.analise) || q.analise.length !== 4 || q.analise.some((x) => !x)) fail(`${p}: analise precisa de 4 linhas`);
  if (!q.hint?.t || !q.hint?.trecho || !b?.texto.includes(q.hint.trecho)) fail(`${p}: hint.trecho fora do texto`);
  if (!q.destaque || !b?.texto.includes(q.destaque)) fail(`${p}: destaque fora do texto`);
  if (!q.why || q.why.length > 150) fail(`${p}: why ${q.why?.length}`);
  if (!q.src) fail(`${p}: sem src`);
  if (!/https?:\/\//.test(q.ref || "")) fail(`${p}: ref sem link`);
}
const dist = Q.map((q) => q.correct[0]);
console.log("gabarito:", dist.join(" "), "| níveis:", lv(2), "/", lv(3));
console.log(bad ? `\n${bad} erros` : "tudo confere (10 perguntas)");
process.exitCode = bad ? 1 : 0;
