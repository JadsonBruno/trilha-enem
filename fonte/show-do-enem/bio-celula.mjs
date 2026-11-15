// Biologia: célula e metabolismo (padrão 4), evolução (6), biotecnologia (7), plantas e animais (8). 25 perguntas.
// Onde há regra, a resposta sai de um modelo: osmose(), divide(), nearest()/isMono() (árvore), gel (compativeis()).
// As figuras usam sempre os mesmos modelos que decidem a resposta certa.
import { INK, MUTED, HINT, OK, BAD, FILL, BASE, esc, r1, text, rect, circle, line, arrow, hintRing } from "./bio-base.mjs";

const PAPER = "#fffdf6";
const BLUE = "#2a7fc2", ORANGE = "#d9731f", GREENTXT = "#1f6b3a";

// ----------------------------------------------------------------------------- ajudantes de desenho
// moldura: "main" usa fonte 14.5; "alt" encolhe a figura para largura <= 320 e aumenta a fonte base para sobrar 14.4 na tela
// regra de legibilidade real: fonte na tela = font-size x (340 main | 150 alt) / largura do viewBox >= 11,5 px
const wrap = (W, H, opts, label, build, fmain = 15) => {
  const alt = opts.size === "alt";
  const k = alt ? Math.min(1, 180 / W) : 1;
  const f = alt ? Math.round((14.4 / k) * 10) / 10 : fmain;
  const body = build(f);
  return `<svg viewBox="0 0 ${r1(W * k)} ${r1(H * k)}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg" font-family="Trebuchet MS, Segoe UI, sans-serif">${k === 1 ? body : `<g transform="scale(${k.toFixed(4)})">${body}</g>`}</svg>`;
};
const T = (x, y, s, f, o = {}) => text(x, y, s, { size: f, ...o });
const G = (x, y, s, inner) => `<g transform="translate(${r1(x)} ${r1(y)}) scale(${s})">${inner}</g>`;
const badge = (x, y, s, f) => circle(x, y, f * 0.85, { fill: PAPER, sw: 1.8 }) + T(x, y + f * 0.35, s, f);
const pill = (x, y, s, f, W) => {
  const w = s.length * f * 0.56 + 18, h = f + 10, cx = Math.min(Math.max(x, w / 2 + 4), W - w / 2 - 4);
  return rect(cx - w / 2, y - h / 2, w, h, { fill: "#dff3e3", rx: h / 2, stroke: OK, sw: 2.2 }) + T(cx, y + f * 0.35, s, f, { fill: GREENTXT });
};
const okRing = (x, y, r) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="none" stroke="${OK}" stroke-width="3.4"/>`;
const hintRect = (x, y, w, h) => `<rect class="hintring" x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="10" fill="none" stroke="${HINT}" stroke-width="3.2" stroke-dasharray="5 4"/>`;
const okRect = (x, y, w, h) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="10" fill="none" stroke="${OK}" stroke-width="3.4"/>`;
const rnd = (seed) => () => (seed = (seed * 1664525 + 1013904223) % 4294967296) / 4294967296;
const pc = (x) => String(x).replace(".", ",") + "%";

// ============================================================================= CÉLULA (organelas)
const NOME = { nucleo: "núcleo", mito: "mitocôndria", rer: "RE rugoso", rel: "RE liso", golgi: "Golgi", lisos: "lisossomo", cloro: "cloroplasto", vacuolo: "vacúolo", parede: "parede celular" };
const ORG = {
  nucleo: () => circle(0, 0, 44, { fill: FILL.lilas }) + circle(9, -7, 11, { fill: "#c9b6ec", sw: 1.6 }),
  mito: () => `<ellipse rx="30" ry="16" fill="${FILL.laranja}" stroke="${INK}" stroke-width="2"/><path d="M-20 0q4-9 8 0t8 0 8 0 8 0" fill="none" stroke="${INK}" stroke-width="1.6"/>`,
  rer: () => [0, 1, 2].map((i) => `<rect x="-36" y="${-18 + i * 13}" width="72" height="9" rx="4.5" fill="${FILL.cinza}" stroke="${INK}" stroke-width="1.8"/>` + [-26, -14, -2, 10, 22].map((x) => `<circle cx="${x}" cy="${-19 + i * 13}" r="2.3" fill="${INK}"/>`).join("")).join(""),
  rel: () => [0, 1, 2].map((i) => `<path d="M-30 ${-10 + i * 10}q10-12 20 0t20 0 20 0" fill="none" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M-30 ${-10 + i * 10}q10-12 20 0t20 0 20 0" fill="none" stroke="${FILL.cinza}" stroke-width="3.4" stroke-linecap="round"/>`).join(""),
  golgi: () => [0, 1, 2, 3].map((i) => { const y = -14 + i * 9, w = 34 - Math.abs(i - 1.5) * 5; return `<path d="M${-w} ${y}q${w} -10 ${2 * w} 0" fill="none" stroke="${INK}" stroke-width="7.5" stroke-linecap="round"/><path d="M${-w} ${y}q${w} -10 ${2 * w} 0" fill="none" stroke="${FILL.rosa}" stroke-width="4" stroke-linecap="round"/>`; }).join(""),
  lisos: () => circle(0, 0, 13, { fill: FILL.sangue }) + [[-4, -3], [4, 2], [-2, 5]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2" fill="${INK}"/>`).join(""),
  cloro: () => `<ellipse rx="34" ry="19" fill="${FILL.folha}" stroke="${INK}" stroke-width="2"/>` + [-18, 0, 18].map((x) => [-6, 2].map((y) => `<rect x="${x - 6}" y="${y - 2}" width="12" height="5" rx="2" fill="#5fae48" stroke="${INK}" stroke-width="1.2"/>`).join("")).join(""),
  vacuolo: () => `<ellipse rx="60" ry="70" fill="${FILL.agua}" stroke="${INK}" stroke-width="2"/>`,
};
const LAY = {
  animal: [
    { k: "nucleo", x: 125, y: 118, s: 1, b: [66, 64], r: 54 }, { k: "mito", x: 275, y: 72, s: 1, b: [322, 56], r: 40 },
    { k: "rer", x: 235, y: 152, s: 1, b: [245, 112], r: 46 }, { k: "rel", x: 190, y: 198, s: 1, b: [245, 206], r: 40 },
    { k: "golgi", x: 315, y: 150, s: 1, b: [352, 122], r: 46 }, { k: "lisos", x: 95, y: 190, s: 1, b: [62, 160], r: 22 },
  ],
  vegetal: [
    { k: "vacuolo", x: 255, y: 125, s: 1, b: [255, 125], r: 78 }, { k: "nucleo", x: 90, y: 75, s: 0.8, b: [52, 50], r: 42 },
    { k: "cloro", x: 95, y: 170, s: 1, b: [95, 130], r: 44 }, { k: "cloro", x: 340, y: 170, s: 0.8, b: null, r: 38 },
    { k: "mito", x: 170, y: 190, s: 1, b: [160, 140], r: 38 }, { k: "parede", x: 200, y: 15, s: 0, b: [200, 15], r: 22 },
  ],
};
function celula(fig, opts = {}) {
  const W = 400, H = 240, tipo = fig.tipo || "animal", L = fig.letras || {};
  return wrap(W, H, opts, `Célula ${tipo === "animal" ? "animal" : "vegetal"} com organelas`, (f) => {
    let s = "";
    if (tipo === "animal") s += `<ellipse cx="200" cy="120" rx="175" ry="105" fill="#fff4d2" stroke="${INK}" stroke-width="2.6"/>`;
    else s += rect(12, 10, 376, 220, { fill: FILL.verde, rx: 22, sw: 5 }) + rect(22, 20, 356, 200, { fill: "#fff4d2", rx: 14, sw: 1.8 });
    for (const o of LAY[tipo]) if (o.k !== "parede") s += G(o.x, o.y, o.s, ORG[o.k]());
    for (const o of LAY[tipo]) {
      const lt = L[o.k];
      if (!lt || !o.b) continue;
      if (o.b[0] !== o.x || o.b[1] !== o.y) s += line(o.b[0], o.b[1], o.x, o.y, { sw: 1.4 });
      s += badge(o.b[0], o.b[1], lt, f);
    }
    const alvo = fig.alvo;
    if (opts.mode === "reveal" && alvo) {
      for (const o of LAY[tipo]) if (o.k === alvo && o.s !== 0) s += okRing(o.x, o.y, o.r * 0.78);
      const o = LAY[tipo].find((q) => q.k === alvo), lt = L[alvo];
      if (o.k === "parede") s += okRing(200, 15, 20);
      const by = o.b ? o.b[1] : o.y;
      s += pill(o.b ? o.b[0] : o.x, by + (by < 120 ? 32 : -32), (lt ? lt + " · " : "") + NOME[alvo], f, W);
    }
    if (opts.hint) { const o = LAY[tipo].find((q) => q.k === opts.hint); if (o) s += hintRing(o.x, o.y, o.r); }
    return s;
  });
}

// ============================================================================= OSMOSE (modelo)
// meio mais diluído que a célula (hipotônico): a água ENTRA; mais concentrado (hipertônico): a água SAI.
export const osmose = ({ in: ci, out: co, parede = false }) => {
  const d = co - ci, tonic = Math.abs(d) <= 0.05 ? "isotônico" : d < 0 ? "hipotônico" : "hipertônico";
  const flow = tonic === "isotônico" ? "nenhum" : tonic === "hipotônico" ? "entra" : "sai";
  const result = parede ? { entra: "túrgida", sai: "plasmolisada", nenhum: "flácida" }[flow] : { entra: "incha", sai: "murcha", nenhum: "normal" }[flow];
  return { tonic, flow, result };
};
const star = (cx, cy, ro, ri, n) => Array.from({ length: n * 2 }, (_, i) => { const a = (Math.PI * i) / n, r = i % 2 ? ri : ro; return `${r1(cx + r * Math.cos(a))},${r1(cy + r * Math.sin(a))}`; }).join(" ");
const cellShape = (cx, cy, r, tipo, est) => {
  if (tipo === "vegetal") {
    const s = r * 1.15, g = { túrgida: 1, turgida: 1, plasmolisada: 11, plasmolise: 11 }[est] ?? 5, inn = s - g, pl = est === "plasmolisada" || est === "plasmolise";
    return rect(cx - s, cy - s, 2 * s, 2 * s, { fill: pl ? "#e8f3fb" : FILL.verde, rx: 6, sw: 4.5 }) +
      (pl ? `<ellipse cx="${cx}" cy="${cy}" rx="${r1(inn)}" ry="${r1(inn * 0.85)}" fill="${FILL.amarelo}" stroke="${INK}" stroke-width="1.8"/>` : rect(cx - inn, cy - inn, 2 * inn, 2 * inn, { fill: FILL.amarelo, rx: 8, sw: 1.8 })) +
      circle(cx, cy, inn * 0.35, { fill: FILL.agua, sw: 1.4 });
  }
  if (est === "incha") return circle(cx, cy, r * 1.32, { fill: "#fbe0dc" }) + circle(cx, cy, r * 1.32 + 5, { fill: "none", stroke: MUTED, sw: 1.4 }).replace("/>", ` stroke-dasharray="3 4"/>`);
  if (est === "murcha") return `<polygon points="${star(cx, cy, r * 0.88, r * 0.62, 11)}" fill="#eaa59d" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`;
  if (est === "divide") return circle(cx - r * 0.5, cy, r * 0.62, { fill: FILL.sangue }) + circle(cx + r * 0.5, cy, r * 0.62, { fill: FILL.sangue });
  return circle(cx, cy, r, { fill: FILL.sangue }) + `<ellipse cx="${cx}" cy="${cy}" rx="${r * 0.5}" ry="${r * 0.5}" fill="#f1a9a1" stroke="${INK}" stroke-width="1.2" stroke-dasharray="3 3"/>`;
};
function osmoseFig(fig, opts = {}) {
  const tipo = fig.tipo || "hemacia";
  if (fig.estado) return wrap(200, 150, opts, "célula em solução", () => rect(8, 8, 184, 134, { fill: FILL.agua, rx: 14 }) + cellShape(100, 75, 38, tipo, fig.estado));
  const cena = fig.cena, n = cena.length, pw = 140, W = n === 1 ? 220 : pw * n, H = 232, ci = fig.in;
  return wrap(W, H, opts, "Célula em béquer com solução", (f) => {
    let s = "";
    cena.forEach((b, i) => {
      const ox = (W - pw * n) / 2 + pw * i, cx = ox + pw / 2, cy = 105, x1 = ox + 16, x2 = ox + 124;
      const m = osmose({ in: ci, out: b.out, parede: tipo === "vegetal" });
      s += `<path d="M${x1} 58V145Q${x1} 152 ${x1 + 8} 152H${x2 - 8}Q${x2} 152 ${x2} 145V58Z" fill="${FILL.agua}" stroke="none"/>`;
      const R = rnd(7 + i * 31), nd = Math.round(b.out * 10);
      for (let d = 0; d < nd; d++) { const px = x1 + 8 + R() * (x2 - x1 - 16), py = 64 + R() * 80; if (Math.hypot(px - cx, py - cy) > 36) s += `<circle cx="${r1(px)}" cy="${r1(py)}" r="2.4" fill="#5b7fb8"/>`; }
      s += `<path d="M${x1} 40V145Q${x1} 152 ${x1 + 8} 152H${x2 - 8}Q${x2} 152 ${x2} 145V40" fill="none" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
      const est = opts.mode === "reveal" ? m.result : "normal", rr = tipo === "vegetal" ? 24 : 24;
      s += cellShape(cx, cy, rr, tipo, est);
      const R2 = rnd(99 + i), ndi = Math.round(ci * 10);
      for (let d = 0; d < ndi; d++) { const a = R2() * 6.283, rad = R2() * rr * 0.62; s += `<circle cx="${r1(cx + rad * Math.cos(a))}" cy="${r1(cy + rad * Math.sin(a))}" r="2.2" fill="#5b7fb8"/>`; }
      if (n > 1) s += badge(cx, 20, "ABC"[i], f);
      s += T(cx, 176, "meio " + pc(b.out).replace(".", ","), f) + T(cx, 196, "célula " + pc(ci), f);
      if (opts.mode === "reveal") {
        s += T(cx, 220, "meio " + m.tonic, f, { fill: GREENTXT });
        const rr2 = rr * 1.3;
        if (m.flow === "entra") s += arrow(cx - rr2 - 20, cy, cx - rr2 - 4, cy, { stroke: BLUE }) + arrow(cx + rr2 + 20, cy, cx + rr2 + 4, cy, { stroke: BLUE });
        if (m.flow === "sai") s += arrow(cx - rr2 - 4, cy, cx - rr2 - 20, cy, { stroke: BLUE }) + arrow(cx + rr2 + 4, cy, cx + rr2 + 20, cy, { stroke: BLUE });
      }
      if (opts.hint && opts.hint.beaker === i) s += hintRing(cx, cy, 40);
    });
    return s;
  });
}

// ============================================================================= MITOSE × MEIOSE (modelo)
export const divide = (proc, n2) => (proc === "mitose" ? { celulas: 2, cromossomos: n2 } : { celulas: 4, cromossomos: n2 / 2 });
const rod = (x, y, col, len) => `<path d="M${r1(x)} ${r1(y - len / 2)}V${r1(y + len / 2)}" stroke="${INK}" stroke-width="7" stroke-linecap="round"/><path d="M${r1(x)} ${r1(y - len / 2)}V${r1(y + len / 2)}" stroke="${col}" stroke-width="4" stroke-linecap="round"/>`;
const MAT = "#e86a92", PAT = "#3d8fd1";
const rods = (cx, cy, cols, dx, dy, len) => { const rows = Math.ceil(cols.length / 2); return cols.map((c, i) => { const col = i % 2, row = Math.floor(i / 2), two = cols.length > 1; return rod(cx + (two ? (col ? dx / 2 : -dx / 2) : 0), cy + (row - (rows - 1) / 2) * dy, c, len); }).join(""); };
function divisao(fig, opts = {}) {
  const W = 400, H = 214, n2 = fig.n2, par = fig.proc, res = divide(par, n2), rev = opts.mode === "reveal";
  return wrap(W, H, opts, `${par}: célula 2n = ${n2}`, (f) => {
    const pairCols = Array.from({ length: n2 }, (_, i) => (i % 2 ? PAT : MAT));
    let s = circle(80, 100, 52, { fill: FILL.amarelo }) + rods(80, 100, pairCols, 18, 15, 12) + T(80, 176, "2n = " + n2, f);
    s += arrow(140, 100, 190, 100) + T(165, 88, par, f);
    const pos = par === "mitose" ? [[270, 62], [270, 146]] : [[245, 56], [325, 56], [245, 146], [325, 146]];
    const rr = par === "mitose" ? 36 : 33;
    pos.forEach(([x, y], i) => {
      s += circle(x, y, rr, { fill: FILL.verde });
      if (!rev) s += T(x, y + f * 0.5, "?", f * 1.5, { fill: MUTED });
      else {
        const cols = par === "mitose" ? pairCols : Array.from({ length: n2 / 2 }, (_, j) => (j % 2 ? PAT : MAT));
        s += rods(x, y, cols, par === "mitose" ? 14 : 16, par === "mitose" ? 11 : 12, 9);
      }
    });
    if (rev) s += T(275, 208, `${res.celulas} células de ${res.cromossomos} cromossomos`, f, { fill: GREENTXT });
    if (opts.hint && opts.hint.filhas) s += hintRing(par === "mitose" ? 270 : 285, par === "mitose" ? 104 : 101, par === "mitose" ? 74 : 102);
    return s;
  });
}

// ============================================================================= DARWIN × LAMARCK
const girafa = (x, g, neck, extra = "") => {
  const nx = x + 12, ty = g - 30 - neck;
  return `<path d="M${x - 9} ${g - 18}V${g}M${x + 9} ${g - 18}V${g}" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>` +
    `<ellipse cx="${x}" cy="${g - 26}" rx="18" ry="10" fill="${FILL.amarelo}" stroke="${INK}" stroke-width="2"/>` +
    `<path d="M${nx} ${g - 30}L${nx + 3} ${ty}" stroke="${INK}" stroke-width="9" stroke-linecap="round"/><path d="M${nx} ${g - 30}L${nx + 3} ${ty}" stroke="${FILL.amarelo}" stroke-width="5.4" stroke-linecap="round"/>` +
    circle(nx + 7, ty - 2, 5.5, { fill: FILL.amarelo, sw: 1.8 }) + `<circle cx="${x - 4}" cy="${g - 27}" r="2" fill="#c98a2c"/><circle cx="${x + 5}" cy="${g - 24}" r="2" fill="#c98a2c"/>` + extra;
};
const xis = (x, y) => line(x - 8, y - 8, x + 8, y + 8, { stroke: BAD, sw: 3.4 }) + line(x - 8, y + 8, x + 8, y - 8, { stroke: BAD, sw: 3.4 });
function darwin(fig, opts = {}) {
  const W = 460, H = 280;
  return wrap(W, H, opts, "Dois esquemas: A, pescoço esticado e herdado; B, variação e sobrevivência", (f) => {
    let s = rect(2, 2, 216, 276, { fill: "none", rx: 12, sw: 1.8 }) + rect(242, 2, 216, 276, { fill: "none", rx: 12, sw: 1.8 });
    s += badge(20, 22, "A", f) + badge(262, 22, "B", f);
    // A: esticar o pescoço e os filhos já nascerem com ele mais longo
    s += girafa(55, 190, 36) + [0, 1, 2].map((i) => arrow(92, 156 - i * 0 - 0, 92, 130, { stroke: BLUE })).slice(0, 1).join("") + arrow(104, 150, 104, 124, { stroke: BLUE }) + arrow(116, 156, 116, 130, { stroke: BLUE });
    s += arrow(112, 205, 140, 205) + girafa(170, 190, 78);
    s += T(55, 222, "geração 1", f) + T(170, 222, "geração 2", f);
    // B: variação, os de pescoço curto não alcançam a comida
    const nk1 = [24, 36, 50, 62], nk2 = [50, 56, 62, 62];
    nk1.forEach((nk, i) => { s += girafa(272 + i * 48, 118, nk); if (i < 2) s += xis(272 + i * 48 + 4, 78 + (62 - nk) * 0 + 20); });
    s += T(350, 142, "geração 1", f);
    nk2.forEach((nk, i) => { s += girafa(272 + i * 48, 258, nk); });
    s += T(350, 276, "geração 2", f);
    if (opts.mode === "reveal" && fig.alvo) s += okRect(fig.alvo === "A" ? 2 : 242, 2, 216, 276);
    if (opts.hint) s += hintRect(opts.hint === "A" ? 6 : 246, 6, 208, 268);
    return s;
  }, 16);
}

// ============================================================================= CLADOGRAMA (árvore: modelo)
const leavesOf = (t) => (typeof t === "string" ? [t] : t.flatMap(leavesOf));
const heightOf = (t) => (typeof t === "string" ? 0 : 1 + Math.max(...t.map(heightOf)));
export const leafPaths = (t, p = []) => (typeof t === "string" ? { [t]: p } : Object.assign({}, ...t.map((c, i) => leafPaths(c, [...p, i]))));
const common = (a, b) => { let i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; };
// parentes mais próximos de x: folhas cujo ancestral comum com x é o mais recente (mais fundo na árvore)
export const nearest = (t, x) => { const P = leafPaths(t); let best = -1, out = []; for (const [n, p] of Object.entries(P)) { if (n === x) continue; const c = common(p, P[x]); if (c > best) { best = c; out = [n]; } else if (c === best) out.push(n); } return out; };
// grupo monofilético = existe um nó cujas folhas são exatamente o grupo (ancestral + todos os descendentes)
export const isMono = (t, set) => { const S = [...set].sort().join("|"); const walk = (n) => leavesOf(n).slice().sort().join("|") === S || (typeof n !== "string" && n.some(walk)); return walk(t); };
export const mrca = (t, names) => { const P = leafPaths(t), ps = names.map((n) => P[n]); let k = ps[0].length; for (const p of ps) k = Math.min(k, common(p, ps[0])); return ps[0].slice(0, k); };
function cladograma(fig, opts = {}) {
  const t = fig.arvore, n = leavesOf(t).length, dy = n > 5 ? 34 : 40, W = 380, H = 24 + n * dy, XL = 262, X0 = 26, rev = opts.mode === "reveal";
  return wrap(W, H, opts, "Árvore filogenética (cladograma)", (f) => {
    const nodes = {}, leafY = {};
    let li = 0, s = "";
    const hl = rev ? (fig.alvo ? mrca(t, [fig.foco, fig.alvo]) : fig.grupo ? mrca(t, fig.grupo) : null) : null;
    const inside = (p) => hl && p.length >= hl.length && hl.every((v, i) => p[i] === v);
    const rec = (nd, path) => {
      if (typeof nd === "string") { const y = 24 + li++ * dy - dy * 0.25 + 12; leafY[nd] = y; return { x: XL, y }; }
      const ch = nd.map((c, i) => rec(c, [...path, i])), x = XL - heightOf(nd) * ((XL - X0) / heightOf(t)), ys = ch.map((c) => c.y), y = (Math.min(...ys) + Math.max(...ys)) / 2;
      nodes[path.join("")] = { x, y };
      ch.forEach((c, i) => { const h = inside([...path, i]); s += line(x, c.y, c.x, c.y, { stroke: h ? OK : INK, sw: h ? 4 : 2.4 }); });
      const h = inside(path);
      s += line(x, Math.min(...ys), x, Math.max(...ys), { stroke: h ? OK : INK, sw: h ? 4 : 2.4 });
      return { x, y };
    };
    const root = rec(t, []);
    s += line(X0 - 14, root.y, X0, root.y, { sw: 2.4 });
    for (const [name, y] of Object.entries(leafY)) {
      const isFoco = name === fig.foco, isAlvo = rev && name === fig.alvo, inG = rev && fig.grupo && fig.grupo.includes(name);
      if (isAlvo || inG) s += rect(XL + 6, y - 12, name.length * f * 0.55 + 14, 24, { fill: "#dff3e3", rx: 9, stroke: OK, sw: 2 });
      s += isFoco ? `<polygon points="${XL},${y - 7} ${XL + 7},${y} ${XL},${y + 7} ${XL - 7},${y}" fill="${FILL.amarelo}" stroke="${INK}" stroke-width="2"/>` : circle(XL, y, 3.2, { fill: INK, sw: 1 });
      s += T(XL + 13, y + f * 0.35, name, f, { anchor: "start", weight: isFoco || isAlvo ? 800 : 700, fill: isAlvo || inG ? GREENTXT : INK });
    }
    if (opts.hint && opts.hint.nodo) { const p = mrca(t, opts.hint.nodo).join(""), nd = nodes[p]; if (nd) s += hintRing(nd.x, nd.y, 18); }
    return s;
  });
}

// ============================================================================= GEL (eletroforese; modelo)
// cada banda é uma posição 1 (perto do poço, fragmento grande) a 10 (longe, fragmento pequeno).
export const paternas = (mae, filho) => filho.filter((b) => !mae.includes(b));
export const compativeis = (raias) => { const [mae, filho, ...sus] = raias, p = paternas(mae.b, filho.b); return sus.filter((s) => p.every((b) => s.b.includes(b))).map((s) => s.n); };
function gel(fig, opts = {}) {
  const R = fig.raias, L = R.length, lw = L > 5 ? 62 : 70, gx = 56, W = gx + L * lw + 12, H = 252, rev = opts.mode === "reveal";
  return wrap(W, H, opts, "Gel de eletroforese com bandas de DNA", (f) => {
    let s = rect(gx, 40, L * lw + 4, 204, { fill: "#33406b", rx: 6, sw: 2.4 });
    s += T(4, 66, "maior", f, { anchor: "start" }) + T(4, 242, "menor", f, { anchor: "start" });
    const [mae, filho] = R, pat = paternas(mae.b, filho.b), comp = compativeis(R);
    R.forEach((r, i) => {
      const cx = gx + 4 + i * lw + lw / 2;
      s += rect(cx - (lw - 18) / 2, 44, lw - 18, 6, { fill: "#1d2644", rx: 2, stroke: "none", sw: 0 });
      const isComp = rev && comp.includes(r.n) && fig.destaque !== false;
      s += T(cx, 30, r.n, f, { fill: isComp ? GREENTXT : INK });
      r.b.forEach((p) => {
        let col = "#f4f1e6";
        if (rev && i === 1) col = mae.b.includes(p) ? "#f4a6c6" : "#7cc4ff";
        if (rev && i > 1 && isComp && pat.includes(p)) col = "#7cc4ff";
        s += rect(cx - (lw - 22) / 2, 62 + (p - 1) * 17, lw - 22, 8, { fill: col, rx: 3, stroke: "none", sw: 0 });
      });
      if (isComp) s += okRect(cx - lw / 2 + 2, 36, lw - 4, 208);
    });
    if (rev) s += T(W / 2 + 20, 249, "rosa: da mãe · azul: do pai", f, { fill: "#cfd8ff" }).replace(/y="249"/, 'y="238"');
    if (opts.hint && opts.hint.lane) { const i = R.findIndex((r) => r.n === opts.hint.lane); if (i >= 0) s += hintRect(gx + 4 + i * lw + 1, 34, lw - 2, 210); }
    return s;
  });
}

// ============================================================================= TRANSGÊNICO
const wavy = (x0, y0, len) => `<path d="M${x0} ${y0}q${len / 8} -12 ${len / 4} 0t${len / 4} 0 ${len / 4} 0 ${len / 4} 0" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
function transgenico(fig, opts = {}) {
  const W = 400, H = 190, GENE = "#e3a21a";
  return wrap(W, H, opts, "Gene de uma espécie inserido no DNA de outra", (f) => {
    let s = circle(70, 90, 54, { fill: FILL.agua }) + circle(330, 90, 54, { fill: FILL.verde });
    s += wavy(38, 90, 24) + rect(63, 83, 18, 14, { fill: GENE, rx: 3, sw: 2 }) + wavy(84, 90, 24);
    s += wavy(298, 90, 24) + rect(323, 83, 18, 14, { fill: GENE, rx: 3, sw: 2 }) + wavy(344, 90, 24);
    s += rect(176, 52, 48, 22, { fill: GENE, rx: 4, sw: 2 }) + T(200, 68, "gene", f) + arrow(130, 90, 262, 90);
    s += T(70, 170, fig.doador || "Bactéria", f) + T(330, 170, fig.receptor || "Milho", f);
    if (opts.mode === "reveal") s += okRing(332, 90, 20) + pill(200, 130, "gene de outra espécie", f, W);
    if (opts.hint) s += hintRing(70, 90, 30);
    return s;
  });
}

// ============================================================================= CLONAGEM (transferência de núcleo)
function clone(fig, opts = {}) {
  const W = 420, H = 200, NUC = "#3d8fd1";
  return wrap(W, H, opts, "Clonagem por transferência de núcleo", (f) => {
    let s = circle(70, 80, 40, { fill: FILL.rosa }) + circle(70, 80, 14, { fill: NUC, sw: 2 });
    s += T(70, 150, "Célula do corpo", f) + T(140, 86, "+", f * 1.6) ;
    s += circle(210, 80, 40, { fill: FILL.laranja }) + circle(210, 80, 14, { fill: "none", stroke: MUTED, sw: 2 }).replace("/>", ` stroke-dasharray="3 3"/>`);
    s += T(210, 150, "Óvulo sem núcleo", f);
    s += arrow(255, 80, 295, 80);
    s += circle(350, 80, 40, { fill: FILL.laranja }) + circle(350, 80, 14, { fill: NUC, sw: 2 }) + T(350, 150, "Óvulo + núcleo", f);
    if (opts.mode === "reveal") s += pill(210, 184, "núcleo azul vem da doadora: DNA dela", f, W);
    if (opts.hint) s += hintRing(210, 80, 46);
    return s;
  });
}

// ============================================================================= CRISPR
function crispr(fig, opts = {}) {
  const W = 400, H = 208, RNA = "#e8883a";
  return wrap(W, H, opts, "Cas9 e RNA guia cortando o DNA", (f) => {
    let s = `<ellipse cx="200" cy="117" rx="84" ry="62" fill="${FILL.lilas}" stroke="${INK}" stroke-width="2.4"/>`;
    for (let x = 30; x <= 370; x += 10) { if (x > 192 && x < 208) continue; s += line(x, 108, x, 126, { stroke: [BASE.A, BASE.T, BASE.G, BASE.C][(x / 10) % 4], sw: 2.6 }); }
    s += `<path d="M30 108H196M204 108H370M30 126H196M204 126H370" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    s += `<path d="M193 101l5 7-5 7M207 101l-5 7 5 7" fill="none" stroke="${BAD}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>`;
    for (let x = 156; x <= 244; x += 11) s += line(x, 130, x, 146, { stroke: MUTED, sw: 1.6, dash: "2 3" });
    s += line(150, 150, 250, 150, { stroke: INK, sw: 7 }) + line(150, 150, 250, 150, { stroke: RNA, sw: 4 });
    s += T(200, 47, "Cas9", f) + T(200, 198, "RNA guia", f) + T(30, 96, "DNA", f, { anchor: "start" });
    if (opts.mode === "reveal") s += `<rect x="144" y="141" width="112" height="19" rx="9" fill="none" stroke="${OK}" stroke-width="3.2"/>` + pill(322, 186, "reconhece o alvo", f, W);
    if (opts.hint) s += hintRing(200, 72, 30);
    return s;
  });
}

// ============================================================================= FÓSSEIS (camadas)
const peixe = (x, y) => `<path d="M${x - 40} ${y}L${x - 56} ${y - 14}V${y + 14}Z" fill="#f6f0e0" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><ellipse cx="${x}" cy="${y}" rx="40" ry="14" fill="#f6f0e0" stroke="${INK}" stroke-width="2"/><path d="M${x - 6} ${y - 14}l8 -10 10 10" fill="#f6f0e0" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/><circle cx="${x + 26}" cy="${y - 3}" r="2.2" fill="${INK}"/>`;
const fossil = {
  peixe: (x, y) => peixe(x, y) + `<path d="M${x + 6} ${y + 12}l6 11 8 -4" fill="#f6f0e0" stroke="${INK}" stroke-width="2" stroke-linejoin="round"/>`,
  trans: (x, y) => peixe(x, y) + `<path d="M${x + 6} ${y + 12}L${x + 14} ${y + 24}L${x + 28} ${y + 28}" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${x + 6} ${y + 12}L${x + 14} ${y + 24}L${x + 28} ${y + 28}" fill="none" stroke="#f6f0e0" stroke-width="2.4" stroke-linecap="round"/>` + circle(x + 14, y + 24, 3.4, { fill: "#f6f0e0", sw: 1.6 }) + `<path d="M${x + 16} ${y - 10}q4 10 0 20M${x + 22} ${y - 10}q4 10 0 20" fill="none" stroke="${INK}" stroke-width="1.8"/>`,
  tetra: (x, y) => `<path d="M${x - 38} ${y}q-14 8 -26 22" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/><ellipse cx="${x}" cy="${y}" rx="38" ry="13" fill="#f6f0e0" stroke="${INK}" stroke-width="2"/><ellipse cx="${x + 44}" cy="${y - 2}" rx="13" ry="9" fill="#f6f0e0" stroke="${INK}" stroke-width="2"/><circle cx="${x + 49}" cy="${y - 5}" r="2" fill="${INK}"/><path d="M${x - 22} ${y + 10}l-6 14M${x - 8} ${y + 12}l-2 14M${x + 14} ${y + 12}l2 14M${x + 28} ${y + 10}l6 14" stroke="${INK}" stroke-width="4" stroke-linecap="round"/>`,
};
function fosseis(fig, opts = {}) {
  const W = 400, H = 232, bands = [["tetra", FILL.areia], ["trans", FILL.cinza], ["peixe", "#e0d2b0"]];
  return wrap(W, H, opts, "Camadas de rocha com três fósseis", (f) => {
    let s = "";
    bands.forEach(([k, col], i) => {
      const y = 12 + i * 70;
      s += `<path d="M70 ${y}H392V${y + 70}H70Z" fill="${col}" stroke="${INK}" stroke-width="2"/>` + fossil[k](150, y + 30);
      s += `<path d="M80 ${y + 60}q20 -6 40 0t40 0 40 0 40 0" fill="none" stroke="${MUTED}" stroke-width="1.4"/>`;
    });
    s += T(34, 30, "novo", f) + T(34, 218, "antigo", f) + arrow(34, 44, 34, 190, { stroke: MUTED });
    s += badge(228, 104, "X", f);
    if (opts.mode === "reveal") s += okRect(70, 82, 322, 70) + pill(296, 144, "forma de transição", f, W);
    if (opts.hint) s += hintRect(74, 86, 314, 62);
    return s;
  });
}

// ============================================================================= ESPECIAÇÃO
function especiacao(fig, opts = {}) {
  const W = 420, H = 196, Y = "#ffd96b", C1 = "#f0a04b", C2 = "#b79be8";
  return wrap(W, H, opts, "Uma população separada por um rio em duas", (f) => {
    let s = "";
    [["antes", 0], ["barreira", 145], ["depois", 290]].forEach(([nm, ox], i) => {
      s += T(ox + 65, 20, nm, f) + rect(ox + 4, 32, 122, 100, { fill: FILL.verde, rx: 14 });
      if (i > 0) s += `<rect x="${ox + 56}" y="30" width="18" height="104" fill="${FILL.agua}" stroke="${INK}" stroke-width="2"/>`;
      const dots = i === 0 ? [[22, 60], [50, 100], [78, 56], [100, 98], [64, 82], [100, 50]] : [[20, 60], [38, 100], [36, 78], [92, 60], [110, 98], [104, 80]];
      dots.forEach(([x, y], j) => { const left = x < 60; s += circle(ox + 4 + x, 32 + y - 24 + 12, 7, { fill: i < 2 ? Y : left ? C1 : C2, sw: 1.8 }); });
    });
    s += `<path d="M330 150H388" stroke="${MUTED}" stroke-width="2.2" stroke-dasharray="4 4" stroke-linecap="round"/>`;
    if (opts.mode === "reveal") s += T(355, 150 + 5, "✗", f * 1.4, { fill: BAD }) + pill(355, 176, "reunidas, não cruzam", f, W);
    else s += T(355, 158, "?", f * 1.6, { fill: MUTED });
    if (opts.hint) s += hintRect(284, 28, 134, 128);
    return s;
  });
}

// ============================================================================= BOTÂNICA
const folhaE = (x, y, rot) => `<ellipse cx="${x}" cy="${y}" rx="40" ry="16" transform="rotate(${rot} ${x} ${y})" fill="${FILL.folha}" stroke="${INK}" stroke-width="2"/>`;
function planta(fig, opts = {}) {
  const W = 360, H = 250, rev = opts.mode === "reveal", modo = fig.modo || "vasos";
  return wrap(W, H, opts, "Planta com raiz, caule e folhas", (f) => {
    let s = `<rect x="4" y="140" width="352" height="106" rx="10" fill="${FILL.areia}" stroke="${INK}" stroke-width="2"/>`;
    s += `<path d="M180 140Q150 180 110 205M180 140Q210 175 250 205M180 140V215M160 175Q140 195 138 225M200 170Q222 190 224 226" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`;
    s += folhaE(132, 72, -25) + folhaE(228, 72, 25) + folhaE(180, 44, 0);
    s += rect(166, 46, 28, 94, { fill: FILL.verde, rx: 4, sw: 2.2 }) + rect(170, 50, 7, 90, { fill: FILL.agua, rx: 2, sw: 1.2 }) + rect(183, 50, 7, 90, { fill: FILL.laranja, rx: 2, sw: 1.2 });
    s += `<circle cx="318" cy="34" r="15" fill="${FILL.amarelo}" stroke="${INK}" stroke-width="2"/>` + [0, 1, 2, 3, 4, 5, 6, 7].map((i) => { const a = (i * Math.PI) / 4; return line(318 + 21 * Math.cos(a), 34 + 21 * Math.sin(a), 318 + 28 * Math.cos(a), 34 + 28 * Math.sin(a), { sw: 2 }); }).join("");
    s += arrow(173.5, 134, 173.5, 62, { stroke: BLUE, sw: 2 });
    if (modo === "vasos") {
      s += arrow(186.5, 62, 186.5, 134, { stroke: ORANGE, sw: 2 });
      s += line(146, 92, 170, 92, { sw: 1.4 }) + badge(130, 92, "A", f) + T(150, 116, "água e sais", f, { anchor: "end" });
      s += line(190, 92, 214, 92, { sw: 1.4 }) + badge(230, 92, "B", f) + T(212, 116, "açúcar", f, { anchor: "start" });
      if (rev) { const tx = fig.alvo === "floema" ? 186.5 : 173.5; s += `<rect x="${tx - 6}" y="46" width="12" height="96" rx="5" fill="none" stroke="${OK}" stroke-width="3.2"/>` + pill(fig.alvo === "floema" ? 290 : 70, 160 - 28, fig.alvo, f, W); }
      if (opts.hint) { s += hintRect(164, 42, 14, 102); }
    } else {
      s += [118, 180, 242].map((x) => arrow(x, 46, x, 22, { stroke: "#7aa6c9", sw: 2 })).join("") + T(180, 14, "vapor de água", f, { fill: "#4a7aa0" });
      s += arrow(110, 200, 140, 178, { stroke: BLUE, sw: 2 }) + arrow(250, 200, 222, 176, { stroke: BLUE, sw: 2 });
      if (rev) s += okRing(132, 70, 62) + okRing(228, 70, 62) + pill(180, 118, "transpiração", f, W);
      if (opts.hint) s += hintRing(180, 190, 60);
    }
    return s;
  });
}
function flor(fig, opts = {}) {
  const W = 300, H = 250, L = fig.letras || {}, rev = opts.mode === "reveal";
  const P = { antera: { x: 96, y: 100, b: [36, 66], r: 22 }, estigma: { x: 150, y: 90, b: [230, 44], r: 26 }, ovario: { x: 150, y: 195, b: [248, 208], r: 38 }, petala: { x: 80, y: 135, b: [28, 190], r: 40 } };
  return wrap(W, H, opts, "Corte de uma flor", (f) => {
    let s = `<ellipse cx="80" cy="135" rx="52" ry="24" transform="rotate(-30 80 135)" fill="${FILL.rosa}" stroke="${INK}" stroke-width="2"/><ellipse cx="220" cy="135" rx="52" ry="24" transform="rotate(30 220 135)" fill="${FILL.rosa}" stroke="${INK}" stroke-width="2"/>`;
    s += rect(144, 222, 12, 28, { fill: FILL.verde, rx: 3, sw: 2 });
    s += `<ellipse cx="118" cy="204" rx="24" ry="9" transform="rotate(25 118 204)" fill="${FILL.folha}" stroke="${INK}" stroke-width="2"/><ellipse cx="182" cy="204" rx="24" ry="9" transform="rotate(-25 182 204)" fill="${FILL.folha}" stroke="${INK}" stroke-width="2"/>`;
    s += `<path d="M150 172V100" stroke="${INK}" stroke-width="8" stroke-linecap="round"/><path d="M150 172V100" stroke="${FILL.folha}" stroke-width="4.4" stroke-linecap="round"/>`;
    s += `<path d="M132 192Q100 160 96 108M168 192Q200 160 204 108" fill="none" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M132 192Q100 160 96 108M168 192Q200 160 204 108" fill="none" stroke="${FILL.folha}" stroke-width="2.4" stroke-linecap="round"/>`;
    s += `<ellipse cx="96" cy="100" rx="11" ry="8" fill="${FILL.laranja}" stroke="${INK}" stroke-width="2"/><ellipse cx="204" cy="100" rx="11" ry="8" fill="${FILL.laranja}" stroke="${INK}" stroke-width="2"/>`;
    s += `<ellipse cx="150" cy="195" rx="26" ry="28" fill="${FILL.verde}" stroke="${INK}" stroke-width="2.2"/>` + [[141, 192], [159, 192], [150, 207]].map(([x, y]) => circle(x, y, 4.4, { fill: FILL.amarelo, sw: 1.6 })).join("");
    s += `<ellipse cx="150" cy="90" rx="17" ry="11" fill="${FILL.amarelo}" stroke="${INK}" stroke-width="2.2"/>` + [[143, 87], [151, 92], [158, 86]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.8" fill="${INK}"/>`).join("");
    for (const [k, o] of Object.entries(P)) if (L[k]) s += line(o.b[0], o.b[1], o.x, o.y, { sw: 1.4 }) + badge(o.b[0], o.b[1], L[k], f);
    if (rev && fig.alvo) { const o = P[fig.alvo]; s += okRing(o.x, o.y, o.r * 0.8) + pill(o.b[0], o.b[1] + (o.b[1] < 120 ? 30 : -30), NOME_FLOR[fig.alvo], f, W); }
    if (opts.hint && P[opts.hint]) s += hintRing(P[opts.hint].x, P[opts.hint].y, P[opts.hint].r);
    return s;
  });
}
const NOME_FLOR = { antera: "antera", estigma: "estigma", ovario: "ovário", petala: "pétala" };

// ============================================================================= ZOOLOGIA
function cordado(fig, opts = {}) {
  const W = 400, H = 196, L = fig.letras || {}, rev = opts.mode === "reveal";
  const P = { tubo: { x: 190, y: 80, b: [190, 36], r: 24, n: "tubo nervoso" }, noto: { x: 230, y: 103, b: [236, 156], r: 24, n: "notocorda" }, fendas: { x: 100, y: 120, b: [70, 166], r: 28, n: "fendas" }, cauda: { x: 346, y: 104, b: [366, 156], r: 26, n: "cauda" } };
  return wrap(W, H, opts, "Corpo de um cordado em corte", (f) => {
    let s = `<path d="M24 104Q100 34 250 46Q340 52 380 104Q340 156 250 162Q100 174 24 104Z" fill="${FILL.amarelo}" stroke="${INK}" stroke-width="2.4"/>`;
    s += rect(80, 97, 252, 14, { fill: FILL.lilas, rx: 7, sw: 2 }) + [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => line(98 + i * 19, 98, 98 + i * 19, 110, { sw: 1.2, stroke: MUTED })).join("");
    s += `<path d="M84 80H328" stroke="${INK}" stroke-width="12" stroke-linecap="round"/><path d="M84 80H328" stroke="${PAPER}" stroke-width="7.4" stroke-linecap="round"/>`;
    s += [0, 1, 2, 3, 4].map((i) => line(70 + i * 15, 120, 73 + i * 15, 142, { sw: 3 })).join("");
    s += circle(300, 160, 3.2, { fill: INK, sw: 1 });
    for (const [k, o] of Object.entries(P)) if (L[k]) s += line(o.b[0], o.b[1], o.x, o.y, { sw: 1.4 }) + badge(o.b[0], o.b[1], L[k], f);
    if (rev && fig.alvo) { const o = P[fig.alvo]; s += okRing(o.x, o.y, o.r) + pill(o.b[0] > 200 ? 300 : 110, o.b[1] < 100 ? 70 : o.b[1] + 28, (L[fig.alvo] ? L[fig.alvo] + " · " : "") + o.n, f, W); }
    if (opts.hint && P[opts.hint]) s += hintRing(P[opts.hint].x, P[opts.hint].y, P[opts.hint].r + 4);
    return s;
  });
}
function quadro(fig, opts = {}) {
  const cols = fig.colunas, rows = fig.linhas, c0 = 110, cw = 130, hh = 50, rh = 40, W = c0 + cw * cols.length + 8, H = hh + rh * rows.length + 8, rev = opts.mode === "reveal";
  return wrap(W, H, opts, "Quadro comparativo de animais", (f) => {
    let s = rect(4, 4, c0, hh, { fill: FILL.cinza, rx: 0 }) + T(4 + c0 / 2, 4 + hh / 2 + 5, "Animal", f);
    cols.forEach((c, j) => { s += rect(4 + c0 + cw * j, 4, cw, hh, { fill: FILL.cinza, rx: 0 }); const ls = c.split("|"); ls.forEach((l, k) => (s += T(4 + c0 + cw * j + cw / 2, 4 + hh / 2 + 5 + (k - (ls.length - 1) / 2) * 17, l, f))); });
    rows.forEach((r, i) => {
      const y = 4 + hh + rh * i, hl = rev && fig.alvo === r.n;
      s += rect(4, y, c0, rh, { fill: hl ? "#dff3e3" : PAPER, rx: 0 }) + T(4 + c0 / 2, y + rh / 2 + 5, r.n, f);
      r.v.forEach((v, j) => (s += rect(4 + c0 + cw * j, y, cw, rh, { fill: hl ? "#dff3e3" : PAPER, rx: 0 }) + T(4 + c0 + cw * j + cw / 2, y + rh / 2 + 5, v ? "sim" : "não", f, { fill: v ? GREENTXT : MUTED })));
      if (hl) s += okRect(2, y + 1, W - 6, rh - 2);
    });
    if (opts.hint) s += hintRect(4 + c0 + 1, 3, cw - 2, hh + rh * rows.length + 2);
    return s;
  });
}

// ============================================================================= ESPECTRO (fotossíntese)
export const ABSORCAO = [["violeta", 0.8, "#8e6fd6"], ["azul", 0.95, "#3d8fd1"], ["verde", 0.15, "#2f9a54"], ["amarelo", 0.3, "#f0cf3a"], ["laranja", 0.5, "#f0963a"], ["vermelho", 0.9, "#d84a40"]];
function espectro(fig, opts = {}) {
  const W = 400, H = 226, B = 190, MAXH = 130;
  return wrap(W, H, opts, "Luz absorvida pela clorofila em cada cor", (f) => {
    let s = T(200, 22, "luz absorvida pela clorofila", f) + line(30, B, 380, B, { sw: 2.4 }) + line(30, B, 30, 40, { sw: 2.4 });
    ABSORCAO.forEach(([nm, a, col], i) => {
      const x = 42 + i * 56, h = a * MAXH;
      s += rect(x, B - h, 44, h, { fill: col, rx: 4, sw: 2 });
      if (opts.hint === nm) s += hintRing(x + 22, B - h / 2, Math.max(26, h / 2 + 8));
      if (opts.mode === "reveal" && nm === fig.alvo) s += okRect(x - 4, B - h - 4, 52, h + 8) + pill(x + 22, B - h - 26, "reflete mais", f, W);
    });
    s += T(200, 214, "cores: violeta → vermelho", f);
    return s;
  });
}

export const FIGS = {
  "cel-celula": celula, "cel-osmose": osmoseFig, "cel-divisao": divisao, "cel-darwin": darwin, "cel-cladograma": cladograma, "cel-gel": gel,
  "cel-transgenico": transgenico, "cel-clone": clone, "cel-crispr": crispr, "cel-fosseis": fosseis, "cel-especiacao": especiacao,
  "cel-planta": planta, "cel-flor": flor, "cel-cordado": cordado, "cel-quadro": quadro, "cel-espectro": espectro,
};
export const PATTERNS_USED = [4, 6, 7, 8];

// ============================================================================= PERGUNTAS
const Q = (q) => ({ subj: "biologia", ...q, alts: q.alts.map(({ ok, ...a }) => a), correct: q.alts.map((a, i) => (a.ok ? i : -1)).filter((i) => i >= 0) });
const OSX = (cap, p) => `OpenStax Biology 2e, ${cap} (openstax.org/books/biology-2e/pages/${p})`;
const REF = {
  org: OSX("4.3 Eukaryotic Cells", "4-3-eukaryotic-cells"), osm: OSX("5.2 Passive Transport", "5-2-passive-transport"),
  fot: OSX("8.2 The Light-Dependent Reactions of Photosynthesis", "8-2-the-light-dependent-reactions-of-photosynthesis"),
  mei: OSX("11.1 The Process of Meiosis", "11-1-the-process-of-meiosis"), evo: OSX("18.1 Understanding Evolution", "18-1-understanding-evolution"),
  esp: OSX("18.2 Formation of New Species", "18-2-formation-of-new-species"),
  fil: OSX("20.1 Organizing Life on Earth (táxons-irmãos; girar um nó não muda a informação)", "20-1-organizing-life-on-earth"),
  bio: OSX("17.1 Biotechnology (eletroforese, PCR, clonagem, transgênicos)", "17-1-biotechnology"),
  xil: OSX("30.5 Transport of Water and Solutes in Plants", "30-5-transport-of-water-and-solutes-in-plants"),
  pol: OSX("32.2 Pollination and Fertilization", "32-2-pollination-and-fertilization"),
  cor: OSX("29.1 Chordates", "29-1-chordates"), ani: OSX("27.1 Features of the Animal Kingdom", "27-1-features-of-the-animal-kingdom"),
  who: "OMS, Food, genetically modified (who.int/news-room/questions-and-answers/item/food-genetically-modified)",
  crispr: "MedlinePlus Genetics, What are genome editing and CRISPR-Cas9? (medlineplus.gov/genetics/understanding/genomicresearch/genomeediting/)",
  tik: "UC Berkeley, Understanding Evolution, Tiktaalik, a transitional form (evolution.berkeley.edu/evolibrary/news/060501_tiktaalik)",
  mono: "UC Berkeley, Understanding Evolution, Phylogenetics (evolution.berkeley.edu/evolibrary/article/phylogenetics_02) e OpenStax Biology 2e, 20.2 (openstax.org/books/biology-2e/pages/20-2-determining-evolutionary-relationships)",
};
const ENEM = "no estilo do ENEM";

const ANIMAL_A = { nucleo: "C", mito: "A", golgi: "D", lisos: "B", rer: "E" };
const hem = osmose({ in: 0.9, out: 0 });
const veg = osmose({ in: 0.9, out: 2.0, parede: true });
const BK = [0.3, 0.9, 2.0], bkRes = BK.map((o) => osmose({ in: 0.9, out: o }).result), iInc = bkRes.indexOf("incha"), iMur = bkRes.indexOf("murcha"), LET = "ABC";
const ESTOM = { incha: "Incha e pode estourar", murcha: "Murcha, com a superfície crenada", normal: "Fica com o mesmo volume", divide: "Divide-se em duas células" };
const dMi = divide("mitose", 4), dMe = divide("meiose", 8);
const verdeAbs = ABSORCAO.find((a) => a[0] === "verde")[1], fotoVerde = verdeAbs < 0.3 ? "baixa" : "alta";

const ARV_HUM = [[["Humano", "Chimpanzé"], "Gorila"], "Orangotango"];
const ARV_AMN = ["Peixe", ["Anfíbio", ["Mamífero", ["Lagarto", ["Crocodilo", "Ave"]]]]];
const GEL1 = [{ n: "Mãe", b: [2, 5, 8, 10] }, { n: "Filho", b: [2, 4, 8, 9] }, { n: "Pai A", b: [4, 6, 9] }, { n: "Pai B", b: [3, 4, 7] }, { n: "Pai C", b: [1, 6, 9] }];
const GEL2 = [{ n: "Mãe", b: [1, 4, 6, 9] }, { n: "Filho", b: [1, 3, 6, 8] }, { n: "Pai A", b: [3, 5, 8] }, { n: "Pai B", b: [2, 3, 8, 10] }, { n: "Pai C", b: [3, 5, 7] }, { n: "Pai D", b: [2, 4, 8] }];
const c1 = compativeis(GEL1), c2 = compativeis(GEL2), excl2 = GEL2.length - 2 - c2.length;

export const QUESTIONS = [
  // ---------------------------------------------------------------- célula e metabolismo (padrão 4)
  Q({
    id: "bio-cel-org-mito", pat: 4, lvl: 1,
    text: "Na célula da figura, qual letra marca a organela onde ocorre a maior parte da respiração celular?",
    fig: [{ kind: "cel-celula", tipo: "animal", letras: ANIMAL_A, alvo: "mito", cap: "Célula animal" }],
    alts: ["A", "B", "C", "D"].map((l) => ({ t: l, ok: l === ANIMAL_A.mito })),
    hint: { t: "O núcleo (anel) guarda o DNA. Procure a outra organela, com dobras internas.", fig: 0, mark: "nucleo" },
    why: "Na mitocôndria a glicose é oxidada com oxigênio e a célula produz a maior parte do seu ATP.",
    src: ENEM, ref: REF.org,
  }),
  Q({
    id: "bio-cel-org-rer", pat: 4, lvl: 2,
    text: "Qual é o nome da organela marcada com X, que sintetiza proteínas para exportação?",
    fig: [{ kind: "cel-celula", tipo: "animal", letras: { rer: "X" }, alvo: "rer", cap: "Organela X" }],
    alts: [{ t: "Retículo endoplasmático rugoso", ok: true }, { t: "Retículo endoplasmático liso" }, { t: "Complexo golgiense" }, { t: "Lisossomo" }],
    hint: { t: "Compare com o RE liso (anel): o que X tem a mais?", fig: 0, mark: "rel" },
    why: "Ribossomos presos dão o aspecto rugoso: o RE rugoso sintetiza proteínas; o liso faz lipídios e não tem pontinhos.",
    src: ENEM, ref: REF.org,
  }),
  Q({
    calc: true, id: "bio-cel-osmose-hemacia", pat: 4, lvl: 1,
    text: "Uma hemácia (0,9% de sal por dentro) é colocada em água destilada. O que acontece com ela?",
    fig: [{ kind: "cel-osmose", tipo: "hemacia", in: 0.9, cena: [{ out: 0 }], cap: "Hemácia em água pura" }],
    alts: ["incha", "murcha", "normal", "divide"].map((e) => ({ fig: { kind: "cel-osmose", tipo: "hemacia", estado: e }, cap: ESTOM[e], ok: e === hem.result })),
    hint: { t: "Compare o sal dentro da célula com o sal fora dela.", fig: 0, mark: { beaker: 0 } },
    why: "O meio é hipotônico: a água entra por osmose, a hemácia incha e pode estourar, pois não tem parede.",
    src: ENEM, ref: REF.osm,
  }),
  Q({
    calc: true, id: "bio-cel-osmose-vegetal", pat: 4, lvl: 2,
    text: "Uma célula vegetal (0,9% de sal por dentro) é posta em solução a 2%. O que acontece com ela?",
    fig: [{ kind: "cel-osmose", tipo: "vegetal", in: 0.9, cena: [{ out: 2.0 }], cap: "Célula vegetal em solução salgada" }],
    alts: [{ t: "Plasmólise: a membrana se afasta da parede", r: "plasmolisada" }, { t: "Fica túrgida: a parede impede o estouro", r: "túrgida" }, { t: "Estoura, como a hemácia em água pura", r: "estoura" }, { t: "Nada muda, pois a parede é impermeável", r: "inalterada" }].map((a) => ({ t: a.t, ok: a.r === veg.result })),
    hint: { t: "Meio mais concentrado: para onde a água vai?", fig: 0, mark: { beaker: 0 } },
    why: "Meio hipertônico: a água sai, o citoplasma encolhe e a membrana se solta da parede (plasmólise).",
    src: ENEM, ref: REF.osm,
  }),
  Q({
    calc: true, id: "bio-cel-osmose-beqleres", pat: 4, lvl: 3,
    text: "Hemácias (0,9%) em três meios. Em quais béqueres a célula incha e murcha, respectivamente?",
    fig: [{ kind: "cel-osmose", tipo: "hemacia", in: 0.9, cena: BK.map((o) => ({ out: o })), cap: "Três béqueres" }],
    alts: [["A", "C"], ["C", "A"], ["B", "C"], ["A", "B"]].map(([a, b]) => ({ t: `Incha em ${a}; murcha em ${b}`, ok: a === LET[iInc] && b === LET[iMur] })),
    hint: { t: "A água vai do meio mais diluído para o mais concentrado.", fig: 0, mark: { beaker: 0 } },
    why: "Incha onde o meio é mais diluído que a célula (A); murcha onde é mais concentrado (C); em B fica igual.",
    src: ENEM, ref: REF.osm,
  }),
  Q({
    id: "bio-cel-fot-noite", pat: 4, lvl: 2,
    text: "É noite e a folha está no escuro. Qual letra marca a organela que ainda produz ATP pela respiração?",
    fig: [{ kind: "cel-celula", tipo: "vegetal", letras: { parede: "A", cloro: "B", mito: "C", vacuolo: "D" }, alvo: "mito", cap: "Célula de folha" }],
    alts: ["A", "B", "C", "D"].map((l) => ({ t: l, ok: l === "C" })),
    hint: { t: "O cloroplasto (anel) só trabalha com luz. Quem mais gera energia?", fig: 0, mark: "cloro" },
    why: "A planta respira o tempo todo: a mitocôndria gera ATP. O cloroplasto só faz fotossíntese, e só com luz.",
    src: ENEM, ref: REF.org,
  }),
  Q({
    calc: true, id: "bio-cel-fot-espectro", pat: 4, lvl: 3,
    text: "Uma planta recebe só luz verde. Pelo gráfico, o que esperar da fotossíntese dela?",
    fig: [{ kind: "cel-espectro", alvo: "verde", cap: "Absorção da clorofila" }],
    alts: [{ t: "Baixa: a clorofila absorve pouco o verde", r: "baixa" }, { t: "Máxima, pois o verde é a cor da clorofila", r: "max" }, { t: "Nula: a planta não aproveita luz nenhuma", r: "nula" }, { t: "Igual à da luz branca, pois todas servem", r: "igual" }].map((a) => ({ t: a.t, ok: a.r === fotoVerde })),
    hint: { t: "Compare a altura da barra verde com a da azul (anel).", fig: 0, mark: "azul" },
    why: "A clorofila absorve sobretudo azul e vermelho e reflete o verde; por isso a folha é verde e a luz verde rende pouco.",
    src: ENEM, ref: REF.fot,
  }),
  Q({
    calc: true, id: "bio-cel-mitose-2n", pat: 4, lvl: 1,
    text: "Na figura, a célula tem 2n = 4 e faz mitose. Quantos cromossomos tem cada célula-filha?",
    fig: [{ kind: "cel-divisao", proc: "mitose", n2: 4, cap: "Mitose, 2n = 4" }],
    alts: [2, 4, 8, 6].map((n) => ({ t: `${n} cromossomos`, ok: n === dMi.cromossomos })),
    hint: { t: "Mitose faz cópias iguais da célula-mãe.", fig: 0, mark: { filhas: true } },
    why: "Na mitose, 1 célula 2n origina 2 células 2n: o número de cromossomos se mantém (4).",
    src: ENEM, ref: REF.mei,
  }),
  Q({
    calc: true, id: "bio-cel-meiose-n", pat: 4, lvl: 2,
    text: "Uma célula com 2n = 8 entra em meiose. Quantas células se formam e com quantos cromossomos cada?",
    fig: [{ kind: "cel-divisao", proc: "meiose", n2: 8, cap: "Meiose, 2n = 8" }],
    alts: [[4, 4], [2, 8], [2, 4], [4, 8]].map(([c, k]) => ({ t: `${c} células com ${k} cromossomos`, ok: c === dMe.celulas && k === dMe.cromossomos })),
    hint: { t: "Meiose: duas divisões seguidas e metade dos cromossomos.", fig: 0, mark: { filhas: true } },
    why: "Na meiose, 1 célula 2n origina 4 células n: cada uma fica com metade dos cromossomos (4).",
    src: ENEM, ref: REF.mei,
  }),
  // ---------------------------------------------------------------- evolução (padrão 6)
  Q({
    id: "bio-evo-girafa-selecao", pat: 6, lvl: 1,
    text: "No esquema B, por que os pescoços ficaram mais longos de uma geração para a outra?",
    fig: [{ kind: "cel-darwin", alvo: "B", cap: "A e B: duas explicações" }],
    alts: [{ t: "Os de pescoço longo deixaram mais descendentes", ok: true }, { t: "Esticar o pescoço o alongou e foi herdado" }, { t: "A necessidade de folhas altas gerou a mutação" }, { t: "Cada girafa evoluiu para alcançar as folhas" }],
    hint: { t: "No esquema B, repare nos X sobre as girafas da geração 1.", fig: 0, mark: "B" },
    why: "Há variação herdável: quem tem pescoço longo alcança mais alimento, sobrevive e reproduz mais (seleção natural).",
    src: ENEM, ref: REF.evo,
  }),
  Q({
    id: "bio-evo-darwin-lamarck", pat: 6, lvl: 2,
    text: "Qual ideia é comum às explicações de Lamarck (A) e de Darwin (B) para o pescoço das girafas?",
    fig: [{ kind: "cel-darwin", cap: "A: Lamarck · B: Darwin" }],
    alts: [{ t: "As espécies mudam ao longo das gerações", ok: true }, { t: "Caracteres adquiridos em vida são herdados" }, { t: "A variação surge antes da seleção, ao acaso" }, { t: "Só sobrevive quem já nasce perfeito" }],
    hint: { t: "Compare o que difere entre as gerações 1 e 2 nos dois painéis.", fig: 0 },
    why: "Nos esquemas, ambos mostram as espécies mudando; só o esquema A (Lamarck) tem herança do pescoço esticado em vida.",
    src: "como no ENEM 2016 (2ª aplicação: Darwin × Lamarck)", ref: REF.evo,
  }),
  Q({
    id: "bio-evo-clado-humano", pat: 6, lvl: 2,
    text: "Pela árvore, quem é o parente mais próximo do gorila (losango)?",
    fig: [{ kind: "cel-cladograma", arvore: ARV_HUM, foco: "Gorila", alvo: "Humano", grupo: ["Humano", "Chimpanzé"], cap: "Primatas" }],
    alts: [{ t: "O orangotango, que está ao lado dele", set: ["Orangotango"] }, { t: "Só o humano", set: ["Humano"] }, { t: "Só o chimpanzé", set: ["Chimpanzé"] }, { t: "Humano e chimpanzé, igualmente próximos", set: ["Humano", "Chimpanzé"] }].map((a) => ({ t: a.t, ok: [...a.set].sort().join() === [...nearest(ARV_HUM, "Gorila")].sort().join() })),
    calc: true,
    hint: { t: "Compare o nó do anel (gorila + orangotango) com o nó que reúne os outros.", fig: 0, mark: { nodo: ["Gorila", "Orangotango"] } },
    why: "Parente mais próximo é quem divide o ancestral comum mais recente: humano e chimpanzé saem do mesmo nó do gorila; o orangotango, de um nó mais antigo.",
    src: ENEM, ref: REF.fil,
  }),
  Q({
    id: "bio-evo-clado-mono", pat: 6, lvl: 3,
    text: "Qual agrupamento é monofilético, isto é, inclui um ancestral e todos os seus descendentes?",
    fig: [{ kind: "cel-cladograma", arvore: ARV_AMN, grupo: ["Crocodilo", "Ave"], cap: "Vertebrados" }],
    alts: [["Crocodilo", "Ave"], ["Lagarto", "Crocodilo"], ["Mamífero", "Lagarto"], ["Peixe", "Anfíbio"]].map((g) => ({ t: g.join(" + "), ok: isMono(ARV_AMN, g) })),
    hint: { t: "O nó do anel deixa alguém de fora? Procure um nó que não deixe.", fig: 0, mark: { nodo: ["Lagarto", "Crocodilo"] } },
    why: "Só crocodilo + ave saem de um mesmo nó sem deixar descendente de fora; lagarto + crocodilo ignora as aves.",
    src: ENEM, ref: REF.mono, calc: true,
  }),
  Q({
    id: "bio-evo-especiacao", pat: 6, lvl: 2,
    text: "Um rio separou uma população em duas. O que mostra que agora são duas espécies, mesmo sem o rio?",
    fig: [{ kind: "cel-especiacao", cap: "População separada pelo rio" }],
    alts: [{ t: "Isolamento reprodutivo, mesmo se reunidas", ok: true }, { t: "Terem cores diferentes" }, { t: "Viverem em margens diferentes" }, { t: "Cada grupo ter menos indivíduos" }],
    hint: { t: "O que acontece se as populações voltarem a se encontrar?", fig: 0, mark: true },
    why: "Espécies distintas não trocam genes mesmo reunidas; o rio isola geograficamente, mas o critério é o isolamento reprodutivo.",
    src: ENEM, ref: REF.esp,
  }),
  Q({
    id: "bio-evo-fossil-transicao", pat: 6, lvl: 3,
    text: "O fóssil X tem arcos branquiais e nadadeira com ossos de punho, entre peixes e tetrápodes. O que indica?",
    fig: [{ kind: "cel-fosseis", cap: "Camadas de rocha" }],
    alts: [{ t: "Forma de transição entre peixes e tetrápodes", ok: true }, { t: "Ancestral direto de todos os anfíbios" }, { t: "Peixe que decidiu sair da água" }, { t: "Animal que misturou duas espécies vivas" }],
    hint: { t: "Camadas mais fundas são mais antigas: veja a camada do meio.", fig: 0, mark: true },
    why: "Traços de dois grupos numa camada intermediária marcam transição; é parente próximo de ancestrais, não necessariamente o ancestral direto.",
    src: ENEM, ref: REF.tik,
  }),
  // ---------------------------------------------------------------- biotecnologia (padrão 7)
  Q({
    id: "bio-biotec-transgenico", pat: 7, lvl: 1,
    text: "O que torna o milho da figura um organismo transgênico?",
    fig: [{ kind: "cel-transgenico", doador: "Bactéria", receptor: "Milho", cap: "Gene inserido no milho" }],
    alts: [{ t: "Recebeu um gene de outra espécie", ok: true }, { t: "É cópia de uma única célula, sem fecundação" }, { t: "Veio do cruzamento de duas variedades" }, { t: "Foi exposto a radiação e mutou" }],
    hint: { t: "Olhe de onde veio o pedaço amarelo do DNA.", fig: 0, mark: "doador" },
    why: "Transgênico leva um gene de outra espécie por engenharia genética; clone é cópia, híbrido vem de cruzamento.",
    src: ENEM, ref: REF.who,
  }),
  Q({
    calc: true, id: "bio-biotec-gel-paternidade", pat: 7, lvl: 2,
    text: "Depois de PCR e eletroforese, quem pode ser o pai da criança, pelas bandas do gel?",
    fig: [{ kind: "cel-gel", raias: GEL1, cap: "Teste de paternidade" }],
    alts: [...GEL1.slice(2).map((r) => ({ t: r.n, ok: c1.length === 1 && c1[0] === r.n })), { t: "Nenhum é compatível", ok: c1.length === 0 }],
    hint: { t: "As bandas do filho que a mãe não tem vieram do pai.", fig: 0, mark: { lane: "Filho" } },
    why: "Cada banda do filho vem da mãe ou do pai: o pai tem de ter todas as bandas do filho que a mãe não tem.",
    src: ENEM, ref: REF.bio,
  }),
  Q({
    calc: true, id: "bio-biotec-gel-excluidos", pat: 7, lvl: 3,
    text: "Quatro suspeitos foram testados. Quantos podem ser excluídos como pai da criança?",
    fig: [{ kind: "cel-gel", raias: GEL2, cap: "Mãe, filho e quatro suspeitos" }],
    alts: [0, 1, 2, 3].map((n) => ({ t: n === 1 ? "1 suspeito" : `${n} suspeitos`, ok: n === excl2 })),
    hint: { t: "Liste as bandas do filho que não são da mãe e confira cada suspeito.", fig: 0, mark: { lane: "Filho" } },
    why: "Só as bandas 3 e 8 do filho não vêm da mãe: os suspeitos A e B têm as duas; C e D não têm.",
    src: ENEM, ref: REF.bio,
  }),
  Q({
    id: "bio-biotec-clonagem", pat: 7, lvl: 2,
    text: "Na clonagem por transferência de núcleo, o clone é geneticamente quase idêntico a qual doadora?",
    fig: [{ kind: "cel-clone", cap: "Transferência de núcleo" }],
    alts: [{ t: "À doadora da célula do corpo (o núcleo)", ok: true }, { t: "À doadora do óvulo sem núcleo" }, { t: "À fêmea que gesta o embrião" }, { t: "A nenhuma: o DNA é todo novo" }],
    hint: { t: "Compare o óvulo (anel) com a célula do corpo: o que falta nele?", fig: 0, mark: "ovulo" },
    why: "O DNA do núcleo vem da célula do corpo; o óvulo só doa o citoplasma, e o clone é cópia de quem doou o núcleo.",
    src: ENEM, ref: REF.bio,
  }),
  Q({
    id: "bio-biotec-crispr", pat: 7, lvl: 3,
    text: "Na edição por CRISPR-Cas9, quem escolhe o ponto exato do corte no DNA?",
    fig: [{ kind: "cel-crispr", cap: "CRISPR-Cas9" }],
    alts: [{ t: "A Cas9, que reconhece o gene sozinha" }, { t: "O RNA guia, que pareia com a sequência-alvo", ok: true }, { t: "A DNA ligase, que cola o fragmento" }, { t: "A DNA polimerase, que copia a fita" }],
    hint: { t: "A Cas9 (anel) é uma enzima que corta. O que a leva ao lugar certo?", fig: 0, mark: "cas9" },
    why: "O RNA guia pareia com a sequência-alvo e leva a Cas9 até lá; a Cas9 só corta onde o guia manda.",
    src: ENEM, ref: REF.crispr,
  }),
  // ---------------------------------------------------------------- plantas e animais (padrão 8)
  Q({
    id: "bio-plan-floema", pat: 8, lvl: 1,
    text: "Qual é o nome do vaso B, por onde circula o açúcar produzido nas folhas?",
    fig: [{ kind: "cel-planta", modo: "vasos", alvo: "floema", cap: "Vasos da planta" }],
    alts: [{ t: "Floema", ok: true }, { t: "Xilema" }, { t: "Estômato" }, { t: "Câmbio" }],
    hint: { t: "A seta azul (anel) leva água para cima. E o açúcar, por onde vai?", fig: 0, mark: "xilema" },
    why: "O floema leva a seiva elaborada (açúcares) das folhas aos órgãos; o xilema leva água e sais das raízes às folhas.",
    src: ENEM, ref: REF.xil,
  }),
  Q({
    id: "bio-plan-flor", pat: 8, lvl: 1,
    text: "Na flor, em qual letra o grão de pólen precisa pousar para que ocorra a polinização?",
    fig: [{ kind: "cel-flor", letras: { antera: "C", estigma: "A", ovario: "D", petala: "B" }, alvo: "estigma", cap: "Flor em corte" }],
    alts: ["A", "B", "C", "D"].map((l) => ({ t: l, ok: l === "A" })),
    hint: { t: "O pólen sai da antera (anel). Onde ele precisa chegar?", fig: 0, mark: "antera" },
    why: "Polinização é o pólen chegar da antera ao estigma; o ovário só vira fruto depois da fecundação.",
    src: ENEM, ref: REF.pol,
  }),
  Q({
    id: "bio-plan-seiva", pat: 8, lvl: 2,
    text: "O que garante o movimento da água pelo xilema até o topo de uma árvore alta?",
    fig: [{ kind: "cel-planta", modo: "transpira", cap: "Subida da água" }],
    alts: [{ t: "A evaporação nas folhas (transpiração)", ok: true }, { t: "O bombeamento ativo do caule, como um coração" }, { t: "A fotossíntese nas raízes" }, { t: "A absorção de água só pelo floema" }],
    hint: { t: "A água entra pelas raízes (anel). Por onde ela sai da planta?", fig: 0, mark: "raiz" },
    why: "A água que evapora nas folhas puxa a coluna de água do xilema, que é contínua por coesão (transpiração).",
    src: "como no ENEM 2016 (transporte de seiva no xilema)", ref: REF.xil,
  }),
  Q({
    id: "bio-plan-quadro-vertebra", pat: 8, lvl: 1,
    text: "Qual animal do quadro NÃO tem coluna vertebral?",
    fig: [{ kind: "cel-quadro", colunas: ["Coluna|vertebral", "Penas"], linhas: [{ n: "Minhoca", v: [false, false] }, { n: "Peixe", v: [true, false] }, { n: "Sapo", v: [true, false] }, { n: "Ave", v: [true, true] }], alvo: "Minhoca", cap: "Quatro animais" }],
    alts: ["Minhoca", "Peixe", "Sapo", "Ave"].map((n) => ({ t: n, ok: n === "Minhoca" })),
    hint: { t: "Leia a coluna da coluna vertebral (anel) de cima para baixo.", fig: 0, mark: "coluna" },
    why: "Invertebrados não têm coluna vertebral: a minhoca é invertebrada; peixe, sapo e ave são vertebrados.",
    src: ENEM, ref: REF.ani,
  }),
  Q({
    id: "bio-plan-cordado", pat: 8, lvl: 3,
    text: "Qual letra marca o tubo nervoso dorsal e oco, uma das marcas dos cordados?",
    fig: [{ kind: "cel-cordado", letras: { tubo: "C", noto: "A", fendas: "D", cauda: "B" }, alvo: "tubo", cap: "Cordado em corte" }],
    alts: ["A", "B", "C", "D"].map((l) => ({ t: l, ok: l === "C" })),
    hint: { t: "A haste de apoio (anel) é a notocorda. O tubo fica nas costas dela.", fig: 0, mark: "noto" },
    why: "Cordados têm notocorda, tubo nervoso dorsal oco, fendas faríngeas e cauda pós-anal em alguma fase da vida.",
    src: ENEM, ref: REF.cor,
  }),
];
