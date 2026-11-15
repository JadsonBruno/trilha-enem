// Biologia: corpo humano (padrão 3) e doenças/vacinas (padrão 5). 17 perguntas conceituais, cada uma com `ref`.
// Onde há regra (ler gráfico, sentido do sangue, ordem de eventos) a resposta certa sai de CALC(), calculada
// a partir dos dados da própria figura; check-bio-corpo.mjs refaz essas contas de modo independente.
import { INK, MUTED, OK, BAD, FILL, svg, text, rect, circle, line, arrow, hintRing, r1 } from "./bio-base.mjs";

export const PATTERNS_USED = [3, 5];

// ----------------------------------------------------------------------------- base dos desenhos
const MW = 440, MH = 250, AW = 180, AH = 102, K = AW / MW; // "main" 440×250 (fonte 15 → 11,6 px reais a 340 px), "alt" 180×102 (fonte 34 × K = 13,9 → 11,6 px reais a 150 px)
const BLUE = "#3d8fd1", RED = "#e4504a";
const BS = (o) => (o && o.size === "alt" ? 34 : 16), BR = (o) => (o && o.size === "alt" ? 25 : 14);
const isAlt = (o) => !!o && o.size === "alt";
const isRev = (o) => !!o && o.mode === "reveal";
const frame = (o, body, label) => (isAlt(o) ? svg(AW, AH, `<g transform="scale(${K.toFixed(4)})">${body}</g>`, label) : svg(MW, MH, body, label));
const T = (o, x, y, s, opt = {}) => {
  const { core = false, ...rest } = opt;
  if (isAlt(o) && !core) return "";
  return text(x, y, s, { size: isAlt(o) ? 34 : 15, ...rest });
};
const ring = (o) => (o && o.hint && o.hint.x != null ? hintRing(o.hint.x, o.hint.y, o.hint.r || 22) : "");
const sty = (rev, on, fill) => (on && rev ? { fill: FILL.verde, stroke: OK, sw: 3.6 } : { fill, stroke: INK, sw: 2 });
const R = (x, y, w, h, s, rx = 10) => rect(x, y, w, h, { fill: s.fill, rx, stroke: s.stroke, sw: s.sw });
const tube = (x1, y1, x2, y2, w, fill) => `${line(x1, y1, x2, y2, { sw: w + 4 })}${line(x1, y1, x2, y2, { stroke: fill, sw: w })}`;

// ----------------------------------------------------------------------------- tubo digestório
const DIG = {
  grosso: { x: 126, y: 156, w: 138, h: 82, rx: 16, fill: FILL.areia, nome: "Intestino grosso", lx: 272, ly: 228, a: "start" },
  delgado: { x: 150, y: 172, w: 90, h: 48, rx: 14, fill: FILL.amarelo, nome: "Intestino delgado", lx: 272, ly: 196, a: "start" },
  pancreas: { x: 196, y: 134, w: 74, h: 18, rx: 9, fill: FILL.lilas, nome: "Pâncreas", lx: 278, ly: 148, a: "start" },
  estomago: { x: 150, y: 86, w: 76, h: 50, rx: 24, fill: FILL.laranja, nome: "Estômago", lx: 142, ly: 116, a: "end" },
  figado: { x: 232, y: 80, w: 92, h: 42, rx: 18, fill: FILL.sangue, nome: "Fígado", lx: 332, ly: 106, a: "start" },
  boca: { x: 150, y: 12, w: 70, h: 34, rx: 14, fill: FILL.rosa, nome: "Boca", lx: 230, ly: 34, a: "start" },
};
function digestorio(f, o) {
  const rev = isRev(o);
  let b = "";
  for (const k of ["grosso", "delgado", "pancreas"]) { const d = DIG[k]; b += R(d.x, d.y, d.w, d.h, sty(rev, f.hl === k, d.fill), d.rx); }
  b += `<path d="M160 190C175 176 190 204 205 190S230 176 232 192" fill="none" stroke="${MUTED}" stroke-width="3" stroke-linecap="round"/>`;
  b += rect(184, 134, 12, 40, { fill: FILL.rosa, rx: 4 }) + rect(180, 46, 10, 42, { fill: FILL.rosa, rx: 4 });
  for (const k of ["estomago", "figado", "boca"]) { const d = DIG[k]; b += R(d.x, d.y, d.w, d.h, sty(rev, f.hl === k, d.fill), d.rx); }
  b += T(o, 196, 70, "Esôfago", { anchor: "start" });
  for (const k of Object.keys(DIG)) { const d = DIG[k]; b += T(o, d.lx, d.ly, d.nome, { anchor: d.a, core: k === f.hl }); }
  return frame(o, b + ring(o), "Esquema do sistema digestório");
}

// ----------------------------------------------------------------------------- coração (vista de frente)
const CH = { 1: [110, 38, 100, 72], 2: [222, 38, 100, 72], 3: [110, 116, 100, 84], 4: [222, 116, 100, 84] };
function coracao(f, o) {
  const rev = isRev(o);
  let b = "";
  for (const c of f.chambers) {
    const [x, y, w, h] = CH[c.n], on = f.hl === c.n;
    const s = sty(rev, on, FILL.cinza);
    b += rect(x, y, w, h, { fill: s.fill, rx: 18, stroke: s.stroke, sw: c.parede === "grossa" ? 6 : s.sw });
    b += circle(x + w / 2, y + h / 2, BR(o) + 2, { fill: "#fff", sw: 2 }) + text(x + w / 2, y + h / 2 + (isAlt(o) ? 11 : 5.5), String(c.n), { size: BS(o) });
  }
  const A = (x1, y1, x2, y2, col) => arrow(x1, y1, x2, y2, { stroke: col, sw: 3.4 });
  b += A(14, 84, 106, 84, BLUE) + T(o, 60, 66, "Do corpo", { fill: BLUE });
  b += A(106, 174, 14, 174, BLUE) + T(o, 60, 156, "Aos pulmões", { fill: BLUE });
  b += A(426, 84, 326, 84, RED) + T(o, 378, 66, "Dos pulmões", { fill: RED });
  b += A(326, 174, 426, 174, RED) + T(o, 378, 156, "Ao corpo", { fill: RED });
  b += T(o, 216, 226, "vista de frente", { fill: MUTED, weight: 600 });
  return frame(o, b + ring(o), "Esquema do coração com quatro câmaras numeradas");
}

// ----------------------------------------------------------------------------- circuito (qual vaso é qual)
const VES = { A: [195, 196, 195, 154, 165, 175], B: [195, 94, 195, 56, 165, 75], C: [245, 56, 245, 94, 275, 75], D: [245, 154, 245, 196, 275, 175] };
function circuito(f, o) {
  const rev = isRev(o);
  let b = rect(150, 8, 140, 44, { fill: FILL.rosa, rx: 14 }) + rect(170, 96, 100, 56, { fill: FILL.cinza, rx: 14 }) + rect(150, 198, 140, 44, { fill: FILL.laranja, rx: 14 });
  b += T(o, 220, 36, "Pulmões", { core: true }) + T(o, 220, 130, "Coração", { core: true }) + T(o, 220, 226, "Corpo", { core: true });
  for (const v of f.vessels) {
    const [x1, y1, x2, y2, bx, by] = VES[v.id], col = v.o2 === "muito" ? RED : BLUE, on = rev && f.hl === v.id;
    if (on) b += line(x1, y1, x2, y2, { stroke: FILL.verde, sw: 14 });
    b += arrow(x1, y1, x2, y2, { stroke: col, sw: 3.6 });
    b += circle(bx, by, BR(o) - 1, { fill: on ? FILL.verde : "#fff", stroke: on ? OK : INK, sw: on ? 3.4 : 2 }) + text(bx, by + (isAlt(o) ? 11 : 5.5), v.id, { size: BS(o) });
  }
  b += rect(312, 104, 24, 7, { fill: RED, rx: 3, stroke: RED, sw: 1 }) + T(o, 344, 112, "muito O2", { anchor: "start" });
  b += rect(312, 134, 24, 7, { fill: BLUE, rx: 3, stroke: BLUE, sw: 1 }) + T(o, 344, 142, "pouco O2", { anchor: "start" });
  b += T(o, 312, 172, "setas: sentido", { anchor: "start", fill: MUTED, weight: 600 }) + T(o, 312, 190, "do fluxo", { anchor: "start", fill: MUTED, weight: 600 });
  return frame(o, b + ring(o), "Circuito do sangue entre corpo, coração e pulmões com quatro vasos");
}

// ----------------------------------------------------------------------------- pulmão
function pulmao(f, o) {
  const rev = isRev(o), al = rev && f.hl === "alveolos";
  let b = tube(220, 8, 220, 54, 12, FILL.agua);
  b += tube(220, 54, 150, 96, 10, FILL.agua) + tube(220, 54, 290, 96, 10, FILL.agua);
  for (const [x1, y1, x2, y2] of [[150, 96, 110, 138], [150, 96, 190, 138], [290, 96, 250, 138], [290, 96, 330, 138]]) b += tube(x1, y1, x2, y2, 5, FILL.agua);
  for (const cx of [110, 190, 250, 330]) {
    for (const [dx, dy] of [[-14, 22], [14, 22], [0, 40]]) {
      b += circle(cx + dx, 138 + dy, 18, { fill: "none", stroke: BAD, sw: 2.4 });
      b += circle(cx + dx, 138 + dy, 13, { fill: al ? FILL.verde : FILL.rosa, stroke: al ? OK : INK, sw: al ? 3 : 2 });
    }
  }
  b += T(o, 236, 30, "Traqueia", { anchor: "start" }) + T(o, 300, 82, "Brônquio", { anchor: "start" }) + T(o, 12, 112, "Bronquíolo", { anchor: "start" });
  b += T(o, 356, 190, "Alvéolos", { anchor: "start" });
  b += circle(24, 228, 7, { fill: "none", stroke: BAD, sw: 2.6 }) + T(o, 38, 233, "capilar sanguíneo", { anchor: "start", fill: BAD, weight: 600 });
  return frame(o, b + ring(o), "Esquema das vias aéreas até os alvéolos, cercados por capilares");
}

// ----------------------------------------------------------------------------- néfron
function nefron(f, o) {
  const rev = isRev(o);
  let b = `<g transform="translate(50 0)">`;
  b += circle(60, 86, 31, { fill: FILL.cinza }) + circle(60, 86, 17, { fill: FILL.sangue });
  b += `<path d="M50 86c4-8 8 8 12 0s6-6 8 0" fill="none" stroke="${INK}" stroke-width="2"/>`;
  b += arrow(6, 54, 38, 70, { stroke: RED, sw: 3 }) + (isAlt(o) ? "" : text(6, 40, "Sangue", { size: 15, anchor: "start", fill: RED }));
  const path = "M91 86L150 86L150 182L200 182L200 86L260 86L260 202";
  b += `<path d="${path}" fill="none" stroke="${INK}" stroke-width="16" stroke-linejoin="round" stroke-linecap="round"/><path d="${path}" fill="none" stroke="${FILL.amarelo}" stroke-width="11" stroke-linejoin="round" stroke-linecap="round"/>`;
  for (const x of [118, 232]) b += arrow(x, 74, x, 50, { stroke: rev ? OK : MUTED, sw: 3.2 });
  b += T(o, 175, 34, rev ? "reabsorção" : "?", { fill: rev ? OK : BAD });
  b += T(o, 60, 148, `Filtrado: ${f.filtrado}`);
  b += arrow(260, 212, 260, 230, { sw: 3 }) + T(o, 260, 246, `Urina: ${f.urina}`);
  b += `</g>`;
  return frame(o, b + ring(o), "Esquema de um néfron: filtrado e urina em partes");
}

// ----------------------------------------------------------------------------- gráfico de linhas
function grafico(f, o) {
  const alt = isAlt(o), rev = isRev(o);
  const L = 64, Rr = 424, Tp = 40, B = 188;
  const sx = (x) => L + ((x - f.x0) / (f.x1 - f.x0)) * (Rr - L), sy = (y) => B - ((y - f.y0) / (f.y1 - f.y0)) * (B - Tp);
  const fs = alt ? 34 : 15, ts = alt ? 34 : 15;
  let b = "";
  if (f.band) b += `<rect x="${L}" y="${r1(sy(f.band.hi))}" width="${Rr - L}" height="${r1(sy(f.band.lo) - sy(f.band.hi))}" fill="${FILL.verde}" opacity="0.7"/>` + (alt ? "" : text(Rr - 4, sy(f.band.hi) + 14, f.band.label, { size: ts, anchor: "end", fill: OK, weight: 600 }));
  for (const y of f.yt) b += line(L, sy(y), Rr, sy(y), { stroke: "#d9d3c2", sw: 1 }) + (alt ? "" : text(L - 8, sy(y) + 5, String(y), { size: ts, anchor: "end", weight: 600 }));
  for (const x of f.xt) b += line(sx(x), B, sx(x), B + 5, { sw: 2 }) + (alt ? "" : text(sx(x), B + 20, String(x), { size: ts, weight: 600 }));
  b += line(L, Tp - 4, L, B) + line(L, B, Rr, B);
  if (!alt) {
    b += text((L + Rr) / 2, B + 44, f.xl, { size: fs });
    b += `<text transform="rotate(-90 16 ${r1((Tp + B) / 2)})" x="16" y="${r1((Tp + B) / 2 + 5)}" font-size="${fs}" font-weight="700" fill="${INK}" text-anchor="middle">${f.yl}</text>`;
  }
  for (const m of f.marks || []) b += line(sx(m.x), Tp, sx(m.x), B, { stroke: MUTED, sw: 1.8, dash: "5 4" }) + (alt ? "" : text(sx(m.x), Tp - 8, m.label, { size: ts, fill: MUTED }));
  for (const s of f.series) b += `<path d="M${s.pts.map(([x, y]) => `${r1(sx(x))} ${r1(sy(y))}`).join("L")}" fill="none" stroke="${s.cor}" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"/>`;
  if (f.series.length > 1 && !alt) {
    let lx = L + 6;
    for (const s of f.series) { b += line(lx, 14, lx + 22, 14, { stroke: s.cor, sw: 3.6 }) + text(lx + 28, 19, s.nome, { size: fs, anchor: "start" }); lx += 28 + s.nome.length * 8.6 + 22; }
  }
  if (rev && f.hl) for (const p of f.hl.pts) {
    b += circle(sx(p.x), sy(p.y), 7, { fill: FILL.verde, stroke: OK, sw: 3 });
    if (p.l && !alt) b += text(Math.min(Math.max(sx(p.x), 100), 392), sy(p.y) - 14, p.l, { size: ts, fill: OK, halo: true });
  }
  let rg = "";
  if (o && o.hint && o.hint.gx != null) rg = hintRing(sx(o.hint.gx), sy(o.hint.gy), o.hint.r || 22);
  return frame(o, b + rg, f.label || "Gráfico");
}

// ----------------------------------------------------------------------------- neurônios e sinapse
function neuronio(f, o) {
  const rev = isRev(o);
  let b = "";
  for (const [x1, y1, x2, y2] of [[40, 94, 14, 72], [40, 126, 14, 148], [36, 110, 8, 110]]) b += line(x1, y1, x2, y2, { sw: 3 });
  b += line(84, 110, 228, 110, { sw: 3 }) + rect(108, 101, 30, 18, { fill: FILL.amarelo, rx: 7 }) + rect(150, 101, 30, 18, { fill: FILL.amarelo, rx: 7 });
  b += circle(60, 110, 25, { fill: FILL.lilas }) + circle(60, 110, 8, { fill: "#fff" });
  b += rect(228, 92, 34, 36, { fill: FILL.lilas, rx: 14 });
  for (const [x, y] of [[240, 102], [250, 112], [240, 120]]) b += circle(x, y, 5, { fill: FILL.amarelo, sw: 1.6 });
  b += line(326, 110, 348, 110, { sw: 3 }) + rect(292, 92, 34, 36, { fill: FILL.agua, rx: 14 }) + circle(372, 110, 25, { fill: FILL.agua }) + circle(372, 110, 8, { fill: "#fff" });
  for (const y of [98, 112]) b += rect(288, y, 6, 9, { fill: INK, rx: 2, sw: 1 });
  if (rev) for (const [x, y] of [[270, 103], [278, 114], [285, 105], [272, 120]]) b += circle(x, y, 4, { fill: RED, stroke: INK, sw: 1.2 });
  if (rev) b += arrow(266, 140, 288, 128, { stroke: OK, sw: 2.4 });
  b += T(o, 160, 88, "Axônio") + T(o, 245, 72, "Terminal") + T(o, 60, 162, "Corpo celular") + T(o, 40, 56, "Dendritos");
  b += line(277, 150, 277, 126, { stroke: MUTED, sw: 2 }) + T(o, 277, 172, "Fenda", { core: true });
  b += T(o, 372, 162, "Neurônio 2", { fill: MUTED, weight: 600 }) + T(o, 60, 196, "Neurônio 1", { fill: MUTED, weight: 600 });
  return frame(o, b + ring(o), "Dois neurônios separados pela fenda sináptica");
}

// ----------------------------------------------------------------------------- ciclos e cadeias de transmissão
const clip = (c, hw, hh, dx, dy) => { const t = Math.min(hw / (Math.abs(dx) || 1e-6), hh / (Math.abs(dy) || 1e-6)); return [c.x + dx * t, c.y + dy * t]; };
function ciclo(f, o) {
  const rev = isRev(o), alt = isAlt(o);
  const N = Object.fromEntries(f.nodes.map((n) => [n.id, { w: 140, h: 50, ...n }]));
  let b = "";
  for (const e of f.arrows) {
    const a = N[e.a], c = N[e.b], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy), ux = dx / d, uy = dy / d;
    const s = clip(a, a.w / 2 + 3, a.h / 2 + 3, ux, uy), t = clip(c, c.w / 2 + 6, c.h / 2 + 6, -ux, -uy);
    b += arrow(s[0], s[1], t[0], t[1], { sw: 3 });
    const lab = rev && e.rev ? e.rev : e.ask, ls = Array.isArray(lab) ? lab : lab ? [lab] : [];
    const big = lab === "?";
    ls.forEach((ln, i) => { b += T(o, (s[0] + t[0]) / 2 + (e.off ? e.off[0] : 0), (s[1] + t[1]) / 2 + (e.off ? e.off[1] : -8) + i * 17, ln, { anchor: e.anchor || "middle", halo: true, fill: big ? BAD : rev && e.rev ? OK : INK, weight: 700, core: big }); });
  }
  for (const n of Object.values(N)) {
    const s = sty(rev, f.hl === n.id, n.fill);
    b += R(n.x - n.w / 2, n.y - n.h / 2, n.w, n.h, s, 12);
    const ls = n.lines;
    ls.forEach((ln, i) => { b += T(o, n.x, n.y + (ls.length === 1 ? 5 : -2 + i * 17), ln); });
  }
  return frame(o, b + ring(o), f.label || "Esquema de transmissão");
}

// ----------------------------------------------------------------------------- vacina × soro
function vacinaSoro(f, o) {
  const rev = isRev(o);
  let b = "";
  f.cards.forEach((c, k) => {
    const x = 12 + k * 211, s = sty(rev, f.hl === c.id, c.fill);
    b += R(x, 12, 205, 222, s, 16) + T(o, x + 102, 46, c.titulo, { core: true });
    b += line(x + 14, 58, x + 191, 58, { stroke: MUTED, sw: 1.6 });
    c.linhas.forEach((ln, i) => { b += circle(x + 18, 86 + i * 34 - 5, 4, { fill: INK, sw: 1 }) + T(o, x + 30, 86 + i * 34, ln, { anchor: "start" }); });
  });
  return frame(o, b + ring(o), "Quadro comparando vacina e soro");
}

// ----------------------------------------------------------------------------- vacina de RNAm: passos embaralhados
const BOX = [[10, 20], [225, 20], [10, 128], [225, 128]];
function rnam(f, o) {
  const rev = isRev(o);
  let b = "";
  f.steps.forEach((st, i) => {
    const [x, y] = BOX[i], s = sty(rev, false, st.fill);
    b += R(x, y, 205, 84, s, 14) + circle(x + 20, y + 22, BR(o), { fill: "#fff" }) + text(x + 20, y + (isAlt(o) ? 34 : 28), st.letra, { size: BS(o) });
    st.lines.forEach((ln, j) => { b += T(o, x + 118, y + 36 + j * 20, ln); });
    if (rev) b += circle(x + 185, y + 20, BR(o) - 2, { fill: FILL.verde, stroke: OK, sw: 2.6 }) + text(x + 185, y + (isAlt(o) ? 32 : 25.5), String(st.ordem), { size: BS(o), fill: OK });
  });
  return frame(o, b + ring(o), "Quatro etapas da ação de uma vacina de RNAm, em ordem embaralhada");
}

// ----------------------------------------------------------------------------- seleção de bactérias resistentes
const dishPos = (i, n = 14) => { const a = i * 2.4, rr = 38 * Math.sqrt((i + 0.5) / n); return [rr * Math.cos(a), rr * Math.sin(a)]; };
function selecao(f, o) {
  const rev = isRev(o);
  const surv = f.antes.map((v, i) => [v, i]).filter(([v]) => v === 1).map(([, i]) => i);
  const dishes = [
    { cx: 74, t: "Antes", c: f.antes.map((v, i) => [i, v]) },
    { cx: 220, t: "Antibiótico", c: surv.map((i) => [i, 1]) },
    { cx: 366, t: "Depois", c: Array.from({ length: f.depois }, (_, i) => [i, 1]) },
  ];
  let b = "";
  dishes.forEach((d, k) => {
    b += circle(d.cx, 118, 56, { fill: "#fffdf6", stroke: rev && k === 2 ? OK : INK, sw: rev && k === 2 ? 4 : 2.2 });
    for (const [i, v] of d.c) { const [dx, dy] = dishPos(i); b += circle(d.cx + dx, 118 + dy, 6.5, { fill: v ? "#5b3f9a" : "#fff3c4", sw: 1.8 }); }
    b += T(o, d.cx, 198, d.t);
  });
  b += arrow(132, 118, 160, 118, { sw: 3 }) + arrow(278, 118, 306, 118, { sw: 3 });
  b += circle(112, 228, 7, { fill: "#fff3c4", sw: 1.8 }) + T(o, 124, 233, "sensível", { anchor: "start" });
  b += circle(250, 228, 7, { fill: "#5b3f9a", sw: 1.8 }) + T(o, 262, 233, "resistente", { anchor: "start" });
  return frame(o, b + ring(o), "Placas com bactérias sensíveis e resistentes antes e depois do antibiótico");
}

export const FIGS = {
  "corpo-digestorio": digestorio,
  "corpo-coracao": coracao,
  "corpo-circuito": circuito,
  "corpo-pulmao": pulmao,
  "corpo-nefron": nefron,
  "corpo-grafico": grafico,
  "corpo-neuronio": neuronio,
  "corpo-ciclo-parasita": ciclo,
  "corpo-vacina-soro": vacinaSoro,
  "corpo-rnam": rnam,
  "corpo-selecao": selecao,
};

// ----------------------------------------------------------------------------- dados das figuras
const F = {};
F.amido = { kind: "corpo-digestorio", hl: "boca", tube: [
  { id: "boca", nome: "Boca", subs: ["amido"] }, { id: "estomago", nome: "Estômago", subs: ["proteína"] },
  { id: "delgado", nome: "Intestino delgado", subs: ["amido", "proteína", "gordura"] }, { id: "grosso", nome: "Intestino grosso", subs: [] },
], cap: "Tubo digestório (esquema)" };
F.lipase = { kind: "corpo-digestorio", hl: "pancreas", bloqueada: { enzima: "lipase", digere: "gordura" }, cap: "O pâncreas lança a lipase no intestino" };
F.coracao = { kind: "corpo-coracao", hl: 2, chambers: [
  { n: 1, linha: "cima", entra: "corpo" }, { n: 2, linha: "cima", entra: "pulmões" },
  { n: 3, linha: "baixo", sai: "pulmões" }, { n: 4, linha: "baixo", sai: "corpo", parede: "grossa" },
], cap: "Coração em vista frontal" };
F.circuito = { kind: "corpo-circuito", hl: "B", vessels: [
  { id: "A", de: "corpo", para: "coração", o2: "pouco" }, { id: "B", de: "coração", para: "pulmões", o2: "pouco" },
  { id: "C", de: "pulmões", para: "coração", o2: "muito" }, { id: "D", de: "coração", para: "corpo", o2: "muito" },
], cap: "Setas mostram o sentido do sangue" };
F.pulmao = { kind: "corpo-pulmao", hl: "alveolos", parts: [
  { nome: "Traqueia", capilares: false }, { nome: "Brônquios", capilares: false }, { nome: "Bronquíolos", capilares: false }, { nome: "Alvéolos", capilares: true },
], cap: "Das vias aéreas aos alvéolos" };
F.nefron = { kind: "corpo-nefron", hl: "reabsorcao", filtrado: 100, urina: 1, cap: "Néfron: valores em partes" };
F.glicemia = { kind: "corpo-grafico", label: "Gráfico da glicemia após uma refeição", x0: 0, x1: 4, y0: 60, y1: 160, xt: [0, 1, 2, 3, 4], yt: [60, 80, 100, 120, 140, 160],
  xl: "Tempo após a refeição (h)", yl: "Glicemia (mg/dL)", band: { lo: 70, hi: 100, label: "normal" },
  series: [{ id: "g", nome: "Glicemia", cor: BLUE, pts: [[0, 85], [0.5, 125], [1, 150], [1.5, 125], [2, 100], [3, 85], [4, 82]] }],
  marks: [{ x: 0, label: "refeição" }], hl: { pts: [{ x: 1, y: 150, l: "pico" }, { x: 2, y: 100, l: "volta ao normal" }] }, cap: "Glicemia de uma pessoa saudável" };
F.jejum = { kind: "corpo-grafico", label: "Gráfico de insulina e glucagon durante o jejum", x0: 0, x1: 12, y0: 0, y1: 14, xt: [0, 2, 4, 6, 8, 10, 12], yt: [0, 4, 8, 12],
  xl: "Horas de jejum", yl: "Nível relativo",
  series: [
    { id: "ins", nome: "Insulina", cor: BLUE, pts: [[0, 12], [2, 8], [4, 5], [6, 3.5], [8, 2.8], [10, 2.2], [12, 2]] },
    { id: "glu", nome: "Glucagon", cor: RED, pts: [[0, 2], [2, 2.5], [4, 3], [6, 3.5], [8, 5], [10, 6.5], [12, 7.5]] },
  ], hl: { pts: [{ x: 6, y: 3.5, l: "cruzam: 6 h" }] }, cap: "Níveis relativos (unidades arbitrárias)" };
F.sinapse = { kind: "corpo-neuronio", sinapse: "química", cap: "Dois neurônios em contato" };
F.malaria = { kind: "corpo-ciclo-parasita", label: "Ciclo da malária entre pessoas e mosquito", hl: "m", nodes: [
  { id: "p1", x: 80, y: 190, lines: ["Pessoa com", "malária"], fill: FILL.sangue, papel: "hospedeiro" },
  { id: "m", x: 220, y: 52, lines: ["Mosquito"], fill: FILL.amarelo, papel: "vetor", nome: "Mosquito Anopheles (fêmea)" },
  { id: "p2", x: 360, y: 190, lines: ["Pessoa", "sadia"], fill: FILL.verde, papel: "hospedeiro" },
], arrows: [
  { a: "p1", b: "m", ask: ["pica e leva", "o parasita"], off: [-8, 0], anchor: "end" },
  { a: "m", b: "p2", ask: ["pica e passa", "o parasita"], off: [8, 0], anchor: "start" },
], cap: "O mesmo mosquito liga uma pessoa à outra" };
F.chagas = { kind: "corpo-ciclo-parasita", label: "Como o parasita da doença de Chagas passa do barbeiro à pessoa", via: "fezes", nodes: [
  { id: "b", x: 100, y: 120, lines: ["Barbeiro", "infectado"], fill: FILL.laranja },
  { id: "p", x: 340, y: 120, lines: ["Pessoa", "picada"], fill: FILL.rosa },
], arrows: [{ a: "b", b: "p", ask: "?", rev: ["fezes com o parasita", "entram na ferida"], off: [0, -10] }], cap: "Como o parasita entra no corpo?" };
F.wolbachia = { kind: "corpo-ciclo-parasita", label: "Método Wolbachia: mosquitos com bactéria e vírus da dengue", efeito: "bloqueia-virus", nodes: [
  { id: "w", x: 75, y: 56, w: 130, lines: ["Fêmea com", "Wolbachia"], fill: FILL.verde },
  { id: "l", x: 75, y: 190, w: 130, lines: ["Macho da", "cidade"], fill: FILL.cinza },
  { id: "f", x: 310, y: 56, w: 150, lines: ["Filhotes com", "a bactéria"], fill: FILL.verde },
  { id: "v", x: 310, y: 190, w: 150, lines: ["Vírus da", "dengue"], fill: FILL.sangue },
], arrows: [{ a: "w", b: "f" }, { a: "l", b: "f" }, { a: "f", b: "v", ask: "?", rev: "vírus bloqueado", off: [-10, 0], anchor: "end" }], cap: "O que a bactéria faz com o vírus?" };
F.vacinasoro = { kind: "corpo-vacina-soro", hl: "soro", necessidade: "imediata", cards: [
  { id: "vacina", titulo: "VACINA", fill: FILL.agua, inicio: "lento", ans: "Vacina, para criar memória imunológica",
    linhas: ["antígeno inofensivo", "o corpo faz anticorpos", "cria memória", "efeito mais lento"] },
  { id: "soro", titulo: "SORO", fill: FILL.amarelo, inicio: "imediato", ans: "Soro, com anticorpos prontos",
    linhas: ["anticorpos prontos", "de outro organismo", "sem memória", "efeito imediato"] },
], cap: "Duas formas de proteção" };
F.anticorpos = { kind: "corpo-grafico", label: "Gráfico de anticorpos após duas doses de vacina", x0: 0, x1: 42, y0: 0, y1: 90, xt: [0, 7, 14, 21, 28, 35, 42], yt: [0, 20, 40, 60, 80],
  xl: "Dias", yl: "Anticorpos",
  series: [{ id: "ac", nome: "Anticorpos", cor: BLUE, pts: [[0, 0], [4, 0.3], [7, 2.5], [10, 7], [14, 10], [21, 7], [28, 4], [30, 10], [32, 45], [35, 80], [42, 60]] }],
  marks: [{ x: 0, label: "1ª dose" }, { x: 28, label: "2ª dose" }], doses: [0, 28],
  hl: { pts: [{ x: 14, y: 10, l: "pico 1" }, { x: 35, y: 80, l: "pico 2" }] }, cap: "Unidades arbitrárias" };
F.rnam = { kind: "corpo-rnam", steps: [
  { letra: "D", ordem: 3, lines: ["Células produzem", "proteína viral"], fill: FILL.amarelo },
  { letra: "A", ordem: 4, lines: ["Corpo faz anticorpos", "e memória"], fill: FILL.verde },
  { letra: "C", ordem: 1, lines: ["Vacina de RNAm", "entra nas células"], fill: FILL.agua },
  { letra: "B", ordem: 2, lines: ["Células leem", "o RNAm"], fill: FILL.lilas },
], cap: "Etapas fora de ordem" };
F.selecao = { kind: "corpo-selecao", antes: [0, 0, 0, 0, 1, 0, 0, 0, 0, 0], depois: 14, cap: "Uma placa, três momentos" };
F.ascaris = { kind: "corpo-ciclo-parasita", label: "Ciclo da lombriga Ascaris entre pessoas, solo e água", via: "fecal-oral", nodes: [
  { id: "p1", x: 80, y: 196, w: 150, lines: ["Pessoa com", "lombriga"], fill: FILL.sangue },
  { id: "s", x: 220, y: 52, w: 150, lines: ["Solo, água e", "alimentos sujos"], fill: FILL.areia },
  { id: "p2", x: 360, y: 196, w: 150, lines: ["Pessoa", "sadia"], fill: FILL.verde },
], arrows: [
  { a: "p1", b: "s", ask: "ovos nas fezes", off: [-14, 2], anchor: "end" },
  { a: "s", b: "p2", ask: ["mãos e verduras", "contaminadas"], off: [14, 2], anchor: "start" },
], cap: "Os ovos saem nas fezes" };

// ----------------------------------------------------------------------------- cálculo da resposta certa, a partir dos dados da figura
const interp = (pts, x) => { for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; if (x >= x1 && x <= x2) return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1 || 1); } return pts[pts.length - 1][1]; };
const reachTime = (pts, level, from, to) => { for (let i = 0; i < pts.length - 1; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[i + 1]; if (x2 < from || x1 > to) continue; if (y1 < level && y2 >= level) return x1 + ((level - y1) * (x2 - x1)) / (y2 - y1); } return null; };
export function respostas(fq) {
  const q = {};
  q.amido = () => F.amido.tube.find((t) => t.subs.includes("amido")).nome;
  q.lipase = () => (F.lipase.bloqueada.digere === "gordura" ? "Mais gordura sai nas fezes" : "?");
  q.coracao = () => {
    const c = F.coracao.chambers.find((x) => x.n === F.coracao.hl);
    if (c.linha === "cima") return c.entra === "pulmões" ? "Átrio esquerdo" : "Átrio direito";
    return c.sai === "pulmões" ? "Ventrículo direito" : "Ventrículo esquerdo";
  };
  q.circuito = () => "Vaso " + F.circuito.vessels.find((v) => v.de === "coração" && v.o2 === "pouco").id;
  q.pulmao = () => F.pulmao.parts.find((p) => p.capilares).nome;
  q.rim = () => (F.nefron.filtrado - F.nefron.urina > F.nefron.filtrado / 2 ? "Quase tudo volta ao sangue por reabsorção" : "?");
  q.glicemia = () => {
    const pts = F.glicemia.series[0].pts, ip = pts.reduce((m, p, i) => (p[1] > pts[m][1] ? i : m), 0);
    return pts[ip + 1][1] < pts[ip][1] ? "Insulina" : "Glucagon";
  };
  q.jejum = () => {
    const [ins, glu] = F.jejum.series.map((s) => s.pts);
    const t = ins.map((p) => p[0]).find((x) => interp(glu, x) >= interp(ins, x));
    return `${t} h; o fígado libera glicose`;
  };
  q.sinapse = () => (F.sinapse.sinapse === "química" ? "Neurotransmissores atravessam a fenda" : "?");
  q.malaria = () => F.malaria.nodes.find((n) => n.papel === "vetor").nome;
  q.chagas = () => (F.chagas.via === "fezes" ? "Fezes do barbeiro entram na ferida da picada" : "?");
  q.wolbachia = () => (F.wolbachia.efeito === "bloqueia-virus" ? "A bactéria atrapalha o vírus no mosquito" : "?");
  q.vacinasoro = () => F.vacinasoro.cards.find((c) => c.inicio === "imediato").ans;
  q.curva = () => {
    const pts = F.anticorpos.series[0].pts, [d1, d2] = F.anticorpos.doses;
    const pk = (a, b) => Math.max(...pts.filter((p) => p[0] >= a && p[0] <= b).map((p) => p[1]));
    const p1 = pk(d1, d2), p2 = pk(d2, 42);
    const lag1 = reachTime(pts, p1 / 4, d1, d2) - d1, lag2 = reachTime(pts, p2 / 4, d2, 42) - d2;
    return `${p2 > p1 ? "Maior" : "Menor"}${p2 > p1 === lag2 < lag1 ? " e" : ", porém"} mais ${lag2 < lag1 ? "rápida" : "lenta"} que na 1ª dose`;
  };
  q.rnam = () => [...F.rnam.steps].sort((a, b) => a.ordem - b.ordem).map((s) => s.letra).join(" → ");
  q.selecao = () => {
    const f0 = F.selecao.antes.filter(Boolean).length / F.selecao.antes.length;
    return f0 < 1 ? "Mata as sensíveis e as resistentes proliferam" : "?";
  };
  q.ascaris = () => (F.ascaris.via === "fecal-oral" ? "Saneamento básico e lavar mãos e alimentos" : "?");
  return q;
}
export const CALC = respostas();

// ----------------------------------------------------------------------------- perguntas
const OSX = "OpenStax, Anatomy & Physiology 2e";
const mk = (d) => {
  const want = CALC[d.calc]();
  const i = d.alts.indexOf(want);
  if (i < 0) throw new Error(`${d.id}: resposta calculada "${want}" não está nas alternativas`);
  const { calc, alts, ...rest } = d;
  return { ...rest, ...(["glicemia", "jejum", "curva"].includes(calc) ? { calc: true } : {}), subj: "biologia", alts: alts.map((t) => ({ t })), correct: [i] };
};

export const QUESTIONS = [
  mk({ id: "bio-corpo-amido-boca", pat: 3, lvl: 1, calc: "amido",
    text: "Pão e arroz são ricos em amido. Em qual órgão começa a digestão química do amido?",
    fig: [F.amido], alts: ["Boca", "Estômago", "Intestino delgado", "Fígado"],
    hint: { t: "Siga o caminho do alimento passo a passo, a partir da entrada.", fig: 0, mark: { x: 185, y: 66, r: 24 } },
    why: "A amilase da saliva já quebra o amido na boca; a digestão das proteínas só começa no estômago.",
    src: "no estilo do ENEM", ref: `${OSX}, 23.7 Chemical Digestion and Absorption: A Closer Look — https://openstax.org/books/anatomy-and-physiology-2e/pages/23-7-chemical-digestion-and-absorption-a-closer-look` }),
  mk({ id: "bio-corpo-lipase-pancreas", pat: 3, lvl: 2, calc: "lipase",
    text: "Um remédio bloqueia a lipase do pâncreas. O que tende a ocorrer com a gordura da refeição?",
    fig: [F.lipase], alts: ["Mais gordura é absorvida no estômago", "A bile passa a digerir a gordura sozinha", "A gordura é digerida pela amilase", "Mais gordura sai nas fezes"],
    hint: { t: "Veja onde a lipase é lançada e o que acontece sem ela.", fig: 0, mark: { x: 233, y: 143, r: 46 } },
    why: "Sem lipase, a gordura não vira ácidos graxos absorvíveis e sai nas fezes; a bile só emulsifica, não é enzima.",
    src: "como no ENEM 2020 (inibidor da lipase)", ref: `${OSX}, 23.7 Chemical Digestion and Absorption: A Closer Look — https://openstax.org/books/anatomy-and-physiology-2e/pages/23-7-chemical-digestion-and-absorption-a-closer-look` }),
  mk({ id: "bio-corpo-coracao-camara-2", pat: 3, lvl: 1, calc: "coracao",
    text: "No esquema do coração, como se chama a câmara marcada com o número 2?",
    fig: [F.coracao], alts: ["Ventrículo direito", "Átrio direito", "Ventrículo esquerdo", "Átrio esquerdo"],
    hint: { t: "Veja o rótulo da seta que chega à câmara 2.", fig: 0, mark: { x: 378, y: 76, r: 46 } },
    why: "Átrio recebe sangue; o que chega dos pulmões entra no átrio esquerdo, que na vista frontal aparece à direita do desenho.",
    src: "no estilo do ENEM", ref: `${OSX}, 19.1 Heart Anatomy — https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy` }),
  mk({ id: "bio-corpo-arteria-venoso", pat: 3, lvl: 2, calc: "circuito",
    text: "No esquema, qual vaso é uma artéria e leva sangue pobre em oxigênio (sangue venoso)?",
    fig: [F.circuito], alts: ["Vaso B", "Vaso C", "Vaso A", "Vaso D"],
    hint: { t: "Artéria é o vaso que sai do coração. Depois confira a cor da seta.", fig: 0, mark: { x: 220, y: 124, r: 54 } },
    why: "Artéria sai do coração, seja qual for o oxigênio: a artéria pulmonar leva sangue pobre em O2 aos pulmões.",
    src: "no estilo do ENEM", ref: `${OSX}, 19.1 Heart Anatomy — https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy` }),
  mk({ id: "bio-corpo-alveolo-trocas", pat: 3, lvl: 2, calc: "pulmao",
    text: "Em qual estrutura do pulmão o oxigênio do ar passa para o sangue?",
    fig: [F.pulmao], alts: ["Traqueia", "Brônquios", "Alvéolos", "Bronquíolos"],
    hint: { t: "Compare onde os capilares (anéis vermelhos) envolvem a parede do tubo.", fig: 0, mark: { x: 150, y: 96, r: 34 } },
    why: "Os alvéolos têm parede finíssima, cercada de capilares: ali o O2 entra no sangue e o CO2 sai. Os tubos só conduzem o ar.",
    src: "no estilo do ENEM", ref: `${OSX}, 22.1 Organs and Structures of the Respiratory System — https://openstax.org/books/anatomy-and-physiology-2e/pages/22-1-organs-and-structures-of-the-respiratory-system` }),
  mk({ id: "bio-corpo-rim-reabsorcao", pat: 3, lvl: 3, calc: "rim",
    text: "Em um néfron, de cada 100 partes filtradas só 1 sai como urina. O que explica isso?",
    fig: [F.nefron], alts: ["A urina é o filtrado do glomérulo, inalterado", "A filtração acontece no túbulo coletor", "A secreção devolve a água ao sangue", "Quase tudo volta ao sangue por reabsorção"],
    hint: { t: "Compare o número do filtrado com o da urina: para onde foi a diferença?", fig: 0, mark: { x: 110, y: 144, r: 46 } },
    why: "Cerca de 99% do filtrado volta ao sangue pelos túbulos (reabsorção); só o restante vira urina.",
    src: "no estilo do ENEM", ref: `${OSX}, 25.5 Physiology of Urine Formation (99% do filtrado é devolvido à circulação) — https://openstax.org/books/anatomy-and-physiology-2e/pages/25-5-physiology-of-urine-formation` }),
  mk({ id: "bio-corpo-glicemia-insulina", pat: 3, lvl: 1, calc: "glicemia",
    text: "Depois de uma refeição, a glicemia sobe e depois desce (gráfico). Qual hormônio provoca a queda?",
    fig: [F.glicemia], alts: ["Insulina", "Glucagon", "Adrenalina", "Cortisol"],
    hint: { t: "Olhe o trecho em que a curva desce depois do pico.", fig: 0, mark: { gx: 1.5, gy: 125, r: 24 } },
    why: "A insulina faz as células captarem glicose e o fígado armazená-la; aqui a glicemia volta ao normal em cerca de 2 h.",
    src: "no estilo do ENEM", ref: `${OSX}, 17.9 The Endocrine Pancreas — https://openstax.org/books/anatomy-and-physiology-2e/pages/17-9-the-endocrine-pancreas` }),
  mk({ id: "bio-corpo-jejum-glucagon", pat: 3, lvl: 3, calc: "jejum",
    text: "No gráfico do jejum, em que hora o glucagon passa a superar a insulina, e o que o fígado faz?",
    fig: [F.jejum], alts: ["6 h; o fígado armazena glicose", "2 h; o fígado libera glicose", "10 h; o fígado armazena glicose", "6 h; o fígado libera glicose"],
    hint: { t: "Compare as duas curvas no começo e no fim do jejum.", fig: 0, mark: { gx: 10.5, gy: 4.4, r: 44 } },
    why: "Com o jejum a insulina cai e o glucagon sobe; depois do cruzamento o fígado libera glicose para manter a glicemia.",
    src: "no estilo do ENEM", ref: `${OSX}, 17.9 The Endocrine Pancreas — https://openstax.org/books/anatomy-and-physiology-2e/pages/17-9-the-endocrine-pancreas` }),
  mk({ id: "bio-corpo-sinapse-neurotransmissor", pat: 3, lvl: 2, calc: "sinapse",
    text: "Entre dois neurônios existe a fenda sináptica. Como a mensagem passa de um para o outro?",
    fig: [F.sinapse], alts: ["O impulso elétrico salta pela fenda", "Neurotransmissores atravessam a fenda", "Hormônios percorrem o sangue até o outro", "Os dois neurônios se fundem por instantes"],
    hint: { t: "Observe o que o terminal do primeiro neurônio guarda.", fig: 0, mark: { x: 262, y: 110, r: 40 } },
    why: "No terminal, vesículas liberam neurotransmissores; eles cruzam a fenda e se ligam a receptores do neurônio seguinte.",
    src: "no estilo do ENEM", ref: `${OSX}, 12.5 Communication Between Neurons — https://openstax.org/books/anatomy-and-physiology-2e/pages/12-5-communication-between-neurons` }),
  mk({ id: "bio-saude-malaria-vetor", pat: 5, lvl: 1, calc: "malaria",
    text: "Na malária, qual organismo é o vetor, isto é, leva o parasita de uma pessoa a outra?",
    fig: [F.malaria], alts: ["Protozoário Plasmodium", "Mosquito Aedes aegypti", "Mosquito Anopheles (fêmea)", "Barbeiro (triatomíneo)"],
    hint: { t: "Vetor é quem transporta: veja quem liga uma pessoa à outra.", fig: 0, mark: { x: 150, y: 125, r: 44 } },
    why: "O Plasmodium é o agente; o vetor é a fêmea do Anopheles, que o leva de pessoa a pessoa pela picada.",
    src: "no estilo do ENEM", ref: "Ministério da Saúde, Malária — https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/m/malaria" }),
  mk({ id: "bio-saude-chagas-fezes", pat: 5, lvl: 2, calc: "chagas",
    text: "Na doença de Chagas, como o Trypanosoma cruzi costuma entrar no corpo na transmissão pelo barbeiro?",
    fig: [F.chagas], alts: ["Saliva do barbeiro injeta o parasita no sangue", "Fezes do barbeiro entram na ferida da picada", "Ovos do barbeiro são engolidos com a comida", "Pelo ar, ao conversar com o doente"],
    hint: { t: "Não é como o mosquito: pense no que o barbeiro deixa na pele.", fig: 0, mark: { x: 220, y: 108, r: 40 } },
    why: "O barbeiro pica e defeca; as fezes com T. cruzi penetram pela ferida ou pelas mucosas. Não é saliva injetada como no mosquito.",
    src: "no estilo do ENEM", ref: "Ministério da Saúde, Doença de Chagas — https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/doenca-de-chagas" }),
  mk({ id: "bio-saude-wolbachia-dengue", pat: 5, lvl: 3, calc: "wolbachia",
    text: "O método Wolbachia usa mosquitos com uma bactéria. Como ele reduz os casos de dengue?",
    fig: [F.wolbachia], alts: ["A bactéria vacina as pessoas picadas", "Mosquitos transgênicos ficam estéreis", "A bactéria atrapalha o vírus no mosquito", "A bactéria mata todos os Aedes adultos"],
    hint: { t: "Veja o que acontece com o vírus dentro dos filhotes.", fig: 0, mark: { x: 310, y: 123, r: 40 } },
    why: "A Wolbachia passa da fêmea aos filhotes e bloqueia o vírus no mosquito; não é transgênico, não vacina e não mata adultos.",
    src: "no estilo do ENEM", ref: "Fiocruz/Radis, O segredo da Wolbachia — https://radis.ensp.fiocruz.br/reportagem/ciencia/o-segredo-da-wolbachia/" }),
  mk({ id: "bio-saude-vacina-soro-cobra", pat: 5, lvl: 1, calc: "vacinasoro",
    text: "Uma pessoa foi picada por cobra peçonhenta. O que se aplica para agir imediatamente?",
    fig: [F.vacinasoro], alts: ["Vacina, para criar memória imunológica", "Antibiótico, para matar o veneno", "Soro, com anticorpos prontos", "Antiviral, para bloquear o veneno"],
    hint: { t: "Compare o início do efeito nos dois quadros.", fig: 0, mark: { x: 216, y: 174, r: 74 } },
    why: "Soro traz anticorpos prontos (imunização passiva): age já, mas dura pouco. A vacina é preventiva e leva dias para fazer efeito.",
    src: "no estilo do ENEM", ref: "Ministério da Saúde, Manual dos Centros de Referência para Imunobiológicos Especiais, 3ª ed. (glossário: imunização ativa e passiva) — https://www.gov.br/saude/pt-br/vacinacao/manuais/manual_centro_referencia_imunobiologicos-1.pdf" }),
  mk({ id: "bio-saude-curva-segunda-dose", pat: 5, lvl: 2, calc: "curva",
    text: "O gráfico mostra anticorpos após duas doses de vacina (dias 0 e 28). O que a 2ª dose provoca?",
    fig: [F.anticorpos], alts: ["Menor e mais lenta que na 1ª dose", "Menor, porém mais rápida que na 1ª dose", "Maior, porém mais lenta que na 1ª dose", "Maior e mais rápida que na 1ª dose"],
    hint: { t: "Compare a altura do pico e o tempo de subida depois de cada dose.", fig: 0, mark: { gx: 32, gy: 45, r: 24 } },
    why: "Na 2ª exposição, as células de memória respondem mais depressa e produzem muito mais anticorpos (resposta secundária).",
    src: "no estilo do ENEM", ref: "OpenStax, Biology 2e, 42.2 Adaptive Immune Response (resposta secundária mais rápida e mais forte) — https://openstax.org/books/biology-2e/pages/42-2-adaptive-immune-response; Ministério da Saúde, Manual dos CRIE, 3ª ed. — https://www.gov.br/saude/pt-br/vacinacao/manuais/manual_centro_referencia_imunobiologicos-1.pdf" }),
  mk({ id: "bio-saude-rnam-ordem", pat: 5, lvl: 3, calc: "rnam",
    text: "Na vacina de RNAm contra a covid-19, qual é a ordem correta dos eventos do esquema?",
    fig: [F.rnam], alts: ["C → D → B → A", "B → C → A → D", "C → B → D → A", "A → C → B → D"],
    hint: { t: "Pense: o que precisa acontecer antes de a célula fabricar a proteína?", fig: 0, mark: { x: 217, y: 126, r: 46 } },
    why: "O RNAm entra na célula, é lido (traduzido) em proteína viral e o corpo reage com anticorpos e memória; o DNA da célula não muda.",
    src: "no estilo do ENEM", ref: "CDC, How COVID-19 vaccines work (mRNA lido pela célula, produz proteína da espícula; não entra no núcleo; anticorpos e memória) — https://www.cdc.gov/covid/vaccines/how-they-work.html" }),
  mk({ id: "bio-saude-resistencia-selecao", pat: 5, lvl: 3, calc: "selecao",
    text: "Por que o uso incorreto de antibióticos favorece o surgimento de bactérias resistentes?",
    fig: [F.selecao], alts: ["As bactérias aprendem a resistir durante o uso", "O antibiótico induz a mutação de resistência", "Mata as sensíveis e as resistentes proliferam", "O corpo do paciente fica resistente ao remédio"],
    hint: { t: "Conte quem sobrevive na placa do meio e quem se multiplica depois.", fig: 0, mark: { x: 220, y: 118, r: 62 } },
    why: "Já havia bactérias resistentes na população; o antibiótico elimina as sensíveis e elas se multiplicam. Não é aprendizado.",
    src: "no estilo do ENEM", ref: "CDC, About Antimicrobial Resistance — https://www.cdc.gov/antimicrobial-resistance/about/index.html; OPAS, Resistência antimicrobiana — https://www.paho.org/pt/topicos/resistencia-antimicrobiana" }),
  mk({ id: "bio-saude-ascaridiase-saneamento", pat: 5, lvl: 2, calc: "ascaris",
    text: "A lombriga (Ascaris) passa de pessoa a pessoa por ovos nas fezes. Qual medida mais interrompe esse ciclo?",
    fig: [F.ascaris], alts: ["Saneamento básico e lavar mãos e alimentos", "Combater o mosquito transmissor", "Tomar a vacina contra a lombriga", "Usar repelente nas áreas de mata"],
    hint: { t: "Siga o caminho dos ovos: das fezes até a boca.", fig: 0, mark: { x: 220, y: 52, r: 56 } },
    why: "Os ovos saem nas fezes e contaminam solo, água e alimentos; sem esgoto tratado e higiene, o ciclo continua.",
    src: "no estilo do ENEM", ref: "OMS, Soil-transmitted helminth infections (ovos nas fezes contaminam o solo onde falta saneamento; controle: saneamento e higiene) — https://www.who.int/news-room/fact-sheets/detail/soil-transmitted-helminth-infections" }),
];
