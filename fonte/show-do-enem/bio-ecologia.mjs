// Banco de Ecologia (Biologia, padrão 1): 20 perguntas e seus renderizadores de figura.
// Respostas calculadas por modelo: teia alimentar (grafo), regra dos 10%, bioacumulação x10, tendência de séries.
// Conceituais (ciclos, relações, impactos, população) levam `ref` com fonte aberta e conferida.
import { INK, MUTED, OK, BAD, HINT, FILL, esc, r1, svg, text, rect, circle, line, arrow, hintRing } from "./bio-base.mjs";

const GOLD = "#bfe8c7"; // resposta pintada no modo reveal
const FOCO = "#3d8fd1"; // seta que a pergunta destaca

// número em português: vírgula decimal, espaço fino não quebrável entre milhares
export const fmt = (v) => {
  const [i, d] = String(Number(Number(v).toPrecision(12))).split(".");
  const g = i.replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return d ? g + "," + d : g;
};

// ============================================================================ MODELOS
// Teia como grafo. nodes: {id, n (nome curto), r: "p" produtor | "c" consumidor | "d" decompositor, x, y}
// edges: [de, para] = seta do alimento para quem o come (sentido da energia).
export function modeloTeia(nodes, edges) {
  const byId = Object.fromEntries(nodes.map((n) => [n.id, n]));
  const prey = Object.fromEntries(nodes.map((n) => [n.id, []]));
  for (const [a, b] of edges) prey[b].push(a);
  const memo = {};
  // todos os níveis possíveis = 1 + comprimento de cada caminho que sai de um produtor
  const lv = (id) => {
    if (memo[id]) return memo[id];
    const s = new Set();
    if (byId[id].r === "p") s.add(1);
    else for (const p of prey[id]) for (const x of lv(p)) s.add(x + 1);
    return (memo[id] = s);
  };
  const niveis = (id) => [...lv(id)].sort((a, b) => a - b);
  const nivel = (id) => niveis(id)[0]; // 1 + menor caminho desde um produtor
  const maxNivel = (id) => niveis(id).at(-1);
  const come = ([a, b]) => b; // quem recebe a seta é quem come
  // propagação: sem nenhuma presa viva, o consumidor desaparece (produtor só some se for retirado)
  const perdeTudo = (retirado) => {
    const dead = new Set([retirado]);
    let mudou = true;
    while (mudou) {
      mudou = false;
      for (const n of nodes) {
        if (dead.has(n.id) || !prey[n.id].length) continue;
        if (prey[n.id].every((p) => dead.has(p))) { dead.add(n.id); mudou = true; }
      }
    }
    dead.delete(retirado);
    return [...dead];
  };
  return { niveis, nivel, maxNivel, come, perdeTudo, byId, prey };
}
// regra dos ~10%: energia no nível n (1 = produtor)
export const energiaNivel = (e1, n, taxa = 0.1) => { let e = e1; for (let i = 1; i < n; i++) e = Number((e * taxa).toPrecision(12)); return e; };
export const energiaNivel1 = (en, n, taxa = 0.1) => { let e = en; for (let i = 1; i < n; i++) e = Number((e / taxa).toPrecision(12)); return e; };
// bioacumulação: concentração multiplicada por 10 a cada nível (v no nível `gl`, 0-based)
export const concNivel = (v, gl, i, f = 10) => Number((v * Math.pow(f, i - gl)).toPrecision(12));
// pirâmide de energia só é possível se decresce a cada nível
export const piramideEnergiaValida = (vals) => vals.every((v, i) => i === 0 || v < vals[i - 1]);
// logística
export const logistica = (K, N0, r, t) => K / (1 + ((K - N0) / N0) * Math.exp(-r * t));
// relação pelos sinais (efeito em cada espécie)
export const RELACAO = { "++": "Mutualismo", "+0": "Comensalismo", "+-": "Parasitismo", "--": "Competição" };
export const relacaoPorSinais = (sa, sb) => RELACAO[sa + sb] || RELACAO[sb + sa];

const ord = (n) => `${n}º`;
const lista = (a) => a.length === 1 ? `Só no ${ord(a[0])} nível` : `No ${a.slice(0, -1).map(ord).join(", ")} e no ${ord(a.at(-1))} níveis`;

// ============================================================================ DADOS DAS TEIAS
// Tamanho real na tela: fonte × 340 ÷ largura do viewBox ≥ 11,5 px (main). Aqui W = 480 e fonte 16,5 → 11,7 px.
const FS = 16.5;
export const TEIAS = {
  cerrado: {
    w: 480, h: 150,
    nodes: [
      { id: "capim", n: "Capim", r: "p", x: 65, y: 35 }, { id: "gafa", n: "Gafanhoto", r: "c", x: 240, y: 35 },
      { id: "sapo", n: "Sapo", r: "c", x: 415, y: 35 }, { id: "cobra", n: "Cobra", r: "c", x: 415, y: 115 },
    ],
    edges: [["capim", "gafa"], ["gafa", "sapo"], ["sapo", "cobra"]],
  },
  pantanal: {
    w: 480, h: 150,
    nodes: [
      { id: "aguape", n: "Aguapé", r: "p", x: 65, y: 35 }, { id: "lambari", n: "Lambari", r: "c", x: 240, y: 35 },
      { id: "dourado", n: "Dourado", r: "c", x: 415, y: 35 }, { id: "ariranha", n: "Ariranha", r: "c", x: 415, y: 115 },
    ],
    edges: [["aguape", "lambari"], ["lambari", "dourado"], ["dourado", "ariranha"]],
    focus: ["lambari", "dourado"],
  },
  mata: {
    w: 480, h: 210,
    nodes: [
      { id: "folhas", n: "Folhas", r: "p", x: 55, y: 45 }, { id: "fruto", n: "Fruto", r: "p", x: 55, y: 165 },
      { id: "lagarta", n: "Lagarta", r: "c", x: 180, y: 45 }, { id: "sagui", n: "Sagui", r: "c", x: 300, y: 105 },
      { id: "gaviao", n: "Gavião", r: "c", x: 420, y: 105 },
    ],
    edges: [["folhas", "lagarta"], ["lagarta", "sagui"], ["fruto", "sagui"], ["sagui", "gaviao"]],
  },
  mangue: {
    w: 480, h: 210,
    nodes: [
      { id: "alga", n: "Alga", r: "p", x: 50, y: 105 }, { id: "caramujo", n: "Caramujo", r: "c", x: 190, y: 45 },
      { id: "tainha", n: "Tainha", r: "c", x: 190, y: 165 }, { id: "siri", n: "Siri", r: "c", x: 330, y: 45 },
      { id: "garca", n: "Garça", r: "c", x: 430, y: 105 },
    ],
    edges: [["alga", "caramujo"], ["alga", "tainha"], ["caramujo", "siri"], ["siri", "garca"], ["tainha", "garca"]],
  },
  amazonia: {
    w: 480, h: 250,
    nodes: [
      { id: "folhas", n: "Folhas", r: "p", x: 48, y: 30 }, { id: "frutos", n: "Frutos", r: "p", x: 48, y: 220 },
      { id: "insetos", n: "Insetos", r: "c", x: 165, y: 30 }, { id: "cutia", n: "Cutia", r: "c", x: 165, y: 220 },
      { id: "sapo", n: "Sapo", r: "c", x: 290, y: 30 }, { id: "jiboia", n: "Jiboia", r: "c", x: 300, y: 125 },
      { id: "onca", n: "Onça", r: "c", x: 430, y: 150 },
    ],
    edges: [["folhas", "insetos"], ["frutos", "cutia"], ["insetos", "sapo"], ["sapo", "jiboia"],
      ["cutia", "jiboia"], ["cutia", "onca"], ["jiboia", "onca"]],
  },
};
const M = Object.fromEntries(Object.entries(TEIAS).map(([k, t]) => [k, modeloTeia(t.nodes, t.edges)]));
const nome = (k, id) => TEIAS[k].nodes.find((n) => n.id === id).n;

// ============================================================================ DADOS DOS CICLOS
// nodes: x,y centro, w largura (altura 34). arrows: p = [x1,y1,x2,y2]; c = centro do número.
export const CICLOS = {
  carbono: {
    w: 480, h: 185,
    nodes: [
      { t: "CO₂ no ar", x: 240, y: 30, w: 170, c: FILL.agua }, { t: "Plantas", x: 55, y: 140, w: 95, c: FILL.folha },
      { t: "Animais", x: 200, y: 140, w: 100, c: FILL.amarelo }, { t: "Decomp.", x: 315, y: 140, w: 95, c: FILL.lilas },
      { t: "Fósseis", x: 430, y: 140, w: 90, c: FILL.cinza },
    ],
    arrows: [
      { n: 1, p: [205, 49, 75, 121], c: [140, 85], role: "Fotossíntese" },
      { n: 2, p: [35, 121, 165, 49], c: [100, 85], role: "Respiração" },
      { n: 3, p: [200, 121, 245, 49], c: [222, 85], role: "Respiração" },
      { n: 4, p: [103, 140, 150, 140], c: [127, 164], role: "Alimentação" },
      { n: 5, p: [315, 121, 300, 49], c: [307, 85], role: "Decomposição" },
      { n: 6, p: [430, 121, 320, 49], c: [375, 85], role: "Combustão" },
    ],
  },
  nitrogenio: {
    w: 480, h: 185,
    nodes: [
      { t: "N₂ no ar", x: 240, y: 30, w: 130, c: FILL.agua }, { t: "Amônia", x: 80, y: 140, w: 100, c: FILL.rosa },
      { t: "Nitrato", x: 250, y: 140, w: 100, c: FILL.laranja }, { t: "Plantas", x: 410, y: 140, w: 100, c: FILL.folha },
    ],
    arrows: [
      { n: 1, p: [200, 49, 95, 121], c: [147, 85], role: "Fixação" },
      { n: 2, p: [130, 140, 200, 140], c: [165, 164], role: "Nitrificação" },
      { n: 3, p: [300, 140, 360, 140], c: [330, 112], role: "Absorção" },
      { n: 4, p: [260, 121, 245, 49], c: [252, 85], role: "Desnitrificação" },
    ],
  },
  agua: {
    w: 480, h: 245,
    nodes: [
      { t: "Atmosfera", x: 240, y: 30, w: 190, c: FILL.agua }, { t: "Oceano", x: 70, y: 200, w: 100, c: FILL.agua },
      { t: "Floresta", x: 410, y: 200, w: 115, c: FILL.folha },
    ],
    arrows: [
      { n: 1, p: [95, 181, 185, 49], c: [140, 115], role: "Evaporação" },
      { n: 2, p: [150, 49, 50, 181], c: [100, 115], role: "Precipitação" },
      { n: 3, p: [390, 181, 300, 49], c: [345, 115], role: "Transpiração" },
      { n: 4, p: [335, 49, 430, 181], c: [382, 115], role: "Precipitação" },
      { n: 5, p: [350, 200, 125, 200], c: [237, 175], role: "Escoamento" },
    ],
  },
};

// ============================================================================ RENDERIZADORES
function figTeia(fig, o = {}) {
  const W = fig.w || 480, H = fig.h || 150, rev = o.mode === "reveal";
  const N = Object.fromEntries(fig.nodes.map((n) => [n.id, { ...n, w: Math.max(58, n.n.length * 10.5 + 22), h: 34 }]));
  let s = "";
  for (const [a, b] of fig.edges) {
    const A = N[a], B = N[b], dx = B.x - A.x, dy = B.y - A.y;
    const clip = (P) => Math.min(dx ? (P.w / 2 + 4) / Math.abs(dx) : Infinity, dy ? (P.h / 2 + 4) / Math.abs(dy) : Infinity);
    const foc = fig.focus && fig.focus[0] === a && fig.focus[1] === b;
    s += arrow(A.x + dx * clip(A), A.y + dy * clip(A), B.x - dx * clip(B), B.y - dy * clip(B), { stroke: foc ? FOCO : INK, sw: foc ? 3.6 : 2.2 });
  }
  const hl = rev ? fig.hl || [] : [];
  for (const n of Object.values(N)) {
    const on = hl.includes(n.id);
    const fill = on ? GOLD : n.r === "p" ? FILL.folha : n.r === "d" ? FILL.lilas : FILL.amarelo;
    s += rect(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h, { fill, rx: 17, stroke: on ? OK : INK, sw: on ? 3.6 : 2 });
    s += text(n.x, n.y + 6, n.n, { size: FS });
  }
  if (o.hint && N[o.hint]) s += hintRing(N[o.hint].x, N[o.hint].y, N[o.hint].w / 2 + 6);
  return svg(W, H, s, fig.cap || "Teia alimentar");
}

// main: nomes e valores (fonte 16,5, viewBox 480). alt: só barras, sem texto (a legenda A/B/C/D vem da alternativa).
function figPiramide(fig, o = {}) {
  const alt = o.size === "alt", rev = o.mode === "reveal", L = fig.levels, n = L.length;
  const W = alt ? 200 : 480, rowH = alt ? 22 : 40, gap = alt ? 5 : 6, top = alt ? 6 : 32, H = top + n * (rowH + gap) + 2;
  const cx = alt ? 100 : 255, maxW = alt ? 188 : 240, smax = Math.max(...L.map((l) => l.s));
  const wid = (sv) => (alt ? 20 : 40) + (maxW - (alt ? 20 : 40)) * (fig.scale === "lin" ? sv / smax : Math.log10(1 + sv) / Math.log10(1 + smax));
  let s = alt ? "" : text(8, 20, fig.tipo || "Pirâmide de energia", { size: FS, anchor: "start", fill: MUTED });
  let ring = "";
  L.forEach((l, i) => {
    const y = H - 2 - (i + 1) * (rowH + gap) + gap, w = wid(l.s), on = rev && fig.hl === i;
    const fill = on ? GOLD : rev && fig.ruim ? FILL.sangue : [FILL.folha, FILL.amarelo, FILL.laranja, FILL.rosa, FILL.lilas][i % 5];
    s += rect(cx - w / 2, y, w, rowH, { fill, rx: 6, stroke: on ? OK : INK, sw: on ? 3.4 : 2 });
    if (!alt) {
      s += text(8, y + rowH / 2 + 6, l.n, { size: FS, anchor: "start" });
      const v = rev && l.tr !== undefined ? l.tr : l.t;
      s += text(W - 8, y + rowH / 2 + 6, v, { size: FS, anchor: "end", fill: v === "?" ? MUTED : INK, weight: v === "?" ? 800 : 700 });
    }
    if (o.hint === i + 1) ring = hintRing(cx, y + rowH / 2, rowH / 2 + 5);
  });
  return svg(W, H, s + ring, fig.cap || "Pirâmide ecológica");
}

function figGrafico(fig, o = {}) {
  const rev = o.mode === "reveal", W = 480, H = 250, Lx = 84, Rx = 468, T = 46, B = 188;
  const { xs, series } = fig, n = xs.length, y0 = fig.y0 ?? 0, y1 = fig.y1;
  const Y = (v) => B - ((v - y0) / (y1 - y0)) * (B - T);
  const bars = fig.tipo === "barras";
  const X = (i) => (bars ? Lx + ((i + 0.5) / n) * (Rx - Lx) : Lx + 16 + (i * (Rx - Lx - 32)) / (n - 1));
  const cores = ["#3d8fd1", "#e3a21a", "#2f9a54", "#c23a30"];
  let s = "";
  for (const t of fig.ticks) s += line(Lx, Y(t), Rx, Y(t), { stroke: "#d9d3c2", sw: 1.2 }) + text(Lx - 7, Y(t) + 6, fmt(t), { size: FS, anchor: "end", weight: 600 });
  s += line(Lx, T - 4, Lx, B) + line(Lx, B, Rx, B);
  xs.forEach((x, i) => (s += text(X(i), B + 22, x, { size: FS, weight: 600 })));
  s += text((Lx + Rx) / 2, H - 8, fig.xl, { size: FS });
  s += `<text x="18" y="${r1((T + B) / 2)}" font-size="${FS}" font-weight="700" fill="${INK}" text-anchor="middle" transform="rotate(-90 18 ${r1((T + B) / 2)})">${esc(fig.yl)}</text>`;
  if (fig.k) {
    const yk = Y(fig.k.y);
    s += line(Lx, yk, Rx, yk, { stroke: rev ? OK : MUTED, sw: 2.4, dash: "7 5" });
    s += text(Rx - 4, yk - 8, rev ? fig.k.rev : "?", { size: rev ? FS : 22, anchor: "end", fill: rev ? OK : MUTED, weight: 800, halo: true });
  }
  series.forEach((sr, si) => {
    const c = sr.c || cores[si % cores.length];
    if (bars) {
      const gw = (Rx - Lx) / n, bw = (gw * 0.55) / series.length;
      sr.ys.forEach((v, i) => {
        const x = Lx + i * gw + gw * 0.225 + si * bw;
        s += rect(x, Y(v), bw, B - Y(v), { fill: c, rx: 3 }) + text(x + bw / 2, Y(v) - 6, fmt(v), { size: FS });
      });
    } else {
      s += `<path d="${sr.ys.map((v, i) => `${i ? "L" : "M"}${r1(X(i))} ${r1(Y(v))}`).join("")}" fill="none" stroke="${c}" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>`;
      sr.ys.forEach((v, i) => { if (!fig.semPontos) s += circle(X(i), Y(v), 4.5, { fill: c }); });
    }
  });
  if (series.length > 1) {
    let lx = Lx;
    series.forEach((sr, si) => {
      s += rect(lx, 12, 16, 16, { fill: sr.c || cores[si % cores.length], rx: 3, sw: 1.6 }) + text(lx + 22, 26, sr.n, { size: FS, anchor: "start" });
      lx += 22 + sr.n.length * 10 + 26;
    });
  }
  if (rev && fig.hl !== undefined) { const sr = series[fig.hlSerie || 0]; s += `<circle cx="${r1(X(fig.hl))}" cy="${r1(Y(sr.ys[fig.hl]))}" r="11" fill="none" stroke="${OK}" stroke-width="3.4"/>`; }
  if (o.hint) { const hi = o.hint - 1, sr = series[fig.hintSerie || 0]; s += hintRing(X(hi), bars ? Y(sr.ys[hi]) - 12 : Y(sr.ys[hi]), bars ? 26 : 16); }
  return svg(W, H, s, fig.cap || "Gráfico");
}

// hint do ciclo: número da seta (anel no número) ou { no: i } (anel no i-ésimo retângulo)
function figCiclo(fig, o = {}) {
  const P = CICLOS[fig.tipo], rev = o.mode === "reveal";
  let s = "";
  for (const a of P.arrows) {
    const on = rev && fig.hl === a.n;
    s += arrow(...a.p, { stroke: on ? OK : INK, sw: on ? 3.6 : 2.2 });
  }
  for (const nd of P.nodes) s += rect(nd.x - nd.w / 2, nd.y - 17, nd.w, 34, { fill: nd.c, rx: 10 }) + text(nd.x, nd.y + 6, nd.t, { size: FS });
  for (const a of P.arrows) {
    const on = rev && fig.hl === a.n;
    s += circle(a.c[0], a.c[1], 13, { fill: on ? GOLD : "#fff", stroke: on ? OK : INK, sw: on ? 3 : 2 }) + text(a.c[0], a.c[1] + 6, a.n, { size: FS });
    if (o.hint === a.n) s += hintRing(a.c[0], a.c[1], 20);
  }
  if (o.hint && o.hint.no !== undefined) { const nd = P.nodes[o.hint.no]; s += hintRing(nd.x, nd.y, Math.max(nd.w / 2 + 6, 34)); }
  return svg(P.w, P.h, s, fig.cap || "Ciclo");
}

function figRelacao(fig, o = {}) {
  const rev = o.mode === "reveal", W = 480, H = 178, Y = 100, bw = 140, bh = 64;
  const cx = { a: 90, b: 390 };
  let s = arrow(240, Y, 162, Y) + arrow(240, Y, 318, Y);
  s += rev ? text(240, Y - 12, fig.nome, { size: FS, fill: OK, weight: 800 }) : text(240, Y - 10, "?", { size: 24, fill: MUTED, weight: 800 });
  for (const k of ["a", "b"]) {
    const sg = fig["s" + k], nm = fig[k].split("|");
    s += rect(cx[k] - bw / 2, Y - bh / 2, bw, bh, { fill: k === "a" ? FILL.folha : FILL.amarelo, rx: 18 });
    if (nm.length === 1) s += text(cx[k], Y + 6, nm[0], { size: FS });
    else s += text(cx[k], Y - 3, nm[0], { size: FS }) + text(cx[k], Y + 18, nm[1], { size: FS });
    s += circle(cx[k], 24, 16, { fill: sg === "+" ? "#d4efd9" : sg === "-" ? "#f6d0cc" : FILL.cinza, stroke: sg === "+" ? OK : sg === "-" ? BAD : INK });
    s += text(cx[k], 32, sg === "-" ? "−" : sg, { size: 24, fill: sg === "+" ? OK : sg === "-" ? BAD : INK, weight: 800 });
    s += text(cx[k], Y + bh / 2 + 26, fig["e" + k], { size: FS, weight: 600 });
    if (o.hint === k) s += hintRing(cx[k], 24, 24);
  }
  return svg(W, H, s, fig.cap || "Relação ecológica");
}

// fig: rows [{id, n (níveis), gl (índice do valor dado, 0-based), v (valor dado), names?}], sp (espaço), top (texto)
function figBioacum(fig, o = {}) {
  const rev = o.mode === "reveal", W = 480, comNomes = fig.rows.some((r) => r.names), rowH = comNomes ? 80 : 64, H = 40 + fig.rows.length * rowH;
  const sp = fig.sp || 84, x0 = fig.x0 || 82;
  let s = text(8, 20, fig.top || "", { size: FS, anchor: "start", fill: MUTED });
  fig.rows.forEach((r, ri) => {
    const y = 66 + ri * rowH, vals = Array.from({ length: r.n }, (_, i) => concNivel(r.v, r.gl, i));
    const top = r.n - 1, win = fig.hlRow === r.id;
    if (!fig.noLetter) s += circle(24, y, 15, { fill: rev && win ? GOLD : "#fff", stroke: rev && win ? OK : INK, sw: rev && win ? 3.2 : 2 }) + text(24, y + 6, r.id, { size: FS });
    for (let i = 0; i < r.n; i++) {
      const x = x0 + i * sp, on = rev && win && i === top;
      if (i < r.n - 1) s += arrow(x + 15, y, x + sp - 15, y) + text(x + sp / 2, y - 12, "×10", { size: FS, fill: MUTED, weight: 600 });
      s += circle(x, y, 14, { fill: on ? GOLD : FILL.amarelo, stroke: on ? OK : INK, sw: on ? 3.2 : 2 }) + text(x, y + 6, i + 1, { size: FS });
      let lab = null;
      if (rev) lab = fmt(vals[i]);
      else if (i === r.gl) lab = fmt(r.v);
      else if (i === (r.q ?? top) && fig.pergunta) lab = "?";
      if (lab !== null) s += text(x, y - 26, lab, { size: FS, fill: lab === "?" ? MUTED : on ? OK : INK, weight: 800 });
      if (r.names) s += text(x, y + 36, r.names[i], { size: FS, weight: 600 });
    }
    if (o.hint === r.id) s += hintRing(24, y, 22);
  });
  return svg(W, H, s, fig.cap || "Bioacumulação");
}

export const FIGS = {
  "eco-teia": figTeia, "eco-piramide": figPiramide, "eco-grafico": figGrafico, "eco-ciclo": figCiclo,
  "eco-relacao": figRelacao, "eco-bioacum": figBioacum,
};

// ============================================================================ PERGUNTAS
// build: alts recebem `ok` calculado pelo modelo; correct sai daí (exatamente 1).
function build({ rot = 0, ...q0 }) {
  const q = { ...q0, alts: [...q0.alts.slice(rot), ...q0.alts.slice(0, rot)] };
  const idx = q.alts.map((a, i) => (a.ok ? i : -1)).filter((i) => i >= 0);
  if (idx.length !== 1) throw new Error(`${q.id}: ${idx.length} alternativas certas`);
  return { subj: "biologia", pat: 1, ...q, alts: q.alts.map(({ ok, ...a }) => a), correct: idx };
}
const teia = (k, extra = {}) => ({ kind: "eco-teia", ...TEIAS[k], ...extra });
const REF = {
  teia: "OpenStax Biology 2e, 46.1 Ecology of Ecosystems (setas da teia: de quem é consumido para quem consome; níveis tróficos): https://openstax.org/books/biology-2e/pages/46-1-ecology-of-ecosystems",
  piramide: "OpenStax Biology 2e, 46.1 e 46.2 (energia se perde a cada nível; pirâmides ecológicas; medido ~14,5% em Silver Springs, então 10% é regra didática): https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems",
  bio: "OpenStax Biology 2e, 46.2 Energy Flow through Ecosystems (biomagnificação: concentração de substâncias tóxicas persistentes cresce a cada nível trófico; Hg e PCB): https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems",
  ciclos: "OpenStax Biology 2e, 46.3 Biogeochemical Cycles: https://openstax.org/books/biology-2e/pages/46-3-biogeochemical-cycles",
  comunidade: "OpenStax Biology 2e, 45.6 Community Ecology (mutualismo, comensalismo, parasitismo): https://openstax.org/books/biology-2e/pages/45-6-community-ecology",
  nasa: "NASA, Causes of Climate Change (queima de combustíveis fósseis eleva o CO₂ atmosférico): https://science.nasa.gov/climate-change/causes",
  usgs: "USGS Water Science School, Evapotranspiration and the Water Cycle (plantas devolvem vapor d'água ao ar pelas folhas): https://www.usgs.gov/water-science-school/science/evapotranspiration-and-water-cycle",
  biodiv: "OpenStax Biology 2e, 47.1 The Biodiversity Crisis (destruição de habitat é o primeiro dos grandes impactos humanos): https://openstax.org/books/biology-2e/pages/47-1-the-biodiversity-crisis",
  pop: "OpenStax Biology 2e, 45.3 Environmental Limits to Population Growth (capacidade de suporte e crescimento logístico): https://openstax.org/books/biology-2e/pages/45-3-environmental-limits-to-population-growth",
};

// --- teias / níveis tróficos (5)
const mc = M.cerrado, sapoNivel = mc.nivel("sapo");
const mp = M.pantanal, [fa, fb] = TEIAS.pantanal.focus, quemCome = mp.come([fa, fb]);
const mm = M.mata, saguiNiveis = mm.niveis("sagui");
const mg = M.mangue, semCaramujo = mg.perdeTudo("caramujo");
const ma = M.amazonia, oncaMax = ma.maxNivel("onca");

const Q_TEIAS = [
  build({
    id: "bio-eco-teia-cerrado-sec", calc: true, lvl: 1,
    text: "No Cerrado, qual organismo desta cadeia é o consumidor secundário?",
    fig: [teia("cerrado", { cap: "Cadeia do Cerrado", hl: ["sapo"] })],
    alts: ["gafa", "cobra", "sapo", "capim"].map((id) => ({ t: nome("cerrado", id), ok: mc.nivel(id) - 1 === 2 })),
    hint: { t: "Comece a contar no produtor: ele é o 1º nível, não consumidor.", fig: 0, mark: "capim" },
    why: `O capim (1º nível) é produtor; o gafanhoto é consumidor primário; o sapo (${ord(sapoNivel)} nível) é o secundário.`,
    src: "no estilo do ENEM", ref: REF.teia,
  }),
  build({
    id: "bio-eco-teia-seta-pantanal", calc: true, rot: 1, lvl: 1,
    text: "Na teia do Pantanal, a seta vai do lambari para o dourado. O que ela indica?",
    fig: [teia("pantanal", { cap: "Teia do Pantanal", hl: [quemCome] })],
    alts: [
      { t: "O lambari come o dourado e recebe sua energia", ok: quemCome === fa },
      { t: "O dourado come o lambari e recebe sua energia", ok: quemCome === fb },
      { t: "O lambari é decompositor do dourado", ok: false },
      { t: "O dourado produz o alimento do lambari", ok: false },
    ],
    hint: { t: "A ponta da seta mostra para onde a energia vai.", fig: 0, mark: "lambari" },
    why: "A seta sai de quem é comido e aponta para quem come: é o sentido da energia, não de quem 'ataca'.",
    src: "no estilo do ENEM", ref: REF.teia,
  }),
  build({
    id: "bio-eco-teia-sagui-niveis", calc: true, lvl: 2,
    text: "Na Mata Atlântica, o sagui come fruto e lagarta. Em quais níveis tróficos ele atua?",
    fig: [teia("mata", { cap: "Teia da Mata Atlântica", hl: ["sagui"] })],
    alts: [[2], [3], [3, 4], [2, 3]].map((a) => ({ t: lista(a), ok: a.join() === saguiNiveis.join() })),
    hint: { t: "Siga cada seta que chega ao sagui desde o produtor e conte os passos.", fig: 0, mark: "fruto" },
    why: "Pelo fruto, o sagui é consumidor primário (2º nível); pela lagarta, secundário (3º): onívoros ocupam mais de um nível.",
    src: "no estilo do ENEM", ref: REF.teia,
  }),
  build({
    id: "bio-eco-teia-manguezal-retirada", calc: true, lvl: 2,
    text: "Na teia do manguezal, quem perde todo o alimento se o caramujo desaparecer?",
    fig: [teia("mangue", { cap: "Teia do manguezal", hl: semCaramujo })],
    alts: ["garca", "siri", "tainha", "alga"].map((id) => ({ t: nome("mangue", id), ok: semCaramujo.length === 1 && semCaramujo[0] === id })),
    hint: { t: "Veja quem tem outra fonte de alimento: esse resiste.", fig: 0, mark: "caramujo" },
    why: "O siri só come caramujo e desaparece; a garça ainda tem a tainha, e a tainha come alga, que continua lá.",
    src: "no estilo do ENEM", ref: REF.teia,
  }),
  build({
    id: "bio-eco-teia-amazonia-onca", calc: true, rot: 1, lvl: 3,
    text: "Qual é o maior nível trófico que a onça atinge nesta teia da Amazônia?",
    fig: [teia("amazonia", { cap: "Teia da Amazônia", hl: ["onca"] })],
    alts: [6, 5, 3, 4].map((n) => ({ t: `${ord(n)} nível`, ok: n === oncaMax })),
    hint: { t: "Procure o caminho mais longo até a onça: passa pela jiboia.", fig: 0, mark: "jiboia" },
    why: "Insetos 2º, sapo 3º, jiboia 4º: ao comer a jiboia a onça é do 5º nível (e do 3º se comer cutia).",
    src: "no estilo do ENEM", ref: REF.teia,
  }),
];

// --- pirâmides e regra dos 10% (3)
const niv1 = 10000, e4 = energiaNivel(niv1, 4);
const pirE = [{ n: "Capim", s: 10000 }, { n: "Gafanhoto", s: 1000 }, { n: "Sapo", s: 100 }, { n: "Cobra", s: 10 }];
const PIR_ALT = [[10000, 1000, 100, 10], [9000, 3000, 800, 40], [200, 700, 2000, 5000], [5000, 1200, 260, 30]];
const e3 = 450, e1 = energiaNivel1(e3, 3);
const Q_PIR = [
  build({
    id: "bio-eco-pir-10pct-4nivel", calc: true, lvl: 1,
    text: "Com 10% de transferência entre níveis, quanta energia chega ao 4º nível desta pirâmide?",
    fig: [{ kind: "eco-piramide", tipo: "Energia (kcal) por nível", cap: "Pirâmide de energia",
      levels: pirE.map((l, i) => ({ n: l.n, s: l.s, t: i === 0 ? fmt(niv1) : "?", tr: fmt(energiaNivel(niv1, i + 1)) })), hl: 3 }],
    alts: [100, 10, 1000, 1].map((v) => ({ t: `${fmt(v)} kcal`, ok: v === e4 })),
    hint: { t: "A cada passada de nível só 10% segue: faça três passos a partir do capim.", fig: 0, mark: 1 },
    why: `10 000 → 1 000 → 100 → ${fmt(e4)} kcal: cada nível guarda só um décimo do anterior.`,
    src: "no estilo do ENEM", ref: REF.piramide,
  }),
  build({
    id: "bio-eco-pir-energia-impossivel", calc: true, lvl: 2,
    text: "Qual destas pirâmides NÃO pode representar a energia de uma cadeia alimentar?",
    fig: [],
    alts: PIR_ALT.map((v, i) => ({
      fig: { kind: "eco-piramide", tipo: "Energia por nível", scale: "lin", ruim: !piramideEnergiaValida(v), levels: v.map((s) => ({ n: "", s, t: "" })) },
      cap: "ABCD"[i], ok: !piramideEnergiaValida(v),
    })),
    hint: { t: "Energia se perde a cada nível: cada barra deve ser menor que a de baixo." },
    why: "A pirâmide de energia nunca é invertida: parte da energia vira calor em cada nível, então cada barra é menor.",
    src: "no estilo do ENEM", ref: REF.piramide,
  }),
  build({
    id: "bio-eco-pir-10pct-volta", calc: true, lvl: 3,
    text: "O 3º nível de uma pirâmide tem 450 kcal. Com 10% de transferência, quanto havia no 1º nível?",
    fig: [{ kind: "eco-piramide", tipo: "Energia (kcal) por nível", cap: "Pirâmide de energia",
      levels: [{ n: "Capim", s: e1, t: "?", tr: fmt(e1) }, { n: "Gafanhoto", s: e1 / 10, t: "?", tr: fmt(e1 / 10) }, { n: "Sapo", s: e3, t: fmt(e3) }], hl: 0 }],
    alts: [4500, 450000, e1, 4050].map((v) => ({ t: `${fmt(v)} kcal`, ok: v === e1 })),
    hint: { t: "Entre o 1º e o 3º nível há duas passagens, cada uma com perda de 90%.", fig: 0, mark: 3 },
    why: "Voltando duas vezes, multiplica-se por 10 a cada passo: 450 → 4 500 → 45 000 kcal.",
    src: "no estilo do ENEM", ref: REF.piramide,
  }),
];

// --- bioacumulação (2)
const CADEIAS = [
  { id: "A", n: 3, gl: 0, v: 0.5 }, { id: "B", n: 5, gl: 0, v: 0.05 }, { id: "C", n: 3, gl: 0, v: 2 }, { id: "D", n: 2, gl: 0, v: 8 },
];
const topos = CADEIAS.map((c) => concNivel(c.v, c.gl, c.n - 1));
const venc = topos.indexOf(Math.max(...topos));
const lambari = { id: "A", n: 4, gl: 1, v: 0.3, names: ["Plâncton", "Lambari", "Tucunaré", "Ariranha"] };
const hgAri = concNivel(lambari.v, lambari.gl, lambari.n - 1);
const Q_BIO = [
  build({
    id: "bio-eco-bio-mercurio-cadeias", calc: true, lvl: 2,
    text: "Mercúrio do garimpo é ×10 a cada nível. Qual cadeia deixa o predador de topo mais contaminado?",
    fig: [{ kind: "eco-bioacum", rows: CADEIAS, hlRow: CADEIAS[venc].id, pergunta: true, top: "Mercúrio (µg/g) em cada nível", cap: "Quatro cadeias com mercúrio" }],
    alts: [2, 0, 3, 1].map((i) => ({ t: `Cadeia ${CADEIAS[i].id}`, ok: i === venc })),
    hint: { t: "Confira o valor inicial e quantos níveis cada cadeia tem: os dois contam." },
    why: `Em B, 0,05 vira ${fmt(topos[1])} µg/g no 5º nível: mais níveis ganham de um valor inicial alto.`,
    src: "como no ENEM PPL 2020 (quadro de cadeias, TBT em moluscos)", ref: REF.bio,
  }),
  build({
    id: "bio-eco-bio-mercurio-ariranha", calc: true, rot: 1, lvl: 3,
    text: "Na cadeia, o lambari (2º nível) tem 0,3 µg/g de mercúrio. Com ×10 por nível, quanto tem a ariranha?",
    fig: [{ kind: "eco-bioacum", rows: [lambari], sp: 120, x0: 80, noLetter: true, pergunta: true, hlRow: "A", top: "Mercúrio (µg/g) em cada nível", cap: "Cadeia com mercúrio" }],
    alts: [3, 30, 300, 0.03].map((v) => ({ t: `${fmt(v)} µg/g`, ok: v === hgAri })),
    hint: { t: "A ariranha está dois níveis acima do lambari: multiplique duas vezes." },
    why: "0,3 → 3 (tucunaré) → 30 µg/g (ariranha): o mercúrio se acumula e cresce no topo da cadeia.",
    src: "no estilo do ENEM", ref: REF.bio,
  }),
];

// --- ciclos (3)
const C = CICLOS;
const papelSeta = (tipo, n) => C[tipo].arrows.find((a) => a.n === n).role;
const fixa = C.nitrogenio.arrows.find((a) => a.role === "Fixação").n;
const transp = C.agua.arrows.find((a) => a.role === "Transpiração").n;
const Q_CICLOS = [
  build({
    id: "bio-eco-ciclo-carbono-seta1", lvl: 1,
    text: "No ciclo do carbono, qual processo a seta 1 representa?",
    fig: [{ kind: "eco-ciclo", tipo: "carbono", hl: 1, cap: "Ciclo do carbono" }],
    alts: ["Respiração", "Fotossíntese", "Combustão", "Decomposição"].map((t) => ({ t, ok: t === papelSeta("carbono", 1) })),
    hint: { t: "Veja se a seta tira o CO₂ do ar ou joga CO₂ no ar.", fig: 0, mark: { no: 0 } },
    why: "Na fotossíntese as plantas retiram CO₂ do ar e o fixam em matéria orgânica.",
    src: "no estilo do ENEM", ref: REF.ciclos,
  }),
  build({
    id: "bio-eco-ciclo-nitrogenio-soja", rot: 3, lvl: 2,
    text: "Bactérias nos nódulos da soja do Cerrado usam o N₂ do ar. Que seta mostra a fixação?",
    fig: [{ kind: "eco-ciclo", tipo: "nitrogenio", hl: fixa, cap: "Ciclo do nitrogênio" }],
    alts: [3, 1, 4, 2].map((n) => ({ t: `Seta ${n}`, ok: n === fixa })),
    hint: { t: "Fixar é transformar o N₂ do ar em um composto que a planta aproveita.", fig: 0, mark: { no: 0 } },
    why: "Fixação: bactérias convertem N₂ em amônia. Nitrificação gera nitrato e desnitrificação devolve N₂ ao ar.",
    src: "no estilo do ENEM", ref: REF.ciclos,
  }),
  build({
    id: "bio-eco-ciclo-agua-desmatamento", lvl: 3,
    text: "Se a floresta for derrubada, qual seta do ciclo da água mais diminui?",
    fig: [{ kind: "eco-ciclo", tipo: "agua", hl: transp, cap: "Ciclo da água" }],
    alts: [1, 2, 3, 5].map((n) => ({ t: `Seta ${n}: ${papelSeta("agua", n).toLowerCase()}${n === 1 ? " do oceano" : n === 2 ? " no mar" : n === 3 ? " das plantas" : " pelos rios"}`, ok: n === transp })),
    hint: { t: "Qual processo depende de as folhas existirem para devolver água ao ar?", fig: 0, mark: { no: 2 } },
    why: "Sem árvores cai a transpiração: as folhas deixam de devolver vapor ao ar. O escoamento tende a aumentar.",
    src: "no estilo do ENEM", ref: REF.usgs,
  }),
];

// --- relações ecológicas (3)
const rel = (a, ea, sa, b, eb, sb, cap) => ({ kind: "eco-relacao", a, ea, sa, b, eb, sb, nome: relacaoPorSinais(sa, sb), cap });
const R1 = rel("Fungo", "recebe açúcar", "+", "Alga", "recebe proteção", "+", "Líquen");
const R2 = rel("Orquídea", "ganha luz", "+", "Árvore", "não é afetada", "0", "Orquídea sobre árvore");
const R3 = rel("Erva-de-|passarinho", "tira água e sais", "+", "Árvore", "perde seiva", "-", "Erva-de-passarinho");
const alts4 = (nomes, certo) => nomes.map((t) => ({ t, ok: t === certo }));
const Q_REL = [
  build({
    id: "bio-eco-rel-liquen", rot: 3, lvl: 1,
    text: "Fungo e alga vivem juntos em um líquen, como na figura. Que relação ecológica é essa?",
    fig: [R1],
    alts: alts4(["Parasitismo", "Mutualismo", "Comensalismo", "Competição"], R1.nome),
    hint: { t: "Veja os sinais: os dois ganham, perdem ou um fica indiferente?", fig: 0, mark: "a" },
    why: "Os dois se beneficiam (+ e +): o fungo recebe açúcar da alga e ela ganha proteção e água.",
    src: "no estilo do ENEM", ref: REF.comunidade,
  }),
  build({
    id: "bio-eco-rel-orquidea", lvl: 1,
    text: "Orquídeas crescem sobre árvores da Mata Atlântica sem prejudicá-las. Qual é a relação?",
    fig: [R2],
    alts: alts4(["Mutualismo", "Parasitismo", "Predação", "Comensalismo"], R2.nome),
    hint: { t: "Olhe o sinal da árvore: ela ganha, perde ou nada muda?", fig: 0, mark: "b" },
    why: "A orquídea ganha apoio e luz (+) e a árvore fica indiferente (0): comensalismo.",
    src: "no estilo do ENEM", ref: REF.comunidade,
  }),
  build({
    id: "bio-eco-rel-erva-passarinho", lvl: 2,
    text: "A erva-de-passarinho vive sobre árvores do Cerrado e retira delas água e sais. Qual é a relação?",
    fig: [R3],
    alts: alts4(["Comensalismo", "Mutualismo", "Predação", "Parasitismo"], R3.nome),
    hint: { t: "Parece com a orquídea, mas veja o sinal da árvore: aqui ela perde.", fig: 0, mark: "b" },
    why: "A erva ganha (+) e a árvore perde seiva (−) por muito tempo, sem morrer logo: parasitismo, não comensalismo.",
    src: "no estilo do ENEM", ref: REF.comunidade,
  }),
];

// --- impactos ambientais com gráfico (3)
const co2 = [317, 339, 370, 414];
const sobe = co2.every((v, i) => i === 0 || v > co2[i - 1]);
const desce = co2.every((v, i) => i === 0 || v < co2[i - 1]);
const algas = [5, 30, 90, 60, 20, 10], oxi = [90, 92, 85, 45, 15, 12];
const frag = [12, 31, 58];
const Q_IMP = [
  build({
    id: "bio-eco-imp-co2-tendencia", rot: 2, lvl: 1,
    text: "O gráfico mostra o CO₂ do ar em quatro décadas. Qual conclusão ele permite?",
    fig: [{ kind: "eco-grafico", tipo: "linha", xs: ["1960", "1980", "2000", "2020"], xl: "Ano", yl: "CO₂ (ppm)", y0: 300, y1: 420, ticks: [300, 360, 420],
      series: [{ n: "CO₂", ys: co2 }], hl: 3, cap: "CO₂ no ar (valores aproximados)" }],
    alts: [
      { t: "A concentração de CO₂ diminuiu no período", ok: desce },
      { t: "A concentração de CO₂ aumentou no período", ok: sobe },
      { t: "A concentração de CO₂ ficou estável", ok: !sobe && !desce && false },
      { t: "O CO₂ oscilou sem tendência clara", ok: false },
    ],
    hint: { t: "Compare o primeiro e o último ponto da linha.", fig: 0, mark: 1 },
    why: "A curva sobe em todos os intervalos; a queima de combustíveis fósseis e o desmatamento elevam o CO₂.",
    src: "no estilo do ENEM", ref: REF.nasa,
  }),
  build({
    id: "bio-eco-imp-eutrofizacao", rot: 1, lvl: 2,
    text: "Esgoto e adubo chegaram à represa e o O₂ despencou após o pico de algas. Por quê?",
    fig: [{ kind: "eco-grafico", tipo: "linha", xs: ["0", "5", "10", "15", "20", "25"], xl: "Dias após a chegada dos nutrientes", yl: "Índice (0 a 100)", y0: 0, y1: 100, ticks: [0, 50, 100],
      series: [{ n: "Algas", c: "#2f9a54", ys: algas }, { n: "O₂", c: "#3d8fd1", ys: oxi }], hl: 3, hlSerie: 1, hintSerie: 0, cap: "Algas e oxigênio (valores ilustrativos)" }],
    alts: [
      { t: "A fotossíntese das algas aumentou após o pico", ok: false },
      { t: "Bactérias gastam O₂ ao decompor algas mortas", ok: algas[3] < algas[2] && oxi[3] < oxi[2] },
      { t: "O adubo dissolvido consome O₂ sem seres vivos", ok: false },
      { t: "Os peixes mortos liberam O₂ ao se decompor", ok: false },
    ],
    hint: { t: "Observe o que acontece com as algas antes de o oxigênio cair.", fig: 0, mark: 3 },
    why: "Excesso de nutrientes gera florações; as algas morrem e a decomposição aeróbia esgota o O₂ da água (eutrofização).",
    src: "no estilo do ENEM", ref: REF.ciclos,
  }),
  build({
    id: "bio-eco-imp-fragmento-especies", lvl: 3,
    text: "O gráfico compara fragmentos de mata. Que conclusão justifica proteger áreas grandes de habitat?",
    fig: [{ kind: "eco-grafico", tipo: "barras", xs: ["10 ha", "100 ha", "1 000 ha"], xl: "Tamanho do fragmento de mata", yl: "Espécies de aves", y0: 0, y1: 60, ticks: [0, 30, 60],
      series: [{ n: "Aves", c: "#2f9a54", ys: frag }], hl: 2, cap: "Aves por fragmento (valores ilustrativos)" }],
    alts: [
      { t: "Fragmentos menores têm mais espécies", ok: false },
      { t: "O tamanho do fragmento não altera as espécies", ok: false },
      { t: "Áreas maiores mantêm mais espécies de aves", ok: frag[0] < frag[1] && frag[1] < frag[2] },
      { t: "Só a caça explica a perda de espécies", ok: false },
    ],
    hint: { t: "Compare as três barras da esquerda para a direita.", fig: 0, mark: 1 },
    why: "A riqueza de espécies cresce com a área do fragmento: a redução do habitat reduz a biodiversidade.",
    src: "no estilo do ENEM", ref: REF.biodiv,
  }),
];

// --- populações (1)
const K = 500, tt = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20], pop = tt.map((t) => Math.round(logistica(K, 10, 0.5, t)));
const Q_POP = [
  build({
    id: "bio-eco-pop-capacidade-suporte", lvl: 2,
    text: "A população de capivaras de uma represa se estabiliza na linha tracejada. O que ela representa?",
    fig: [{ kind: "eco-grafico", tipo: "linha", xs: tt.map(String), xl: "Tempo (anos)", yl: "Nº de capivaras", y0: 0, y1: 600, ticks: [0, 300, 600], semPontos: true,
      series: [{ n: "População", c: "#3d8fd1", ys: pop }], k: { y: K, rev: "K" }, cap: "Crescimento de capivaras (valores ilustrativos)" }],
    alts: [
      { t: "Potencial biótico da espécie", ok: false },
      { t: "Tamanho inicial da população", ok: false },
      { t: "Capacidade de suporte do ambiente", ok: pop.slice(-3).every((v) => Math.abs(v - K) / K < 0.05) },
      { t: "Taxa máxima de natalidade", ok: false },
    ],
    hint: { t: "Observe o que acontece com a curva quando os recursos ficam escassos.", fig: 0 },
    why: "Com recursos limitados, o crescimento logístico se acomoda no máximo que o ambiente sustenta (capacidade de suporte, K).",
    src: "no estilo do ENEM", ref: REF.pop,
  }),
];

export const QUESTIONS = [...Q_TEIAS, ...Q_PIR, ...Q_BIO, ...Q_CICLOS, ...Q_REL, ...Q_IMP, ...Q_POP];
export const PATTERNS_USED = [1];
