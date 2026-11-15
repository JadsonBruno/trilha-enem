// Revisão química: confere átomo por átomo cada molécula que a figura mostra, contra a tabela do pedido.
// Rodar: node check-quimica.mjs
import { build, run, layout3d, CATALOG, SCENARIOS, VALENCE, oxidize, esterify } from "./model.mjs";

// [spec, nome IUPAC, fórmula, função, PE da tabela do pedido (null = não estava na tabela)]
const EXPECT = [
  [{ n: 1 }, "metano", "CH₄", "hidrocarboneto", -162], [{ n: 2 }, "etano", "C₂H₆", "hidrocarboneto", -89],
  [{ n: 3 }, "propano", "C₃H₈", "hidrocarboneto", -42], [{ n: 4 }, "butano", "C₄H₁₀", "hidrocarboneto", -0.5],
  [{ n: 5 }, "pentano", "C₅H₁₂", "hidrocarboneto", 36], [{ n: 6 }, "hexano", "C₆H₁₄", "hidrocarboneto", 69],
  [{ n: 7 }, "heptano", "C₇H₁₆", "hidrocarboneto", 98], [{ n: 8 }, "octano", "C₈H₁₈", "hidrocarboneto", 126],
  [{ n: 2, bond: 2 }, "eteno", "C₂H₄", "hidrocarboneto", -104], [{ n: 3, bond: 2 }, "propeno", "C₃H₆", "hidrocarboneto", -48],
  [{ n: 2, bond: 3 }, "etino", "C₂H₂", "hidrocarboneto", -84], [{ n: 3, bond: 3 }, "propino", "C₃H₄", "hidrocarboneto", -23],
  [{ n: 4, bond: 2 }, "but-1-eno", "C₄H₈", "hidrocarboneto", null], [{ n: 8, bond: 3 }, "oct-1-ino", "C₈H₁₄", "hidrocarboneto", null],
  [{ n: 1, group: "OH" }, "metanol", "CH₄O", "alcool", 65], [{ n: 2, group: "OH" }, "etanol", "C₂H₆O", "alcool", 78],
  [{ n: 3, group: "OH" }, "propan-1-ol", "C₃H₈O", "alcool", 97], [{ n: 4, group: "OH" }, "butan-1-ol", "C₄H₁₀O", "alcool", 118],
  [{ n: 2, group: "OR", r: 2 }, "etoxietano", "C₄H₁₀O", "eter", 35], [{ n: 1, group: "OR", r: 1 }, "metoximetano", "C₂H₆O", "eter", -25],
  [{ n: 4, group: "CHO" }, "butanal", "C₄H₈O", "aldeido", 75], [{ n: 4, group: "CO", at: 2 }, "butanona", "C₄H₈O", "cetona", 80],
  [{ n: 4, group: "COOH" }, "ácido butanoico", "C₄H₈O₂", "acido", 164], [{ n: 2, group: "COOH" }, "ácido etanoico", "C₂H₄O₂", "acido", 118],
  [{ n: 1, group: "COOR", r: 1 }, "metanoato de metila", "C₂H₄O₂", "ester", 32],
  [{ n: 1, group: "CHO" }, "metanal", "CH₂O", "aldeido", -19], [{ n: 2, group: "CHO" }, "etanal", "C₂H₄O", "aldeido", 20],
  [{ n: 3, group: "CO", at: 2 }, "propanona", "C₃H₆O", "cetona", 56], [{ n: 2, group: "COOR", r: 2 }, "etanoato de etila", "C₄H₈O₂", "ester", 77],
  [{ ring: 6, aromatic: true, group: "OH" }, "fenol", "C₆H₆O", "fenol", 182],
  [{ n: 4, group: "COOR", r: 2 }, "butanoato de etila", "C₆H₁₂O₂", "ester", null],
];

let bad = 0;
const fail = (msg) => { bad++; console.log("ERRO  " + msg); };
function atomCheck(m) {
  for (const a of m.atoms) {
    const used = m.bonds.reduce((s, b) => s + (b.a === a.id || b.b === a.id ? b.order : 0), 0);
    if (used !== VALENCE[a.el]) fail(`${m.name}: ${a.id} (${a.el}) tem ${used} ligações, devia ter ${VALENCE[a.el]}`);
  }
  if (!m.spec.ring) { const pos = layout3d(m); for (const a of m.atoms) if (!pos[a.id]) fail(`${m.name}: ${a.id} sem posição 3D`); }
}
for (const [spec, nome, formula, func, pe] of EXPECT) {
  const m = build(spec);
  atomCheck(m);
  if (m.name !== nome) fail(`nome ${m.name} ≠ ${nome}`);
  if (m.formula !== formula) fail(`${nome}: fórmula ${m.formula} ≠ ${formula}`);
  if (m.func !== func) fail(`${nome}: função ${m.func} ≠ ${func}`);
  if (pe !== null && m.pe !== pe) fail(`${nome}: PE ${m.pe} ≠ tabela ${pe}`);
  if (pe === null && m.peSrc !== "lit") fail(`${nome}: PE fora da tabela devia estar marcado como lit`);
}
for (const spec of CATALOG) atomCheck(build(spec));
// fórmulas gerais
for (let n = 1; n <= 8; n++) {
  const a = build({ n }); if (a.count.H !== 2 * n + 2) fail(`alcano n=${n}: H ${a.count.H}`);
  if (n >= 2) { const e = build({ n, bond: 2 }), i = build({ n, bond: 3 }); if (e.count.H !== 2 * n) fail(`alceno n=${n}`); if (i.count.H !== 2 * n - 2) fail(`alcino n=${n}`); }
}
if (build({ ring: 6 }).count.H !== 12) fail("ciclo-hexano CnH2n");
if (build({ ring: 6, aromatic: true }).formula !== "C₆H₆") fail("benzeno C6H6");
// valência recusada
if (build({ n: 4, extraH: 1 }).valid) fail("aceitou carbono com 5 ligações");
if (build({ n: 1, bond: 2 }).valid) fail("aceitou dupla com 1 carbono");
// reações
const et = { n: 2, group: "OH", at: 1 };
if (build(oxidize(et)).name !== "etanal" || build(oxidize(oxidize(et))).name !== "ácido etanoico") fail("oxidação do etanol");
if (build(oxidize({ n: 3, group: "OH", at: 2 })).name !== "propanona") fail("álcool secundário -> cetona");
if (build(esterify({ n: 4, group: "COOH" }, et)).name !== "butanoato de etila") fail("esterificação");
// conservação de átomos na esterificação: ácido + álcool = éster + água
{ const a = build({ n: 4, group: "COOH" }).count, b = build(et).count, e = build(esterify({ n: 4, group: "COOH" }, et)).count;
  if (a.C + b.C !== e.C || a.H + b.H !== e.H + 2 || a.O + b.O !== e.O + 1) fail("esterificação não conserva átomos"); }
// cenários: todas as moléculas de todas as etapas
for (const s of SCENARIOS) {
  const r = run(s.id);
  for (const b of r.bases) atomCheck(b.mol);
  for (const st of r.stages) for (const e of st.mols) atomCheck(e.mol);
  console.log(`${s.id.padEnd(9)} ${r.bases.map((b) => b.mol.name).join(" + ")} → ${r.stages.map((st) => st.mols.map((e) => e.mol.name + " " + e.mol.formula).join(" + ")).join(" → ") || "(nada pendurado)"} | final ${r.final.name} ${r.final.pe} °C${r.compare ? ` | B ${r.compare.name} ${r.compare.pe} °C` : ""}`);
}
// petróleo, todas as escolhas
for (let n = 1; n <= 8; n++) for (const bond of [1, 2, 3]) {
  const r = run("petroleo", { n, bond });
  if ((n === 1 && bond > 1) === r.valid) fail(`petróleo n=${n} bond=${bond} validade`);
  if (r.valid && r.final.pe === null) fail(`petróleo ${r.final.name} sem PE`);
}
console.log(bad ? `${bad} erros` : `revisão química: tudo confere (${EXPECT.length} moléculas da tabela, ${CATALOG.length} do catálogo, 4 cenários, 24 escolhas do petróleo)`);
