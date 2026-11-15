// Conferência da Genética do Show de Biologia: node check-bio-genetica.mjs
// 1) regras do contrato (1 certa, 4 diferentes, figura, ids, tamanhos, 5/7/6 por nível); 2) renderizadores nos 3 modos e 2 tamanhos;
// 3) modelos contra casos da literatura; 4) respostas recalculadas de forma independente; 5) gera preview-genetica.html.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as G from "./bio-genetica.mjs";

const { QUESTIONS, FIGS, PATTERNS_USED, ANSWERS, fr, fstr, feq } = G;
const HERE = dirname(fileURLToPath(import.meta.url));
let bad = 0;
const fail = (m) => { bad++; console.log("ERRO  " + m); };
const ok = (c, m) => { if (!c) fail(m); };

// ------------------------------------------------------------------ contrato
ok(JSON.stringify(PATTERNS_USED) === "[2]", "PATTERNS_USED deve ser [2]");
ok(QUESTIONS.length === 18, `são ${QUESTIONS.length} perguntas, esperado 18`);
const ids = new Set();
const lv = { 1: 0, 2: 0, 3: 0 };
const sub = {};
for (const q of QUESTIONS) {
  const w = q.id;
  ok(!ids.has(q.id), `${w}: id repetido`); ids.add(q.id);
  ok(/^bio-gen-/.test(q.id), `${w}: id deve começar com bio-gen-`);
  ok(q.subj === "biologia" && q.pat === 2, `${w}: subj/pat`);
  ok([1, 2, 3].includes(q.lvl), `${w}: nível`); lv[q.lvl]++;
  const tema = q.id.split("-")[2]; sub[tema] = (sub[tema] || 0) + 1;
  ok(q.text && q.text.length <= 120, `${w}: enunciado com ${q.text?.length} caracteres (máx 120)`);
  ok(q.why && q.why.length <= 150, `${w}: why com ${q.why?.length} caracteres (máx 150)`);
  ok(q.hint && q.hint.t && q.hint.t.length <= 120, `${w}: dica ausente ou longa`);
  ok(q.src === "no estilo do ENEM" || /^como no ENEM \d{4} \(/.test(q.src), `${w}: src`);
  ok(q.alts.length === 4, `${w}: ${q.alts.length} alternativas`);
  const ts = q.alts.map((a) => a.t ?? JSON.stringify(a.fig));
  ok(new Set(ts).size === 4, `${w}: alternativas repetidas`);
  for (const a of q.alts) ok(a.t && a.t.length <= 46, `${w}: alternativa "${a.t}" com ${a.t?.length} caracteres (máx 46)`);
  ok(q.correct.length === 1 && q.correct[0] >= 0 && q.correct[0] < 4, `${w}: deve haver exatamente 1 certa`);
  ok(ANSWERS[q.id] === q.alts[q.correct[0]]?.t, `${w}: a certa (${q.alts[q.correct[0]]?.t}) não é a calculada pelo modelo (${ANSWERS[q.id]})`);
  ok((q.fig && q.fig.length >= 1) || q.alts.some((a) => a.fig), `${w}: sem figura`);
  ok(q.fig.length <= 2, `${w}: figuras demais`);
  if (q.hint?.fig != null) ok(q.fig[q.hint.fig], `${w}: dica aponta figura inexistente`);
}
ok(lv[1] === 5 && lv[2] === 7 && lv[3] === 6, `níveis ${lv[1]}/${lv[2]}/${lv[3]}, esperado 5/7/6`);
const want = { punnett: 4, hered: 5, abo: 3, x: 2, codigo: 3, lei2: 1 };
for (const [k, n] of Object.entries(want)) ok(sub[k] === n, `subtema ${k}: ${sub[k]}, esperado ${n}`);

// ------------------------------------------------------------------ renderizadores
const kinds = new Set();
const figsOf = (q) => [...q.fig, ...q.alts.filter((a) => a.fig).map((a) => a.fig)];
for (const q of QUESTIONS) figsOf(q).forEach((f) => kinds.add(f.kind));
for (const k of kinds) ok(FIGS[k], `kind "${k}" não existe em FIGS`);
for (const k of Object.keys(FIGS)) ok(/^gen-/.test(k), `kind ${k} sem prefixo gen-`);
// tamanho real na tela: main ~340x210 px, alt ~150x120 px; fonte real = font-size x escala, tem de dar >= 11,5 px
const BOX = { main: [340, 210], alt: [150, 120] };
const warns = new Set();
let nsvg = 0;
for (const q of QUESTIONS) {
  q.fig.forEach((f, i) => {
    for (const size of ["main", "alt"]) for (const mode of ["ask", "uni", "reveal"]) for (const hint of [undefined, q.hint?.fig === i ? q.hint.mark : undefined]) {
      let s;
      try { s = FIGS[f.kind](f, { mode, size, hint }); } catch (e) { fail(`${q.id} fig ${i} ${size}/${mode}: ${e.message}`); continue; }
      nsvg++;
      ok(typeof s === "string" && s.startsWith("<svg"), `${q.id}: não começa com <svg`);
      const vb = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(s);
      ok(!!vb, `${q.id}: sem viewBox`);
      if (vb) {
        const sc = Math.min(BOX[size][0] / +vb[1], BOX[size][1] / +vb[2]);
        const fonts = [...s.matchAll(/font-size="(\d+(?:\.\d+)?)"/g)].map((m) => +m[1]);
        const real = Math.min(...fonts) * sc;
        if (real < 11.5) { if (size === "main") fail(`${q.id} main/${mode}: fonte real ${real.toFixed(1)} px < 11,5 (viewBox ${vb[1]}x${vb[2]})`); else warns.add(`${f.kind}${f.v ? ":" + f.v : ""}`); }
      }
      ok(!/NaN|undefined|Infinity/.test(s), `${q.id} ${size}/${mode}: NaN/undefined no SVG`);
      if (hint) ok(/class="hintring"/.test(s), `${q.id} ${size}: dica sem anel`);
      // nada cortado: todo x/y de texto e retângulo dentro do viewBox
      if (vb) for (const m of s.matchAll(/<(?:text|rect|circle)[^>]*?\b(?:x|cx)="(-?[\d.]+)"[^>]*?\b(?:y|cy)="(-?[\d.]+)"/g)) {
        if (+m[1] < -0.5 || +m[1] > +vb[1] + 0.5 || +m[2] < -0.5 || +m[2] > +vb[2] + 0.5) { fail(`${q.id} ${size}/${mode}: elemento fora do viewBox (${m[1]}, ${m[2]})`); break; }
      }
    }
  });
}

// ------------------------------------------------------------------ modelos × literatura
const E = (c, m) => ok(c, "modelo: " + m);
{ // Aa × Aa
  const g = G.crossGrid([["A", "a"]], [["A", "a"]]);
  const gen = G.countBy(g, G.keyOf), ph = G.countBy(g, G.phenD);
  E(gen.get("AA") === 1 && gen.get("Aa") === 2 && gen.get("aa") === 1, "Aa×Aa deve dar 1:2:1");
  E(ph.get("D") === 3 && ph.get("r") === 1 && G.ratioStr([3, 1]) === "3 : 1", "Aa×Aa deve dar 3:1");
  E(feq(G.condProb(g, (x) => G.phenD(x) === "D", (x) => G.keyOf(x) === "Aa"), fr(2, 3)), "P(Aa | dominante) = 2/3");
  const lt = G.countBy(g, G.keyOf, { dead: ["AA"] });
  E(lt.get("Aa") === 2 && lt.get("aa") === 1 && !lt.has("AA"), "com AA letal sobram Aa:aa = 2:1");
  const t = G.countBy(G.crossGrid([["A", "a"]], [["a", "a"]]), G.phenD);
  E(t.get("D") === 2 && t.get("r") === 2, "Aa×aa dá 1:1");
  E(G.countBy(G.crossGrid([["A", "A"]], [["a", "a"]]), G.keyOf).get("Aa") === 4, "AA×aa dá 100% Aa");
}
{ // diíbrido 9:3:3:1
  const p = [["A", "a"], ["B", "b"]], g = G.crossGrid(p, p), ph = G.countBy(g, G.phenD);
  E(G.gametes(p).map((x) => x.join("")).join() === "AB,Ab,aB,ab", "gametas de AaBb");
  E(ph.get("DD") === 9 && ph.get("Dr") === 3 && ph.get("rD") === 3 && ph.get("rr") === 1, "AaBb×AaBb dá 9:3:3:1");
  E(G.probWhere(g, (x) => G.keyOf(x) === "aabb").n === 1 && G.probWhere(g, (x) => G.keyOf(x) === "aabb").d === 16, "aabb = 1/16");
}
{ // ABO
  const g = G.crossGrid([["IA", "i"]], [["IB", "i"]]), c = G.countBy(g, G.aboOf);
  E(c.get("A") === 1 && c.get("B") === 1 && c.get("AB") === 1 && c.get("O") === 1, "IAi×IBi dá A, B, AB e O com 1/4 cada");
  E(G.aboOf([["IA", "IA"]]) === "A" && G.aboOf([["i", "i"]]) === "O" && G.aboOf([["IA", "IB"]]) === "AB", "fenótipos ABO");
  let n = 0; for (const d of G.ALL_TYPES) for (const r of G.ALL_TYPES) if (G.canDonate(d, r)) n++;
  E(n === 27, `pares doador-receptor compatíveis = ${n}, literatura: 27`);
  E(G.ALL_TYPES.every((r) => G.canDonate("O−", r)), "O− doa para todos");
  E(G.ALL_TYPES.every((d) => G.canDonate(d, "AB+")), "AB+ recebe de todos");
  E(G.donorsOf("O−").join() === "O−", "O− só recebe de O−");
  E(G.donorsOf("A+").join() === "A+,A−,O+,O−", "A+ recebe de A+, A−, O+ e O−");
  E(!G.canDonate("A+", "A−") && !G.canDonate("AB−", "A+") && G.canDonate("B−", "B+"), "Rh e ABO na compatibilidade");
  E(G.typeFromAgglutination({ A: true, B: true, D: false }) === "AB−" && G.typeFromAgglutination({ A: false, B: false, D: true }) === "O+", "tipagem pela lâmina");
}
{ // ligada ao X
  const g = G.crossGrid([["XD", "Xd"]], [["XD", "Y"]]);
  const boy = (x) => x[0].includes("Y"), aff = (x) => G.phenD(x) === "r";
  E(feq(G.condProb(g, boy, aff), fr(1, 2)), "XDXd×XDY: metade dos meninos afetados");
  E(feq(G.condProb(g, (x) => !boy(x), aff), fr(0)), "XDXd×XDY: nenhuma menina afetada");
  E(feq(G.probWhere(g, aff), fr(1, 4)), "XDXd×XDY: 1/4 de todos os filhos");
  const g2 = G.crossGrid([["XD", "XD"]], [["Xd", "Y"]]);
  E(G.cells(g2).every((x) => !boy(x.g) ? G.keyOf(x.g) === "XDXd" : G.keyOf(x.g) === "XDY"), "pai afetado: filhas portadoras, filhos normais");
}
{ // heredogramas
  const P = G.PEDS;
  E(G.compatibleModes(P.recessiva).join() === "AR", "pais normais + filha afetada: só AR");
  E(G.compatibleModes(P.dominante).join() === "AD", "casal afetado + filha normal: só AD");
  E(G.compatibleModes([{ id: "a", sex: "M", g: 0, x: 0, aff: true }, { id: "b", sex: "F", g: 0, x: 1, aff: false }, { id: "c", sex: "F", g: 1, x: 0, aff: true, par: ["a", "b"] }]).includes("XD"), "pai afetado e filha afetada cabem em XD");
  E(!G.compatibleModes([{ id: "a", sex: "M", g: 0, x: 0, aff: true }, { id: "b", sex: "F", g: 0, x: 1, aff: false }, { id: "c", sex: "F", g: 1, x: 0, aff: false, par: ["a", "b"] }]).includes("XD"), "pai afetado e filha normal não cabem em XD");
  const filho = [{ id: "a", sex: "M", g: 0, x: 0, aff: false }, { id: "b", sex: "F", g: 0, x: 1, aff: true }, { id: "c", sex: "M", g: 1, x: 0, aff: false, par: ["a", "b"] }];
  E(!G.compatibleModes(filho).includes("XR") && G.compatibleModes(filho).includes("AD"), "mãe afetada e filho normal: descarta XR (todo filho de mãe XaXa é afetado)");
  const het = (g) => g.includes("A") && g.includes("a");
  const two = [M0("a"), F0("b"), { id: "c", sex: "M", g: 1, x: 0, aff: false, par: ["a", "b"] }, { id: "d", sex: "F", g: 1, x: 1, aff: true, par: ["a", "b"] }];
  E(feq(G.probGeno("AR", two, "c", het), fr(2, 3)), "irmão normal de afetado: 2/3 de ser portador");
  const cousins = G.PEDS.prim19.filter((p) => !p.ghost);
  E(feq(G.childProb("AR", cousins, "II-2", "II-3", (s, a) => a), fr(1, 9)), "2/3 × 2/3 × 1/4 = 1/9");
  E(feq(G.childProb("AR", G.PEDS.prob13.filter((p) => !p.ghost), "II-2", "II-3", (s, a) => a), fr(1, 3)), "2/3 × 1/2 = 1/3");
  E(feq(G.childProb("XR", G.PEDS.ligadoX.filter((p) => !p.ghost), "II-3", "II-2", (s, a) => a), fr(1, 4)), "filha de afetado × normal: 1/4 dos filhos afetados");
  E(feq(G.childProb("XR", G.PEDS.ligadoX.filter((p) => !p.ghost), "II-3", "II-2", (s, a) => s === "M" && a) , fr(1, 4)), "...e todos são meninos");
  E(G.certainGeno("XR", G.PEDS.ligadoX.filter((p) => !p.ghost), "II-2") === "XAXa", "filha de afetado normal é XAXa");
  E(G.certainGeno("AR", G.PEDS.certeza, "II-1") === "Aa", "filho normal de mãe aa é Aa");
}
function M0(id) { return { id, sex: "M", g: 0, x: 0, aff: false }; }
function F0(id) { return { id, sex: "F", g: 0, x: 1, aff: false }; }
{ // código genético
  const C = G.CODONS;
  E(Object.keys(C).length === 64, "64 códons");
  E(C.AUG === "Met" && ["UAA", "UAG", "UGA"].every((c) => C[c] === "Pare"), "AUG é Met; UAA, UAG, UGA são parada");
  E(Object.values(C).filter((a) => a === "Pare").length === 3, "só 3 códons de parada");
  E(Object.entries(C).filter(([, a]) => a === "Met").length === 1 && Object.entries(C).filter(([, a]) => a === "Trp").length === 1, "Met e Trp têm 1 códon");
  for (const a of ["Leu", "Ser", "Arg"]) E(Object.values(C).filter((x) => x === a).length === 6, `${a} tem 6 códons`);
  E(Object.values(C).filter((x) => x === "Ile").length === 3 && Object.values(C).filter((x) => x === "Phe").length === 2, "Ile 3, Phe 2");
  E(C.GCU === "Ala" && C.UGG === "Trp" && C.AAA === "Lys" && C.UUU === "Phe" && C.GAA === "Glu" && C.CAG === "Gln" && C.CAC === "His" && C.UAC === "Tyr" && C.UGU === "Cys" && C.GGG === "Gly", "códons conhecidos");
  E(G.transcribe("TAC") === "AUG", "molde 3'-TAC-5' dá AUG");
  E(G.transcribe("TACCGAGAA") === "AUGGCUCUU" && G.translate("AUGGCUCUU").join("-") === "Met-Ala-Leu", "TACCGAGAA → AUGGCUCUU → Met-Ala-Leu");
  E(G.transcribe("ATTTGGC") === "UAAACCG", "A→U, T→A, G→C, C→G");
  E(G.translate("AUGUAAGGG").join() === "Met", "UAA para a tradução");
  E(G.translate("GGAUGUGAAAA").join() === "Met", "UGA para a tradução");
  const w = "AUGUUCCAGUGGCACGAAUAAGCUCAUUGA";
  E(G.translate(w).length === 6, "proteína original com 6 aminoácidos");
  E(G.translate(G.mutate(w, 6, "C", "U")).join() === G.translate(w).join(), "mutação silenciosa não muda a proteína");
  E(G.translate(G.mutate(w, 7, "C", "U")).length === 2, "sem sentido no 3º códon: 2 aminoácidos");
  E(G.translate(G.mutate(w, 19, "U", "C")).length === 9, "perder a parada alonga a proteína");
}
// fração
E(fstr(fr(2, 4)) === "1/2" && fstr(fr(0, 5)) === "0" && fstr(fr(4, 2)) === "2", "frações");

// ------------------------------------------------------------------ recálculo independente das respostas (por enumeração simples de strings)
const indep = (a, b) => { // frequência de cada genótipo de um loco (strings "Aa")
  const m = {}; for (const x of a) for (const y of b) { const k = [x, y].sort((p, q) => (p === p.toUpperCase() ? 0 : 1) - (q === q.toUpperCase() ? 0 : 1)).join(""); m[k] = (m[k] || 0) + 1; } return m;
};
{
  const q1 = QUESTIONS.find((q) => q.id === "bio-gen-punnett-ervilha-rugosa"), g = indep("Rr", "Rr");
  ok(q1.alts[q1.correct[0]].t === `${g.rr}/${g.RR + g.Rr + g.rr}`, "ervilha: recálculo independente");
  const q2 = QUESTIONS.find((q) => q.id === "bio-gen-punnett-heterozigoto-2-3"), h = indep("Aa", "Aa");
  ok(q2.alts[q2.correct[0]].t === "2/3" && h.Aa === 2 && h.AA + h.Aa === 3, "heterozigoto: recálculo independente");
  const q3 = QUESTIONS.find((q) => q.id === "bio-gen-punnett-letal-amarelo");
  ok(q3.alts[q3.correct[0]].t === "2/3", "letal: recálculo independente");
  const q4 = QUESTIONS.find((q) => q.id === "bio-gen-lei2-diibrido-3-16");
  ok(q4.alts[q4.correct[0]].t === "3/16", "diíbrido: (3/4)(1/4) = 3/16");
  const q5 = QUESTIONS.find((q) => q.id === "bio-gen-x-heredograma-1-4");
  ok(q5.alts[q5.correct[0]].t === "1/4", "ligada ao X: (1/2)(1/2) = 1/4");
  const q6 = QUESTIONS.find((q) => q.id === "bio-gen-hered-irmaos-afetados-1-9");
  ok(q6.alts[q6.correct[0]].t === "1/9", "primos: (2/3)(2/3)(1/4) = 1/9");
  const q7 = QUESTIONS.find((q) => q.id === "bio-gen-hered-prob-1-3");
  ok(q7.alts[q7.correct[0]].t === "1/3", "(2/3)(1/2) = 1/3");
  const q8 = QUESTIONS.find((q) => q.id === "bio-gen-codigo-mutacao-menor-proteina");
  ok(q8.alts[q8.correct[0]].t === "7ª base: C troca por U", "mutação: 7ª base C→U");
  const q9 = QUESTIONS.find((q) => q.id === "bio-gen-abo-transfusao-b-negativo");
  ok(q9.alts[q9.correct[0]].t === "B− e O−", "B− recebe de B− e O−");
  const q10 = QUESTIONS.find((q) => q.id === "bio-gen-abo-lamina-tipagem");
  ok(q10.alts[q10.correct[0]].t === "A+", "lâmina: A+");
  const q11 = QUESTIONS.find((q) => q.id === "bio-gen-codigo-traducao-peptideo");
  ok(q11.alts[q11.correct[0]].t === "Met-Ala-Trp-Lys", "peptídeo Met-Ala-Trp-Lys");
}

// ------------------------------------------------------------------ preview
const LV = { 1: "fácil", 2: "média", 3: "difícil" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const fig = (f, mode, hint) => `<div class="fig">${FIGS[f.kind](f, { mode, size: "main", hint })}</div>`;
let html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Prévia: Genética</title>
<style>body{margin:0;background:#e9e4d6;font-family:Trebuchet MS,Segoe UI,sans-serif;color:#1c2541}.col{width:390px;margin:0 auto;padding:10px 12px}
.card{background:#fffdf6;border:2px solid #1c2541;border-radius:14px;padding:12px;margin:0 0 16px}.tag{font-size:12px;color:#fff;background:#4c9a3c;border-radius:8px;padding:2px 8px;display:inline-block}
.id{font-size:11px;color:#6b7191;margin-left:6px}h2{font-size:17px;margin:8px 0}.fig{max-width:360px;max-height:210px;margin:6px auto;display:flex;justify-content:center;border:1px dashed #cfc8b4;border-radius:8px}
.fig svg{width:100%;max-height:210px}.lab{font-size:11px;color:#6b7191;margin-top:6px}.alt{border:2px solid #1c2541;border-radius:10px;padding:7px 10px;margin:5px 0;font-weight:700}.alt.ok{background:#cfe8c4;border-color:#2f9a54}
.why{font-size:13px;margin-top:8px}.small{font-size:12px;color:#6b7191}.hintring{animation:none}</style></head><body><div class="col"><h1 style="font-size:20px">Genética: ${QUESTIONS.length} perguntas</h1>`;
for (const q of QUESTIONS) {
  html += `<div class="card"><span class="tag">Genética · ${LV[q.lvl]}</span><span class="id">${q.id}</span><h2>${esc(q.text)}</h2>`;
  q.fig.forEach((f, i) => {
    html += `<div class="lab">figura ${i + 1}: pergunta</div>${fig(f, "ask")}`;
    if (q.hint?.fig === i) html += `<div class="lab">com a dica do professor</div>${fig(f, "ask", q.hint.mark)}`;
    html += `<div class="lab">depois de responder (reveal)</div>${fig(f, "reveal")}`;
  });
  q.alts.forEach((a, i) => (html += `<div class="alt${q.correct.includes(i) ? " ok" : ""}">${"ABCD"[i]}) ${esc(a.t)}${q.correct.includes(i) ? " ✔" : ""}</div>`));
  html += `<div class="why"><b>Dica:</b> ${esc(q.hint.t)}<br><b>Por quê:</b> ${esc(q.why)}</div><div class="small">${esc(q.src)}${q.ref ? " · " + esc(q.ref) : ""}</div></div>`;
}
html += "</div></body></html>";
writeFileSync(join(HERE, "preview-genetica.html"), html);

console.log(`${QUESTIONS.length} perguntas (${lv[1]}/${lv[2]}/${lv[3]}), ${nsvg} desenhos testados, subtemas ${JSON.stringify(sub)}`);
if (warns.size) console.log("aviso: no tamanho alt (~150 px) não chegam a 11,5 px reais (nenhuma pergunta usa alt): " + [...warns].join(", "));
console.log(bad ? `${bad} problema(s)` : "tudo confere");
process.exit(bad ? 1 : 0);
