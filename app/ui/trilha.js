// Aba Trilha: seletor de matéria, unidades com blocos de lição em zigue-zague e o bloco "Desafio" no fim de cada unidade.
import { esc, plural } from "../util.js";
import { S, xpHoje } from "../estado.js";
import { IDX, materiaAtual, feita, destravada, proximaLicao, desafioLiberado, licoesFeitasUnidade } from "../conteudo.js";
import { ICON, ROTULO_CARTAO } from "../icones.js";
import { chipsMateria, ligarChips, abrirModal, toast } from "./comum.js";
import { abrirLicao, abrirDesafio } from "./sessao.js";

const ZIGUE = [0, 46, 66, 46, 0, -46, -66, -46];

export function renderTrilha(raiz, aoMudarMateria) {
  const m = materiaAtual();
  if (!m) { raiz.innerHTML = `<div class="empty card"><h2>Sem conteúdo</h2><p class="muted">Nenhuma matéria foi carregada neste build.</p></div>`; return; }
  const seq = IDX.porMateria.get(m.id), atual = proximaLicao(m);
  const feitas = seq.filter(feita).length;
  const unidades = m.unidades.map((u) => {
    const blocos = u.licoes.map((l, k) => {
      const f = feita(l), liv = destravada(l), cur = l === atual;
      const est = f ? "done" : cur ? "cur" : liv ? "open" : "locked";
      const rot = f ? "feita" : liv ? (cur ? "pronta para começar" : "disponível") : "bloqueada";
      const d = S.done[l.id];
      return `<div class="stop" style="transform:translateX(${ZIGUE[k % ZIGUE.length]}px)">${cur ? `<div class="start-tip">Começar</div>` : ""}
        <button type="button" class="brick ${est}" data-licao="${esc(l.id)}" aria-label="Lição ${l.n}: ${esc(l.titulo)} (${rot})" ${liv ? "" : 'aria-disabled="true"'}>${f ? ICON.check : liv ? ICON.play : ICON.lock}</button>
        <div class="lbl">${esc(l.titulo)}</div><div class="lv">${d && d.total ? `${d.acertos}/${d.total} de primeira` : `${l.exercicios.length} exercícios`}</div></div>`;
    }).join("");
    const temD = u.desafio && u.desafio.length;
    const liv = desafioLiberado(u), melhor = S.desafio[u.id];
    const kd = u.licoes.length;
    const desafio = temD ? `<div class="stop" style="transform:translateX(${ZIGUE[kd % ZIGUE.length]}px)">
        <button type="button" class="brick desafio ${liv ? (melhor != null ? "done" : "cur") : "locked"}" data-desafio="${esc(u.id)}" aria-label="Desafio da unidade ${u.n}: ${liv ? "disponível" : "bloqueado até concluir as lições"}" ${liv ? "" : 'aria-disabled="true"'}>${liv ? ICON.trophy : ICON.lock}</button>
        <div class="lbl">Desafio · estilo ENEM</div><div class="lv">${melhor != null ? `melhor nota ${melhor}/10 (ilustrativa)` : "10 questões, sem vidas"}</div></div>` : "";
    return `<section class="unit" style="--uc:${u.cor}" aria-label="Unidade ${u.n}: ${esc(u.titulo)}">
      <div class="uhead"><span class="eb">Unidade ${u.n} · ${licoesFeitasUnidade(u)}/${u.licoes.length}</span><h2>${esc(u.titulo)}</h2><p>${esc(u.descricao)}</p>
        <button type="button" data-guia="${esc(u.id)}" aria-label="Guia da unidade ${esc(u.titulo)}">${ICON.book}Guia</button></div>
      <div class="trail">${blocos}${desafio}</div></section>`;
  }).join("");
  const x = xpHoje();
  raiz.innerHTML = `${chipsMateria(m.id)}
    <div class="hero"><h1>${esc(m.nome)}</h1><p>${esc(m.descricao)}</p></div>
    <div class="goalrow"><span class="pill">${feitas}/${seq.length} lições</span><span class="pill">${x}/${S.goal} XP hoje</span><span class="pill">${esc(m.area)}</span></div>
    <div class="stack units">${unidades}</div>`;
  ligarChips(raiz, aoMudarMateria);
  raiz.querySelectorAll("[data-licao]").forEach((b) => b.addEventListener("click", () => {
    const l = IDX.licoes.get(b.dataset.licao);
    if (!destravada(l)) return toast("Conclua a lição anterior para liberar esta.");
    abrirLicao(l.id);
  }));
  raiz.querySelectorAll("[data-desafio]").forEach((b) => b.addEventListener("click", () => {
    const u = IDX.unidades.get(b.dataset.desafio);
    if (!desafioLiberado(u)) return toast("Conclua todas as lições da unidade para liberar o Desafio.");
    abrirDesafio(u.id);
  }));
  raiz.querySelectorAll("[data-guia]").forEach((b) => b.addEventListener("click", () => guia(IDX.unidades.get(b.dataset.guia))));
}

// modal com os cartões de ensino da unidade em resumo
function guia(u) {
  const html = `<div class="row between"><h2>Guia: ${esc(u.titulo)}</h2><button type="button" class="iconbtn" data-fechar aria-label="Fechar">${ICON.x}</button></div><p class="muted">${esc(u.descricao)}</p>` +
    u.licoes.map((l) => `<div class="gb"><h3>Lição ${l.n}: ${esc(l.titulo)}</h3>${l.cartoes.map((c) => `<div class="gc"><span class="eb">${esc(ROTULO_CARTAO[c.tipo] || c.tipo)}</span><b>${esc(c.titulo)}</b><p>${esc(c.texto)}</p></div>`).join("")}</div>`).join("");
  abrirModal(html);
}
