// Modelo da bancada de modelos moleculares (Química orgânica para o ENEM).
// DADO REAL (aprox.): pontos de ebulição a 1 atm em °C (tabela PE abaixo; "tabela" = números do pedido,
// "lit" = valores de literatura que acrescentei), valências (C 4, O 2, H 1), massas (C 12, H 1, O 16),
// regras de nome IUPAC (prefixo + infixo + sufixo) e fórmulas gerais.
// QUALITATIVO: solubilidade em água (miscível / solúvel / pouco solúvel / insolúvel).
// ILUSTRATIVO: faixas das frações do petróleo e a geometria do modelo 3D (zigue-zague simplificado).

export const VALENCE = { C: 4, O: 2, H: 1 };
export const MASS = { C: 12, H: 1, O: 16 };
export const PREFIX = ["met", "et", "prop", "but", "pent", "hex", "hept", "oct", "non", "dec"];
export const INFIX = { 1: "an", 2: "en", 3: "in" };
export const BONDNAME = { 1: "simples", 2: "dupla", 3: "tripla" };

// uma cor (c1..c8 da paleta) por função, a mesma em todas as telas
export const FUNCS = {
  hidrocarboneto: { nome: "Hidrocarboneto", cor: 6, grupo: "só C e H", sufixo: "o", dia: "GLP, gasolina, querosene" },
  alcool: { nome: "Álcool", cor: 1, grupo: "−OH em carbono saturado", sufixo: "ol", dia: "etanol (combustível, bebidas)" },
  fenol: { nome: "Fenol", cor: 7, grupo: "−OH direto no anel aromático", sufixo: "fenol", dia: "desinfetantes" },
  eter: { nome: "Éter", cor: 4, grupo: "−O− entre dois carbonos", sufixo: "…oxi…ano", dia: "éter etílico (solvente)" },
  aldeido: { nome: "Aldeído", cor: 2, grupo: "−CHO na ponta da cadeia", sufixo: "al", dia: "formol (solução de metanal)" },
  cetona: { nome: "Cetona", cor: 3, grupo: "C=O no meio da cadeia", sufixo: "ona", dia: "acetona (propanona)" },
  acido: { nome: "Ácido carboxílico", cor: 5, grupo: "−COOH", sufixo: "ácido …oico", dia: "vinagre (ácido etanoico)" },
  ester: { nome: "Éster", cor: 8, grupo: "−COO− entre carbonos", sufixo: "…ato de …ila", dia: "essências de frutas" },
};

// pontos de ebulição aproximados (°C, 1 atm)
export const PE = {
  metano: [-162, "tabela"], etano: [-89, "tabela"], propano: [-42, "tabela"], butano: [-0.5, "tabela"],
  pentano: [36, "tabela"], hexano: [69, "tabela"], heptano: [98, "tabela"], octano: [126, "tabela"],
  eteno: [-104, "tabela"], propeno: [-48, "tabela"], etino: [-84, "tabela", "sublima"], propino: [-23, "tabela"],
  "but-1-eno": [-6, "lit"], "pent-1-eno": [30, "lit"], "hex-1-eno": [63, "lit"], "hept-1-eno": [94, "lit"], "oct-1-eno": [121, "lit"],
  "but-1-ino": [8, "lit"], "pent-1-ino": [40, "lit"], "hex-1-ino": [71, "lit"], "hept-1-ino": [100, "lit"], "oct-1-ino": [126, "lit"],
  metanol: [65, "tabela"], etanol: [78, "tabela"], "propan-1-ol": [97, "tabela"], "butan-1-ol": [118, "tabela"], "propan-2-ol": [82, "lit"],
  etoxietano: [35, "tabela"], metoximetano: [-25, "tabela"], butanal: [75, "tabela"], butanona: [80, "tabela"],
  "ácido butanoico": [164, "tabela"], "ácido etanoico": [118, "tabela"], "metanoato de metila": [32, "tabela"],
  metanal: [-19, "tabela"], etanal: [20, "tabela"], propanal: [48, "lit"], propanona: [56, "tabela"],
  "etanoato de etila": [77, "tabela"], fenol: [182, "tabela"], "ácido metanoico": [101, "lit"], "ácido propanoico": [141, "lit"],
  "butanoato de etila": [121, "lit"], "etanoato de butila": [126, "lit"], benzeno: [80, "lit"], "ciclo-hexano": [81, "lit"],
};

// solubilidade em água, qualitativa (miscível > solúvel > pouco solúvel > insolúvel)
export const SOLUB = {
  metanol: "miscível", etanol: "miscível", "propan-1-ol": "miscível", "propan-2-ol": "miscível", "butan-1-ol": "pouco solúvel",
  metanal: "solúvel", etanal: "miscível", propanal: "solúvel", butanal: "pouco solúvel", propanona: "miscível", butanona: "solúvel",
  "ácido metanoico": "miscível", "ácido etanoico": "miscível", "ácido propanoico": "miscível", "ácido butanoico": "miscível",
  metoximetano: "pouco solúvel", etoxietano: "pouco solúvel", "metanoato de metila": "solúvel", "etanoato de etila": "pouco solúvel",
  "butanoato de etila": "insolúvel", "etanoato de butila": "insolúvel", fenol: "pouco solúvel",
};
export const SOLUB_LEVEL = { miscível: 3, solúvel: 2, "pouco solúvel": 1, insolúvel: 0 };

// frações do petróleo (faixas ilustrativas, em nº de carbonos)
export const FRACOES = [
  { nome: "Gases / GLP", de: 1, ate: 4 },
  { nome: "Gasolina", de: 5, ate: 10 },
  { nome: "Querosene", de: 10, ate: 16 },
  { nome: "Diesel", de: 14, ate: 20 },
  { nome: "Óleos lubrificantes", de: 20, ate: 35 },
  { nome: "Resíduo / asfalto", de: 35, ate: 99 },
];

// ----------------------------------------------------------------------------- montagem (átomos e ligações)
// spec: { n, bond (1|2|3 entre C1 e C2), ring (6), aromatic, group, at, r, extraH }
// group: null | "OH" (álcool/fenol, em C`at`) | "CHO" | "CO" (cetona em C`at`) | "COOH" | "OR" (éter: n de um lado, r do outro) | "COOR" (éster: ácido n, álcool r)
// C1 é sempre o carbono do grupo e fica na ponta direita da cadeia.
export function build(spec) {
  const s = { n: 1, bond: 1, group: null, at: 1, r: 0, extraH: 0, ...spec };
  const atoms = [], bonds = [], errors = [];
  const add = (a) => (atoms.push(a), a);
  const link = (a, b, order, kind = "chain") => bonds.push({ a, b, order, kind });
  const heavy = []; // a cadeia, da esquerda para a direita

  if (s.ring) {
    for (let i = 1; i <= s.ring; i++) heavy.push(add({ id: "C" + i, el: "C" }));
    for (let i = 0; i < s.ring; i++) link(heavy[i].id, heavy[(i + 1) % s.ring].id, s.aromatic && i % 2 === 0 ? 2 : 1);
  } else {
    for (let i = s.n; i >= 1; i--) heavy.push(add({ id: "C" + i, el: "C" }));
    for (let i = 0; i < heavy.length - 1; i++) link(heavy[i].id, heavy[i + 1].id, 1);
    if (s.bond > 1) {
      if (s.n < 2) errors.push(`Ligação ${BONDNAME[s.bond]} precisa de 2 carbonos: com 1 carbono só não há com quem dividir a vareta.`);
      else bonds[bonds.length - 1].order = s.bond; // entre C2 e C1
    }
    if (s.group === "OR" || s.group === "COOR") {
      const o = add({ id: "Oe", el: "O" });
      link(heavy[heavy.length - 1].id, o.id, 1, "group");
      heavy.push(o);
      for (let i = 1; i <= s.r; i++) {
        const c = add({ id: "R" + i, el: "C" });
        link(heavy[heavy.length - 1].id, c.id, 1, i === 1 ? "group" : "chain");
        heavy.push(c);
      }
    }
  }
  // substituintes pesados (O) pendurados nos carbonos
  const subs = [];
  const hang = (host, el, id, order, role) => { const a = add({ id, el, host, role }); subs.push(a); link(host, id, order, "group"); return a; };
  if (s.group === "OH") { hang("C" + s.at, "O", "O1", 1, "OH"); }
  if (s.group === "CHO") hang("C1", "O", "O1", 2, "=O");
  if (s.group === "CO") hang("C" + s.at, "O", "O1", 2, "=O");
  if (s.group === "COOH") { hang("C1", "O", "O1", 2, "=O"); hang("C1", "O", "O2", 1, "OH"); }
  if (s.group === "COOR") hang("C1", "O", "O1", 2, "=O");
  if (s.group === "CHO" && s.n < 1) errors.push("Aldeído precisa de pelo menos 1 carbono.");
  if (s.group === "CO" && (s.at <= 1 || s.at >= s.n)) errors.push("Cetona: a C=O tem de ficar num carbono do meio (com carbono dos dois lados). Na ponta seria aldeído.");

  // completa com H até cada átomo ter a valência certa
  const used = (id) => bonds.reduce((acc, b) => acc + (b.a === id || b.b === id ? b.order : 0), 0);
  for (const a of [...atoms]) {
    if (a.el === "H") continue;
    let free = VALENCE[a.el] - used(a.id);
    for (let k = 0; k < free; k++) {
      const h = add({ id: "H" + a.id + "." + k, el: "H", host: a.id });
      link(a.id, h.id, 1, a.el === "O" ? "group" : "ch");
    }
  }
  if (s.extraH) {
    for (let k = 0; k < s.extraH; k++) { const h = add({ id: "Hx" + k, el: "H", host: "C1", extra: true }); link("C1", h.id, 1, "ch"); }
  }
  // validação da valência: ninguém passa de 4 (C), 2 (O), 1 (H)
  for (const a of atoms) {
    const u = used(a.id);
    if (u > VALENCE[a.el]) errors.push(`O ${a.el === "C" ? "carbono" : a.el === "O" ? "oxigênio" : "hidrogênio"} ${a.id} ficaria com ${u} ligações, mas só tem ${VALENCE[a.el]} "furos". A regra dos ${VALENCE[a.el]} não deixa.`);
  }
  return finish(s, atoms, bonds, heavy, errors);
}

function finish(s, atoms, bonds, heavy, errors) {
  const count = { C: 0, H: 0, O: 0 };
  for (const a of atoms) count[a.el]++;
  const func = funcOf(s);
  const parts = nameParts(s);
  const name = parts.full;
  const pe = PE[name];
  const hasO = count.O > 0;
  const hasOH = s.group === "OH" || s.group === "COOH";
  const solub = func === "hidrocarboneto" ? "insolúvel" : SOLUB[name] ?? null;
  const mass = count.C * MASS.C + count.H * MASS.H + count.O * MASS.O;
  const nC = count.C;
  const fracao = func === "hidrocarboneto" && !s.ring ? FRACOES.find((f) => nC >= f.de && nC <= f.ate)?.nome ?? null : null;
  return {
    spec: s, atoms, bonds, heavy: heavy.map((a) => a.id), valid: errors.length === 0, errors,
    count, formula: formulaText(count), family: familyOf(s), func, funcInfo: FUNCS[func],
    name, parts, pe: pe ? pe[0] : null, peSrc: pe ? pe[1] : null, peNote: pe?.[2] ?? null,
    state: pe ? (pe[0] < 25 ? "gás" : "líquido") : null,
    forces: { london: true, dipolo: hasO, hbond: hasOH },
    solub, mass, fracao, apolarC: nC, polar: hasO,
  };
}

function funcOf(s) {
  switch (s.group) {
    case "OH": return s.aromatic ? "fenol" : "alcool";
    case "CHO": return "aldeido";
    case "CO": return "cetona";
    case "COOH": return "acido";
    case "OR": return "eter";
    case "COOR": return "ester";
    default: return "hidrocarboneto";
  }
}

export function familyOf(s) {
  if (s.group) return null;
  if (s.ring && s.aromatic) return { nome: "aromático", geral: "C₆H₆" };
  if (s.ring) return { nome: "cicloalcano", geral: "CₙH₂ₙ" };
  return { 1: { nome: "alcano", geral: "CₙH₂ₙ₊₂" }, 2: { nome: "alceno", geral: "CₙH₂ₙ" }, 3: { nome: "alcino", geral: "CₙH₂ₙ₋₂" } }[s.bond];
}

const SUB = "₀₁₂₃₄₅₆₇₈₉";
export const sub = (n) => String(n).split("").map((d) => SUB[+d]).join("");
export function formulaText({ C, H, O }) {
  return `C${C > 1 ? sub(C) : ""}H${H > 1 ? sub(H) : ""}${O ? "O" + (O > 1 ? sub(O) : "") : ""}`;
}

// nome = prefixo (nº de C) + infixo (ligação) + sufixo (função)
export function nameParts(s) {
  const pre = PREFIX[s.n - 1];
  if (s.ring) {
    if (s.aromatic) return s.group === "OH" ? { pre: "fen", inf: "", suf: "ol", full: "fenol" } : { pre: "benz", inf: "", suf: "eno", full: "benzeno" };
    return { pre: "ciclo-hex", inf: "an", suf: "o", full: "ciclo-hexano" };
  }
  const loc = (k) => (s.n >= 3 ? `-${k}-` : "");
  switch (s.group) {
    case "OH": {
      const l = s.n >= 3 ? `-${s.at}-` : "";
      return { pre, inf: "an", suf: "ol", full: `${pre}an${l}ol` };
    }
    case "CHO": return { pre, inf: "an", suf: "al", full: `${pre}anal` };
    case "CO": return { pre, inf: "an", suf: "ona", full: s.n >= 5 ? `${pre}an-${s.at}-ona` : `${pre}anona` };
    case "COOH": return { pre, inf: "an", suf: "oico", full: `ácido ${pre}anoico`, head: "ácido" };
    case "COOR": return { pre, inf: "an", suf: "oato", full: `${pre}anoato de ${PREFIX[s.r - 1]}ila`, tail: `de ${PREFIX[s.r - 1]}ila` };
    case "OR": {
      const [small, big] = s.n <= s.r ? [s.n, s.r] : [s.r, s.n];
      return { pre: PREFIX[big - 1], inf: "an", suf: "o", full: `${PREFIX[small - 1]}oxi${PREFIX[big - 1]}ano`, head: `${PREFIX[small - 1]}oxi` };
    }
    default: {
      const inf = INFIX[s.bond];
      if (s.bond > 1 && s.n >= 4) return { pre, inf, suf: "o", full: `${pre}-1-${inf}o` };
      void loc;
      return { pre, inf, suf: "o", full: `${pre}${inf}o` };
    }
  }
}

// ----------------------------------------------------------------------------- geometria 3D do kit (zigue-zague)
export const GEO = { DX: 12, DZ: 7, CH: 9, CO: 11.5, OH: 7.5, R: { C: 4.4, O: 4.1, H: 2.7 } };
const norm = (v) => { const l = Math.hypot(...v) || 1; return v.map((x) => x / l); };

// devolve { pos: {id: [x,y,z]} } com a cadeia começando em x = 0
export function layout3d(mol, { flip = false } = {}) {
  const { DX, DZ } = GEO;
  const pos = {};
  const H = mol.heavy;
  const L = H.length;
  H.forEach((id, i) => { pos[id] = [i * DX, 0, i % 2 === 1 ? DZ : 0]; });
  const neighbors = (id) => mol.bonds.filter((b) => (b.a === id || b.b === id)).map((b) => (b.a === id ? b.b : b.a)).filter((o) => H.includes(o));
  const subsOf = (id) => mol.atoms.filter((a) => a.host === id);
  for (const id of H) {
    const i = H.indexOf(id), p = pos[id], up = i % 2 === 1 ? 1 : -1;
    const nb = neighbors(id);
    const subs = subsOf(id);
    const v = [0, 0, up], f = norm([0, 1, 0.55 * up]), b = norm([0, -1, 0.55 * up]);
    let slots;
    if (L === 1) {
      slots = { v: [0, 0, 1], c: [0.94, 0, -0.33], f: [-0.47, 0.82, -0.33], b: [-0.47, -0.82, -0.33] };
    } else if (nb.length === 1) {
      const q = pos[nb[0]];
      const c = norm([-(q[0] - p[0]), 0, q[2] - p[2]]);
      slots = { c, f: norm([c[0] * 0.5, 1, 0.55 * up]), b: norm([c[0] * 0.5, -1, 0.55 * up]), v };
    } else slots = { v, f, b };
    const n = subs.length;
    let order;
    if (L === 1) order = n === 4 ? ["v", "c", "f", "b"] : ["v", "c", "f"];
    else if (nb.length === 1) order = n >= 3 ? ["f", "b", "c", "v"] : n === 2 ? ["v", "c"] : ["c"];
    else order = n >= 2 ? ["f", "b"] : ["v"];
    // =O prefere v, −OH prefere c, H preenche o resto
    const free = [...order];
    const take = (pref) => { const k = pref.find((x) => free.includes(x)) ?? free[0]; free.splice(free.indexOf(k), 1); return k; };
    const placed = [];
    for (const a of subs.filter((x) => x.role === "=O")) placed.push([a, take(["v", "c"])]);
    for (const a of subs.filter((x) => x.role === "OH")) placed.push([a, take(["c", "f"])]);
    for (const a of subs.filter((x) => x.el === "H" && !x.extra)) placed.push([a, take(["f", "b", "c", "v"])]);
    for (const [a, k] of placed) {
      const d = slots[k];
      const len = a.el === "H" ? GEO.CH : GEO.CO;
      pos[a.id] = [p[0] + d[0] * len, p[1] + d[1] * len, p[2] + d[2] * len];
      a.slot = k;
      if (a.role === "OH") {
        const hh = mol.atoms.find((x) => x.host === a.id);
        const s2 = d[2] >= 0 ? 1 : -1;
        const dh = norm([d[0] * 0.35 + (d[0] === 0 ? 0.5 : 0), d[1] * 0.35, s2]);
        pos[hh.id] = [pos[a.id][0] + dh[0] * GEO.OH, pos[a.id][1] + dh[1] * GEO.OH, pos[a.id][2] + dh[2] * GEO.OH];
      }
    }
    // o H a mais do teste da regra dos 4: chega por cima e não encontra furo
    for (const a of subs.filter((x) => x.extra)) pos[a.id] = [p[0], p[1], p[2] + 13];
  }
  if (flip) {
    const maxX = Math.max(...Object.values(pos).map((q) => q[0]));
    const minX = Math.min(...Object.values(pos).map((q) => q[0]));
    for (const id in pos) pos[id] = [maxX + minX - pos[id][0], pos[id][1], pos[id][2]];
  }
  return pos;
}

// renomeia ids (para ligar a molécula de antes à de depois na animação)
export function relabel(mol, map) {
  const r = (id) => {
    if (map[id]) return map[id];
    const m = /^H(.+)\.(\d+)$/.exec(id);
    if (m && map[m[1]]) return "H" + map[m[1]] + "." + m[2];
    return id;
  };
  return {
    ...mol,
    atoms: mol.atoms.map((a) => ({ ...a, id: r(a.id), host: a.host ? r(a.host) : a.host })),
    bonds: mol.bonds.map((b) => ({ ...b, a: r(b.a), b: r(b.b) })),
    heavy: mol.heavy.map(r),
  };
}

// ----------------------------------------------------------------------------- reações simples
export const oxidize = (spec) => {
  if (spec.group === "OH" && spec.at === 1) return { ...spec, group: "CHO" };
  if (spec.group === "OH" && spec.at > 1) return { ...spec, group: "CO" };
  if (spec.group === "CHO") return { ...spec, group: "COOH" };
  return null;
};
export const esterify = (acid, alcohol) => (acid.group === "COOH" && alcohol.group === "OH" && alcohol.at === 1 ? { n: acid.n, group: "COOR", r: alcohol.n } : null);
export const combustion = (mol) => {
  const { C, H, O } = mol.count;
  const o2 = (2 * C + H / 2 - O) / 2;
  return { CO2: C, H2O: H / 2, O2: o2 };
};

// ----------------------------------------------------------------------------- cenários
export const STEPS = ["Contar os carbonos", "Escolher a ligação", "Completar com H", "Dar o nome", "Pendurar o grupo", "Reconhecer a função", "Ver o comportamento", "Desafio ENEM"];

export const SCENARIOS = [
  { id: "petroleo", label: "Petróleo", sub: "hidrocarbonetos de C1 a C8" },
  { id: "vinagre", label: "Vinho vira vinagre", sub: "etanol → etanal → ácido etanoico" },
  { id: "isomeros", label: "Isômeros C₂H₆O", sub: "etanol × metoximetano" },
  { id: "essencia", label: "Essência de abacaxi", sub: "ácido + álcool → éster + água" },
];

// Função pura: cenário (+ escolhas) -> tudo o que a bancada, o termômetro, o béquer e a janela mostram.
// stages: as moléculas que o passo 5 monta, em ordem; each { mols: [{key, mol, flip, at}] , label }
export function run(id, opts = {}) {
  const sc = SCENARIOS.find((x) => x.id === id) || SCENARIOS[0];
  const n = Math.min(8, Math.max(1, opts.n ?? 4)), bond = opts.bond ?? 1, extraH = opts.extraH ?? 0;
  const out = { scenario: sc, opts: { n, bond, extraH } };
  if (sc.id === "petroleo") {
    const base = build({ n, bond, extraH });
    out.bases = [{ key: "A", mol: base }];
    out.stages = [];
    out.final = base;
    out.compare = bond > 1 && base.valid ? build({ n }) : null;
    out.compareWhy = out.compare ? "o alcano com o mesmo nº de carbonos" : null;
    out.series = [1, 2, 3, 4, 5, 6, 7, 8].map((k) => { const m = build({ n: k, bond: 1 }); return { n: k, name: m.name, pe: m.pe, fracao: m.fracao }; });
    out.skip = [4, 5];
  }
  if (sc.id === "vinagre") {
    const base = build({ n: 2 });
    const s1 = { n: 2, group: "OH", at: 1 }, s2 = oxidize(s1), s3 = oxidize(s2);
    out.bases = [{ key: "A", mol: base }];
    out.stages = [s1, s2, s3].map((sp, k) => ({ label: ["pendura o −OH", "oxida: perde 2 H", "oxida: ganha 1 O"][k], mols: [{ key: "A", mol: build(sp) }] }));
    out.final = out.stages[2].mols[0].mol;
    out.history = out.stages.map((st) => st.mols[0].mol);
    out.compare = base;
    out.compareWhy = "o esqueleto sem nada pendurado";
    out.skip = [];
  }
  if (sc.id === "isomeros") {
    const base = build({ n: 2 });
    const eter = relabel(build({ n: 1, group: "OR", r: 1 }), { C1: "C2", R1: "C1" });
    out.bases = [{ key: "A", mol: base }, { key: "B", mol: base }];
    out.stages = [{ label: "O na ponta × O no meio", mols: [{ key: "A", mol: build({ n: 2, group: "OH", at: 1 }) }, { key: "B", mol: eter }] }];
    out.final = out.stages[0].mols[0].mol;
    out.compare = out.stages[0].mols[1].mol;
    out.compareWhy = "o isômero: mesma fórmula, O no meio";
    out.skip = [];
  }
  if (sc.id === "essencia") {
    const base = build({ n: 4 });
    const acid = { n: 4, group: "COOH" }, alc = { n: 2, group: "OH", at: 1 };
    const partner = relabel(build(alc), { C1: "R1", C2: "R2", O1: "Oe" });
    const ester = build(esterify(acid, alc));
    out.bases = [{ key: "A", mol: base }];
    out.stages = [
      { label: "pendura o −COOH", mols: [{ key: "A", mol: build(acid) }] },
      { label: "chega o etanol", mols: [{ key: "A", mol: build(acid) }, { key: "A", mol: partner, flip: true, partner: true }] },
      { label: "sai água, fica o éster", mols: [{ key: "A", mol: ester }], water: ["O2", "HO2.0", "HOe.0"] },
    ];
    out.final = ester;
    out.compare = build(acid);
    out.compareWhy = "o ácido de antes (tinha O−H)";
    out.reagents = { acid: build(acid), alcohol: build(alc) };
    out.skip = [];
  }
  out.valid = out.bases.every((b) => b.mol.valid);
  out.errors = out.bases.flatMap((b) => b.mol.errors);
  return out;
}

// ----------------------------------------------------------------------------- conferência química
export const CATALOG = [
  { n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }, { n: 6 }, { n: 7 }, { n: 8 },
  { n: 2, bond: 2 }, { n: 3, bond: 2 }, { n: 4, bond: 2 }, { n: 8, bond: 2 }, { n: 2, bond: 3 }, { n: 3, bond: 3 }, { n: 6, bond: 3 },
  { n: 1, group: "OH" }, { n: 2, group: "OH" }, { n: 3, group: "OH" }, { n: 4, group: "OH" }, { n: 3, group: "OH", at: 2 },
  { n: 1, group: "CHO" }, { n: 2, group: "CHO" }, { n: 3, group: "CHO" }, { n: 4, group: "CHO" },
  { n: 3, group: "CO", at: 2 }, { n: 4, group: "CO", at: 2 },
  { n: 1, group: "COOH" }, { n: 2, group: "COOH" }, { n: 4, group: "COOH" },
  { n: 1, group: "OR", r: 1 }, { n: 2, group: "OR", r: 2 },
  { n: 1, group: "COOR", r: 1 }, { n: 2, group: "COOR", r: 2 }, { n: 4, group: "COOR", r: 2 }, { n: 2, group: "COOR", r: 4 },
  { ring: 6, aromatic: true }, { ring: 6, aromatic: true, group: "OH" }, { ring: 6 },
];

export function selfCheck() {
  const lines = CATALOG.map((sp) => {
    const m = build(sp);
    const f = m.funcInfo.nome;
    return `${m.name.padEnd(20)} ${m.formula.padEnd(8)} ${f.padEnd(18)} PE ${m.pe ?? "?"} (${m.peSrc ?? "-"}) ${m.valid ? "ok" : "ERRO " + m.errors.join("; ")}`;
  });
  const bad = build({ n: 4, extraH: 1 });
  lines.push(`teste 5ª ligação: ${bad.valid ? "ACEITOU (erro!)" : "recusou: " + bad.errors[0]}`);
  const bad2 = build({ n: 1, bond: 2 });
  lines.push(`teste metano com dupla: ${bad2.valid ? "ACEITOU (erro!)" : "recusou: " + bad2.errors[0]}`);
  return lines.join("\n");
}
