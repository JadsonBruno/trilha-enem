// Conferência do lote Corpo humano + Doenças: node check-bio-corpo.mjs  (também gera preview-corpo.html)
import { writeFileSync } from "node:fs";
import { QUESTIONS, FIGS, PATTERNS_USED } from "./bio-corpo.mjs";

let erros = 0;
const bad = (m) => { erros++; console.log("ERRO:", m); };
const ok = (c, m) => { if (!c) bad(m); };

// ---- 1) estrutura
const ids = new Set();
const cnt = { 1: 0, 2: 0, 3: 0 }, pat = { 3: 0, 5: 0 };
ok(QUESTIONS.length === 17, `esperava 17 perguntas, há ${QUESTIONS.length}`);
ok(JSON.stringify(PATTERNS_USED) === "[3,5]", "PATTERNS_USED deve ser [3,5]");
for (const q of QUESTIONS) {
  const id = q.id;
  ok(!ids.has(id), `id repetido ${id}`); ids.add(id);
  ok(q.subj === "biologia", `${id}: subj`);
  ok(id.startsWith(q.pat === 3 ? "bio-corpo-" : "bio-saude-"), `${id}: id × padrão`);
  ok([3, 5].includes(q.pat), `${id}: pat`); pat[q.pat]++;
  ok([1, 2, 3].includes(q.lvl), `${id}: lvl`); cnt[q.lvl]++;
  ok(q.text.length <= 120, `${id}: text ${q.text.length} > 120`);
  ok(q.why.length <= 150, `${id}: why ${q.why.length} > 150`);
  ok(q.alts.length === 4, `${id}: precisa de 4 alternativas`);
  ok(new Set(q.alts.map((a) => a.t)).size === 4, `${id}: alternativas repetidas`);
  for (const a of q.alts) ok(a.t && a.t.length <= 46, `${id}: alternativa "${a.t}" (${a.t && a.t.length}) > 46`);
  ok(Array.isArray(q.correct) && q.correct.length === 1 && q.correct[0] >= 0 && q.correct[0] < 4, `${id}: correct`);
  ok(Array.isArray(q.fig) && q.fig.length >= 1, `${id}: sem figura`);
  ok(q.hint && q.hint.t && q.hint.fig === 0 && q.hint.mark, `${id}: hint incompleto`);
  ok(/^no estilo do ENEM$|^como no ENEM \d{4} \(.+\)$/.test(q.src), `${id}: src`);
  ok(q.ref && /https?:\/\//.test(q.ref), `${id}: ref sem link`);
  for (const f of q.fig) ok(FIGS[f.kind], `${id}: kind ${f.kind} não existe em FIGS`);
}
ok(cnt[1] === 5 && cnt[2] === 7 && cnt[3] === 5, `níveis ${cnt[1]}/${cnt[2]}/${cnt[3]} (esperado 5/7/5)`);
ok(pat[3] === 9 && pat[5] === 8, `padrões ${pat[3]}/${pat[5]} (esperado 9/8)`);
const pos = [0, 0, 0, 0]; QUESTIONS.forEach((q) => pos[q.correct[0]]++);

// ---- 2) renderização, tamanho real da fonte e limites (main ~340 px, alt ~150 px na tela; mínimo 11,5 px reais)
const usados = new Set(QUESTIONS.flatMap((q) => q.fig.map((f) => f.kind)));
const REAL = { main: 340, alt: 150 };
const menor = { main: 99, alt: 99 };
for (const kind of Object.keys(FIGS)) {
  ok(usados.has(kind), `kind ${kind} não é usado por nenhuma pergunta`);
  const q = QUESTIONS.find((x) => x.fig.some((f) => f.kind === kind));
  const fig = q.fig.find((f) => f.kind === kind);
  for (const mode of ["ask", "uni", "reveal"]) for (const size of ["main", "alt"]) {
    for (const hint of [undefined, q.hint.mark]) {
      const s = FIGS[kind](fig, { mode, size, hint });
      const tag = `${kind} ${mode}/${size}${hint ? "/hint" : ""}`;
      if (typeof s !== "string" || !s.startsWith("<svg") || !/viewBox="0 0 [\d.]+ [\d.]+"/.test(s)) { bad(`${tag}: svg inválido`); continue; }
      const [W, H] = s.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).slice(1).map(Number);
      ok(!/<svg[^>]* width="\d/.test(s), `${tag}: width fixo`);
      const k = size === "alt" ? Number((s.match(/scale\(([\d.]+)\)/) || [0, 1])[1]) : 1;
      ok(size === "alt" ? W <= 330 : W <= 520, `${tag}: largura ${W}`);
      for (const m of s.matchAll(/<text\b([^>]*)>([^<]*)<\/text>/g)) {
        const a = m[1], fs = Number(a.match(/font-size="([\d.]+)"/)[1]);
        const real = (fs * k * REAL[size]) / W;
        menor[size] = Math.min(menor[size], real);
        if (real < 11.5) bad(`${tag}: texto "${m[2]}" com ${real.toFixed(1)} px reais (< 11,5)`);
        if (/rotate\(/.test(a)) continue;
        const x = Number(a.match(/ x="([-\d.]+)"/)[1]), anc = (a.match(/text-anchor="(\w+)"/) || [0, "start"])[1];
        const w = m[2].length * fs * 0.54;
        const x0 = anc === "middle" ? x - w / 2 : anc === "end" ? x - w : x, x1 = x0 + w;
        const lim = size === "alt" ? W / k : W;
        if (x0 < -1 || x1 > lim + 1) bad(`${tag}: texto "${m[2]}" estoura a borda (${x0.toFixed(0)}–${x1.toFixed(0)} de ${lim.toFixed(0)})`);
        const y = Number(a.match(/ y="([-\d.]+)"/)[1]);
        if (y > (size === "alt" ? H / k : H) + 1 || y < 0) bad(`${tag}: texto "${m[2]}" fora na vertical (y=${y})`);
      }
      ok(!hint || s.includes("hintring"), `${tag}: sem anel da dica`);
    }
  }
}
for (const q of QUESTIONS) for (const f of q.fig) if (f.kind === "corpo-ciclo-parasita") for (const n of f.nodes) for (const l of n.lines) ok(l.length * 8.4 <= (n.w || 140) - 12, `${q.id}: "${l}" não cabe na caixa`);

// ---- 3) conferência independente (refeita aqui, sem usar CALC) das perguntas de gráfico e de regra
const alvo = (id) => { const q = QUESTIONS.find((x) => x.id === id); return q.alts[q.correct[0]].t; };
const fig0 = (id) => QUESTIONS.find((x) => x.id === id).fig[0];
const val = (pts, x) => { let r = null; for (let i = 0; i < pts.length - 1; i++) if (x >= pts[i][0] && x <= pts[i + 1][0]) r = pts[i][1] + ((pts[i + 1][1] - pts[i][1]) * (x - pts[i][0])) / (pts[i + 1][0] - pts[i][0]); return r; };
{ // glicemia: pico em 1 h, desce depois e volta a <= 100 em 2 h => o hormônio que reduz a glicemia é a insulina
  const g = fig0("bio-corpo-glicemia-insulina").series[0].pts;
  const pico = g.reduce((m, p) => (p[1] > m[1] ? p : m));
  const desce = g.filter((p) => p[0] > pico[0]).every((p) => p[1] < pico[1]);
  const volta = g.find((p) => p[0] > pico[0] && p[1] <= 100)[0];
  ok(desce && pico[0] === 1 && volta === 2, "glicemia: pico/queda/retorno");
  ok(alvo("bio-corpo-glicemia-insulina") === "Insulina", "glicemia: resposta deve ser Insulina");
}
{ // jejum: instante em que glucagon >= insulina (passo de 0,5 h) e sentido das curvas
  const [ins, glu] = fig0("bio-corpo-jejum-glucagon").series.map((s) => s.pts);
  let t = null; for (let x = 0; x <= 12; x += 0.5) if (val(glu, x) >= val(ins, x)) { t = x; break; }
  ok(t === 6, `jejum: cruzamento em ${t}`);
  ok(val(glu, 12) > val(ins, 12) && val(ins, 0) > val(glu, 0), "jejum: sentido das curvas");
  ok(alvo("bio-corpo-jejum-glucagon") === "6 h; o fígado libera glicose", "jejum: resposta");
}
{ // anticorpos: 2º pico > 1º pico e menos dias até 1/4 do pico na 2ª dose
  const p = fig0("bio-saude-curva-segunda-dose").series[0].pts;
  const picoA = Math.max(...p.filter((q) => q[0] <= 28).map((q) => q[1])), picoB = Math.max(...p.filter((q) => q[0] >= 28).map((q) => q[1]));
  const tempo = (ini, fim, nivel) => { for (let x = ini; x <= fim; x += 0.01) if (val(p, x) >= nivel) return x - ini; return NaN; };
  const a = tempo(0, 28, picoA / 4), b = tempo(28, 42, picoB / 4);
  ok(picoB > picoA && b < a, `anticorpos: picos ${picoA}/${picoB}, atrasos ${a.toFixed(1)}/${b.toFixed(1)}`);
  ok(alvo("bio-saude-curva-segunda-dose") === "Maior e mais rápida que na 1ª dose", "anticorpos: resposta");
}
{ const c = fig0("bio-corpo-coracao-camara-2").chambers.find((x) => x.n === 2); ok(c.linha === "cima" && c.entra === "pulmões" && alvo("bio-corpo-coracao-camara-2") === "Átrio esquerdo", "coração"); }
{ const v = fig0("bio-corpo-arteria-venoso").vessels.filter((x) => x.de === "coração" && x.o2 === "pouco"); ok(v.length === 1 && v[0].id === "B" && alvo("bio-corpo-arteria-venoso") === "Vaso B", "circuito"); }
{ const f = fig0("bio-corpo-rim-reabsorcao"); ok(f.filtrado - f.urina === 99 && alvo("bio-corpo-rim-reabsorcao").includes("reabsorção"), "rim 99%"); }
{ const f = fig0("bio-corpo-amido-boca").tube; ok(f[0].nome === "Boca" && f[0].subs.includes("amido") && alvo("bio-corpo-amido-boca") === "Boca", "amido"); }
{ const f = fig0("bio-saude-resistencia-selecao"); ok(f.antes.filter(Boolean).length === 1 && f.antes.length === 10 && f.depois > 1, "seleção: 1 resistente em 10 e depois cresce"); }
{ const f = fig0("bio-saude-rnam-ordem").steps; ok(f.map((s) => s.ordem).sort().join("") === "1234" && f.find((s) => s.ordem === 1).letra === "C" && alvo("bio-saude-rnam-ordem") === "C → B → D → A", "rnam: ordem"); }
{ const f = fig0("bio-saude-malaria-vetor").nodes.filter((n) => n.papel === "vetor"); ok(f.length === 1 && alvo("bio-saude-malaria-vetor") === f[0].nome, "malária: vetor"); }

// ---- 4) prévia para revisão
const esc = (t) => String(t).replace(/&/g, "&amp;").replace(/</g, "&lt;");
let html = `<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prévia: corpo humano e doenças</title>
<style>body{font-family:Trebuchet MS,Segoe UI,sans-serif;background:#f4efe1;margin:0;padding:16px;display:flex;justify-content:center}main{width:390px}
article{background:#fffdf6;border:2px solid #1c2541;border-radius:14px;padding:12px;margin:0 0 16px}h3{margin:0 0 4px;font-size:13px;color:#4c9a3c}
.t{font-size:16px;font-weight:700;margin:4px 0 8px}.f{width:340px;max-width:100%;border:1px dashed #bbb;border-radius:8px;margin:4px 0}.f svg,.mini svg{width:100%;height:auto;display:block}
small{color:#6b7191;display:block;margin:2px 0}.alt{border:2px solid #1c2541;border-radius:10px;padding:8px;margin:5px 0;font-size:15px}.alt.c{background:#cfe8c4;border-color:#2f9a54}
.mini{width:150px;border:1px dashed #bbb;margin:4px 0}</style><main>`;
for (const q of QUESTIONS) {
  html += `<article><h3>${q.id} · padrão ${q.pat} · nível ${q.lvl}</h3><div class="t">${esc(q.text)}</div>`;
  for (const f of q.fig) {
    html += `<small>ask</small><div class="f">${FIGS[f.kind](f, { mode: "ask", size: "main" })}</div>`;
    html += `<small>com dica do professor</small><div class="f">${FIGS[f.kind](f, { mode: "ask", size: "main", hint: q.hint.mark })}</div>`;
    html += `<small>reveal</small><div class="f">${FIGS[f.kind](f, { mode: "reveal", size: "main" })}</div>`;
    html += `<small>alt (150 px)</small><div class="mini">${FIGS[f.kind](f, { mode: "ask", size: "alt" })}</div><small>${esc(f.cap || "")}</small>`;
  }
  q.alts.forEach((a, i) => { html += `<div class="alt${q.correct[0] === i ? " c" : ""}">${"ABCD"[i]}) ${esc(a.t)}${q.correct[0] === i ? " ✔" : ""}</div>`; });
  html += `<small><b>Dica:</b> ${esc(q.hint.t)}</small><small><b>Por quê:</b> ${esc(q.why)}</small><small><b>src:</b> ${esc(q.src)}</small><small><b>ref:</b> ${esc(q.ref)}</small></article>`;
}
writeFileSync(new URL("./preview-corpo.html", import.meta.url), html + "</main>");

console.log(`perguntas ${QUESTIONS.length}; níveis ${cnt[1]}/${cnt[2]}/${cnt[3]}; padrão 3: ${pat[3]}, padrão 5: ${pat[5]}; posição da certa A-D: ${pos.join("/")}`);
console.log(`menor fonte real: main ${menor.main.toFixed(1)} px (a 340 px), alt ${menor.alt.toFixed(1)} px (a 150 px)`);
if (erros) { console.log(`${erros} erro(s)`); process.exit(1); }
console.log("tudo confere");
