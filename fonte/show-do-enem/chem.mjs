// Modelo de grafo da trilha: qualquer molécula montada à mão (C, O e ligações numa grade hexagonal).
// Os H são implícitos: cada átomo completa a valência com H. Daqui saem fórmula, funções (por padrão de átomos),
// classificação da cadeia, nome (quando a cadeia é simples, como cobra o ENEM) e, pelo nome, PE e solubilidade.
import { PREFIX, INFIX, PE, SOLUB, SOLUB_LEVEL, FUNCS, build as buildSpec } from "./model.mjs";

export const VAL = { C: 4, O: 2 };
// grade hexagonal: posição = q·u + r·v, com u a −30° e v a +30°. Vizinhos em sentido horário a partir de −30°.
export const DIRS = [[1, 0], [0, 1], [-1, 1], [-1, 0], [0, -1], [1, -1]];
export const toXY = (q, r) => [(q + r) * 0.8660254, (r - q) * 0.5];
const key = (q, r) => q + "," + r;

// cores fixas: uma por função, iguais em todas as telas
export const FCOLOR = { hidrocarboneto: "#38b2ac", alcool: "#3d8fd1", fenol: "#e4504a", eter: "#4fa36b", aldeido: "#e3a21a", cetona: "#ee7b55", acido: "#d6589a", ester: "#8e6fd6", enol: "#8d93ae" };
export const FNAME = { ...Object.fromEntries(Object.entries(FUNCS).map(([k, v]) => [k, v.nome])), enol: "Enol" };

export function blank() { return { atoms: [], bonds: [] }; }
export function clone(m) { return { atoms: m.atoms.map((a) => ({ ...a })), bonds: m.bonds.map((b) => ({ ...b })) }; }
let uid = 1;
export function addAtom(m, el, q, r) { const id = "a" + uid++; m.atoms.push({ id, el, q, r }); return id; }
export function addBond(m, a, b, o = 1) { m.bonds.push({ a, b, o }); }
export const atomAt = (m, q, r) => m.atoms.find((a) => a.q === q && a.r === r);
export const bondOf = (m, a, b) => m.bonds.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
export const adjacent = (p, s) => DIRS.some(([dq, dr]) => p.q + dq === s.q && p.r + dr === s.r);

// ----------------------------------------------------------------------------- análise
export function analyze(m) {
  const byId = Object.fromEntries(m.atoms.map((a) => [a.id, a]));
  const nb = Object.fromEntries(m.atoms.map((a) => [a.id, []]));
  for (const b of m.bonds) { if (!byId[b.a] || !byId[b.b]) continue; nb[b.a].push({ id: b.b, o: b.o }); nb[b.b].push({ id: b.a, o: b.o }); }
  const errors = [];
  const info = {};
  for (const a of m.atoms) {
    const used = nb[a.id].reduce((s, x) => s + x.o, 0);
    const h = VAL[a.el] - used;
    info[a.id] = { used, h: Math.max(0, h) };
    if (h < 0) errors.push({ id: a.id, msg: `${a.el === "C" ? "Esse carbono" : "Esse oxigênio"} ficaria com ${used} ligações, mas só tem ${VAL[a.el]} mãos. A regra dos ${VAL[a.el]} não deixa.` });
  }
  for (const b of m.bonds) {
    const A = byId[b.a], B = byId[b.b];
    if (A.el === "O" && B.el === "O") errors.push({ id: A.id, msg: "Oxigênio ligado em oxigênio não aparece nas funções do ENEM: ligue o O num carbono." });
  }
  const count = { C: 0, H: 0, O: 0 };
  for (const a of m.atoms) { count[a.el]++; count.H += info[a.id].h; }
  const formula = m.atoms.length ? fText(count) : "";
  // anéis (ciclos simples de até 8 átomos)
  const rings = findRings(m, nb);
  const inRing = new Set(rings.flat());
  const aromatic = rings.filter((ring) => ring.length === 6 && ring.every((id) => byId[id].el === "C") && ring.every((id, i) => {
    const prev = ring[(i + 5) % 6], next = ring[(i + 1) % 6];
    const o1 = bondOf(m, id, prev).o, o2 = bondOf(m, id, next).o;
    return (o1 === 2 && o2 === 1) || (o1 === 1 && o2 === 2);
  }));
  const aro = new Set(aromatic.flat());
  // grupos funcionais, olhando cada oxigênio
  const groups = [];
  const seen = new Set();
  const Cs = (id) => nb[id].filter((x) => byId[x.id].el === "C");
  const push = (func, atoms, center) => { const k2 = func + ":" + [...atoms].sort().join("|"); if (seen.has(k2)) return; seen.add(k2); groups.push({ func, atoms, center }); };
  for (const o of m.atoms.filter((a) => a.el === "O")) {
    const ns = nb[o.id];
    const dbl = ns.find((x) => x.o === 2 && byId[x.id].el === "C");
    if (dbl) {
      const c = dbl.id;
      const others = nb[c].filter((x) => x.id !== o.id);
      const os = others.find((x) => byId[x.id].el === "O" && x.o === 1);
      if (os) {
        const osC = Cs(os.id).filter((x) => x.id !== c);
        if (osC.length) push("ester", [c, o.id, os.id], c); else push("acido", [c, o.id, os.id], c);
      } else {
        const cN = others.filter((x) => byId[x.id].el === "C").length;
        push(cN >= 2 ? "cetona" : "aldeido", [c, o.id], c);
      }
      continue;
    }
    const cs = Cs(o.id);
    if (cs.length === 1 && info[o.id].h >= 1) {
      const c = cs[0].id;
      const hasCarbonyl = nb[c].some((x) => x.o === 2 && byId[x.id].el === "O");
      if (hasCarbonyl) continue; // é a hidroxila de um ácido
      if (aro.has(c)) push("fenol", [o.id, c], o.id);
      else if (nb[c].some((x) => x.o === 2 && byId[x.id].el === "C")) push("enol", [o.id, c], o.id);
      else push("alcool", [o.id, c], o.id);
    } else if (cs.length === 2) {
      const carbonylNext = cs.some((x) => nb[x.id].some((y) => y.o === 2 && byId[y.id].el === "O"));
      if (!carbonylNext) push("eter", [cs[0].id, o.id, cs[1].id], o.id);
    }
  }
  const funcs = [...new Set(groups.map((g) => g.func))];
  const func = funcs.length === 0 ? (m.atoms.length && count.O === 0 ? "hidrocarboneto" : null) : funcs.length === 1 ? funcs[0] : "mista";
  // cadeia
  const multCC = m.bonds.filter((b) => b.o > 1 && byId[b.a].el === "C" && byId[b.b].el === "C");
  const ramificada = m.atoms.some((a) => a.el === "C" && Cs(a.id).length >= 3) || (rings.length > 0 && m.atoms.some((a) => !inRing.has(a.id) && a.el === "C"));
  const hetero = m.atoms.some((a) => a.el === "O" && Cs(a.id).length >= 2);
  const chain = m.atoms.length ? {
    forma: rings.length ? (m.atoms.some((a) => !inRing.has(a.id)) ? "mista (anel + parte aberta)" : "fechada (anel)") : "aberta",
    lig: aromatic.length ? "aromática" : multCC.length ? "insaturada" : "saturada",
    ram: ramificada ? "ramificada" : "normal",
    het: hetero ? "heterogênea (O no meio)" : "homogênea",
  } : null;
  const family = func === "hidrocarboneto" ? hcFamily(rings, aromatic, multCC) : null;
  const named = errors.length ? null : nameOf(m, byId, nb, groups, rings, aromatic, multCC);
  const pe = named && PE[named] ? PE[named][0] : null;
  const solub = func === "hidrocarboneto" ? "insolúvel" : named ? SOLUB[named] ?? null : null;
  const hasOH = groups.some((g) => ["alcool", "fenol", "acido", "enol"].includes(g.func));
  return {
    atoms: m.atoms, bonds: m.bonds, info, nb, errors, valid: errors.length === 0, count, formula, rings, aromatic,
    groups, funcs, func, chain, family, name: named, pe, peSrc: named && PE[named] ? PE[named][1] : null,
    solub, mixes: solub ? SOLUB_LEVEL[solub] >= 2 : null, state: pe === null ? null : pe < 25 ? "gás" : "líquido",
    forces: { london: count.C > 0, dipolo: count.O > 0, hbond: hasOH }, mass: count.C * 12 + count.H + count.O * 16,
  };
}

function findRings(m, nb) {
  const out = [], sigs = new Set();
  const ids = m.atoms.map((a) => a.id);
  for (const start of ids) {
    const stack = [[start, [start]]];
    while (stack.length) {
      const [cur, path] = stack.pop();
      for (const { id } of nb[cur]) {
        if (id === start && path.length >= 3) {
          const sig = [...path].sort().join("|");
          if (!sigs.has(sig)) { sigs.add(sig); out.push([...path]); }
        } else if (!path.includes(id) && path.length < 8) stack.push([id, [...path, id]]);
      }
    }
  }
  // fica com os ciclos mínimos (descarta os que contêm outro ciclo inteiro)
  return out.filter((r) => !out.some((s) => s !== r && s.length < r.length && s.every((x) => r.includes(x))));
}

function hcFamily(rings, aromatic, multCC) {
  if (aromatic.length) return { nome: "aromático", geral: "anel benzênico" };
  if (rings.length) return multCC.length ? { nome: "cicloalceno", geral: "CₙH₂ₙ₋₂" } : { nome: "cicloalcano", geral: "CₙH₂ₙ" };
  if (!multCC.length) return { nome: "alcano", geral: "CₙH₂ₙ₊₂" };
  if (multCC.length === 1) return multCC[0].o === 2 ? { nome: "alceno", geral: "CₙH₂ₙ" } : { nome: "alcino", geral: "CₙH₂ₙ₋₂" };
  return { nome: "com várias insaturações", geral: "" };
}

const SUBD = "₀₁₂₃₄₅₆₇₈₉";
export const subN = (n) => String(n).split("").map((d) => SUBD[+d]).join("");
export const fText = ({ C, H, O }) => `${C ? "C" + (C > 1 ? subN(C) : "") : ""}${H ? "H" + (H > 1 ? subN(H) : "") : ""}${O ? "O" + (O > 1 ? subN(O) : "") : ""}`;

// nome IUPAC só para o que o ENEM pede: cadeia normal com no máximo um grupo, ou benzeno/fenol/ciclo-hexano
function nameOf(m, byId, nb, groups, rings, aromatic, multCC) {
  if (!m.atoms.length) return null;
  const C = m.atoms.filter((a) => a.el === "C");
  if (rings.length) {
    if (rings.length !== 1 || rings[0].length !== 6 || C.length !== 6) return null;
    const extra = m.atoms.filter((a) => !rings[0].includes(a.id));
    if (aromatic.length) { if (!extra.length) return "benzeno"; if (extra.length === 1 && groups.length === 1 && groups[0].func === "fenol") return "fenol"; return null; }
    if (!extra.length && !multCC.length) return "ciclo-hexano";
    return null;
  }
  if (groups.length > 1 || C.length > 10 || C.length === 0) return null;
  const heavyN = (id) => nb[id].filter((x) => byId[x.id]);
  const skel = m.atoms.filter((a) => a.el === "C" || heavyN(a.id).length >= 2);
  const sk = new Set(skel.map((a) => a.id));
  const deg = (id) => nb[id].filter((x) => sk.has(x.id)).length;
  if (skel.some((a) => deg(a.id) > 2)) return null;
  const ends = skel.filter((a) => deg(a.id) <= 1);
  if (skel.length > 1 && ends.length !== 2) return null;
  // percorre a cadeia de uma ponta à outra
  const path = [ends[0].id];
  while (path.length < skel.length) {
    const nx = nb[path[path.length - 1]].find((x) => sk.has(x.id) && !path.includes(x.id));
    if (!nx) return null;
    path.push(nx.id);
  }
  const n = path.length;
  const g = groups[0];
  const pre = (k) => PREFIX[k - 1];
  const locant = (i) => Math.min(i + 1, n - i);
  if (!g) {
    if (m.atoms.some((a) => a.el === "O")) return null;
    if (multCC.length > 1) return null;
    if (!multCC.length) return pre(n) + "ano";
    const b = multCC[0];
    const i = Math.min(path.indexOf(b.a), path.indexOf(b.b));
    const loc = Math.min(i + 1, n - 1 - i);
    const inf = INFIX[b.o];
    return n >= 4 ? `${pre(n)}-${loc}-${inf}o` : `${pre(n)}${inf}o`;
  }
  if (multCC.length) return null;
  const nCpath = path.filter((id) => byId[id].el === "C").length;
  if (g.func === "alcool") { const i = path.indexOf(g.atoms[1]); return n <= 2 ? `${pre(n)}anol` : `${pre(n)}an-${locant(i)}-ol`; }
  if (g.func === "aldeido") { const i = path.indexOf(g.center); if (n > 1 && i !== 0 && i !== n - 1) return null; return `${pre(n)}anal`; }
  if (g.func === "cetona") { const i = path.indexOf(g.center); return n <= 4 ? `${pre(n)}anona` : `${pre(n)}an-${locant(i)}-ona`; }
  if (g.func === "acido") { const i = path.indexOf(g.center); if (n > 1 && i !== 0 && i !== n - 1) return null; return `ácido ${pre(n)}anoico`; }
  if (g.func === "eter" || g.func === "ester") {
    const oi = path.findIndex((id) => byId[id].el === "O");
    const left = path.slice(0, oi), right = path.slice(oi + 1);
    if (g.func === "eter") { const [a, b] = [left.length, right.length].sort((x, y) => x - y); return `${pre(a)}oxi${pre(b)}ano`; }
    const acidSide = left.includes(g.center) ? left : right, rSide = acidSide === left ? right : left;
    void nCpath;
    return `${pre(acidSide.length)}anoato de ${pre(rSide.length)}ila`;
  }
  return null;
}

// ----------------------------------------------------------------------------- moléculas a partir da receita do modelo antigo (cadeia normal)
export function fromSpec(spec) {
  const mol = buildSpec(spec);
  const m = blank();
  const ids = {};
  if (spec.ring) {
    const ring = mol.heavy;
    ring.forEach((hid, k) => { ids[hid] = addAtom(m, "C", DIRS[k][0], DIRS[k][1]); });
  } else {
    mol.heavy.forEach((hid, i) => { const el = mol.atoms.find((a) => a.id === hid).el; const q = Math.ceil(i / 2), r = Math.floor(i / 2); ids[hid] = addAtom(m, el, q, r); });
  }
  for (const b of mol.bonds) if (ids[b.a] && ids[b.b]) addBond(m, ids[b.a], ids[b.b], b.order);
  // oxigênios pendurados: vão para a direção livre mais afastada dos outros átomos
  for (const o of mol.atoms.filter((a) => a.el === "O" && a.host)) {
    const host = m.atoms.find((a) => a.id === ids[o.host]);
    const ring = spec.ring ? mol.heavy.indexOf(o.host) : -1;
    let best = null, bestScore = -1;
    DIRS.forEach(([dq, dr], k) => {
      const q = host.q + (ring >= 0 ? DIRS[ring][0] : dq), r = host.r + (ring >= 0 ? DIRS[ring][1] : dr);
      if (ring >= 0 && k > 0) return;
      if (atomAt(m, q, r)) return;
      const [x, y] = toXY(q, r);
      const near = Math.min(...m.atoms.filter((a) => a !== host).map((a) => { const [x2, y2] = toXY(a.q, a.r); return Math.hypot(x - x2, y - y2); }), 9);
      const pref = o.role === "=O" ? (y < toXY(host.q, host.r)[1] ? 0.2 : 0) : 0;
      // ângulo de 120° com as ligações que o carbono já tem (nunca 60°)
      const used = m.bonds.filter((b) => b.a === host.id || b.b === host.id).map((b) => { const o2 = m.atoms.find((a) => a.id === (b.a === host.id ? b.b : b.a)); return DIRS.findIndex(([a1, b1]) => host.q + a1 === o2.q && host.r + b1 === o2.r); });
      const open = (used.every((j) => [2, 3, 4].includes((k - j + 6) % 6)) ? 10 : 0) + (used.length && [2, 4].includes((k - used[0] + 6) % 6) ? 5 : 0);
      if (near + pref + open > bestScore) { bestScore = near + pref + open; best = [q, r]; }
    });
    ids[o.id] = addAtom(m, "O", best[0], best[1]);
    addBond(m, ids[o.host], ids[o.id], mol.bonds.find((b) => (b.a === o.host && b.b === o.id) || (b.b === o.host && b.a === o.id)).order);
  }
  return m;
}

// ----------------------------------------------------------------------------- receita curta para escrever moléculas à mão
// "C0,0 C1,0 =O2,-1 ..." não; usamos listas: [el, q, r] e ligações [i, j, ordem]
export function mol(atoms, bonds) {
  const m = blank();
  const ids = atoms.map(([el, q, r]) => addAtom(m, el, q, r));
  for (const [i, j, o] of bonds) addBond(m, ids[i], ids[j], o || 1);
  return m;
}
// anel de 6 em volta do centro (cq, cr): vértices na ordem de DIRS; aromático alterna 2,1,2,1...
export function ringAtoms(cq, cr) { return DIRS.map(([dq, dr]) => ["C", cq + dq, cr + dr]); }
export function ringBonds(start, aromatic) { return [0, 1, 2, 3, 4, 5].map((k) => [start + k, start + ((k + 1) % 6), aromatic && k % 2 === 0 ? 2 : 1]); }
