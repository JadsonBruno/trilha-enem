// Conferência do lote bio-celula.mjs. Termina com "tudo confere" se estiver tudo certo; também gera preview-celula.html.
import fs from "node:fs";
import { QUESTIONS, FIGS, PATTERNS_USED, osmose, divide, nearest, isMono, compativeis, paternas, ABSORCAO } from "./bio-celula.mjs";

let bad = 0;
const fail = (m) => { bad++; console.log("ERRO:", m); };
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) fail(`${m}: esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`); };

// ---------------------------------------------------------------- perguntas
if (QUESTIONS.length !== 25) fail(`25 perguntas, há ${QUESTIONS.length}`);
const ids = new Set();
const cont = { lvl: {}, pat: {} };
for (const q of QUESTIONS) {
  if (ids.has(q.id)) fail(`id repetido ${q.id}`); ids.add(q.id);
  if (!/^bio-(cel|evo|biotec|plan)-/.test(q.id)) fail(`${q.id}: prefixo do id`);
  if (q.subj !== "biologia") fail(`${q.id}: subj`);
  if (![4, 6, 7, 8].includes(q.pat) || !PATTERNS_USED.includes(q.pat)) fail(`${q.id}: pat ${q.pat}`);
  cont.lvl[q.lvl] = (cont.lvl[q.lvl] || 0) + 1; cont.pat[q.pat] = (cont.pat[q.pat] || 0) + 1;
  if (q.text.length > 120) fail(`${q.id}: enunciado ${q.text.length} > 120`);
  if (q.why.length > 150) fail(`${q.id}: why ${q.why.length} > 150`);
  if (!q.ref || q.ref.length < 10) fail(`${q.id}: sem ref`);
  if (!q.src || !(q.src === "no estilo do ENEM" || /^como no ENEM \d{4}/.test(q.src))) fail(`${q.id}: src`);
  if (!q.hint || !q.hint.t) fail(`${q.id}: sem dica`);
  if (q.alts.length !== 4) fail(`${q.id}: ${q.alts.length} alternativas`);
  if (!Array.isArray(q.correct) || q.correct.length !== 1 || !(q.correct[0] >= 0 && q.correct[0] < 4)) fail(`${q.id}: correct ${JSON.stringify(q.correct)}`);
  const sig = q.alts.map((a) => (a.t ? "t:" + a.t : "f:" + JSON.stringify(a.fig) + (a.cap || "")));
  if (new Set(sig).size !== 4) fail(`${q.id}: alternativas repetidas`);
  q.alts.forEach((a, i) => { if (a.t && a.t.length > 46) fail(`${q.id}: alt ${i} com ${a.t.length} caracteres`); if (a.cap && a.cap.length > 46) fail(`${q.id}: cap ${i} longa`); if (!a.t && !a.fig) fail(`${q.id}: alt ${i} vazia`); });
  const figs = [...(q.fig || []), ...q.alts.filter((a) => a.fig).map((a) => a.fig)];
  if (!figs.length) fail(`${q.id}: sem figura`);
  if (q.fig.length > 2) fail(`${q.id}: mais de 2 figuras`);
  for (const f of figs) if (!FIGS[f.kind]) fail(`${q.id}: kind ${f.kind} não existe`);
}
eq(cont.lvl, { 1: 8, 2: 10, 3: 7 }, "contagem por nível");
eq(cont.pat, { 4: 9, 6: 6, 7: 5, 8: 5 }, "contagem por padrão");

// ---------------------------------------------------------------- renderização e legibilidade real
// fonte na tela = font-size x (340 main | 150 alt) / largura do viewBox; mínimo 11,5 px
const minFont = (svg) => {
  const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
  const k = (svg.match(/scale\(([\d.]+)\)/) || [, 1])[1];
  const fs = [...svg.matchAll(/font-size="([\d.]+)"/g)].map((m) => +m[1] * +k);
  return { w: +vb[1], h: +vb[2], min: fs.length ? Math.min(...fs) : Infinity };
};
const MODES = ["ask", "uni", "reveal"], SIZES = ["main", "alt"];
const used = { main: new Set(), alt: new Set() };
for (const q of QUESTIONS) { (q.fig || []).forEach((f) => used.main.add(f.kind)); q.alts.forEach((a) => a.fig && used.alt.add(a.fig.kind)); }
let nrender = 0;
for (const q of QUESTIONS) {
  const itens = [...(q.fig || []).map((f) => [f, "main"]), ...q.alts.filter((a) => a.fig).map((a) => [a.fig, "alt"])];
  for (const [f, size] of itens) for (const mode of MODES) for (const hint of [null, q.hint.mark]) {
    if (hint && (mode !== "ask" || size === "alt")) continue;
    const sv = FIGS[f.kind](f, { mode, size, hint });
    nrender++;
    if (typeof sv !== "string" || !sv.startsWith("<svg") || !/viewBox="0 0 [\d.]+ [\d.]+"/.test(sv)) { fail(`${q.id}/${f.kind}: svg inválido`); continue; }
    if (/NaN|undefined/.test(sv)) fail(`${q.id}/${f.kind}/${mode}/${size}: NaN ou undefined no svg`);
    const { w, min } = minFont(sv), real = (min * (size === "main" ? 340 : 150)) / w;
    if (w > (size === "main" ? 520 : 330)) fail(`${q.id}/${f.kind}/${size}: viewBox largo (${w})`);
    if (real < 11.5) fail(`${q.id}/${f.kind}/${mode}/${size}: fonte real ${real.toFixed(1)} px < 11,5`);
    if (hint && !sv.includes("hintring")) fail(`${q.id}/${f.kind}: dica sem anel`);
  }
}
// todo kind existe e renderiza nos 3 modos x 2 tamanhos (com um exemplo qualquer vindo das perguntas)
const exemplo = {};
for (const q of QUESTIONS) for (const f of [...q.fig, ...q.alts.filter((a) => a.fig).map((a) => a.fig)]) exemplo[f.kind] ||= f;
for (const [k, fn] of Object.entries(FIGS)) {
  if (!k.startsWith("cel-")) fail(`kind ${k} sem prefixo cel-`);
  if (!exemplo[k]) { fail(`kind ${k} não é usado`); continue; }
  for (const mode of MODES) for (const size of SIZES) {
    const sv = fn(exemplo[k], { mode, size });
    if (typeof sv !== "string" || !sv.startsWith("<svg") || !/viewBox=/.test(sv)) fail(`${k}/${mode}/${size}: svg inválido`);
    else if (minFont(sv).w > (size === "main" ? 520 : 330)) fail(`${k}/${size}: viewBox largo`);
    nrender++;
  }
}
for (const k of used.alt) if (used.main.has(k) === false && k !== "cel-osmose") fail(`alt ${k}: confira legibilidade`);

// ---------------------------------------------------------------- modelos em casos conhecidos
eq(osmose({ in: 0.9, out: 0 }).result, "incha", "hemácia em água pura incha");
eq(osmose({ in: 0.9, out: 2 }).result, "murcha", "hemácia em meio concentrado murcha");
eq(osmose({ in: 0.9, out: 0.9 }).result, "normal", "hemácia em meio isotônico");
eq(osmose({ in: 0.9, out: 0, parede: true }).result, "túrgida", "célula vegetal em água pura fica túrgida");
eq(osmose({ in: 0.9, out: 2, parede: true }).result, "plasmolisada", "célula vegetal em meio concentrado");
eq(osmose({ in: 0.9, out: 0.3 }).tonic, "hipotônico", "meio diluído é hipotônico");
eq(divide("mitose", 46), { celulas: 2, cromossomos: 46 }, "mitose mantém 2n");
eq(divide("meiose", 46), { celulas: 4, cromossomos: 23 }, "meiose reduz para n");
const hum = ["Orangotango", ["Gorila", ["Humano", "Chimpanzé"]]], hum2 = [["Humano", "Chimpanzé"], ["Gorila", "Orangotango"]], rot = [[["Chimpanzé", "Humano"], "Gorila"], "Orangotango"];
eq(nearest(hum, "Humano"), ["Chimpanzé"], "humano mais próximo de chimpanzé que de gorila");
eq(nearest(rot, "Humano"), ["Chimpanzé"], "rotacionar nós não muda o parentesco");
eq(nearest(hum2, "Gorila"), ["Orangotango"], "irmãos em árvore balanceada");
eq(isMono(hum, ["Humano", "Chimpanzé"]), true, "humano+chimpanzé monofilético");
eq(isMono(hum, ["Gorila", "Humano"]), false, "gorila+humano não é monofilético");
eq(isMono(["A", ["B", ["C", "D"]]], ["B", "C", "D"]), true, "B,C,D monofilético");
const g = (filho, ...sus) => [{ n: "Mãe", b: [1, 3, 5] }, { n: "Filho", b: filho }, ...sus.map((b, i) => ({ n: "S" + i, b }))];
eq(compativeis(g([1, 7, 9], [7, 2], [9, 2], [1, 3])), [], "filho com bandas que nenhum candidato explica: nenhum compatível");
eq(compativeis(g([1, 3, 8], [8, 4], [2, 9])), ["S0"], "um único compatível");
eq(compativeis(g([1, 3], [4], [5])), ["S0", "S1"], "filho só com bandas da mãe: todos compatíveis");
eq(paternas([1, 3, 5], [1, 4, 5]), [4], "banda paterna");
eq(ABSORCAO.find((a) => a[0] === "verde")[1] < 0.3, true, "clorofila absorve pouco o verde");

// ---------------------------------------------------------------- preview avulso
const css = `body{font-family:Trebuchet MS,Segoe UI,sans-serif;background:#eee9da;margin:0;padding:12px;color:#1c2541}.col{width:390px;margin:0 auto}.q{background:#fffdf6;border:2px solid #1c2541;border-radius:14px;padding:12px;margin:0 0 16px}.tag{font-size:12px;color:#4c9a3c;font-weight:700}h2{font-size:16px;margin:4px 0 8px}.fig{display:flex;gap:6px;margin:6px 0}.fig>div{flex:1;text-align:center;font-size:11px;color:#6b7191}.fig svg{width:100%;max-width:340px;height:auto}.alts{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px}.alt{border:1.5px solid #1c2541;border-radius:10px;padding:6px;font-size:13px;background:#fff;text-align:center}.alt svg{width:150px;height:auto}.alt.c{background:#dff3e3;border-color:#2f9a54}.why{font-size:12px;color:#444;margin-top:8px}`;
const cols = QUESTIONS.map((q) => {
  const fig = (mode, hint) => (q.fig || []).map((f) => `<div>${FIGS[f.kind](f, { mode, size: "main", hint })}<br>${f.cap || ""}</div>`).join("");
  const alts = q.alts.map((a, i) => `<div class="alt${q.correct[0] === i ? " c" : ""}">${a.fig ? FIGS[a.fig.kind](a.fig, { mode: "ask", size: "alt" }) + "<br>" : ""}${"ABCD"[i]}) ${a.t || a.cap || ""}${a.fig && a.t ? "" : ""}</div>`).join("");
  return `<div class="q"><div class="tag">${q.id} · nível ${q.lvl} · padrão ${q.pat}</div><h2>${q.text}</h2><div class="fig">${fig("ask")}</div><div class="alts">${alts}</div><div class="tag" style="margin-top:8px">dica: ${q.hint.t}</div><div class="fig">${fig("ask", q.hint.mark)}</div><div class="tag">revelado</div><div class="fig">${fig("reveal")}</div><div class="why">${q.why}<br><i>${q.src} · ${q.ref}</i></div></div>`;
}).join("");
fs.writeFileSync(new URL("./preview-celula.html", import.meta.url), `<!doctype html><meta charset="utf-8"><title>preview célula</title><style>${css}</style><div class="col">${cols}</div>`);

console.log(`${QUESTIONS.length} perguntas · níveis ${JSON.stringify(cont.lvl)} · padrões ${JSON.stringify(cont.pat)} · ${nrender} renderizações`);
console.log(bad ? `${bad} problema(s)` : "tudo confere");
process.exit(bad ? 1 : 0);
