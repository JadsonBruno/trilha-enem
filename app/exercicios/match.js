// match: duas colunas embaralhadas; toque um de cada lado. Par errado treme; o exercício conta como errado (uma vez) mas segue até completar.
import { esc, shuffle } from "../util.js";
import { topo, redesenhar } from "./_comum.js";

export default {
  rotulo: "Ligue os pares",
  render(ex, ctx) {
    const n = ex.pares.length, idx = [...Array(n).keys()];
    ctx.est.esq = shuffle(idx); ctx.est.dir = shuffle(idx);
    ctx.est.feitos = new Set(); ctx.est.errou = false; ctx.est.tentativas = 0;
    const col = (lado, ordem, k) => `<div class="mcol" role="group" aria-label="${lado}">${ordem.map((i) => `<button type="button" class="tile" data-l="${k}" data-i="${i}">${esc(ex.pares[i][k])}</button>`).join("")}</div>`;
    return topo(ex, "Ligue os pares") + `<p class="muted dica-uso">Toque num item de cada coluna para formar o par.</p><div class="match">${col("Coluna da esquerda", ctx.est.esq, 0)}${col("Coluna da direita", ctx.est.dir, 1)}</div>`;
  },
  ligar(el, ex, ctx) {
    const est = ctx.est;
    let selE = null, selD = null;
    const tile = (l, i) => el.querySelector(`.tile[data-l="${l}"][data-i="${i}"]`);
    el.querySelectorAll(".tile").forEach((b) => b.addEventListener("click", () => {
      if (est.fechado || b.classList.contains("done")) return;
      const l = +b.dataset.l, i = +b.dataset.i;
      if (l === 0) { selE = selE === i ? null : i; } else { selD = selD === i ? null : i; }
      el.querySelectorAll('.tile[data-l="0"]').forEach((x) => x.classList.toggle("sel", selE != null && +x.dataset.i === selE));
      el.querySelectorAll('.tile[data-l="1"]').forEach((x) => x.classList.toggle("sel", selD != null && +x.dataset.i === selD));
      if (selE == null || selD == null) return;
      est.tentativas++;
      const a = tile(0, selE), d = tile(1, selD);
      if (selE === selD) {
        est.feitos.add(selE);
        [a, d].forEach((x) => { x.classList.remove("sel", "shake"); x.classList.add("done"); x.disabled = true; });
        if (est.feitos.size === ex.pares.length) ctx.pronto(true);
      } else {
        est.errou = true;
        [a, d].forEach((x) => { x.classList.remove("sel"); x.classList.remove("shake"); void x.offsetWidth; x.classList.add("shake"); setTimeout(() => x.classList.remove("shake"), 450); });
      }
      selE = selD = null;
    }));
  },
  conferir: (ex, est) => !est.errou && est.feitos.size === ex.pares.length,
  revelar(el, ex, est, ok) {
    est.fechado = true;
    el.querySelectorAll(".tile").forEach((b) => { b.disabled = true; b.classList.remove("sel"); });
    redesenhar(el, ex, "reveal");
  },
  travar(el, est) { est.fechado = true; el.querySelectorAll(".tile").forEach((b) => { b.disabled = true; }); },
  certaTexto: (ex) => ex.pares.map((p) => `${p[0]} = ${p[1]}`).join(" · "),
  escolhaTexto: () => "",
  auto(el, ex, est, certo) {
    const clic = (l, i) => el.querySelector(`.tile[data-l="${l}"][data-i="${i}"]`).click();
    if (!certo) { clic(0, 0); clic(1, 1); } // par errado de propósito
    ex.pares.forEach((_, i) => { clic(0, i); clic(1, i); });
  },
};
