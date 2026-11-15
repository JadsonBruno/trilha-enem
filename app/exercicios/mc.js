// mc: múltipla escolha de texto (A–D), alternativas embaralhadas; figura de ex.fig acima.
import { esc } from "../util.js";
import { topo, altsHtml, ligarAlts, conferirAlts, revelarAlts, autoAlts, redesenhar, travar } from "./_comum.js";

export default {
  rotulo: "Escolha a certa",
  render: (ex, ctx) => topo(ex, "Escolha a certa") + altsHtml(ex, ctx, { embaralhar: true }),
  ligar: ligarAlts,
  conferir: conferirAlts,
  revelar(el, ex, est, ok) { revelarAlts(el, ex, est, ok); redesenhar(el, ex, "reveal"); },
  travar,
  certaTexto: (ex) => ex.alts[ex.certa],
  escolhaTexto: (ex, est) => (est.sel != null ? ex.alts[est.sel] : ""),
  auto: autoAlts,
};
