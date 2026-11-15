// Base comum dos desenhos de Biologia: o mesmo traço da trilha (papel creme, contorno azul-marinho, cores suaves).
// Todo renderizador de bio-*.mjs usa estes ajudantes para as figuras saírem iguais entre os temas.
export const INK = "#1c2541";
export const MUTED = "#6b7191";
export const HINT = "#e08a2f"; // anel tracejado da dica do professor (classe hintring)
export const OK = "#2f9a54";
export const BAD = "#c23a30";
export const BIO = "#4c9a3c"; // cor da matéria
// cores suaves para preencher (sempre com contorno INK)
export const FILL = { verde: "#cfe8c4", folha: "#9fd18a", agua: "#cde3f5", sangue: "#f6c9c4", amarelo: "#ffe4a6", lilas: "#e2d6f5", cinza: "#e6e2d8", laranja: "#fbd5b5", rosa: "#f8d3e3", areia: "#efe3c8" };
// nucleotídeos e genótipos com cor fixa em todas as figuras
export const BASE = { A: "#e4504a", T: "#3d8fd1", U: "#8e6fd6", G: "#2f9a54", C: "#e3a21a" };

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
export const r1 = (n) => Number(n.toFixed(1));
// moldura: viewBox sem width/height fixos (o cartão do jogo dimensiona)
export const svg = (w, h, body, label = "figura") => `<svg viewBox="0 0 ${r1(w)} ${r1(h)}" role="img" aria-label="${esc(label)}" xmlns="http://www.w3.org/2000/svg" font-family="Trebuchet MS, Segoe UI, sans-serif">${body}</svg>`;
export const text = (x, y, s, { size = 14, weight = 700, fill = INK, anchor = "middle", halo = false } = {}) =>
  `<text x="${r1(x)}" y="${r1(y)}" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}"${halo ? ` stroke="#fffdf6" stroke-width="4" paint-order="stroke"` : ""}>${esc(s)}</text>`;
export const rect = (x, y, w, h, { fill = "#fff", rx = 8, stroke = INK, sw = 2 } = {}) => `<rect x="${r1(x)}" y="${r1(y)}" width="${r1(w)}" height="${r1(h)}" rx="${rx}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
export const circle = (x, y, r, { fill = "#fff", stroke = INK, sw = 2 } = {}) => `<circle cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
export const line = (x1, y1, x2, y2, { stroke = INK, sw = 2.2, dash = "" } = {}) => `<path d="M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round"${dash ? ` stroke-dasharray="${dash}"` : ""}/>`;
// seta com ponta (fluxo de energia, transcrição, etc.)
export const arrow = (x1, y1, x2, y2, { stroke = INK, sw = 2.2 } = {}) => {
  const a = Math.atan2(y2 - y1, x2 - x1), h = 8;
  const p = (t) => `${r1(x2 - h * Math.cos(a + t))} ${r1(y2 - h * Math.sin(a + t))}`;
  return `${line(x1, y1, x2, y2, { stroke, sw })}<path d="M${p(0.45)}L${r1(x2)} ${r1(y2)}L${p(-0.45)}" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>`;
};
// anel da dica do professor em volta de um ponto
export const hintRing = (x, y, r = 18) => `<circle class="hintring" cx="${r1(x)}" cy="${r1(y)}" r="${r1(r)}" fill="none" stroke="${HINT}" stroke-width="3.2" stroke-dasharray="5 4"/>`;
