// Conferência de lin-funcoes.mjs: node check-lin-funcoes.mjs. Gera preview-lin-funcoes.html. Termina com "tudo confere".
import fs from "node:fs";
import { checkTabela, FIGS as BASE_FIGS } from "./lin-base.mjs";
import { FATOS, QUESTIONS } from "./lin-funcoes.mjs";

let bad = 0;
const fail = (m) => { bad++; console.log("ERRO  " + m); };
for (const m of checkTabela(FATOS)) fail("tabela: " + m);

if (QUESTIONS.length !== 20) fail(`esperava 20 perguntas, há ${QUESTIONS.length}`);
const lv = [1, 2, 3].map((l) => QUESTIONS.filter((q) => q.lvl === l).length);
if (lv.join() !== "6,8,6") fail(`níveis ${lv.join("/")} (esperava 6/8/6)`);
const fmt = (q) => (q.id.endsWith("-exemplo2nome") ? 0 : 0);
const cont = { cd: 0, dc: 0, ex: 0 };
for (const q of QUESTIONS) {
  if (/-exemplo2nome-/.test(q.id)) cont.ex++; else if (/-(nome2def|nome2marca)-/.test(q.id)) cont.cd++; else if (/-(def2nome|marca2nome)-/.test(q.id)) cont.dc++; else fail(`${q.id}: formato desconhecido`);
}
if (`${cont.cd}/${cont.dc}/${cont.ex}` !== "9/6/5") fail(`formatos ${cont.cd}/${cont.dc}/${cont.ex} (esperava 9/6/5)`);

const ids = new Set();
for (const q of QUESTIONS) {
  if (ids.has(q.id)) fail(`${q.id}: id repetido`); ids.add(q.id);
  if (!q.id.startsWith("lin-fun-") || q.subj !== "linguagens" || q.pat !== 2) fail(`${q.id}: id/subj/pat`);
  if (q.alts.length !== 4) fail(`${q.id}: ${q.alts.length} alternativas`);
  if (q.correct.length !== 1 || !q.alts[q.correct[0]]) fail(`${q.id}: correct inválido`);
  const ts = q.alts.map((a) => a.t); if (new Set(ts.map((t) => String(t).toLowerCase())).size !== 4) fail(`${q.id}: alternativas repetidas`);
  for (const t of ts) if (!t || t.length > 46) fail(`${q.id}: alternativa "${t}" com ${t?.length} caracteres`);
  if (!q.fig?.length) fail(`${q.id}: sem figura`);
  if (!q.ref) fail(`${q.id}: sem ref`);
  if (q.text.length > 120) fail(`${q.id}: enunciado longo`);
  if (!q.hint?.t) fail(`${q.id}: sem dica`);
  if (!q.why || q.why.length > 150) fail(`${q.id}: why ausente ou > 150`);
  // a certa deve ser o campo da tabela do alvo
  for (const f of q.fig) if (!BASE_FIGS[f.kind]) fail(`${q.id}: kind ${f.kind} sem renderizador`);
  for (const mode of ["ask", "uni", "reveal"]) for (const f of q.fig) { const s = BASE_FIGS[f.kind](f, { mode, size: "main", hint: q.hint.mark || ["x"] }); if (!s.startsWith("<svg")) fail(`${q.id}: render ${mode}`); }
}

// preview 390 px
const css = `body{font-family:Trebuchet MS,Segoe UI,sans-serif;background:#eee9da;margin:0;padding:12px;color:#1c2541}.col{width:390px;margin:0 auto}.q{background:#fffdf6;border:2px solid #1c2541;border-radius:14px;padding:12px;margin:0 0 16px}.tag{font-size:12px;color:#7d4fb3;font-weight:700}h2{font-size:16px;margin:4px 0 8px}.fig{display:flex;gap:6px;margin:6px 0}.fig>div{flex:1;text-align:center}.fig svg{width:100%;max-width:340px;height:auto}.alts{display:grid;grid-template-columns:1fr;gap:6px;margin-top:8px}.alt{border:1.5px solid #1c2541;border-radius:10px;padding:8px;font-size:14px;background:#fff}.alt.c{background:#dff3e3;border-color:#2f9a54}.why{font-size:12px;color:#444;margin-top:8px}`;
const fig = (q, mode, hint) => q.fig.map((f) => `<div>${BASE_FIGS[f.kind](f, { mode, size: "main", hint })}</div>`).join("");
const cols = QUESTIONS.map((q) => `<div class="q"><div class="tag">${q.id} · nível ${q.lvl}</div><h2>${q.text}</h2><div class="fig">${fig(q, "ask")}</div><div class="alts">${q.alts.map((a, i) => `<div class="alt${q.correct[0] === i ? " c" : ""}">${"ABCD"[i]}) ${a.t}</div>`).join("")}</div><div class="tag" style="margin-top:8px">dica: ${q.hint.t}</div><div class="fig">${fig(q, "ask", q.hint.mark || ["x"])}</div><div class="tag">revelado</div><div class="fig">${fig(q, "reveal")}</div><div class="why">${q.why}<br><i>${q.src} · ${q.ref}</i></div></div>`).join("");
fs.writeFileSync(new URL("./preview-lin-funcoes.html", import.meta.url), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=390"><title>preview funções</title><style>${css}</style><div class="col">${cols}</div>`);

console.log(`${QUESTIONS.length} perguntas · níveis ${lv.join("/")} · formatos ${cont.cd}/${cont.dc}/${cont.ex} · ${FATOS.length} fatos`);
console.log(bad ? `${bad} problema(s)` : "tudo confere");
process.exit(bad ? 1 : 0);
