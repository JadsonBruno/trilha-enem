// Conferência do Show do Milhão: node check-show.mjs
// 1) cada pergunta tem exatamente 1 alternativa certa segundo o modelo, 4 alternativas diferentes e figura;
// 2) toda molécula tem valência válida, geometria limpa na grade e, as novas, fórmula e funções de literatura;
// 3) o desenho (drawMol da trilha) roda para todas as figuras; 4) há perguntas suficientes em cada nível.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import * as chem from "./chem.mjs";
import { BANK, MOLS, NEW_FORMULA, NEW_FUNCS, SPEC_NAMES, PATTERNS, an } from "./questions.mjs";

const { toXY, DIRS, analyze } = chem;
const HERE = dirname(fileURLToPath(import.meta.url));
let bad = 0;
const fail = (m) => { bad++; console.log("ERRO  " + m); };

// --- geometria: ligações entre vizinhos da grade, sem átomos sobrepostos ou encostados, ângulos de 120° (60° só em C com 4 vizinhos)
function geom(m, name) {
  const pos = new Set();
  for (const a of m.atoms) { const k = a.q + "," + a.r; if (pos.has(k)) fail(`${name}: dois átomos em ${k}`); pos.add(k); }
  for (const b of m.bonds) { const A = m.atoms.find((x) => x.id === b.a), B = m.atoms.find((x) => x.id === b.b); const [x1, y1] = toXY(A.q, A.r), [x2, y2] = toXY(B.q, B.r); if (Math.abs(Math.hypot(x1 - x2, y1 - y2) - 1) > 1e-6) fail(`${name}: ligação que não é vizinha`); }
  for (const a of m.atoms) for (const c of m.atoms) if (a !== c && !m.bonds.some((b) => (b.a === a.id && b.b === c.id) || (b.b === a.id && b.a === c.id))) { const [x1, y1] = toXY(a.q, a.r), [x2, y2] = toXY(c.q, c.r); if (Math.hypot(x1 - x2, y1 - y2) < 1.01) fail(`${name}: átomos encostados sem ligação`); }
  for (const a of m.atoms) {
    const dirs = m.bonds.filter((b) => b.a === a.id || b.b === a.id).map((b) => { const o = m.atoms.find((x) => x.id === (b.a === a.id ? b.b : b.a)); return DIRS.findIndex(([dq, dr]) => a.q + dq === o.q && a.r + dr === o.r); });
    if (dirs.length < 4 && dirs.some((d) => dirs.includes((d + 1) % 6))) fail(`${name}: ângulo de 60° no átomo ${a.el}(${a.q},${a.r})`);
  }
}
// --- assinatura do grafo (Weisfeiler-Lehman) para saber se duas figuras são a mesma molécula
function wl(m) {
  const A = analyze(m);
  let lab = Object.fromEntries(m.atoms.map((a) => [a.id, a.el + A.info[a.id].h]));
  for (let it = 0; it < 4; it++) lab = Object.fromEntries(m.atoms.map((a) => [a.id, lab[a.id] + "(" + A.nb[a.id].map((x) => x.o + lab[x.id]).sort().join(",") + ")"]));
  return Object.values(lab).sort().join("|");
}

// --- moléculas
for (const [k, M] of Object.entries(MOLS)) {
  const A = an(k);
  geom(M.m, k);
  if (!A.valid) fail(`${k}: valência ${A.errors.map((e) => e.msg).join("; ")}`);
  if (NEW_FORMULA[k] && A.formula !== NEW_FORMULA[k]) fail(`${k}: fórmula ${A.formula} ≠ literatura ${NEW_FORMULA[k]}`);
  if (NEW_FUNCS[k] && [...A.funcs].sort().join() !== [...NEW_FUNCS[k]].sort().join()) fail(`${k}: funções ${A.funcs} ≠ ${NEW_FUNCS[k]}`);
  if (M.spec && !M.ctx && A.name !== k) fail(`${k}: o modelo deu o nome ${A.name}`);
  if (M.spec && analyze(chem.fromSpec(M.spec)).formula !== A.formula) fail(`${k}: receita e desenho com fórmulas diferentes`);
}
for (const n of SPEC_NAMES) if (!MOLS[n]) fail(`receita sem molécula: ${n}`);
console.log("Moléculas novas (desenhadas para o show):");
for (const k of Object.keys(NEW_FORMULA)) { const A = an(k); console.log(`  ${MOLS[k].nome.padEnd(32)} ${A.formula.padEnd(10)} ${A.groups.map((g) => g.func).join(", ") || "só C e H"} | ${A.chain.forma}, ${A.chain.lig}, ${A.chain.ram}, ${A.chain.het}`); }

// --- desenho: o mesmo drawMol da trilha (trecho recortado de trilha.js, como no build)
const trilha = readFileSync(join(HERE, "trilha.js"), "utf8");
const cut = (a, b) => trilha.slice(trilha.indexOf(a), trilha.indexOf(b));
const drawSrc = cut("const $ =", "const store = {") + cut("// ----------------------------------------------------------------------------- desenho de moléculas", "const specMol");
const drawMol = new Function(...Object.keys(chem), drawSrc + "\nreturn drawMol;")(...Object.values(chem));

// --- perguntas
const ids = new Set();
const count = {};
for (const q of BANK) {
  const tag = q.id;
  if (ids.has(q.id)) fail(`${tag}: id repetido`); ids.add(q.id);
  if (q.correct.length !== 1) fail(`${tag}: ${q.correct.length} alternativas certas (${q.alts.map((a) => a.t || a.k).join(" / ")})`);
  if (q.alts.length !== 4) fail(`${tag}: ${q.alts.length} alternativas`);
  const keys = q.alts.map((a) => (a.k ? "fig:" + wl(MOLS[a.k].m) : "txt:" + a.t.toLowerCase()));
  if (new Set(keys).size !== 4) fail(`${tag}: alternativas repetidas (${q.alts.map((a) => a.t || a.k).join(" / ")})`);
  const figs = [...q.fig.map((f) => f.k), ...q.alts.filter((a) => a.k).map((a) => a.k)];
  if (!figs.length) fail(`${tag}: pergunta sem figura`);
  for (const k of figs) {
    if (!MOLS[k]) { fail(`${tag}: molécula ${k} não existe`); continue; }
    const { svg, W, H } = drawMol(MOLS[k].m, an(k), { view: "bastao", groups: "all", tags: true });
    if (!svg.startsWith("<svg") || !(W > 0 && H > 0)) fail(`${tag}: desenho de ${k} falhou`);
  }
  for (const f of q.fig) if (f.mark) { if (f.mark.some((i) => i < 0 || i >= MOLS[f.k].m.atoms.length)) fail(`${tag}: marca fora da molécula`); }
  if (q.hint?.atoms && q.hint.atoms.some((i) => i < 0)) fail(`${tag}: dica aponta átomo inexistente`);
  if (!q.text || q.text.length > 120) fail(`${tag}: enunciado longo demais (${q.text.length})`);
  if (!q.why || q.why.length > 150) fail(`${tag}: explicação longa demais (${q.why?.length})`);
  for (const a of q.alts) if (a.t && a.t.length > 46) fail(`${tag}: alternativa longa "${a.t}"`);
  const c = (count[q.pat] ??= { 1: 0, 2: 0, 3: 0 }); c[q.lvl]++;
}
console.log("\nPerguntas por padrão (fácil / médio / difícil):");
for (const [p, c] of Object.entries(count)) console.log(`  ${p}. ${PATTERNS[p].padEnd(26)} ${c[1]} / ${c[2]} / ${c[3]}`);
const byL = [1, 2, 3].map((l) => BANK.filter((q) => q.lvl === l).length);
console.log(`  total ${BANK.length}: ${byL.join(" / ")}`);
// um jogo usa 5 fáceis, 5 médias e 6 difíceis, mais até 3 pulos
if (byL[0] < 8 || byL[1] < 8 || byL[2] < 9) fail("poucas perguntas em algum nível");
if (BANK.length < 60) fail("menos de 60 perguntas");
console.log(bad ? `\n${bad} erros` : `\nshow: tudo confere (${BANK.length} perguntas, ${Object.keys(MOLS).length} moléculas)`);
process.exitCode = bad ? 1 : 0;
