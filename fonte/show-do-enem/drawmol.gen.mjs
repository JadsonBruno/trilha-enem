// GERADO por gen-drawmol.mjs a partir de trilha.js. Não editar.
import { DIRS, FCOLOR, FNAME, VAL, addAtom, addBond, adjacent, analyze, atomAt, blank, bondOf, clone, fText, fromSpec, mol, ringAtoms, ringBonds, subN, toXY } from "./chem.mjs";
const $ = (sel, el = document) => el.querySelector(sel);
const UNIT = 42;
const INK = "#1c2541";
const ELC = { C: "#3d4357", O: "#e4504a", H: "#f7f4ec" };
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;");
const r1 = (n) => Number(n.toFixed(1));
const fmtT = (t) => (t === null || t === undefined ? "—" : `${String(Math.abs(t) < 1 && t !== 0 ? t.toFixed(1) : Math.round(t)).replace("-", "−").replace(".", ",")} °C`);
const capFirst = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const FORDER = ["alcool", "fenol", "eter", "aldeido", "cetona", "acido", "ester"];
// ----------------------------------------------------------------------------- desenho de moléculas (bolas, traços, bastão)
const xyOf = (a) => toXY(a.q, a.r);
function labelOf(A, a, view, xy) {
  const h = A.info[a.id].h;
  const nbs = A.nb[a.id];
  const allRight = nbs.length > 0 && nbs.every((x) => xy[x.id][0] > xy[a.id][0] + 0.01);
  if (a.el === "O") return h ? (allRight ? "HO" : "OH") : "O";
  if ((view === "bastao" || (view === "tracos" && A.rings.some((r) => r.includes(a.id)))) && nbs.length) return null;
  const hs = h ? "H" + (h > 1 ? subN(h) : "") : "";
  if (!hs) return "C";
  return allRight ? hs + "C" : "C" + hs;
}
function freeDirs(m, a) {
  const used = m.bonds.filter((b) => b.a === a.id || b.b === a.id).map((b) => {
    const o = m.atoms.find((x) => x.id === (b.a === a.id ? b.b : b.a));
    return DIRS.findIndex(([dq, dr]) => a.q + dq === o.q && a.r + dr === o.r);
  });
  const free = [0, 1, 2, 3, 4, 5].filter((k) => !used.includes(k));
  const gap = (k) => (used.length ? Math.min(...used.map((j) => Math.min((k - j + 6) % 6, (j - k + 6) % 6))) : 3);
  // espalha: primeiro as direções mais longe das ligações, depois as mais longe umas das outras
  const out = [];
  const pool = [...free];
  while (pool.length) {
    pool.sort((p, q) => {
      const sp = gap(p) + (out.length ? Math.min(...out.map((j) => Math.min((p - j + 6) % 6, (j - p + 6) % 6))) : 0);
      const sq = gap(q) + (out.length ? Math.min(...out.map((j) => Math.min((q - j + 6) % 6, (j - q + 6) % 6))) : 0);
      return sq - sp;
    });
    out.push(pool.shift());
  }
  return out;
}
// opt: view, groups (para auréolas), tags (escrever o nome da função), box ([x0,y0,x1,y1] em unidades), grid, sel, unit, pad, bad
function drawMol(m, A, opt = {}) {
  const view = opt.view || "bastao";
  if (opt.groups === "all") opt = { ...opt, groups: A.groups };
  const U = opt.unit || UNIT;
  const xy = Object.fromEntries(m.atoms.map((a) => [a.id, xyOf(a)]));
  let box = opt.box;
  if (!box) {
    const xs = m.atoms.map((a) => xy[a.id][0]), ys = m.atoms.map((a) => xy[a.id][1]);
    const pad = opt.pad ?? (view === "bolas" ? 1.05 : 0.75);
    box = xs.length ? [Math.min(...xs) - pad, Math.min(...ys) - pad, Math.max(...xs) + pad, Math.max(...ys) + pad] : [-2, -1, 2, 1];
  }
  const W = (box[2] - box[0]) * U, H = (box[3] - box[1]) * U;
  const P = ([x, y]) => [r1((x - box[0]) * U), r1((y - box[1]) * U)];
  let s = "";
  // grade de pontos (montador)
  if (opt.grid) {
    for (let q = -14; q <= 14; q++) for (let r = -14; r <= 14; r++) {
      const [x, y] = toXY(q, r);
      if (x < box[0] + 0.3 || x > box[2] - 0.3 || y < box[1] + 0.3 || y > box[3] - 0.3) continue;
      const [px, py] = P([x, y]);
      s += `<circle cx="${px}" cy="${py}" r="2.6" fill="#d6ccb6"/>`;
    }
  }
  // auréolas das funções
  for (const g of opt.groups || []) {
    const col = FCOLOR[g.func] || "#999";
    for (const b of m.bonds) if (g.atoms.includes(b.a) && g.atoms.includes(b.b)) { const [x1, y1] = P(xy[b.a]), [x2, y2] = P(xy[b.b]); s += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${col}" stroke-opacity=".32" stroke-width="${r1(U * 0.78)}" stroke-linecap="round"/>`; }
    for (const id of g.atoms) { const [x, y] = P(xy[id]); s += `<circle cx="${x}" cy="${y}" r="${r1(U * 0.42)}" fill="${col}" fill-opacity=".32" stroke="${col}" stroke-width="2"/>`; }
  }
  const labels = Object.fromEntries(m.atoms.map((a) => [a.id, view === "bolas" ? null : labelOf(A, a, view, xy)]));
  const rad = (id) => (labels[id] ? (labels[id].length <= 1 ? 0.26 : 0.38) : 0);
  // ligações
  for (const b of m.bonds) {
    const [ax, ay] = xy[b.a], [bx, by] = xy[b.b];
    const dx = bx - ax, dy = by - ay, L0 = Math.hypot(dx, dy), ux = dx / L0, uy = dy / L0, nx = -uy, ny = ux;
    const s0 = view === "bolas" ? 0 : rad(b.a), s1 = view === "bolas" ? 0 : rad(b.b);
    const p1 = [ax + ux * s0, ay + uy * s0], p2 = [bx - ux * s1, by - uy * s1];
    const offs = b.o === 1 ? [0] : b.o === 2 ? [-1, 1] : [-1.6, 0, 1.6];
    const gap = view === "bolas" ? 0.09 : 0.07;
    for (const o of offs) {
      const [x1, y1] = P([p1[0] + nx * gap * o, p1[1] + ny * gap * o]), [x2, y2] = P([p2[0] + nx * gap * o, p2[1] + ny * gap * o]);
      if (view === "bolas") s += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="${b.o === 1 ? 7 : 5}" stroke-linecap="round"/><path d="M${x1} ${y1}L${x2} ${y2}" stroke="${b.o > 1 ? "#f2b63c" : "#c3cad8"}" stroke-width="${b.o === 1 ? 4.2 : 2.6}" stroke-linecap="round"/>`;
      else s += `<path d="M${x1} ${y1}L${x2} ${y2}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`;
    }
  }
  // átomos
  for (const a of m.atoms) {
    const [x, y] = P(xy[a.id]);
    if (view === "bolas") {
      const h = A.info[a.id].h;
      const dirs = freeDirs(m, a).slice(0, h);
      for (const k of dirs) {
        const [hx0, hy0] = toXY(a.q + DIRS[k][0] * 0.62, a.r + DIRS[k][1] * 0.62);
        const [hx, hy] = P([hx0, hy0]);
        s += `<path d="M${x} ${y}L${hx} ${hy}" stroke="${INK}" stroke-width="5" stroke-linecap="round"/><path d="M${x} ${y}L${hx} ${hy}" stroke="#c3cad8" stroke-width="2.6" stroke-linecap="round"/><circle cx="${hx}" cy="${hy}" r="${r1(U * 0.17)}" fill="${ELC.H}" stroke="${INK}" stroke-width="1.6"/><circle cx="${r1(hx - U * 0.05)}" cy="${r1(hy - U * 0.05)}" r="${r1(U * 0.05)}" fill="#fff"/>`;
      }
      const rr = a.el === "C" ? U * 0.27 : U * 0.25;
      s += `<circle cx="${x}" cy="${y}" r="${r1(rr)}" fill="${ELC[a.el]}" stroke="${INK}" stroke-width="1.8"/><circle cx="${r1(x - rr * 0.35)}" cy="${r1(y - rr * 0.38)}" r="${r1(rr * 0.3)}" fill="#fff" fill-opacity=".45"/>`;
      if (opt.letters) s += `<text x="${x}" y="${r1(y + 4.5)}" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">${a.el}</text>`;
    } else if (labels[a.id]) {
      const t = labels[a.id];
      const col = a.el === "O" ? "#c23a30" : INK;
      s += `<text x="${x}" y="${r1(y + 6)}" text-anchor="middle" font-size="${r1(U * 0.42)}" font-weight="700" fill="${col}" font-family="Trebuchet MS, sans-serif">${esc(t)}</text>`;
    }
    if (opt.sel === a.id) s += `<circle cx="${x}" cy="${y}" r="${r1(U * 0.43)}" fill="none" stroke="#e08a2f" stroke-width="3" stroke-dasharray="5 4"/>`;
    if (opt.bad === a.id) s += `<circle cx="${x}" cy="${y}" r="${r1(U * 0.45)}" fill="none" stroke="#c23a30" stroke-width="3.2"/>`;
  }
  // nome da função escrito perto do grupo
  if (opt.tags) {
    const cx = m.atoms.reduce((t, a) => t + xy[a.id][0], 0) / m.atoms.length, cy = m.atoms.reduce((t, a) => t + xy[a.id][1], 0) / m.atoms.length;
    for (const g of opt.groups || []) {
      const gx = g.atoms.reduce((t, id) => t + xy[id][0], 0) / g.atoms.length, gy = g.atoms.reduce((t, id) => t + xy[id][1], 0) / g.atoms.length;
      let dx = gx - cx, dy = gy - cy; const L0 = Math.hypot(dx, dy) || 1; dx /= L0; dy /= L0;
      const [tx, ty] = P([gx + dx * 1.0, gy + dy * 1.0 + 0.1]);
      s += `<text x="${tx}" y="${ty}" text-anchor="middle" font-size="12.5" font-weight="700" fill="${FCOLOR[g.func]}" stroke="#fffdf6" stroke-width="4" paint-order="stroke" font-family="Trebuchet MS, sans-serif">${esc(FNAME[g.func])}</text>`;
    }
  }
  return { svg: `<svg viewBox="0 0 ${r1(W)} ${r1(H)}" width="${r1(W)}" role="img" aria-label="${esc(opt.label || "molécula")}" xmlns="http://www.w3.org/2000/svg">${s}</svg>`, box, W, H };
}

export { drawMol, r1, esc };
