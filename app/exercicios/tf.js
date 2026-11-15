// tf: afirmação (o enunciado) + figura/base + botões Verdadeiro / Falso.
import { topo, redesenhar, travar } from "./_comum.js";

export default {
  rotulo: "Verdadeiro ou falso?",
  render: (ex) => topo(ex, "Verdadeiro ou falso?") + `<div class="tf" role="radiogroup" aria-label="Resposta"><button type="button" class="opt" role="radio" aria-checked="false" data-v="1">Verdadeiro</button><button type="button" class="opt" role="radio" aria-checked="false" data-v="0">Falso</button></div>`,
  ligar(el, ex, ctx) {
    const btns = [...el.querySelectorAll(".opt")];
    btns.forEach((b) => b.addEventListener("click", () => {
      if (ctx.est.fechado) return;
      ctx.est.sel = b.dataset.v === "1";
      btns.forEach((x) => { const on = x === b; x.classList.toggle("sel", on); x.setAttribute("aria-checked", on); });
      ctx.pronto(true);
    }));
  },
  conferir: (ex, est) => est.sel === ex.certa,
  revelar(el, ex, est, ok) {
    est.fechado = true;
    el.querySelectorAll(".opt").forEach((b) => {
      const v = b.dataset.v === "1";
      b.disabled = true; b.classList.remove("sel");
      if (v === ex.certa) b.classList.add("right"); else if (v === est.sel) b.classList.add("wrong");
    });
    redesenhar(el, ex, "reveal");
  },
  travar,
  certaTexto: (ex) => (ex.certa ? "Verdadeiro" : "Falso"),
  escolhaTexto: (ex, est) => (est.sel == null ? "" : est.sel ? "Verdadeiro" : "Falso"),
  auto(el, ex, est, certo) { el.querySelector(`.opt[data-v="${(certo ? ex.certa : !ex.certa) ? 1 : 0}"]`).click(); },
};
