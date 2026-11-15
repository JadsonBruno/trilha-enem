// Peças comuns aos tipos de exercício: figuras, texto-base, cabeça da questão e alternativas de texto.
import { FIGURAS } from "../figuras/index.js";
import { esc, shuffle, LETRAS } from "../util.js";

// svg de uma figura via registro (nunca lança: figura que falha some em vez de quebrar a lição)
export function svgFig(f, { mode = "ask", size = "main", hint } = {}) {
  try { return FIGURAS[f.kind](f, { mode, size, hint }); } catch (e) { console.warn("figura falhou", f && f.kind, e); return ""; }
}
export function figuras(ex, mode = "ask") {
  if (!ex.fig || !ex.fig.length) return "";
  return `<div class="figs">${ex.fig.map((f, i) => `<figure class="fig" data-fig="${i}"><div class="fsvg">${svgFig(f, { mode })}</div>${f.cap ? `<figcaption>${esc(f.cap)}</figcaption>` : ""}</figure>`).join("")}</div>`;
}
// redesenha as figuras (modo reveal ou com dica: hint = marca da dica, aplicada só à figura hintIdx)
export function redesenhar(el, ex, mode, hintIdx = -1, hint) {
  (ex.fig || []).forEach((f, i) => {
    const alvo = el.querySelector(`[data-fig="${i}"] .fsvg`);
    if (alvo) alvo.innerHTML = svgFig(f, { mode, hint: i === hintIdx ? hint : undefined });
  });
}
export function baseHtml(ex) {
  if (!ex.base) return "";
  const b = ex.base;
  return `<blockquote class="base">${b.titulo ? `<div class="btit">${esc(b.titulo)}</div>` : ""}<p class="bt">${esc(b.texto)}</p><footer>${esc(b.fonte)}</footer></blockquote>`;
}
// cabeça da questão: rótulo, texto-base (se houver), enunciado e figuras
export function topo(ex, rotulo, mode = "ask") {
  return `<div class="qtype">${esc(rotulo)}</div>${baseHtml(ex)}<h2 class="q">${esc(ex.enunciado)}</h2>${figuras(ex, mode)}`;
}

// ---- alternativas de texto (mc e enem) ----
export function altsHtml(ex, ctx, { embaralhar }) {
  const ordem = embaralhar ? shuffle(ex.alts.map((_, i) => i)) : ex.alts.map((_, i) => i);
  ctx.est.ordem = ordem;
  return `<div class="opts" role="radiogroup" aria-label="Alternativas">${ordem.map((o, pos) => `<button type="button" class="opt" role="radio" aria-checked="false" data-o="${o}"><span class="k">${LETRAS[pos]}</span><span class="t">${esc(ex.alts[o])}</span></button>`).join("")}</div>`;
}
export function ligarAlts(el, ex, ctx) {
  const btns = [...el.querySelectorAll(".opt")];
  btns.forEach((b) => b.addEventListener("click", () => {
    if (ctx.est.fechado) return;
    ctx.est.sel = +b.dataset.o;
    btns.forEach((x) => { const on = x === b; x.classList.toggle("sel", on); x.setAttribute("aria-checked", on); });
    ctx.pronto(true);
  }));
}
export const conferirAlts = (ex, est) => est.sel === ex.certa;
export function revelarAlts(el, ex, est, ok) {
  est.fechado = true;
  el.querySelectorAll(".opt").forEach((b) => {
    const o = +b.dataset.o;
    b.disabled = true;
    if (o === ex.certa) b.classList.add("right");
    else if (o === est.sel && !ok) b.classList.add("wrong");
    b.classList.remove("sel");
  });
}
export function travar(el, est) {
  est.fechado = true;
  el.querySelectorAll("button").forEach((b) => { b.disabled = true; });
}
// clica numa alternativa de verdade (usado pelo gancho de teste)
export function autoAlts(el, ex, est, certo) {
  const alvo = certo ? ex.certa : ex.alts.map((_, i) => i).find((i) => i !== ex.certa);
  el.querySelector(`.opt[data-o="${alvo}"]`).click();
}
