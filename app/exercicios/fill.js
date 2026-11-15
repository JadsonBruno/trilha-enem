// fill: frase com lacuna ___ + banco de opções.
import { esc, shuffle } from "../util.js";
import { topo, redesenhar, travar } from "./_comum.js";

export default {
  rotulo: "Complete a frase",
  render(ex, ctx) {
    const [a, b] = ex.frase.split("___");
    const ordem = shuffle(ex.opcoes.map((_, i) => i));
    ctx.est.ordem = ordem;
    return topo(ex, "Complete a frase") +
      `<p class="sentence">${esc(a)}<span class="blank" id="blank" aria-live="polite">&nbsp;</span>${esc(b)}</p>` +
      `<div class="wordbank" role="group" aria-label="Opções">${ordem.map((o) => `<button type="button" class="ochip" data-o="${o}">${esc(ex.opcoes[o])}</button>`).join("")}</div>`;
  },
  ligar(el, ex, ctx) {
    const blank = el.querySelector("#blank");
    const btns = [...el.querySelectorAll(".ochip")];
    btns.forEach((b) => b.addEventListener("click", () => {
      if (ctx.est.fechado) return;
      ctx.est.sel = +b.dataset.o;
      blank.textContent = ex.opcoes[ctx.est.sel];
      btns.forEach((x) => x.classList.toggle("sel", x === b));
      ctx.pronto(true);
    }));
  },
  conferir: (ex, est) => est.sel === ex.certa,
  revelar(el, ex, est, ok) {
    est.fechado = true;
    const blank = el.querySelector("#blank");
    blank.textContent = ex.opcoes[ex.certa];
    blank.classList.add(ok ? "right" : "wrong");
    el.querySelectorAll(".ochip").forEach((b) => {
      b.disabled = true; b.classList.remove("sel");
      if (+b.dataset.o === ex.certa) b.classList.add("right"); else if (+b.dataset.o === est.sel) b.classList.add("wrong");
    });
    redesenhar(el, ex, "reveal");
  },
  travar,
  certaTexto: (ex) => ex.opcoes[ex.certa],
  escolhaTexto: (ex, est) => (est.sel != null ? ex.opcoes[est.sel] : ""),
  auto(el, ex, est, certo) {
    const alvo = certo ? ex.certa : ex.opcoes.map((_, i) => i).find((i) => i !== ex.certa);
    el.querySelector(`.ochip[data-o="${alvo}"]`).click();
  },
};
