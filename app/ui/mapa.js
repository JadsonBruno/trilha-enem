// Aba Mapa: "Matérias × temas". Linhas = temas da matéria (com a frequência no ENEM), colunas = unidades.
import { esc } from "../util.js";
import { S } from "../estado.js";
import { IDX, materiaAtual, feita, licoesFeitasUnidade } from "../conteudo.js";
import { ICON } from "../icones.js";
import { chipsMateria, ligarChips } from "./comum.js";

let sel = null; // { tipo: "tema" | "unidade", id }
const FREQ = { alta: "alta", media: "média", baixa: "baixa" };

// 'cheio' = há lição concluída da unidade com o tema; 'vazio' = existe e não foi feita; 'nada' = a unidade não trata o tema
function celula(u, t) {
  const ls = u.licoes.filter((l) => (l.temas || []).includes(t.id));
  if (!ls.length) return (u.temas || []).includes(t.id) ? "vazio" : "nada";
  return ls.some(feita) ? "cheio" : "vazio";
}

function detalhe(m) {
  if (sel && sel.tipo === "tema") {
    const t = m.temas.find((x) => x.id === sel.id);
    if (t) {
      const linhas = m.unidades.map((u) => {
        const ls = u.licoes.filter((l) => (l.temas || []).includes(t.id));
        return ls.length ? `<li><b style="color:${u.cor}">Unidade ${u.n}</b> · ${esc(u.titulo)}<ul>${ls.map((l) => `<li>${feita(l) ? "✓" : "○"} ${esc(l.titulo)}</li>`).join("")}</ul></li>` : "";
      }).join("");
      return `<h2>${esc(t.nome)}</h2><p><span class="freq f-${t.freq}">frequência ${FREQ[t.freq]}</span></p><p class="muted">Fonte da frequência: ${esc(t.ref)}</p>${linhas ? `<ul class="dlist">${linhas}</ul>` : `<p class="muted">Nenhuma lição trata este tema ainda.</p>`}`;
    }
  }
  if (sel && sel.tipo === "unidade") {
    const u = IDX.unidades.get(sel.id);
    if (u && u.mat === m) {
      const temas = m.temas.filter((t) => celula(u, t) !== "nada");
      return `<h2 style="color:${u.cor}">Unidade ${u.n}: ${esc(u.titulo)}</h2><p>${esc(u.descricao)}</p><p><b>${licoesFeitasUnidade(u)}</b> de ${u.licoes.length} lições feitas${S.desafio[u.id] != null ? ` · melhor nota do Desafio: ${S.desafio[u.id]}/10 (ilustrativa)` : ""}</p>
        <ul class="dlist">${temas.map((t) => `<li>${celula(u, t) === "cheio" ? "■" : "□"} ${esc(t.nome)} <span class="freq f-${t.freq}">${FREQ[t.freq]}</span></li>`).join("")}</ul>`;
    }
  }
  return `<p class="muted">Toque num tema (linha) ou numa unidade (coluna) para ver os detalhes.</p>`;
}

export function renderMapa(raiz, aoMudarMateria) {
  const m = materiaAtual();
  if (!m) { raiz.innerHTML = ""; return; }
  const resumo = IDX.materias.map((x) => {
    const seq = IDX.porMateria.get(x.id), f = seq.filter(feita).length, p = seq.length ? Math.round((100 * f) / seq.length) : 0;
    return `<div class="resumo"><div class="row between"><b>${esc(x.nome)}</b><span class="mono">${p}% · ${f}/${seq.length}</span></div><div class="barra" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso em ${esc(x.nome)}"><i style="width:${p}%;background:${x.corTexto}"></i></div></div>`;
  }).join("");
  const cab = m.unidades.map((u) => `<th scope="col"><button type="button" class="ucol ${sel && sel.tipo === "unidade" && sel.id === u.id ? "on" : ""}" data-col="${esc(u.id)}" style="--uc:${u.cor}" aria-label="Unidade ${u.n}: ${esc(u.titulo)}">${u.n}</button></th>`).join("");
  const linhas = m.temas.map((t) => `<tr class="${sel && sel.tipo === "tema" && sel.id === t.id ? "hi" : ""}"><th scope="row" class="cn"><button type="button" data-lin="${esc(t.id)}"><span>${esc(t.nome)}</span><span class="freq f-${t.freq}">${FREQ[t.freq]}</span></button></th>${m.unidades.map((u) => {
    const c = celula(u, t);
    const rot = c === "cheio" ? "feito" : c === "vazio" ? "ainda não feito" : "não trata o tema";
    return `<td style="--uc:${u.cor}">${c === "nada" ? `<span class="nada" aria-label="${esc(t.nome)}, unidade ${u.n}: ${rot}">·</span>` : `<span class="dot ${c === "cheio" ? "f" : ""}" role="img" aria-label="${esc(t.nome)}, unidade ${u.n}: ${rot}"></span>`}</td>`;
  }).join("")}</tr>`).join("");
  raiz.innerHTML = `${chipsMateria(m.id)}
    <div class="hero"><h1>Matérias × temas</h1><p>Cada linha é um tema do ENEM em ${esc(m.nome)}; cada coluna, uma unidade. O quadrado cheio marca o tema que você já estudou numa lição concluída.</p></div>
    <div class="mx-wrap" tabindex="0" aria-label="Tabela de temas por unidade"><table class="mx"><caption class="sr">Temas de ${esc(m.nome)} por unidade</caption><thead><tr><th scope="col" class="cn">Tema</th>${cab}</tr></thead><tbody>${linhas}</tbody></table></div>
    <div class="legenda"><span><i class="dot f" style="--uc:var(--ink)"></i> feito</span><span><i class="dot" style="--uc:var(--ink)"></i> ainda não feito</span><span><i class="nada">·</i> unidade não trata o tema</span></div>
    <div class="card detail" aria-live="polite">${detalhe(m)}</div>
    <h2 class="sec">Progresso por matéria</h2><div class="card stack">${resumo}</div>`;
  ligarChips(raiz, (id) => { sel = null; aoMudarMateria(id); });
  const redesenhar = () => renderMapa(raiz, aoMudarMateria);
  raiz.querySelectorAll("[data-lin]").forEach((b) => b.addEventListener("click", () => { sel = { tipo: "tema", id: b.dataset.lin }; redesenhar(); }));
  raiz.querySelectorAll("[data-col]").forEach((b) => b.addEventListener("click", () => { sel = { tipo: "unidade", id: b.dataset.col }; redesenhar(); }));
}
