// mc-figura: grade 2×2 de figuras (size "alt", ~150 px) com legenda `cap`.
import { esc, shuffle, LETRAS } from "../util.js";
import { svgFig, topo, conferirAlts, revelarAlts, autoAlts, travar } from "./_comum.js";

export default {
  rotulo: "Qual figura?",
  render(ex, ctx) {
    const ordem = shuffle(ex.alts.map((_, i) => i));
    ctx.est.ordem = ordem;
    const cel = (o, pos) => {
      const a = ex.alts[o];
      // a legenda costuma entregar a resposta (ex.: "Etanal" numa pergunta de aldeído): só aparece antes de responder com ex.altCap
      const cap = a.cap ? `<span class="cap"${ex.altCap ? "" : " hidden"}>${esc(a.cap)}</span>` : "";
      return `<button type="button" class="opt altfig" role="radio" aria-checked="false" data-o="${o}" aria-label="Alternativa ${LETRAS[pos]}${a.cap && ex.altCap ? ": " + esc(a.cap) : ""}"><span class="k">${LETRAS[pos]}</span><span class="fsvg" data-alt="${o}">${svgFig(a.fig, { size: "alt" })}</span>${cap}</button>`;
    };
    return topo(ex, "Qual figura?") + `<div class="altgrid" role="radiogroup" aria-label="Alternativas">${ordem.map(cel).join("")}</div>`;
  },
  ligar(el, ex, ctx) {
    const btns = [...el.querySelectorAll(".opt")];
    btns.forEach((b) => b.addEventListener("click", () => {
      if (ctx.est.fechado) return;
      ctx.est.sel = +b.dataset.o;
      btns.forEach((x) => { const on = x === b; x.classList.toggle("sel", on); x.setAttribute("aria-checked", on); });
      ctx.pronto(true);
    }));
  },
  conferir: conferirAlts,
  revelar(el, ex, est, ok) {
    revelarAlts(el, ex, est, ok);
    el.querySelectorAll(".cap[hidden]").forEach((c) => (c.hidden = false));
    ex.alts.forEach((a, o) => { const alvo = el.querySelector(`[data-alt="${o}"]`); if (alvo) alvo.innerHTML = svgFig(a.fig, { mode: "reveal", size: "alt" }); });
    (ex.fig || []).forEach((f, i) => { const alvo = el.querySelector(`[data-fig="${i}"] .fsvg`); if (alvo) alvo.innerHTML = svgFig(f, { mode: "reveal" }); });
  },
  travar,
  certaTexto: (ex) => { const a = ex.alts[ex.certa]; return a.cap || "a figura destacada"; },
  escolhaTexto: (ex, est) => { const a = est.sel != null ? ex.alts[est.sel] : null; return a ? a.cap || "figura " + LETRAS[est.ordem.indexOf(est.sel)] : ""; },
  auto: autoAlts,
};
