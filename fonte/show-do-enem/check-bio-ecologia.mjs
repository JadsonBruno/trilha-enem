// Conferência das perguntas de Ecologia. Termina com "tudo confere" se estiver tudo certo.
import { writeFileSync } from "node:fs";
import { QUESTIONS, FIGS, PATTERNS_USED, TEIAS, modeloTeia, energiaNivel, concNivel, piramideEnergiaValida, relacaoPorSinais } from "./bio-ecologia.mjs";

const erros = [];
const bad = (id, m) => erros.push(`${id}: ${m}`);
const ids = new Set();
const cont = { 1: 0, 2: 0, 3: 0 };

for (const q of QUESTIONS) {
  const id = q.id;
  if (!/^bio-eco-/.test(id)) bad(id, "id sem prefixo bio-eco-");
  if (ids.has(id)) bad(id, "id repetido");
  ids.add(id);
  if (q.subj !== "biologia" || q.pat !== 1) bad(id, "subj/pat");
  cont[q.lvl] = (cont[q.lvl] || 0) + 1;
  if (q.text.length > 120) bad(id, `text ${q.text.length} > 120`);
  if (q.why.length > 150) bad(id, `why ${q.why.length} > 150`);
  if (q.alts.length !== 4) bad(id, "não tem 4 alternativas");
  if (!Array.isArray(q.correct) || q.correct.length !== 1 || !(q.correct[0] >= 0 && q.correct[0] < 4)) bad(id, "correct inválido");
  const chaves = q.alts.map((a) => (a.t !== undefined ? "t:" + a.t : "f:" + JSON.stringify(a.fig)));
  if (new Set(chaves).size !== 4) bad(id, "alternativas repetidas");
  for (const a of q.alts) if (a.t !== undefined && a.t.length > 46) bad(id, `alt "${a.t}" ${a.t.length} > 46`);
  if (!(q.fig?.length || q.alts.some((a) => a.fig))) bad(id, "sem figura");
  if (q.fig && q.fig.length > 2) bad(id, "mais de 2 figuras");
  if (!q.hint?.t) bad(id, "sem hint");
  if (!q.ref || q.ref.length < 20) bad(id, "sem ref");
  if (!/^(no estilo do ENEM$|como no ENEM (Digital |PPL )?2020 \()/.test(q.src)) bad(id, "src não confirmado: " + q.src);
  // a dica só diz onde olhar: nunca marca a própria resposta
  const mk = q.hint.mark;
  for (const f of q.fig || []) {
    if (f.kind === "eco-ciclo" && mk === f.hl) bad(id, "hint marca a seta da resposta");
    if (f.kind === "eco-teia" && (f.hl || []).includes(mk)) bad(id, "hint marca o organismo da resposta");
    if (f.kind === "eco-piramide" && mk === f.hl + 1) bad(id, "hint marca o nível da resposta");
    if (f.kind === "eco-grafico" && f.hl !== undefined && mk === f.hl + 1) bad(id, "hint marca o ponto da resposta");
    if (f.kind === "eco-bioacum" && mk === f.hlRow) bad(id, "hint marca a cadeia da resposta");
  }
  const figs = [...(q.fig || []), ...q.alts.filter((a) => a.fig).map((a) => a.fig)];
  for (const f of figs) {
    if (!FIGS[f.kind]) { bad(id, `kind ${f.kind} não existe em FIGS`); continue; }
    if (!f.kind.startsWith("eco-")) bad(id, "kind sem prefixo eco-");
    for (const mode of ["ask", "uni", "reveal"]) for (const size of ["main", "alt"]) for (const hint of [undefined, q.hint.mark]) {
      let out;
      try { out = FIGS[f.kind](f, { mode, size, hint }); } catch (e) { bad(id, `render ${f.kind} ${mode}/${size}: ${e.message}`); continue; }
      if (typeof out !== "string" || !out.startsWith("<svg") || !/viewBox="0 0 [\d.]+ [\d.]+"/.test(out)) { bad(id, `svg inválido ${f.kind}`); continue; }
      const fontes = [...out.matchAll(/font-size="([\d.]+)"/g)].map((m) => +m[1]);
      // tamanho REAL na tela: main ~340 px, alt ~150 px; fonte real = font-size × px ÷ largura do viewBox ≥ 11,5
      const ehAlt = q.alts.some((a) => a.fig === f);
      if (fontes.length && (size === "alt") === ehAlt) { const px = ehAlt ? 150 : 340, wv = +out.match(/viewBox="0 0 ([0-9.]+)/)[1], real = (Math.min(...fontes) * px) / wv; if (real < 11.5) bad(id, `fonte real ${real.toFixed(1)} px < 11,5 em ${f.kind}/${size} (font ${Math.min(...fontes)}, viewBox ${wv})`); }
      if (/NaN|undefined/.test(out)) bad(id, `NaN/undefined em ${f.kind} ${mode}/${size}`);
      const w = +out.match(/viewBox="0 0 ([\d.]+)/)[1];
      const h = +out.match(/viewBox="0 0 [\d.]+ ([\d.]+)/)[1];
      for (const m of out.matchAll(/<text x="(-?[\d.]+)" y="(-?[\d.]+)"/g)) if (+m[1] < 0 || +m[1] > w || +m[2] < 0 || +m[2] > h) bad(id, `texto fora do quadro (${m[1]},${m[2]}) em ${f.kind}`);
    }
  }
}

if (cont[1] !== 7 || cont[2] !== 8 || cont[3] !== 5) bad("geral", `níveis ${cont[1]}/${cont[2]}/${cont[3]} em vez de 7/8/5`);
if (QUESTIONS.length !== 20) bad("geral", "não são 20 perguntas");
if (JSON.stringify(PATTERNS_USED) !== "[1]") bad("geral", "PATTERNS_USED");

// ---- modelo do grafo em teias conhecidas
const eq = (a, b, m) => JSON.stringify(a) !== JSON.stringify(b) && bad("modelo", `${m}: ${JSON.stringify(a)} ≠ ${JSON.stringify(b)}`);
const cadeia = modeloTeia(
  [{ id: "capim", r: "p" }, { id: "gafa", r: "c" }, { id: "sapo", r: "c" }, { id: "cobra", r: "c" }],
  [["capim", "gafa"], ["gafa", "sapo"], ["sapo", "cobra"]]);
eq(cadeia.nivel("sapo"), 3, "sapo é nível 3");
eq(cadeia.nivel("sapo") - 1, 2, "sapo é consumidor secundário");
eq(cadeia.nivel("capim"), 1, "capim produtor");
eq(cadeia.perdeTudo("gafa"), ["sapo", "cobra"], "retirar gafanhoto");
eq(energiaNivel(10000, 4), 10, "10 000 kcal no produtor → 10 no 4º nível");
eq(energiaNivel(10000, 1), 10000, "1º nível");
eq(concNivel(0.3, 1, 3), 30, "bioacumulação x10 duas vezes");
eq(piramideEnergiaValida([100, 10, 1]), true, "pirâmide válida");
eq(piramideEnergiaValida([1, 10, 100]), false, "pirâmide invertida inválida");
eq(relacaoPorSinais("+", "0"), "Comensalismo", "sinais +0");
eq(relacaoPorSinais("-", "+"), "Parasitismo", "sinais −+");
const T = (k) => modeloTeia(TEIAS[k].nodes, TEIAS[k].edges);
eq(T("mata").niveis("sagui"), [2, 3], "sagui 2º e 3º");
eq(T("amazonia").niveis("onca"), [3, 4, 5], "onça 3, 4 e 5");
eq(T("amazonia").niveis("jiboia"), [3, 4], "jiboia 3 e 4");
eq(T("mangue").perdeTudo("caramujo"), ["siri"], "sem caramujo só o siri perde tudo");
eq(T("mangue").perdeTudo("alga").sort(), ["caramujo", "garca", "siri", "tainha"], "sem alga todos");
eq(T("pantanal").come(TEIAS.pantanal.focus), "dourado", "seta lambari→dourado: o dourado come");
for (const [k, t] of Object.entries(TEIAS)) {
  const ids2 = new Set(t.nodes.map((n) => n.id));
  for (const [a, b] of t.edges) {
    if (!ids2.has(a) || !ids2.has(b)) bad("teia " + k, `aresta ${a}→${b}`);
    else if (t.nodes.find((n) => n.id === b).r === "p") bad("teia " + k, "produtor comendo");
  }
  for (const n of t.nodes) if (n.n.length > 10) bad("teia " + k, `nome "${n.n}" > 10 letras`);
}
// respostas gravadas × recálculo independente (valores esperados escritos aqui)
const resp = Object.fromEntries(QUESTIONS.map((q) => [q.id, q.alts[q.correct[0]]]));
const certo = (id, t) => resp[id].t !== t && bad(id, `correta é "${resp[id].t}", esperado "${t}"`);
certo("bio-eco-teia-cerrado-sec", "Sapo");
certo("bio-eco-teia-sagui-niveis", "No 2º e no 3º níveis");
certo("bio-eco-teia-manguezal-retirada", "Siri");
certo("bio-eco-teia-amazonia-onca", "5º nível");
certo("bio-eco-pir-10pct-4nivel", "10 kcal");
certo("bio-eco-pir-10pct-volta", "45 000 kcal");
certo("bio-eco-bio-mercurio-cadeias", "Cadeia B");
certo("bio-eco-bio-mercurio-ariranha", "30 µg/g");
certo("bio-eco-ciclo-carbono-seta1", "Fotossíntese");
certo("bio-eco-ciclo-nitrogenio-soja", "Seta 1");
certo("bio-eco-rel-liquen", "Mutualismo");
certo("bio-eco-rel-orquidea", "Comensalismo");
certo("bio-eco-rel-erva-passarinho", "Parasitismo");
certo("bio-eco-pop-capacidade-suporte", "Capacidade de suporte do ambiente");

// ---- preview avulso (coluna de 390 px)
const rotulo = ["", "fácil", "média", "difícil"];
const blocos = QUESTIONS.map((q, n) => {
  const fig = (f, mode, size = "main") => `<div class="fig ${size}">${FIGS[f.kind](f, { mode, size })}</div>`;
  const figsQ = (q.fig || []).map((f) => `<div><small>ask</small>${fig(f, "ask")}<small>reveal</small>${fig(f, "reveal")}<div class="cap">${f.cap || ""}</div></div>`).join("");
  const alts = q.alts.map((a, i) => `<li class="${i === q.correct[0] ? "ok" : ""}">${"ABCD"[i]}) ${a.t !== undefined ? a.t : `<div class="par">${fig(a.fig, "ask", "alt")}${fig(a.fig, "reveal", "alt")}</div>${a.cap || ""}`}</li>`).join("");
  return `<section><h3>${n + 1}. ${q.id} <span class="lv">${rotulo[q.lvl]}</span></h3><p class="q">${q.text}</p>${figsQ}<ol>${alts}</ol><p class="hint">Dica: ${q.hint.t}</p><p class="why">${q.why}</p><p class="src">${q.src}</p><p class="ref">${q.ref}</p></section>`;
}).join("\n");
const css = "body{font-family:Trebuchet MS,sans-serif;background:#fffdf6;color:#1c2541;max-width:390px;margin:0 auto;padding:8px}section{border:2px solid #4c9a3c;border-radius:12px;padding:10px;margin:12px 0;background:#fff}h3{font-size:13px;margin:0 0 6px}.lv{background:#4c9a3c;color:#fff;border-radius:8px;padding:1px 6px;font-size:11px}.q{font-size:16px;font-weight:700;margin:4px 0}.fig svg{width:100%;height:auto;display:block}.par{display:grid;grid-template-columns:1fr 1fr;gap:4px}small{color:#6b7191}.cap{font-size:12px;color:#6b7191}ol{list-style:none;padding:0}li{border:1.5px solid #1c2541;border-radius:8px;margin:5px 0;padding:6px 8px;font-size:14px}li.ok{background:#e3f1da;border-color:#2f9a54}.hint{color:#b8641a;font-size:13px}.why{font-size:13px}.src,.ref{font-size:11px;color:#6b7191;word-break:break-word}";
writeFileSync(new URL("./preview-ecologia.html", import.meta.url), `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Preview Ecologia</title><style>${css}</style>${blocos}`);

if (erros.length) { console.log(erros.join("\n")); console.log(`\n${erros.length} problema(s)`); process.exit(1); }
console.log(`${QUESTIONS.length} perguntas; níveis ${cont[1]}/${cont[2]}/${cont[3]}; preview-ecologia.html gerado`);
console.log("tudo confere");
