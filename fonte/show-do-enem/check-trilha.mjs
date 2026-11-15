// Conferência da trilha: moléculas reais, nomes do montador e receitas do modelo antigo.
import { analyze, fromSpec, toXY } from "./chem.mjs";
import { HUNT, EXPECTED, EXPECTED_FORMULA } from "./molecules.mjs";
import { build, CATALOG } from "./model.mjs";
let bad = 0;
const fail = (m) => { bad++; console.log("ERRO  " + m); };
function geom(m, name) {
  const pos = new Set();
  for (const a of m.atoms) { const k = a.q + "," + a.r; if (pos.has(k)) fail(`${name}: dois átomos em ${k}`); pos.add(k); }
  for (const b of m.bonds) { const A = m.atoms.find((x) => x.id === b.a), B = m.atoms.find((x) => x.id === b.b); const [x1, y1] = toXY(A.q, A.r), [x2, y2] = toXY(B.q, B.r); if (Math.abs(Math.hypot(x1 - x2, y1 - y2) - 1) > 1e-6) fail(`${name}: ligação que não é vizinha`); }
  for (const a of m.atoms) for (const c of m.atoms) if (a !== c && !m.bonds.some((b) => (b.a === a.id && b.b === c.id) || (b.b === a.id && b.a === c.id))) { const [x1, y1] = toXY(a.q, a.r), [x2, y2] = toXY(c.q, c.r); if (Math.hypot(x1 - x2, y1 - y2) < 1.01) fail(`${name}: átomos encostados sem ligação`); }
}
for (const h of HUNT) {
  const r = analyze(h.m);
  geom(h.m, h.id);
  if (!r.valid) fail(`${h.id}: ${r.errors.map((e) => e.msg).join(";")}`);
  const got = [...r.funcs].sort().join(","), want = [...EXPECTED[h.id]].sort().join(",");
  if (got !== want) fail(`${h.id}: funções ${got} ≠ ${want}`);
  if (r.formula !== EXPECTED_FORMULA[h.id]) fail(`${h.id}: fórmula ${r.formula} ≠ ${EXPECTED_FORMULA[h.id]}`);
  console.log(`${h.nome.padEnd(30)} ${r.formula.padEnd(10)} ${r.groups.map((g) => g.func).join(", ") || "só C e H"} | ${r.chain.forma}, ${r.chain.lig}, ${r.chain.ram}, ${r.chain.het}${r.name ? " | nome " + r.name : ""}`);
}
for (const sp of CATALOG) {
  const old = build(sp), m = fromSpec(sp), r = analyze(m);
  geom(m, old.name);
  if (r.name !== old.name) fail(`receita ${JSON.stringify(sp)}: nome ${r.name} ≠ ${old.name}`);
  if (r.formula !== old.formula) fail(`${old.name}: fórmula ${r.formula} ≠ ${old.formula}`);
  if (r.func !== old.func) fail(`${old.name}: função ${r.func} ≠ ${old.func}`);
  if (r.pe !== old.pe) fail(`${old.name}: PE ${r.pe} ≠ ${old.pe}`);
}
console.log(bad ? `${bad} erros` : `trilha: tudo confere (${HUNT.length} moléculas reais, ${CATALOG.length} receitas)`);
