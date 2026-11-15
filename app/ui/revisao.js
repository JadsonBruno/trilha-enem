// Aba Revisão: questões erradas vencidas hoje (caixas hoje → 1 → 3 → 7 → 16 dias) e lista das próximas.
import { esc, plural } from "../util.js";
import { S, vencidas, proximas, rotuloData, INTERVALOS } from "../estado.js";
import { IDX, existeEx } from "../conteudo.js";
import { abrirRevisao } from "./sessao.js";

const curto = (t, n = 80) => (t.length > n ? t.slice(0, n - 1) + "…" : t);

export function contarVencidas() { return vencidas(existeEx).length; }

export function renderRevisao(raiz) {
  const venc = vencidas(existeEx), prox = proximas(existeEx);
  const total = Object.keys(S.review).filter(existeEx).length;
  const sess = Math.min(10, venc.length);
  const porData = new Map();
  for (const p of prox) { if (!porData.has(p.due)) porData.set(p.due, []); porData.get(p.due).push(p); }
  const lista = [...porData.entries()].map(([d, itens]) => `<div class="card"><div class="row between"><b>${esc(rotuloData(d))}</b><span class="pill">${itens.length} ${plural(itens.length, "questão", "questões")}</span></div>
      <ul class="rlist">${itens.slice(0, 5).map((p) => { const e = IDX.exercicios.get(p.id); return `<li><span class="dotm" style="background:${e.mat.corTexto}" aria-hidden="true"></span>${esc(curto(e.ex.enunciado))} <span class="muted">· ${esc(e.mat.nome)}</span></li>`; }).join("")}${itens.length > 5 ? `<li class="muted">e mais ${itens.length - 5}…</li>` : ""}</ul></div>`).join("");
  raiz.innerHTML = `<div class="hero"><h1>Revisão</h1><p>As questões que você errou voltam em intervalos crescentes: hoje, depois ${INTERVALOS.slice(1).join(", ").replace(/, (\d+)$/, " e $1")} dias. Acertou, sobe de intervalo. Errou, volta para hoje.</p></div>
    <div class="card stack">${venc.length
      ? `<div><b>${venc.length} ${plural(venc.length, "questão vencida", "questões vencidas")} hoje</b><p class="muted">Cada sessão traz até 10 questões.</p></div><button type="button" class="btn go wide" id="btnRevisar">Revisar (${sess})</button>`
      : `<div class="empty"><b>${total ? "Tudo em dia por hoje." : "Nada para revisar ainda."}</b><p class="muted">${total ? "As próximas aparecem abaixo." : "Quando você errar uma questão, ela volta aqui."}</p></div>`}</div>
    ${prox.length ? `<h2 class="sec">Próximas</h2><div class="stack">${lista}</div>` : ""}`;
  const b = raiz.querySelector("#btnRevisar");
  if (b) b.addEventListener("click", abrirRevisao);
}
