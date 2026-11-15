// Cores: deriva as cores das unidades a partir da cor da matéria, garantindo texto branco legível (contraste ≥ 4,5).
const hex2rgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
const rgb2hex = (r, g, b) => "#" + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, "0")).join("");
function rgb2hsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  let h = 0, s = 0;
  if (d) {
    s = d / (1 - Math.abs(2 * l - 1));
    h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
    h *= 60; if (h < 0) h += 360;
  }
  return [h, s, l];
}
function hsl2hex(h, s, l) {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return rgb2hex((r + m) * 255, (g + m) * 255, (b + m) * 255);
}
const lum = (hex) => { const [r, g, b] = hex2rgb(hex).map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
export const contrasteBranco = (hex) => 1.05 / (lum(hex) + 0.05);
// escurece até o texto branco ter contraste suficiente
export function paraBranco(hex, min = 4.6) {
  if (!/^#[0-9a-f]{6}$/i.test(hex || "")) hex = "#2a7f8f";
  let [h, s, l] = rgb2hsl(...hex2rgb(hex));
  let out = hex;
  for (let i = 0; i < 40 && contrasteBranco(out) < min; i++) { l -= 0.015; out = hsl2hex(h, s, l); }
  return out;
}
const DH = [0, 22, -22, 44, -44, 66], DL = [0, -0.02, 0.03, -0.04, 0.02, -0.03];
export function corUnidade(base, i) {
  const [h, s, l] = rgb2hsl(...hex2rgb(paraBranco(base)));
  return paraBranco(hsl2hex(h + DH[i % 6], Math.max(0.42, s), Math.min(0.5, Math.max(0.2, l + DL[i % 6]))));
}
