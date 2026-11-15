// Conferência de lin-figuras.mjs: node check-lin-figuras.mjs. Termina com "tudo confere"; gera preview-lin-figuras.html.
import fs from "node:fs";
import { FATOS, QUESTIONS, FIGS as FIGS_PROPRIAS, PATTERNS_USED, PLANO, PARES_SOBREPOSTOS } from "./lin-figuras.mjs";
import { checkTabela, FIGS as BASE } from "./lin-base.mjs";

let bad = 0;
const fail = (m) => { bad++; console.log("ERRO:", m); };
const FIGS = { ...BASE, ...FIGS_PROPRIAS };

// ---- tabela
for (const p of checkTabela(FATOS)) fail("tabela: " + p);
if (FATOS.length < 20) fail("poucas figuras na tabela");

// ---- exemplos: figuras que TAMBÉM servem ao exemplo (julgamento humano). Vazio = nenhuma das erradas serve.
// Justificativas das escolhas de alternativas (as figuras vizinhas foram tiradas do páreo no próprio PLANO):
//  catacrese/metáfora, elipse/zeugma, aliteração/assonância, sinestesia/metáfora, apóstrofe/personificação nunca aparecem juntas em "exemplo → qual é".
const tambemServe = {
  // "lin-fig-<alvo>-e2n": ["figura-que-também-serve", ...]  (todas vazias de propósito)
};
const idFato = (t) => FATOS.find((f) => f.nome === t)?.id;

// ---- perguntas
if (QUESTIONS.length !== 30) fail(`30 perguntas, há ${QUESTIONS.length}`);
const cont = { lvl: {}, fmt: {} }, ids = new Set();
for (const q of QUESTIONS) {
  if (ids.has(q.id)) fail(`id repetido ${q.id}`); ids.add(q.id);
  if (!/^lin-fig-[a-z]+-(n2d|d2n|e2n)$/.test(q.id)) fail(`${q.id}: prefixo/formato do id`);
  if (q.subj !== "linguagens" || q.pat !== 1 || !PATTERNS_USED.includes(1)) fail(`${q.id}: subj/pat`);
  const fmt = q.id.split("-").pop(); cont.lvl[q.lvl] = (cont.lvl[q.lvl] || 0) + 1; cont.fmt[fmt] = (cont.fmt[fmt] || 0) + 1;
  if (q.text.length > 120) fail(`${q.id}: enunciado longo`);
  if (!q.why || q.why.length > 150) fail(`${q.id}: why ${q.why?.length}`);
  if (!q.ref || !/https:\/\//.test(q.ref)) fail(`${q.id}: sem ref`);
  if (!(q.src === "no estilo do ENEM" || /^como no ENEM \d{4}/.test(q.src))) fail(`${q.id}: src`);
  if (!q.hint?.t) fail(`${q.id}: sem dica`);
  if (q.alts.length !== 4) fail(`${q.id}: ${q.alts.length} alternativas`);
  if (!Array.isArray(q.correct) || q.correct.length !== 1 || !(q.correct[0] >= 0 && q.correct[0] < 4)) fail(`${q.id}: correct`);
  if (new Set(q.alts.map((a) => a.t)).size !== 4) fail(`${q.id}: alternativas repetidas`);
  q.alts.forEach((a, i) => { if (!a.t || a.t.length > 46) fail(`${q.id}: alt ${i} (${a.t?.length})`); });
  if (!q.fig?.length) fail(`${q.id}: sem figura`);
  // a certa sai da tabela
  const alvo = q.id.split("-")[2], f = FATOS.find((x) => x.id === alvo);
  if (!f) { fail(`${q.id}: alvo desconhecido`); continue; }
  const campo = fmt === "d2n" || fmt === "e2n" ? "nome" : "def";
  if (q.alts[q.correct[0]].t !== f[campo]) fail(`${q.id}: a certa não é a da tabela`);
  // dica não entrega o nome
  const semAcento = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  if (semAcento(q.hint.t).includes(semAcento(f.nome.split(" ")[0]))) fail(`${q.id}: dica contém o nome da figura`);
  // elipse e zeugma (a zeugma é um tipo de elipse) nunca são alternativas uma da outra, em nenhum formato
  if (["elipse", "zeugma"].includes(alvo)) { const outra = alvo === "elipse" ? "zeugma" : "elipse"; if (q.alts.some((a) => a.t === FATOS.find((x) => x.id === outra)[campo])) fail(`${q.id}: ${outra} aparece como alternativa errada`); }
  for (const x of ["elipse", "zeugma"]) { const o = FATOS.find((y) => y.id === x); if ((o.confunde || []).some((c) => ["elipse", "zeugma"].includes(c) && c !== x)) fail(`confunde de ${x} cita elipse/zeugma`); }
  // exemplo → qual é
  if (fmt === "e2n") {
    if (q.fig[0].kind !== "lin-frase") fail(`${q.id}: figura devia ser lin-frase`);
    const erradas = q.alts.filter((_, i) => i !== q.correct[0]).map((a) => idFato(a.t));
    const extra = tambemServe[q.id] || [];
    for (const e of erradas) {
      if (!e) fail(`${q.id}: alternativa errada fora da tabela`);
      if (extra.includes(e)) fail(`${q.id}: ${e} também serve ao exemplo`);
      if (PARES_SOBREPOSTOS.some(([a, b]) => (a === alvo && b === e) || (b === alvo && a === e))) fail(`${q.id}: ${alvo} e ${e} podem conviver no exemplo`);
    }
    if (!q.hint.mark?.length) fail(`${q.id}: sem marca para circular`);
  }
}
const eq = (a, b, m) => { if (JSON.stringify(a) !== JSON.stringify(b)) fail(`${m}: esperado ${JSON.stringify(b)}, veio ${JSON.stringify(a)}`); };
eq([1, 2, 3].map((l) => cont.lvl[l]), [9, 12, 9], "níveis fácil/média/difícil");
eq([cont.fmt.n2d, cont.fmt.d2n, cont.fmt.e2n], [12, 11, 7], "formatos conceito→def / def→conceito / exemplo→qual");
if (PLANO.length !== 30) fail("PLANO != 30");

// ---- renderização (3 modos, dica) e tamanho real do texto
const minFont = (svg) => { const vb = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/), k = (svg.match(/scale\(([\d.]+)\)/) || [, 1])[1]; const fs = [...svg.matchAll(/font-size="([\d.]+)"/g)].map((m) => +m[1] * +k); return { w: +vb[1], min: fs.length ? Math.min(...fs) : Infinity }; };
let nrender = 0;
for (const q of QUESTIONS) for (const f of q.fig) for (const mode of ["ask", "uni", "reveal"]) for (const hint of [null, q.hint.mark || true]) {
  if (hint && mode !== "ask") continue;
  const sv = FIGS[f.kind](f, { mode, size: "main", hint }); nrender++;
  if (typeof sv !== "string" || !sv.startsWith("<svg")) { fail(`${q.id}: svg inválido`); continue; }
  if (/NaN|undefined/.test(sv)) fail(`${q.id}/${mode}: NaN ou undefined`);
  const { w, min } = minFont(sv), real = (min * 310) / w;
  if (real < 11.5) fail(`${q.id}/${mode}: fonte real ${real.toFixed(1)} px`);
}

// ---- preview 390 px: pergunta, figura (ask / dica / reveal), alternativas e a explicação
const css = `body{font-family:Trebuchet MS,Segoe UI,sans-serif;background:#eee9da;margin:0;padding:12px;color:#1c2541}.col{width:390px;margin:0 auto}.q{background:#fffdf6;border:2px solid #1c2541;border-radius:14px;padding:10px;margin:0 0 14px}.tag{font-size:12px;color:#6b7280}h2{font-size:16px;margin:6px 0}.fig svg{width:310px;display:block;margin:4px auto}.alt{border:2px solid #1c2541;border-radius:10px;padding:6px 8px;margin:5px 0;font-size:14px}.alt.c{background:#dff0d4}.why{font-size:13px;margin-top:6px}.dica{font-size:13px;color:#7a5c00}`;
const cols = QUESTIONS.map((q) => {
  const fg = (mode, hint) => q.fig.map((f) => FIGS[f.kind](f, { mode, size: "main", hint })).join("");
  const alts = q.alts.map((a, i) => `<div class="alt${q.correct[0] === i ? " c" : ""}">${"ABCD"[i]}) ${a.t}</div>`).join("");
  return `<div class="q"><div class="tag">${q.id} · nível ${q.lvl}</div><h2>${q.text}</h2><div class="fig">${fg("ask")}</div><div class="alts">${alts}</div><div class="dica">Dica: ${q.hint.t}</div><div class="tag">com dica</div><div class="fig">${fg("ask", q.hint.mark || true)}</div><div class="tag">reveal</div><div class="fig">${fg("reveal")}</div><div class="why">${q.why}</div><div class="tag">${q.src} · ${q.ref}</div></div>`;
}).join("");
fs.writeFileSync(new URL("./preview-lin-figuras.html", import.meta.url), `<!doctype html><meta charset="utf-8"><title>preview figuras</title><style>${css}</style><div class="col">${cols}</div>`);

console.log(`${QUESTIONS.length} perguntas · níveis ${JSON.stringify(cont.lvl)} · formatos ${JSON.stringify(cont.fmt)} · ${nrender} renderizações`);
console.log(bad ? `${bad} problema(s)` : "tudo confere");
process.exit(bad ? 1 : 0);
