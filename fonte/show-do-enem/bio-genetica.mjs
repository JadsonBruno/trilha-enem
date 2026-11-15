// Genética (padrão 2) do Show de Biologia: 18 perguntas, todas com a resposta CALCULADA por modelos deste arquivo.
// Modelos: frações exatas; cruzamento por enumeração de gametas (qualquer número de locos, autossômico ou ligado ao X);
// heredograma por enumeração de genótipos (AD, AR, XD, XR); ABO/Rh por antígenos; código genético padrão (64 códons).
// As alternativas erradas são as pegadinhas clássicas; a certa entra na posição indicada e vem sempre do modelo.
import { INK, MUTED, HINT, OK, BAD, FILL, BASE, esc, r1, svg, rect, circle, line, hintRing } from "./bio-base.mjs";

// =============================================================== frações exatas
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
export const fr = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
export const fadd = (a, b) => fr(a.n * b.d + b.n * a.d, a.d * b.d);
export const fmul = (a, b) => fr(a.n * b.n, a.d * b.d);
export const fdiv = (a, b) => fr(a.n * b.d, a.d * b.n);
export const feq = (a, b) => a.n === b.n && a.d === b.d;
export const fstr = (f) => (f.n === 0 ? "0" : f.d === 1 ? String(f.n) : `${f.n}/${f.d}`);
const ZERO = fr(0), ONE = fr(1), HALF = fr(1, 2);

// =============================================================== cruzamentos
// Um genitor é uma lista de locos; cada loco é um par de alelos: [["A","a"],["B","b"]].
// Alelos: "A"/"a" (autossômico), "IA","IB","i" (ABO), "XD","Xd","Y" (ligado ao X). Dominante = último caractere maiúsculo (Y não conta).
export const isDomTok = (t) => t !== "Y" && /[A-Z]$/.test(t);
const rank = (t) => (t === "Y" ? 3 : isDomTok(t) ? 0 : 1);
export const canonPair = (a, b) => { const r = rank(a) - rank(b); return r < 0 || (r === 0 && a <= b) ? [a, b] : [b, a]; };
export const gametes = (parent) => parent.reduce((acc, [x, y]) => acc.flatMap((g) => [[...g, x], [...g, y]]), [[]]);
export const crossGrid = (p1, p2) => {
  const g1 = gametes(p1), g2 = gametes(p2);
  return g2.map((row) => g1.map((col) => p1.map((_, l) => canonPair(col[l], row[l]))));
};
export const keyOf = (g) => g.map((l) => l.join("")).join("");
export const phenD = (g) => g.map((l) => (l.some(isDomTok) ? "D" : "r")).join(""); // "D" tem alelo dominante, "r" não
export function cells(grid, { dead = [] } = {}) { const out = []; for (const row of grid) for (const g of row) { const k = keyOf(g); if (!dead.includes(k)) out.push({ g, k }); } return out; }
export const probWhere = (grid, pred, o) => { const c = cells(grid, o); return fr(c.filter((x) => pred(x.g, x.k)).length, c.length); };
export const condProb = (grid, given, pred, o) => { const c = cells(grid, o).filter((x) => given(x.g, x.k)); return fr(c.filter((x) => pred(x.g, x.k)).length, c.length); };
export const keysWhere = (grid, pred, o) => [...new Set(cells(grid, o).filter((x) => pred(x.g, x.k)).map((x) => x.k))];
export const countBy = (grid, fn, o) => { const m = new Map(); for (const x of cells(grid, o)) m.set(fn(x.g), (m.get(fn(x.g)) || 0) + 1); return m; };
export const ratioStr = (counts) => { const g = counts.reduce(gcd, 0); return counts.map((c) => c / g).join(" : "); };

// =============================================================== ABO / Rh
export const aboOf = (g) => { const s = new Set(g[0]); const a = s.has("IA"), b = s.has("IB"); return a && b ? "AB" : a ? "A" : b ? "B" : "O"; };
export const ALL_TYPES = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−"];
export const antigens = (t) => ({ A: t.startsWith("A"), B: t.includes("B"), D: t.endsWith("+") });
// hemácias do doador não podem ter antígeno que o receptor não tenha (o plasma do receptor ataca)
export const canDonate = (donor, receptor) => { const d = antigens(donor), r = antigens(receptor); return (!d.A || r.A) && (!d.B || r.B) && (!d.D || r.D); };
export const typeFromAgglutination = (agg) => (agg.A && agg.B ? "AB" : agg.A ? "A" : agg.B ? "B" : "O") + (agg.D ? "+" : "−");
export const donorsOf = (receptor) => ALL_TYPES.filter((d) => canDonate(d, receptor));

// =============================================================== heredograma
export const MODES = {
  AD: { dom: true, x: false, nome: "Autossômica dominante" },
  AR: { dom: false, x: false, nome: "Autossômica recessiva" },
  XD: { dom: true, x: true, nome: "Ligada ao X dominante" },
  XR: { dom: false, x: true, nome: "Ligada ao X recessiva" },
};
const genoOptions = (mode, sex) => {
  if (!MODES[mode].x) return [["A", "A"], ["A", "a"], ["a", "a"]];
  return sex === "M" ? [["XA", "Y"], ["Xa", "Y"]] : [["XA", "XA"], ["XA", "Xa"], ["Xa", "Xa"]];
};
export const affectedOf = (mode, g) => (MODES[mode].dom ? g.some(isDomTok) : !g.some(isDomTok));
// distribuição dos filhos de um sexo dado: [{g, p}]
export function childDist(mode, fg, mg, sex) {
  const out = new Map();
  const add = (a, b, p) => { const g = canonPair(a, b), k = g.join("|"); out.set(k, { g, p: fadd(out.get(k)?.p || ZERO, p) }); };
  if (!MODES[mode].x) { for (const a of fg) for (const b of mg) add(a, b, fr(1, 4)); }
  else { const fx = fg.find((t) => t !== "Y"); for (const b of mg) { if (sex === "F") add(fx, b, HALF); else add(b, "Y", HALF); } }
  return [...out.values()];
}
// pessoas: {id, sex:"M"|"F", aff, x, g, par?:[paiId, maeId], fix?:"AA", ghost?} — pais sempre antes dos filhos
export function enumerate(mode, people) {
  const out = [], cur = new Map();
  const rec = (i, w) => {
    if (i === people.length) { out.push({ geno: new Map(cur), w }); return; }
    const p = people[i];
    if (p.ghost) { rec(i + 1, w); return; }
    let opts = genoOptions(mode, p.sex).filter((g) => affectedOf(mode, g) === !!p.aff);
    if (p.fix) opts = opts.filter((g) => g.join("") === p.fix);
    for (const g of opts) {
      let pw = ONE;
      if (p.par) { const d = childDist(mode, cur.get(p.par[0]), cur.get(p.par[1]), p.sex).find((x) => x.g.join("|") === g.join("|")); pw = d ? d.p : ZERO; }
      if (pw.n === 0) continue;
      cur.set(p.id, g); rec(i + 1, fmul(w, pw)); cur.delete(p.id);
    }
  };
  rec(0, ONE);
  return out;
}
export const compatibleModes = (people) => Object.keys(MODES).filter((m) => enumerate(m, people).length > 0);
export const certainGeno = (mode, people, id) => { const s = new Set(enumerate(mode, people).map((a) => a.geno.get(id).join(""))); return s.size === 1 ? [...s][0] : null; };
export function probGeno(mode, people, id, pred) {
  let tot = ZERO, hit = ZERO;
  for (const a of enumerate(mode, people)) { tot = fadd(tot, a.w); if (pred(a.geno.get(id))) hit = fadd(hit, a.w); }
  return fdiv(hit, tot);
}
// chance de um filho (sexo sorteado) do casal satisfazer pred(sexo, afetado)
export function childProb(mode, people, fid, mid, pred) {
  let tot = ZERO, hit = ZERO;
  for (const a of enumerate(mode, people)) {
    tot = fadd(tot, a.w);
    for (const sex of ["M", "F"]) for (const d of childDist(mode, a.geno.get(fid), a.geno.get(mid), sex)) if (pred(sex, affectedOf(mode, d.g))) hit = fadd(hit, fmul(a.w, fmul(HALF, d.p)));
  }
  return fdiv(hit, tot);
}

// =============================================================== código genético padrão
const AAS = "FFLLSSSSYY**CC*WLLLLPPPPHHQQRRRRIIIMTTTTNNKKSSRRVVVVAAAADDEEGGGG"; // ordem U, C, A, G em cada posição
const AA3 = { F: "Phe", L: "Leu", S: "Ser", Y: "Tyr", C: "Cys", W: "Trp", P: "Pro", H: "His", Q: "Gln", R: "Arg", I: "Ile", M: "Met", T: "Thr", N: "Asn", K: "Lys", V: "Val", A: "Ala", D: "Asp", E: "Glu", G: "Gly", "*": "Pare" };
export const CODONS = {};
{ const B = "UCAG"; for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++) CODONS[B[i] + B[j] + B[k]] = AA3[AAS[16 * i + 4 * j + k]]; }
export const COMP_DNA_RNA = { A: "U", T: "A", G: "C", C: "G" };
// molde lido 3'→5' ⇒ RNAm lido 5'→3' (pareamento direto)
export const transcribe = (templ35) => [...templ35].map((b) => COMP_DNA_RNA[b]).join("");
export const reverse = (s) => [...s].reverse().join("");
export function translate(rna, from = null) {
  let i = from ?? rna.indexOf("AUG");
  const out = [];
  if (i < 0) return out;
  for (; i + 3 <= rna.length; i += 3) { const aa = CODONS[rna.slice(i, i + 3)]; if (aa === "Pare") break; out.push(aa); }
  return out;
}
export const mutate = (rna, pos, from, to) => { if (rna[pos - 1] !== from) throw new Error(`base ${pos} é ${rna[pos - 1]}, não ${from}`); return rna.slice(0, pos - 1) + to + rna.slice(pos); };

// =============================================================== desenho: ajudantes
const raw = (x, y, markup, { size = 14, weight = 700, fill = INK, anchor = "middle", opacity } = {}) =>
  `<text x="${r1(x)}" y="${r1(y)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${opacity != null ? ` opacity="${opacity}"` : ""}>${markup}</text>`;
const sup = (t) => (t.length === 1 ? esc(t) : `${esc(t[0])}<tspan baseline-shift="super" font-size="75%">${esc(t.slice(1))}</tspan>`);
const genoMk = (g) => g.map((l) => l.map(sup).join("")).join("");
const hintBox = (x, y, w, h) => `<rect class="hintring" x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="10" fill="none" stroke="${HINT}" stroke-width="3.2" stroke-dasharray="5 4"/>`;
const rr = (x, y, w, h, fill, o = {}) => rect(x, y, w, h, { fill, rx: 7, sw: 2, ...o });
const legendRow = (items, W, y) => {
  const wd = items.map((it) => 22 + it.t.length * 7.8);
  const total = wd.reduce((a, b) => a + b, 0) + (items.length - 1) * 10;
  let x = (W - total) / 2, s = "";
  items.forEach((it, i) => { s += rect(x, y - 8, 14, 14, { fill: it.col, rx: 3, sw: 1.6 }) + raw(x + 19, y + 5, esc(it.t), { size: 14, weight: 600, anchor: "start" }); x += wd[i] + 10; });
  return s;
};

// ---------------------------------------------------------------- quadro de Punnett
// fig: { p1, p2 (locos), who?:[rótulo1, rótulo2], ph?:[nome dominante, nome recessivo], phCol?, pcol?, legend?, abo?, dead?, hl?, hl2? }
// mark da dica: { part: "top" | "left" | "grid" }
const ABO_FILL = { A: FILL.rosa, B: FILL.agua, AB: FILL.lilas, O: FILL.cinza };
function punnett(fig, { mode = "ask", size = "main", hint } = {}) {
  const main = size === "main";
  const g1 = gametes(fig.p1), g2 = gametes(fig.p2), nc = g1.length, nr = g2.length, grid = crossGrid(fig.p1, fig.p2);
  const small = nc > 2;
  const cw = small ? (main ? 58 : 50) : main ? 88 : 72;
  const ch = small ? (main ? 36 : 32) : fig.abo ? (main ? 60 : 56) : main ? 52 : 46;
  const hw = small ? 52 : 58, hh = main ? 34 : 30, th = 28, pad = 10;
  const col2 = fig.phCol || [FILL.verde, FILL.areia];
  const legend = fig.legend || (fig.ph ? [{ col: col2[0], t: fig.ph[0] }, { col: col2[1], t: fig.ph[1] }] : null);
  const W = Math.max(pad * 2 + hw + nc * cw, 230), legH = legend ? 30 : 6, H = th + hh + nr * ch + legH + 6;
  const ox = (W - (hw + nc * cw)) / 2, x0 = ox + hw, y0 = th + hh;
  let s = raw(W / 2, 20, `${fig.who ? esc(fig.who[0]) + " " : ""}${genoMk(fig.p1)} × ${fig.who ? esc(fig.who[1]) + " " : ""}${genoMk(fig.p2)}`, { size: 15 });
  g1.forEach((g, c) => { s += rr(x0 + c * cw + 1, th + 1, cw - 2, hh - 2, FILL.agua) + raw(x0 + c * cw + cw / 2, th + hh / 2 + 5, g.map(sup).join(""), { size: 15 }); });
  g2.forEach((g, r) => { s += rr(ox + 1, y0 + r * ch + 1, hw - 2, ch - 2, FILL.lilas) + raw(ox + hw / 2, y0 + r * ch + ch / 2 + 5, g.map(sup).join(""), { size: 15 }); });
  const phCol = fig.pcol || { D: col2[0], r: col2[1] };
  const hl = fig.hl || [], hl2 = fig.hl2 || [], rev = mode === "reveal" && hl.length > 0;
  for (let r = 0; r < nr; r++) for (let c = 0; c < nc; c++) {
    const g = grid[r][c], k = keyOf(g), dead = mode === "reveal" && (fig.dead || []).includes(k);
    const type = fig.abo ? aboOf(g) : null;
    let fill = dead ? FILL.cinza : fig.abo ? ABO_FILL[type] : phCol[phenD(g)];
    const sel = rev && hl.includes(k), sel2 = rev && hl2.includes(k);
    if (sel2) fill = FILL.folha;
    const x = x0 + c * cw, y = y0 + r * ch, cx = x + cw / 2, cy = y + ch / 2, op = rev && !sel ? 0.5 : null;
    s += rect(x + 1, y + 1, cw - 2, ch - 2, { fill, rx: 6, sw: sel ? 4 : 2, stroke: sel ? OK : INK });
    const two = fig.abo || dead;
    s += raw(cx, two ? cy - 3 : cy + 5, genoMk(g), { size: small ? 14 : 16, opacity: op });
    if (fig.abo) s += raw(cx, cy + 16, `tipo ${type}`, { size: 14, weight: 600, opacity: op });
    if (dead) s += line(x + 8, y + ch - 8, x + cw - 8, y + 8, { stroke: BAD, sw: 2.4 }) + raw(cx, cy + 17, "morre", { size: 14, weight: 700, fill: BAD });
  }
  if (legend) s += legendRow(legend, W, H - 18);
  if (hint) {
    const m = hint;
    if (m.part === "top") s += hintBox(x0 - 2, th - 2, nc * cw + 4, hh + 4);
    else if (m.part === "left") s += hintBox(ox - 2, y0 - 2, hw + 4, nr * ch + 4);
    else s += hintBox(x0 - 3, y0 - 3, nc * cw + 6, nr * ch + 6);
  }
  return svg(W, H, s, `Quadro de Punnett ${keyOf(fig.p1)} × ${keyOf(fig.p2)}`);
}

// ---------------------------------------------------------------- heredograma
// fig: { people, mode?, focus?:[ids] } — reveal pinta focus e escreve os genótipos que o modelo prova (ou a probabilidade, em focus)
// mark da dica: { ids:[...] }
function heredograma(fig, { mode = "ask", size = "main", hint } = {}) {
  const main = size === "main", P = fig.people;
  const r = main ? 14 : 12, dy = main ? 72 : 62, pad = main ? 36 : 12, maxW = main ? 414 : 182;
  const xs = P.map((p) => p.x), minx = Math.min(...xs), span = Math.max(Math.max(...xs) - minx, 1);
  let dx = main ? 72 : 44;
  if (span * dx + pad * 2 > maxW) dx = (maxW - pad * 2) / span;
  const gens = Math.max(...P.map((p) => p.g)) + 1;
  const W = Math.max(span * dx + pad * 2, main ? 262 : 120), off = (W - span * dx) / 2 - minx * dx;
  const H = 8 + r + (gens - 1) * dy + r + 34 + (main ? 24 : 0);
  const pos = (p) => ({ x: off + p.x * dx, y: 8 + r + p.g * dy });
  const by = new Map(P.map((p) => [p.id, p]));
  let ln = "", sy = "", tx = "";
  const fams = new Map();
  for (const p of P) if (p.par) { const k = p.par.join("|"); (fams.get(k) || fams.set(k, []).get(k)).push(p); }
  for (const [k, kids] of fams) {
    const [fa, ma] = k.split("|").map((id) => pos(by.get(id)));
    const xa = Math.min(fa.x, ma.x), xb = Math.max(fa.x, ma.x), mx = (xa + xb) / 2, y = fa.y, yb = y + dy - r - 6;
    ln += line(xa + r, y, xb - r, y, { sw: 2.2 }) + line(mx, y, mx, yb, { sw: 2.2 });
    const kx = kids.map((c) => pos(c).x).concat(mx);
    ln += line(Math.min(...kx), yb, Math.max(...kx), yb, { sw: 2.2 });
    for (const c of kids) ln += line(pos(c).x, yb, pos(c).x, pos(c).y - r, { sw: 2.2 });
  }
  for (const [a, b] of fig.unions || []) { const A = pos(by.get(a)), B = pos(by.get(b)); ln += line(Math.min(A.x, B.x) + r, A.y, Math.max(A.x, B.x) - r, A.y, { sw: 2.2 }); }
  const focus = fig.focus || [];
  const all = mode === "reveal" && fig.mode ? enumerate(fig.mode, P.filter((p) => !p.ghost)) : null;
  for (const p of P) {
    const { x, y } = pos(p);
    if (p.ghost) {
      sy += `<path d="M${r1(x)} ${r1(y - r - 3)}L${r1(x + r + 3)} ${r1(y)}L${r1(x)} ${r1(y + r + 3)}L${r1(x - r - 3)} ${r1(y)}Z" fill="#fffdf6" stroke="${INK}" stroke-width="2.2" stroke-dasharray="4 3" stroke-linejoin="round"/>`;
      sy += raw(x, y + 6, "?", { size: 17, fill: INK });
      continue;
    }
    if (mode === "reveal" && focus.includes(p.id)) sy += circle(x, y, r + 7, { fill: "none", stroke: OK, sw: 3.4 });
    const fill = p.aff ? INK : "#fff";
    sy += p.sex === "M" ? rect(x - r, y - r, 2 * r, 2 * r, { fill, rx: 3, sw: 2.4 }) : circle(x, y, r, { fill, sw: 2.4 });
    tx += raw(x, y + r + 15, esc(p.id), { size: 14 });
    if (all) {
      const set = new Map();
      for (const a of all) { const g = a.geno.get(p.id); set.set(g.join("|"), g); }
      if (set.size === 1) tx += raw(x, y + r + 30, genoMk([[...set.values()][0]]), { size: 14, weight: 600, fill: OK });
      else if (focus.includes(p.id)) {
        const het = (g) => g.some(isDomTok) && g.some((t) => t !== "Y" && !isDomTok(t));
        const pr = probGeno(fig.mode, P.filter((q) => !q.ghost), p.id, het);
        const hg = genoOptions(fig.mode, p.sex).find(het);
        tx += raw(x, y + r + 30, `${fstr(pr)} ${genoMk([hg])}`, { size: 14, weight: 600, fill: OK });
      }
    }
  }
  if (hint && hint.ids) for (const id of hint.ids) { const q = pos(by.get(id)); sy += hintRing(q.x, q.y, r + 8); }
  let lg = "";
  if (main) {
    const y = H - 12;
    lg = rect(W / 2 - 112, y - 7, 14, 14, { fill: "#fff", rx: 2, sw: 1.8 }) + raw(W / 2 - 92, y + 5, "homem", { size: 14, weight: 600, anchor: "start" }) +
      circle(W / 2 - 22, y, 7, { fill: "#fff", sw: 1.8 }) + raw(W / 2 - 11, y + 5, "mulher", { size: 14, weight: 600, anchor: "start" }) +
      rect(W / 2 + 50, y - 7, 14, 14, { fill: INK, rx: 2, sw: 1.8 }) + raw(W / 2 + 70, y + 5, "afetado", { size: 14, weight: 600, anchor: "start" });
  }
  return svg(W, H, ln + sy + tx + lg, "Heredograma");
}

// ---------------------------------------------------------------- fitas de DNA/RNA
const baseCell = (x, y, cw, ch, c, { fs = 15, ghost = false, sw = 1.8 } = {}) => {
  if (ghost) return `<rect x="${r1(x + 1)}" y="${r1(y)}" width="${r1(cw - 2)}" height="${ch}" rx="5" fill="#fffdf6" stroke="${MUTED}" stroke-width="1.6" stroke-dasharray="3 3"/>` + raw(x + cw / 2, y + ch / 2 + 5, "?", { size: fs, fill: MUTED });
  return `<rect x="${r1(x + 1)}" y="${r1(y)}" width="${r1(cw - 2)}" height="${ch}" rx="5" fill="${BASE[c]}" fill-opacity=".32" stroke="${BASE[c]}" stroke-width="${sw}"/>` + raw(x + cw / 2, y + ch / 2 + 5, c, { size: fs, weight: 800 });
};
// fig: { v:"transcricao", dna }  |  { v:"traducao", rna }  |  { v:"mutacao", rna, per:5, ans?:pos }
// mark da dica: { codon:k } (transcrição/mutação) | { all:true }
function fita(fig, { mode = "ask", size = "main", hint } = {}) {
  const main = size === "main", maxW = main ? 430 : 182, fs = 15;
  if (fig.v === "transcricao") {
    const n = fig.dna.length, groups = n / 3, endw = 30, gap = 8;
    const cw = Math.min(main ? 30 : 24, Math.floor((maxW - 2 * endw - (groups - 1) * gap) / n));
    const W = 2 * endw + n * cw + (groups - 1) * gap, chh = main ? 32 : 28, y1 = 28, y2 = y1 + chh + 40, H = y2 + chh + 12;
    const bx = (i) => endw + i * cw + Math.floor(i / 3) * gap;
    let s = raw(endw, 18, "DNA (fita molde)", { size: 14, anchor: "start" });
    s += raw(endw - 6, y1 + chh / 2 + 5, "3'", { size: 14, anchor: "end" }) + raw(W - endw + 6, y1 + chh / 2 + 5, "5'", { size: 14, anchor: "start" });
    s += raw(endw, y1 + chh + 22, "RNAm", { size: 14, anchor: "start" });
    s += raw(endw - 6, y2 + chh / 2 + 5, "5'", { size: 14, anchor: "end" }) + raw(W - endw + 6, y2 + chh / 2 + 5, "3'", { size: 14, anchor: "start" });
    const rna = transcribe(fig.dna);
    for (let i = 0; i < n; i++) {
      s += baseCell(bx(i), y1, cw, chh, fig.dna[i], { fs });
      s += line(bx(i) + cw / 2, y1 + chh + 2, bx(i) + cw / 2, y2 - 2, { stroke: MUTED, sw: 1.2, dash: "2 3" });
      s += mode === "reveal" ? baseCell(bx(i), y2, cw, chh, rna[i], { fs }) : baseCell(bx(i), y2, cw, chh, "A", { fs, ghost: true });
    }
    if (hint && hint.codon != null) s += hintBox(bx(hint.codon * 3) - 2, y1 - 4, 3 * cw + 4, chh + 8);
    return svg(W, H, s, "Fita molde de DNA e RNAm a ser formado");
  }
  if (fig.v === "traducao") {
    const n = fig.rna.length, endw = main ? 24 : 16;
    const cw = Math.min(main ? 20 : 15, Math.floor((maxW - 2 * endw) / n)), W = 2 * endw + n * cw, chh = main ? 30 : 28;
    const y = 30, H = y + chh + 52;
    let s = raw(endw, 18, "RNAm", { size: 15, anchor: "start" });
    s += raw(endw - 4, y + chh / 2 + 5, "5'", { size: 15, anchor: "end" }) + raw(W - endw + 4, y + chh / 2 + 5, "3'", { size: 15, anchor: "start" });
    for (let i = 0; i < n; i++) s += baseCell(endw + i * cw, y, cw, chh, fig.rna[i], { fs, sw: 1.4 });
    if (mode === "reveal") {
      const st = fig.rna.indexOf("AUG");
      for (let i = st; i + 3 <= n; i += 3) {
        const aa = CODONS[fig.rna.slice(i, i + 3)], cx = endw + (i + 1.5) * cw;
        s += line(endw + i * cw + 2, y + chh + 8, endw + (i + 3) * cw - 2, y + chh + 8, { stroke: aa === "Pare" ? BAD : OK, sw: 2.6 });
        s += raw(cx, y + chh + 28, aa, { size: 15, fill: aa === "Pare" ? BAD : INK });
        if (aa === "Pare") break;
      }
    }
    if (hint && hint.all) s += hintBox(endw - 3, y - 5, n * cw + 6, chh + 10);
    return svg(W, H, s, "Fita de RNA mensageiro");
  }
  // mutação: RNAm em códons, 'per' códons por linha, número da primeira base de cada códon
  const n = fig.rna.length, nc = n / 3, per = fig.per || 5, rows = Math.ceil(nc / per), endw = main ? 26 : 16, gap = main ? 8 : 6;
  const cw = Math.min(main ? 22 : 18, Math.floor((maxW - 2 * endw - (per - 1) * gap) / (3 * per))), chh = main ? 28 : 26;
  const W = 2 * endw + 3 * per * cw + (per - 1) * gap, rowH = 18 + chh + 12, H = 8 + rows * rowH + 6;
  const bx = (i) => { const c = Math.floor(i / 3) % per; return endw + c * 3 * cw + c * gap + (i % 3) * cw; };
  const byy = (i) => 8 + Math.floor(i / 3 / per) * rowH + 18;
  let s = raw(endw - 4, byy(0) + chh / 2 + 5, "5'", { size: 15, anchor: "end" }) + raw(W - endw + 4, byy(n - 1) + chh / 2 + 5, "3'", { size: 15, anchor: "start" });
  for (let i = 0; i < n; i++) {
    s += baseCell(bx(i), byy(i), cw, chh, fig.rna[i], { fs: 15, sw: 1.4 });
    if (i % 3 === 0) s += raw(bx(i) + cw / 2, byy(i) - 4, String(i + 1), { size: 15, weight: 600, fill: MUTED });
  }
  if (mode === "reveal" && fig.ans) s += circle(bx(fig.ans - 1) + cw / 2, byy(fig.ans - 1) + chh / 2, cw * 0.72 + 3, { fill: "none", stroke: OK, sw: 3.4 });
  for (const k of hint ? hint.codons || [] : []) s += hintBox(bx(k * 3) - 2, byy(k * 3) - 3, 3 * cw + 4, chh + 6);
  return svg(W, H, s, "RNA mensageiro em códons");
}

// ---------------------------------------------------------------- tipagem sanguínea
// gen-sangue: lâmina com 3 gotas { agg:{A,B,D} }; gen-hemacia: hemácia e plasma de { type }, ans?: texto de quem pode doar
// mark da dica: { drop: "A"|"B"|"D" } | { part:"cell"|"plasma" }
const CLUMPS = [[-12, -8], [-4, -14], [8, -10], [14, -1], [6, 8], [-6, 12], [-15, 4], [0, 0], [-3, -3], [5, -4], [-9, 8]];
function sangue(fig, { mode = "ask", size = "main", hint } = {}) {
  const main = size === "main", sp = main ? 114 : 58, r = main ? 29 : 22, W = sp * 3 + 8, cy = 56;
  let s = "";
  [["A", "Anti-A"], ["B", "Anti-B"], ["D", "Anti-D"]].forEach(([k, lab], i) => {
    const cx = 4 + sp * (i + 0.5), agg = !!fig.agg[k];
    s += raw(cx, 18, lab, { size: 14 });
    s += circle(cx, cy, r, { fill: agg ? "#fffdf6" : FILL.sangue, sw: 2.2 });
    if (agg) for (const [dx, dy] of CLUMPS) s += `<circle cx="${r1(cx + dx)}" cy="${r1(cy + dy)}" r="4.4" fill="#b3261e" stroke="${INK}" stroke-width="1"/>`;
    s += raw(cx, cy + r + 20, (main ? (agg ? "aglutinou" : "não aglutinou") : agg ? "sim" : "não"), { size: 14, weight: 600, fill: agg ? BAD : MUTED });
    if (hint && hint.drop === k) s += hintRing(cx, cy, r + 9);
  });
  const t = typeFromAgglutination(fig.agg), ag = antigens(t);
  const list = ["A", "B", "D"].filter((k) => ag[k]).join(" e ") || "nenhum";
  s += mode === "reveal" ? raw(W / 2, main ? 134 : 104, main ? `Tipo ${t}: antígenos ${list}` : `Tipo ${t}`, { size: 15, fill: OK }) : "";
  if (hint && hint.drop === "all") s += hintBox(4, 24, W - 8, 2 * r + 34);
  return svg(W, main ? 144 : 110, s, "Lâmina de tipagem sanguínea com soros anti-A, anti-B e anti-D");
}
function hemacia(fig, { mode = "ask", size = "main", hint } = {}) {
  const main = size === "main", W = main ? 340 : 320, H = 178, ag = antigens(fig.type);
  const cx = 78, cy = 66, R = 34;
  let s = circle(cx, cy, R, { fill: FILL.sangue, sw: 2.4 }) + circle(cx, cy, R * 0.45, { fill: "#f0a9a2", sw: 1.4 });
  const cols = { A: "#f4a6a0", B: "#9cc7ec", D: "#f2d07a" };
  const present = ["A", "B", "D"].filter((k) => ag[k]);
  const angs = present.length === 1 ? [-90] : present.length === 2 ? [-125, -55] : [-145, -90, -35];
  present.forEach((k, i) => {
    const a = (angs[i] * Math.PI) / 180, px = cx + (R + 16) * Math.cos(a), py = cy + (R + 16) * Math.sin(a);
    s += line(cx + R * Math.cos(a), cy + R * Math.sin(a), px, py, { sw: 2 }) + circle(px, py, 11, { fill: cols[k], sw: 2 }) + raw(px, py + 5, k, { size: 14, weight: 800 });
  });
  s += raw(cx, 130, "Hemácias", { size: 14 }) + raw(cx, 148, `Rh ${ag.D ? "positivo" : "negativo"}`, { size: 14, weight: 600, fill: MUTED });
  const anti = ["A", "B"].filter((k) => !ag[k]);
  const px0 = 168, pw = W - px0 - 8;
  s += rr(px0, 22, pw, 112, FILL.agua) + raw(px0 + pw / 2, 42, "Plasma", { size: 14 });
  if (anti.length === 0) s += raw(px0 + pw / 2, 74, "sem anti-A nem anti-B", { size: 14, weight: 600 });
  anti.forEach((k, i) => {
    const y = anti.length === 1 ? 74 : 66 + i * 24, x = px0 + 28;
    s += `<path d="M${x} ${y + 8}L${x} ${y - 2}M${x} ${y - 2}L${x - 7} ${y - 12}M${x} ${y - 2}L${x + 7} ${y - 12}" stroke="${INK}" stroke-width="2.4" fill="none" stroke-linecap="round"/>` + raw(x + 22, y + 5, `anti-${k}`, { size: 15, anchor: "start" });
  });
  if (!ag.D) s += raw(px0 + pw / 2, 112, "Rh−: forma anti-D", { size: 14, weight: 600, fill: BAD }) + raw(px0 + pw / 2, 128, "se receber Rh+", { size: 14, weight: 600, fill: BAD });
  if (mode === "reveal" && fig.ans) s += raw(px0 + pw / 2, 160, `recebe de ${fig.ans}`, { size: 14, fill: OK });
  if (hint && hint.part === "cell") s += hintRing(cx, cy - 6, R + 22);
  if (hint && hint.part === "plasma") s += hintBox(px0 - 3, 19, pw + 6, 118);
  return svg(W, H, s, `Hemácia e plasma do tipo ${fig.type}`);
}

export const FIGS = { "gen-punnett": punnett, "gen-heredograma": heredograma, "gen-fita": fita, "gen-sangue": sangue, "gen-hemacia": hemacia };
export const PATTERNS_USED = [2];

// =============================================================== perguntas
export const QUESTIONS = [];
export const ANSWERS = {}; // id → texto da alternativa certa, para o check conferir
const SRC = "no estilo do ENEM";
const OS = "https://openstax.org/books/";
const REFS = { hered: "Herança e heredogramas: OpenStax Biology 2e, " + OS + "biology-2e/pages/12-2-characteristics-and-traits", abo: "Tipagem ABO/Rh: OpenStax Anatomy & Physiology 2e, " + OS + "anatomy-and-physiology-2e/pages/18-6-blood-typing" };
const CODE_REF = "Código genético: OpenStax Biology 2e, " + OS + "biology-2e/pages/15-1-the-genetic-code";
// a alternativa certa vem do modelo (ans) e entra na posição 'at'; as erradas são as pegadinhas
function pick(dist, ans, at, fmt) {
  const vals = [...dist]; vals.splice(at, 0, ans);
  const t = vals.map(fmt);
  if (new Set(t).size !== 4) throw new Error("alternativas repetidas: " + t.join(" | "));
  return { alts: t.map((x) => ({ t: x })), correct: [at], ansText: fmt(ans) };
}
function add({ id, lvl, text, fig, hint, why, src = SRC, ref, picked }) {
  ref ??= REFS[id.split("-")[2]];
  ANSWERS[id] = picked.ansText;
  QUESTIONS.push({ id, subj: "biologia", pat: 2, lvl, text, fig, alts: picked.alts, correct: picked.correct, hint, why, src, calc: true, ...(ref ? { ref } : {}) });
}
const geno = (g) => keyOf(g);

// ---- Punnett / 1ª lei (4)
{
  const p1 = [["R", "r"]], grid = crossGrid(p1, p1), rec = (g) => phenD(g) === "r";
  const ans = probWhere(grid, (g) => rec(g));
  add({
    id: "bio-gen-punnett-ervilha-rugosa", lvl: 1,
    text: "Ervilha lisa (R) domina a rugosa (r). No cruzamento Rr × Rr, qual a chance de um filho ser rugoso?",
    fig: [{ kind: "gen-punnett", p1, p2: p1, ph: ["lisa", "rugosa"], hl: keysWhere(grid, rec), cap: "Rr × Rr" }],
    picked: pick([fr(3, 4), fr(1, 2), fr(2, 3)], ans, 1, fstr),
    hint: { t: "Conte, no quadro, quantas das 4 casas têm só alelos r.", fig: 0, mark: { part: "grid" } },
    why: `Rr × Rr dá RR, Rr, Rr e rr: só a casa rr é rugosa, ${fstr(ans)}.`,
  });
}
{
  const p1 = [["B", "b"]], p2 = [["b", "b"]], grid = crossGrid(p1, p2);
  const cnt = countBy(grid, phenD), ans = ratioStr([cnt.get("D") || 0, cnt.get("r") || 0]);
  add({
    id: "bio-gen-punnett-coelho-proporcao", lvl: 1,
    text: "Coelho preto Bb cruzado com marrom bb (preto domina). Qual a proporção pretos : marrons nos filhotes?",
    fig: [{ kind: "gen-punnett", p1, p2, ph: ["preto", "marrom"], phCol: [FILL.cinza, FILL.laranja], hl: keysWhere(grid, (g) => phenD(g) === "D"), cap: "Bb × bb" }],
    picked: pick(["3 : 1", "1 : 2 : 1", "2 : 1"], ans, 0, (v) => v),
    hint: { t: "Olhe os gametas das bordas: um dos pais só produz um tipo.", fig: 0, mark: { part: "left" } },
    why: `Bb × bb dá Bb, Bb, bb, bb: ${ans} entre pretos e marrons (fenótipo, não genótipo).`,
  });
}
{
  const p1 = [["A", "a"]], grid = crossGrid(p1, p1), dom = (g) => phenD(g) === "D";
  const ans = condProb(grid, dom, (g) => keyOf(g) === "Aa");
  add({
    id: "bio-gen-punnett-heterozigoto-2-3", lvl: 2,
    text: "Flor púrpura (A) domina a branca (a). Dos descendentes púrpuras de Aa × Aa, que fração é heterozigota?",
    fig: [{ kind: "gen-punnett", p1, p2: p1, ph: ["púrpura", "branca"], phCol: [FILL.lilas, "#ffffff"], hl: keysWhere(grid, dom), hl2: keysWhere(grid, (g) => keyOf(g) === "Aa"), cap: "Aa × Aa" }],
    picked: pick([fr(1, 2), fr(3, 4), fr(1, 4)], ans, 2, fstr),
    hint: { t: "A pergunta já sabe que a flor é púrpura: o que sai do universo de casas?", fig: 0, mark: { part: "grid" } },
    why: `Sobram 3 casas púrpuras (AA, Aa, Aa); 2 são Aa: ${fstr(ans)}, e não 1/2 nem 3/4.`,
  });
}
{
  const p1 = [["A", "a"]], dead = ["AA"], grid = crossGrid(p1, p1);
  const ans = probWhere(grid, (g) => keyOf(g) === "Aa", { dead });
  add({
    id: "bio-gen-punnett-letal-amarelo", lvl: 3,
    text: "Camundongos amarelos (Aa) cruzados entre si. AA é letal. Que fração dos filhotes vivos é amarela?",
    fig: [{ kind: "gen-punnett", p1, p2: p1, ph: ["amarelo", "cinza"], phCol: [FILL.amarelo, FILL.cinza], dead, hl: keysWhere(grid, (g) => keyOf(g) === "Aa", { dead }), cap: "Aa × Aa, AA não nasce" }],
    picked: pick([fr(3, 4), fr(1, 2), fr(1, 4)], ans, 3, fstr),
    hint: { t: "Quem morre não entra na contagem dos que nasceram.", fig: 0, mark: { part: "grid" } },
    why: `Sem a casa AA sobram 3 filhotes (Aa, Aa, aa): 2 amarelos em 3 = ${fstr(ans)}, não 3/4.`,
  });
}

// ---- heredogramas (5)
const M = (id, g, x, aff, par, extra = {}) => ({ id, sex: "M", g, x, aff, ...(par ? { par } : {}), ...extra });
const F = (id, g, x, aff, par, extra = {}) => ({ id, sex: "F", g, x, aff, ...(par ? { par } : {}), ...extra });
const modeText = (m) => MODES[m].nome;
export const PEDS = {
  recessiva: [M("I-1", 0, 0.5, false), F("I-2", 0, 1.5, false), F("II-1", 1, 0, true, ["I-1", "I-2"]), M("II-2", 1, 1, false, ["I-1", "I-2"]), F("II-3", 1, 2, false, ["I-1", "I-2"])],
  dominante: [M("I-1", 0, 0.5, true), F("I-2", 0, 1.5, true), M("II-1", 1, 0, true, ["I-1", "I-2"]), F("II-2", 1, 1, false, ["I-1", "I-2"]), F("II-3", 1, 2, true, ["I-1", "I-2"])],
  certeza: [M("I-1", 0, 0, false), F("I-2", 0, 1, true), M("II-1", 1, 0, false, ["I-1", "I-2"]), F("II-2", 1, 1, false), M("III-1", 2, 0, false, ["II-1", "II-2"]), F("III-2", 2, 1, false, ["II-1", "II-2"])],
  prob13: [M("I-1", 0, 0, false), F("I-2", 0, 1, false), F("II-1", 1, 0, true, ["I-1", "I-2"]), M("II-2", 1, 1, false, ["I-1", "I-2"]), F("II-3", 1, 2, true), { id: "?", g: 2, x: 1.5, ghost: true, par: ["II-2", "II-3"] }],
  prim19: [M("I-1", 0, 0, false), F("I-2", 0, 1, false), M("I-3", 0, 3, false), F("I-4", 0, 4, false), F("II-1", 1, 0, true, ["I-1", "I-2"]), M("II-2", 1, 1, false, ["I-1", "I-2"]), F("II-3", 1, 3, false, ["I-3", "I-4"]), M("II-4", 1, 4, true, ["I-3", "I-4"]), { id: "?", g: 2, x: 2, ghost: true, par: ["II-2", "II-3"] }],
  ligadoX: [M("I-1", 0, 0, true), F("I-2", 0, 1, false), M("II-1", 1, 0, false, ["I-1", "I-2"]), F("II-2", 1, 1, false, ["I-1", "I-2"]), M("II-3", 1, 2, false), { id: "?", g: 2, x: 1.5, ghost: true, par: ["II-3", "II-2"] }],
};
const real = (p) => p.filter((x) => !x.ghost);
const modeAlts = (order) => order.map((m) => ({ t: modeText(m), v: m }));
function modeQuestion({ id, lvl, text, ped, order, hint, focus, why }) {
  const ok = compatibleModes(PEDS[ped]);
  if (ok.length !== 1) throw new Error(`${id}: ${ok.length} modos compatíveis`);
  const alts = modeAlts(order), ci = alts.findIndex((a) => a.v === ok[0]);
  add({
    id, lvl, text,
    fig: [{ kind: "gen-heredograma", people: PEDS[ped], mode: ok[0], focus, cap: "Heredograma" }],
    picked: { alts: alts.map((a) => ({ t: a.t })), correct: [ci], ansText: modeText(ok[0]) },
    hint, why: why(modeText(ok[0])),
  });
}
modeQuestion({
  id: "bio-gen-hered-pais-normais-recessiva", lvl: 1, ped: "recessiva", order: ["XD", "AR", "AD", "XR"], focus: ["I-1", "I-2", "II-1"],
  text: "Pais normais têm uma filha afetada. Qual o padrão de herança desta doença?",
  hint: { t: "Compare os pais com a filha afetada: de onde veio o alelo?", fig: 0, mark: { ids: ["I-1", "I-2", "II-1"] } },
  why: () => "Pais normais com filha afetada: o alelo é recessivo e a filha tem pai normal, então não é ligado ao X.",
});
modeQuestion({
  id: "bio-gen-hered-pais-afetados-dominante", lvl: 2, ped: "dominante", order: ["AR", "XR", "AD", "XD"], focus: ["I-1", "I-2", "II-2"],
  text: "Um casal afetado tem uma filha normal. Qual o padrão de herança da doença?",
  hint: { t: "Dois afetados tiveram uma filha normal: o que isso diz sobre o alelo?", fig: 0, mark: { ids: ["I-1", "I-2", "II-2"] } },
  why: () => "Afetados com filha normal: o alelo é dominante e o pai Aa passou a; se fosse ligado ao X, a filha seria afetada.",
});
{
  const ped = PEDS.certeza, mode = "AR";
  const ids = ped.map((p) => p.id), sure = ids.filter((id) => certainGeno(mode, ped, id) === "Aa");
  if (sure.length !== 1) throw new Error("certeza: " + sure);
  const dist = ["I-1", "I-2", "III-2"];
  add({
    id: "bio-gen-hered-portador-certo", lvl: 2,
    text: "Doença autossômica recessiva. Quem, com certeza, é portador (heterozigoto) neste heredograma?",
    fig: [{ kind: "gen-heredograma", people: ped, mode, focus: sure, cap: "Heredograma" }],
    picked: pick(dist, sure[0], 3, (v) => v),
    hint: { t: "Quem é filho de uma pessoa afetada (aa) e é normal?", fig: 0, mark: { ids: ["I-2"] } },
    why: `${sure[0]} é normal e filho(a) de mãe aa: recebeu a dela e só pode ser Aa.`,
  });
}
{
  const ped = PEDS.prob13, mode = "AR", people = real(ped);
  const ans = childProb(mode, people, "II-2", "II-3", (sx, aff) => aff);
  add({
    id: "bio-gen-hered-prob-1-3", lvl: 3,
    text: "Doença autossômica recessiva. Qual a chance de o descendente “?” de II-2 × II-3 ser afetado?",
    fig: [{ kind: "gen-heredograma", people: ped, mode, focus: ["II-2", "II-3"], cap: "Heredograma" }],
    picked: pick([fr(1, 2), fr(2, 3), fr(1, 4)], ans, 1, fstr),
    hint: { t: "II-2 é normal, mas tem irmã afetada: quais genótipos ele pode ter?", fig: 0, mark: { ids: ["II-2"] } },
    why: `II-2 é Aa com chance 2/3 (normal, filho de Aa × Aa) e II-3 é aa: 2/3 × 1/2 = ${fstr(ans)}.`,
  });
}
{
  const ped = PEDS.prim19, mode = "AR", people = real(ped);
  const ans = childProb(mode, people, "II-2", "II-3", (sx, aff) => aff);
  add({
    id: "bio-gen-hered-irmaos-afetados-1-9", lvl: 3,
    text: "Doença autossômica recessiva. Qual a chance de o descendente “?” de II-2 × II-3 ser afetado?",
    fig: [{ kind: "gen-heredograma", people: ped, mode, focus: ["II-2", "II-3"], cap: "Heredograma" }],
    picked: pick([fr(1, 4), fr(1, 6), fr(1, 3)], ans, 0, fstr),
    hint: { t: "Cada um dos dois tem um irmão afetado: calcule a chance de cada um ser portador.", fig: 0, mark: { ids: ["II-2", "II-3"] } },
    why: `Cada cônjuge é Aa com chance 2/3; juntos, 2/3 × 2/3 × 1/4 = ${fstr(ans)}.`,
  });
}

// ---- ABO / Rh (3)
{
  const agg = { A: true, B: false, D: true }, ans = typeFromAgglutination(agg);
  add({
    id: "bio-gen-abo-lamina-tipagem", lvl: 1,
    text: "A lâmina mostra o teste com soros anti-A, anti-B e anti-D. Qual o tipo sanguíneo da pessoa?",
    fig: [{ kind: "gen-sangue", agg, cap: "Aglutinou = tem o antígeno" }],
    picked: pick(["A−", "O+", "B+"], ans, 2, (v) => v),
    hint: { t: "Aglutinação mostra que o soro encontrou o antígeno correspondente.", fig: 0, mark: { drop: "all" } },
    why: `Aglutinou com anti-A e anti-D: tem antígenos A e D (Rh+), logo é ${ans}.`,
  });
}
{
  const t = "B−", don = donorsOf(t), fmtSet = (a) => a.join(" e ");
  add({
    id: "bio-gen-abo-transfusao-b-negativo", lvl: 2,
    text: "Um paciente B− precisa de hemácias. Quais doadores evitam aglutinação e sensibilização Rh?",
    fig: [{ kind: "gen-hemacia", type: t, ans: fmtSet(don), cap: "Hemácia e plasma do paciente" }],
    picked: pick([["B+", "B−"], ["O+", "O−"], ["A−", "B−"]], don, 0, fmtSet),
    hint: { t: "Compare os antígenos A, B e D de cada doador com os do paciente.", fig: 0, mark: { part: "plasma" } },
    why: `${t} tem anti-A e não tem D: só recebe sangue sem A e sem D (${fmtSet(don)}); Rh+ o sensibilizaria.`,
  });
}
{
  const p1 = [["IA", "i"]], p2 = [["IB", "i"]], grid = crossGrid(p1, p2);
  const order = ["A", "B", "AB", "O"], set = order.filter((t) => cells(grid).some((c) => aboOf(c.g) === t));
  const fmt = (a) => (a.length === 1 ? a[0] : a.slice(0, -1).join(", ") + " e " + a[a.length - 1]);
  add({
    id: "bio-gen-abo-cruzamento-a-b", lvl: 2,
    text: "Mulher do tipo A (IAi) e homem do tipo B (IBi). Que tipos sanguíneos os filhos podem ter?",
    fig: [{ kind: "gen-punnett", p1, p2, abo: true, who: ["Mãe", "Pai"], hl: keysWhere(grid, () => true), cap: "IAi × IBi" }],
    picked: pick([["A", "B"], ["AB", "O"], ["A", "B", "AB"]], set, 1, fmt),
    hint: { t: "Cada genitor dá um dos dois alelos: monte as 4 combinações.", fig: 0, mark: { part: "grid" } },
    why: `IAi × IBi dá IAIB, IAi, IBi e ii: os quatro tipos, ${fmt(set)}, com 1/4 cada.`,
  });
}

// ---- ligada ao X (2)
{
  const p1 = [["XD", "Xd"]], p2 = [["XD", "Y"]], grid = crossGrid(p1, p2);
  const aff = (g) => phenD(g) === "r", isBoy = (g) => g[0].includes("Y");
  const frac = (boy) => condProb(grid, (g) => isBoy(g) === boy, (g) => aff(g));
  const spec = { b: frac(true), g: frac(false) };
  const w = (f, m) => (f.n === 0 ? (m ? "nenhum" : "nenhuma") : feq(f, HALF) ? "metade" : feq(f, ONE) ? (m ? "todos" : "todas") : fstr(f));
  const fmt = (s) => `Meninos: ${w(s.b, true)}; meninas: ${w(s.g, false)}`;
  add({
    id: "bio-gen-x-daltonismo-filhos", lvl: 2,
    text: "Daltonismo é recessivo ligado ao X. Mãe XDXd × pai XDY: quem pode ser daltônico entre os filhos?",
    fig: [{ kind: "gen-punnett", p1, p2, who: ["Mãe", "Pai"], ph: ["visão normal", "daltônico"], phCol: [FILL.verde, FILL.laranja], hl: keysWhere(grid, aff), cap: "XDXd × XDY" }],
    picked: pick([{ b: ZERO, g: HALF }, { b: ONE, g: HALF }, { b: fr(1, 4), g: fr(1, 4) }], spec, 0, fmt),
    hint: { t: "Menino recebe o X da mãe e o Y do pai. Quais casas são XY?", fig: 0, mark: { part: "grid" } },
    why: "Os meninos (XDY e XdY) têm 1/2 de chance de Xd e ficam afetados; as meninas recebem XD do pai e não são.",
  });
}
{
  const ped = PEDS.ligadoX, mode = "XR", people = real(ped);
  const ans = childProb(mode, people, "II-3", "II-2", (sx, aff) => aff);
  add({
    id: "bio-gen-x-heredograma-1-4", lvl: 3,
    text: "Doença recessiva ligada ao X. Qual a chance de a criança “?” (de qualquer sexo) ser afetada?",
    fig: [{ kind: "gen-heredograma", people: ped, mode, focus: ["II-2"], cap: "Heredograma" }],
    picked: pick([fr(1, 2), fr(1, 8), ZERO], ans, 2, fstr),
    hint: { t: "II-2 é filha de um homem afetado: qual X ela recebeu dele?", fig: 0, mark: { ids: ["I-1", "II-2"] } },
    why: `II-2 é portadora (XAXa). Com um pai normal, só meninos Xa são afetados: 1/2 × 1/2 = ${fstr(ans)}, e não 1/2.`,
  });
}

// ---- código genético e mutação (3)
const spaced = (s) => s.match(/.{3}/g).join(" ");
{
  const dna = "TACCGAGAA", rna = transcribe(dna);
  const fmt = (s) => `5'-${spaced(s)}-3'`;
  add({
    id: "bio-gen-codigo-transcricao", lvl: 1,
    text: "Esta fita molde de DNA será transcrita. Qual é o RNAm formado, lido de 5' para 3'?",
    fig: [{ kind: "gen-fita", v: "transcricao", dna, cap: "Fita molde (3' → 5')" }],
    picked: pick([[...dna].map((b) => (b === "T" ? "U" : b)).join(""), [...dna].map((b) => ({ A: "T", T: "A", G: "C", C: "G" })[b]).join(""), reverse(rna)], rna, 3, fmt),
    hint: { t: "Pareie cada base do molde: A-U, T-A, G-C, C-G. No RNA não há T.", fig: 0, mark: { codon: 0 } },
    why: "A RNA polimerase pareia A–U, T–A, G–C, C–G: 3'-TAC CGA GAA-5' dá 5'-AUG GCU CUU-3'.",
    ref: CODE_REF,
  });
}
{
  const rna = "GCAUGGCUUGGAAAUAGCC", st = rna.indexOf("AUG");
  const ans = translate(rna), fmt = (a) => a.join("-");
  const fromStart = translate(rna, 0), frame = translate(rna, st + 1);
  add({
    id: "bio-gen-codigo-traducao-peptideo", lvl: 2,
    text: "Este RNAm será traduzido pelo código genético padrão. Qual peptídeo é formado?",
    fig: [{ kind: "gen-fita", v: "traducao", rna, cap: "RNAm (5' → 3')" }],
    picked: pick([fromStart, frame, [...ans, "Pare"]], ans, 1, fmt),
    hint: { t: "A tradução começa no códon de início e termina no de parada.", fig: 0, mark: { all: true } },
    why: `Começa no AUG e lê de 3 em 3 até UAG (parada): ${fmt(ans)}. O códon de parada não entra no peptídeo.`,
    ref: CODE_REF,
  });
}
{
  const rna = "AUGUUCCAGUGGCACGAAUAAGCUCAUUGA";
  const muts = [{ pos: 7, from: "C", to: "U" }, { pos: 12, from: "G", to: "A" }, { pos: 6, from: "C", to: "U" }, { pos: 19, from: "U", to: "C" }];
  const len = (m) => translate(mutate(rna, m.pos, m.from, m.to)).length;
  const best = Math.min(...muts.map(len)), win = muts.filter((m) => len(m) === best);
  if (win.length !== 1) throw new Error("mutação: empate");
  const ans = win[0], ord = (n) => `${n}ª`;
  const fmt = (m) => `${ord(m.pos)} base: ${m.from} troca por ${m.to}`;
  add({
    id: "bio-gen-codigo-mutacao-menor-proteina", lvl: 3,
    text: "Qual troca de uma base no RNAm abaixo produz a menor proteína?",
    fig: [{ kind: "gen-fita", v: "mutacao", rna, per: 5, ans: ans.pos, cap: "RNAm em códons (5' → 3')" }],
    picked: pick([muts[1], muts[2], muts[3]], ans, 0, fmt),
    hint: { t: "Veja os códons de parada já existentes e procure uma troca que crie outro mais cedo.", fig: 0, mark: { codons: [6, 9] } },
    why: "C→U na 7ª base cria parada já no 3º códon (2 aa). A 12ª também cria, mas só no 4º (3 aa); a 6ª é silenciosa; a 19ª remove a parada.",
    src: "como no ENEM 2021 (mutação no RNAm e tamanho da proteína)",
    ref: CODE_REF,
  });
}

// ---- 2ª lei (1)
{
  const p = [["A", "a"], ["B", "b"]], grid = crossGrid(p, p);
  const isAbb = (g) => phenD(g) === "Dr";
  const ans = probWhere(grid, isAbb);
  add({
    id: "bio-gen-lei2-diibrido-3-16", lvl: 3,
    text: "AaBb × AaBb, genes em cromossomos diferentes. Qual a chance de um filho ser A_bb?",
    fig: [{ kind: "gen-punnett", p1: p, p2: p, legend: [{ col: FILL.verde, t: "A_B_" }, { col: FILL.amarelo, t: "A_bb" }, { col: FILL.agua, t: "aaB_" }, { col: FILL.rosa, t: "aabb" }], pcol: { DD: FILL.verde, Dr: FILL.amarelo, rD: FILL.agua, rr: FILL.rosa }, hl: keysWhere(grid, isAbb), cap: "AaBb × AaBb" }],
    picked: pick([fr(9, 16), fr(1, 16), fr(3, 8)], ans, 1, fstr),
    hint: { t: "Cada pai faz 4 gametas (2ª lei). Na legenda, localize A_bb e conte essas casas.", fig: 0, mark: { part: "grid" } },
    why: `Dos 16 quadrados, 3 são A_ bb (AAbb, Aabb, Aabb): ${fstr(ans)}. Ou 3/4 × 1/4 = ${fstr(ans)}.`,
  });
}
