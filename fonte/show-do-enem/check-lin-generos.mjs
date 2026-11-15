// Conferência de Gêneros textuais. Termina com "tudo confere". Gera preview-lin-generos.html.
import { writeFileSync } from "node:fs";
import { QUESTIONS, FIGS as FIG_GEN, FATOS, PATTERNS_USED, PARTES } from "./lin-generos.mjs";
import { FIGS as FIG_BASE, checkTabela } from "./lin-base.mjs";

const FIGS = { ...FIG_BASE, ...FIG_GEN };
const erros = [];
const bad = (id, m) => erros.push(`${id}: ${m}`);

for (const m of checkTabela(FATOS)) bad("FATOS", m);
if (QUESTIONS.length !== 30) bad("geral", `${QUESTIONS.length} perguntas em vez de 30`);
const lv = [1, 2, 3].map((l) => QUESTIONS.filter((q) => q.lvl === l).length);
if (lv.join() !== "10,12,8") bad("geral", `níveis ${lv.join("/")} em vez de 10/12/8`);
const fmt = { c: 0, d: 0, f: 0 };
for (const q of QUESTIONS) { const m = q.id.match(/-(c|d|f)\d?$/); if (m) fmt[m[1]]++; else bad(q.id, "id sem sufixo de formato"); }
if (fmt.f !== 20 || fmt.c !== 5 || fmt.d !== 5) bad("geral", `formatos f/c/d ${fmt.f}/${fmt.c}/${fmt.d} em vez de 20/5/5`);
if (JSON.stringify(PATTERNS_USED) !== "[3]") bad("geral", "PATTERNS_USED");

const ids = new Set(), usados = new Set();
for (const q of QUESTIONS) {
  const id = q.id;
  if (!/^lin-gen-/.test(id)) bad(id, "prefixo");
  if (ids.has(id)) bad(id, "id repetido"); ids.add(id);
  if (q.subj !== "linguagens" || q.pat !== 3) bad(id, "subj/pat");
  if (q.text.length > 120) bad(id, `text ${q.text.length} > 120`);
  if (!q.why || q.why.length > 150) bad(id, "why ausente ou > 150");
  if (!q.hint?.t) bad(id, "sem dica");
  if (!q.ref || !/https?:\/\//.test(q.ref)) bad(id, "ref sem link");
  if (!(q.src === "no estilo do ENEM" || /^como no ENEM (2014|2016|2019|2023) \(/.test(q.src))) bad(id, "src não confirmado: " + q.src);
  if (q.alts.length !== 4) bad(id, "não tem 4 alternativas");
  if (q.correct.length !== 1 || !(q.correct[0] >= 0 && q.correct[0] < 4)) bad(id, "correct inválido");
  const ch = q.alts.map((a) => a.t ?? JSON.stringify(a.fig));
  if (new Set(ch.map((x) => x.toLowerCase())).size !== 4) bad(id, "alternativas repetidas");
  for (const a of q.alts) if (a.t && a.t.length > 46) bad(id, `alt com ${a.t.length} caracteres`);
  if (!(q.fig?.length || q.alts.some((a) => a.fig))) bad(id, "sem figura");
  // a certa tem de ser a que a tabela diz
  const cert = q.alts[q.correct[0]].t, f0 = q.fig[0];
  if (f0.kind === "lin-gen-recorte") {
    const f = FATOS.find((x) => x.id === f0.genero);
    if (!f) bad(id, "gênero fora da tabela");
    else if (![f.def, f.marca, f.nome].includes(cert) && !(PARTES[f0.genero] && f0.oculta)) bad(id, "certa não sai da tabela");
    if (f0.oculta) { const nome = { lide: "Lide", ingr: "Ingredientes", aval: "Avaliação", fato: "Fato do dia" }[f0.oculta]; if (nome && cert !== nome) bad(id, `parte oculta "${f0.oculta}" não bate com a certa "${cert}"`); }
    for (const k of [...(f0.hl || []), ...(f0.oculta || []), ...[q.hint.mark || []].flat()]) if (!PARTES[f0.genero].includes(k) && !/^(q\d|b\d)$/.test(k)) bad(id, `parte "${k}" inexistente em ${f0.genero}`);
    // nenhuma errada pode ser def/marca/nome do mesmo gênero
    if (!f0.oculta) for (const a of q.alts) if (a.t !== cert && [f.def, f.marca, f.nome].includes(a.t)) bad(id, "errada igual à certa");
  }
  const figs = [...(q.fig || []), ...q.alts.filter((a) => a.fig).map((a) => a.fig)];
  for (const f of figs) {
    usados.add(f.kind);
    if (!FIGS[f.kind]) { bad(id, `kind ${f.kind} inexistente`); continue; }
    for (const mode of ["ask", "uni", "reveal"]) for (const size of ["main", "alt"]) {
      let out;
      try { out = FIGS[f.kind](f, { mode, size, hint: size === "main" ? q.hint.mark : undefined }); } catch (e) { bad(id, `render ${f.kind} ${mode}/${size}: ${e.message}`); continue; }
      const vb = out.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/);
      if (!out.startsWith("<svg") || !vb) { bad(id, "svg sem viewBox"); continue; }
      if (/NaN|undefined/.test(out)) bad(id, `NaN/undefined em ${f.kind}`);
      const [w, h] = [+vb[1], +vb[2]], px = size === "main" ? 310 : 150;
      const fontes = [...out.matchAll(/font-size="([\d.]+)"/g)].map((m) => +m[1]);
      if (fontes.length && (Math.min(...fontes) * px) / w < 11.5) bad(id, `fonte real ${(Math.min(...fontes) * px / w).toFixed(1)} px em ${f.kind}/${size}`);
      // texto cortado: largura estimada de cada rótulo cabe na caixa; âncoras dentro do quadro
      for (const m of out.matchAll(/<text x="([\d.-]+)" y="([\d.-]+)"[^>]*font-size="([\d.]+)"[^>]*>([^<]*)</g)) {
        const [x, y, fs, t] = [+m[1], +m[2], +m[3], m[4]];
        if (x < 0 || x > w || y < 0 || y > h) bad(id, `texto fora do quadro em ${f.kind}`);
        const larg = t.length * fs * 0.6;
        const anc = /text-anchor="middle"/.test(m[0]);
        if ((anc && (x - larg / 2 < 6 || x + larg / 2 > w - 6)) || (!anc && x + larg > w - 6)) bad(id, `texto "${t}" pode vazar (${larg.toFixed(0)} px)`);
      }
    }
  }
}
// rótulos que cabem em suas caixas (estimativa 0,6·fonte por caractere)
import { readFileSync } from "node:fs";
const src = readFileSync(new URL("./lin-generos.mjs", import.meta.url), "utf8");
for (const m of src.matchAll(/P\("(\w+)", (\d+), (\d+), (\d+), (\d+), "([^"]+)"(, \{[^}]*\})?\)/g)) {
  const [, k, , , w, , label, o] = m, el = /e: true/.test(o || ""), cen = /c: true/.test(o || "") || !/l: [1-9]/.test(o || "");
  const util = el ? w * 0.74 - 8 : w - 18;
  if (label.length * 12.5 * 0.58 > util) bad("layout", `rótulo "${label}" (${k}) não cabe em ${w} px`);
  void cen;
}
if (!usados.has("lin-gen-recorte")) bad("geral", "nenhum recorte usado");

// prévia 390 px
const SH = (f, q, mode, hint) => FIGS[f.kind](f, { mode, size: "main", hint });
let html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=390"><style>body{margin:0 auto;width:390px;background:#f3ecd9;font-family:Trebuchet MS,sans-serif;color:#1c2541}section{background:#fffdf6;border:2px solid #1c2541;border-radius:14px;margin:10px;padding:10px}h3{margin:0 0 6px;font-size:14px}.f{width:310px;margin:4px auto}.f svg{width:100%;display:block}ol{margin:4px 0;padding-left:20px;font-size:13px}.ok{font-weight:800;color:#2f9a54}small{color:#6b7191}.tag{font-size:11px;color:#7d4fb3;font-weight:800}</style>`;
for (const q of QUESTIONS) {
  const f = q.fig[0];
  html += `<section><div class="tag">${q.id} · nível ${q.lvl}</div><h3>${q.text}</h3>
<div class="f">${SH(f, q, "ask")}</div><small>dica: ${q.hint.t}</small><div class="f">${SH(f, q, "ask", q.hint.mark)}</div>
<ol>${q.alts.map((a, i) => `<li${i === q.correct[0] ? ' class="ok"' : ""}>${a.t}</li>`).join("")}</ol><small>${q.why}</small><div class="f">${SH(f, q, "reveal")}</div></section>`;
}
writeFileSync(new URL("./preview-lin-generos.html", import.meta.url), html);

if (erros.length) { console.log(erros.join("\n")); console.log(`\n${erros.length} problemas`); process.exitCode = 1; }
else console.log(`gêneros: tudo confere (${QUESTIONS.length} perguntas, níveis ${lv.join("/")}, formatos f/c/d ${fmt.f}/${fmt.c}/${fmt.d}, ${FATOS.length} fatos)`);
