// Registro de figuras: FIGURAS[kind](fig, { mode, size, hint }) → "<svg viewBox=…>".
// Os renderizadores vêm do Show do ENEM (cópia em fonte/, só leitura). Kind novo = renderizador novo + uma linha aqui.
// O motor não sabe de matéria: só pede a figura pelo kind.
import { SUBJECT as QUIMICA } from "../../fonte/show-do-enem/quimica.mjs";
import { SUBJECT as BIOLOGIA } from "../../fonte/show-do-enem/biologia.mjs";
import { SUBJECT as LINGUAGENS } from "../../fonte/show-do-enem/linguagens.mjs";

// Largura que a figura ocupa numa tela de 390 px (o CSS do motor respeita estes limites).
export const LARGURA = { main: 310, alt: 150 };
export const LETRA_MIN = 11.5; // px reais
const ALVO = 12.2; // folga: a figura de cartão chega a ~298 px de largura

// Sobe todo font-size abaixo do necessário para dar ≥ 11,8 px reais na largura mostrada.
export function letraMinima(svg, size = "main") {
  const m = /viewBox="\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)"/.exec(svg);
  if (!m) return svg;
  const min = (ALVO * +m[3]) / (LARGURA[size] || LARGURA.main);
  const fix = (v) => String(Math.round(Math.max(+v, min) * 10) / 10);
  return svg
    .replace(/font-size="([\d.]+)(px)?"/g, (_, v) => `font-size="${fix(v)}"`)
    .replace(/font-size:\s*([\d.]+)(px)?/g, (_, v) => `font-size:${fix(v)}px`);
}

const BRUTOS = { ...QUIMICA.FIGS, ...BIOLOGIA.FIGS, ...LINGUAGENS.FIGS };
export const FIGURAS = Object.fromEntries(
  Object.entries(BRUTOS).map(([k, f]) => [k, (fig, opts = {}) => letraMinima(f(fig, opts), opts.size)]),
);
