// enem: texto-base estilo papel de prova + alternativas A–E de frase; depois de responder mostra a análise da escolhida.
import { esc } from "../util.js";
import { topo, altsHtml, ligarAlts, conferirAlts, revelarAlts, autoAlts, redesenhar, travar } from "./_comum.js";

export default {
  rotulo: "Estilo ENEM",
  render: (ex, ctx) => `<span class="tagenem">estilo ENEM</span>` + topo(ex, "Leia e responda") + altsHtml(ex, ctx, { embaralhar: false }) + `<div class="analise" id="analise" hidden></div>`,
  ligar: ligarAlts,
  conferir: conferirAlts,
  revelar(el, ex, est, ok) {
    revelarAlts(el, ex, est, ok);
    redesenhar(el, ex, "reveal");
    const a = ex.analise && ex.analise[est.sel];
    const box = el.querySelector("#analise");
    if (a && box) { box.hidden = false; box.innerHTML = `<b>Sobre a sua escolha</b><p>${esc(a)}</p>`; }
  },
  travar,
  certaTexto: (ex) => ex.alts[ex.certa],
  escolhaTexto: (ex, est) => (est.sel != null ? ex.alts[est.sel] : ""),
  auto: autoAlts,
};
