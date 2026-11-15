// order: toque para montar a sequência (banco → linha de resposta; toque na linha para devolver).
import { esc, shuffle } from "../util.js";
import { topo, redesenhar } from "./_comum.js";

export default {
  rotulo: "Ponha em ordem",
  render(ex, ctx) {
    ctx.est.pool = shuffle(ex.itens.map((_, i) => i));
    // garante que o embaralhado não já esteja na ordem certa
    if (ctx.est.pool.every((v, k) => v === k)) ctx.est.pool.reverse();
    ctx.est.seq = [];
    return topo(ex, "Ponha em ordem") + `<p class="muted dica-uso">Toque nos itens na ordem certa. Toque num item da linha para devolvê-lo.</p><ol class="answer-line" id="linha" aria-label="Sua sequência"></ol><div class="pool" id="pool" aria-label="Itens"></div>`;
  },
  ligar(el, ex, ctx) {
    const est = ctx.est, linha = el.querySelector("#linha"), pool = el.querySelector("#pool");
    function desenhar() {
      linha.innerHTML = est.seq.map((i, k) => `<li><button type="button" class="ochip" data-lin="${k}"><span class="n">${k + 1}</span>${esc(ex.itens[i])}</button></li>`).join("") || `<li class="vazio muted">Sua sequência aparece aqui.</li>`;
      pool.innerHTML = est.pool.map((i) => `<button type="button" class="ochip" data-i="${i}">${esc(ex.itens[i])}</button>`).join("");
      ctx.pronto(est.seq.length === ex.itens.length);
    }
    el.addEventListener("click", (e) => {
      if (est.fechado) return;
      const b = e.target.closest(".ochip");
      if (!b) return;
      if (b.dataset.i != null) { const i = +b.dataset.i; est.pool = est.pool.filter((x) => x !== i); est.seq.push(i); }
      else if (b.dataset.lin != null) { const k = +b.dataset.lin; const [i] = est.seq.splice(k, 1); est.pool.push(i); }
      desenhar();
    });
    est.desenhar = desenhar;
    desenhar();
  },
  conferir: (ex, est) => est.seq.length === ex.itens.length && est.seq.every((v, k) => v === k),
  revelar(el, ex, est, ok) {
    est.fechado = true;
    const linha = el.querySelector("#linha");
    el.querySelector("#pool").innerHTML = "";
    linha.classList.add(ok ? "right" : "wrong");
    linha.innerHTML = est.seq.map((i, k) => `<li><span class="ochip ${i === k ? "right" : "wrong"}"><span class="n">${k + 1}</span>${esc(ex.itens[i])}</span></li>`).join("");
    if (!ok) linha.insertAdjacentHTML("afterend", `<div class="analise"><b>Ordem certa</b><ol>${ex.itens.map((t) => `<li>${esc(t)}</li>`).join("")}</ol></div>`);
    redesenhar(el, ex, "reveal");
  },
  travar(el, est) { est.fechado = true; el.querySelectorAll("button").forEach((b) => { b.disabled = true; }); },
  certaTexto: (ex) => ex.itens.join(" → "),
  escolhaTexto: (ex, est) => est.seq.map((i) => ex.itens[i]).join(" → "),
  auto(el, ex, est, certo) {
    const ordem = ex.itens.map((_, i) => i);
    if (!certo) ordem.reverse();
    ordem.forEach((i) => el.querySelector(`#pool .ochip[data-i="${i}"]`).click());
  },
};
