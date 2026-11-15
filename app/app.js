// Motor da Trilha ENEM: cabeçalho, abas, roteamento e gancho de teste. Não sabe de matéria: recebe CONTEUDO pronto.
import { $, $$, esc } from "./util.js";
import { S, carregar, salvar, hoje, forcarHoje, xpHoje, streakAtual } from "./estado.js";
import { IDX, indexar, materiaAtual } from "./conteudo.js";
import { ICON } from "./icones.js";
import { iniciarModal, anel } from "./ui/comum.js";
import { iniciarSessao, ganchos, abrirLicao, abrirDesafio, abrirRevisao, api } from "./ui/sessao.js";
import { renderTrilha } from "./ui/trilha.js";
import { renderRevisao, contarVencidas } from "./ui/revisao.js";
import { renderMapa } from "./ui/mapa.js";
import { renderPerfil, aplicarTema } from "./ui/perfil.js";

const ABAS = [["trilha", "Trilha", ICON.trilha], ["revisao", "Revisão", ICON.revisao], ["mapa", "Mapa", ICON.mapa], ["perfil", "Perfil", ICON.perfil]];
let aba = "trilha";

function escolherMateria(id) {
  S.materia = id; salvar();
  atualizar();
}
function cabecalho() {
  $("#sStreak").innerHTML = `${ICON.flame}<span>${streakAtual()}</span>`;
  $("#sStreak").classList.toggle("off", streakAtual() === 0);
  $("#sStreak").title = "Dias seguidos";
  $("#sXp").innerHTML = `${ICON.bolt}<span>${S.xp}</span>`;
  $("#sGoal").innerHTML = anel(xpHoje(), S.goal);
  const n = contarVencidas();
  const b = $('[data-aba="revisao"] .badge');
  if (b) { b.textContent = n > 9 ? "9+" : n; b.hidden = n === 0; b.setAttribute("aria-label", n + " para revisar"); }
}
function desenharAba() {
  const raiz = $("#v-" + aba);
  if (aba === "trilha") renderTrilha(raiz, escolherMateria);
  else if (aba === "revisao") renderRevisao(raiz);
  else if (aba === "mapa") renderMapa(raiz, escolherMateria);
  else renderPerfil(raiz, atualizar);
}
function mostrarAba() {
  for (const [id] of ABAS) {
    $("#v-" + id).classList.toggle("on", id === aba);
    const a = $(`[data-aba="${id}"]`);
    if (id === aba) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  }
}
export function atualizar() {
  cabecalho();
  desenharAba();
}
export function ir(destino, { rolar = true } = {}) {
  if (!ABAS.some(([id]) => id === destino)) destino = "trilha";
  aba = destino;
  mostrarAba(); atualizar();
  if (rolar) window.scrollTo(0, 0);
}

export function iniciar(CONTEUDO) {
  carregar();
  indexar(CONTEUDO);
  if (!IDX.materias.some((m) => m.id === S.materia) && IDX.materias[0]) S.materia = IDX.materias[0].id;
  aplicarTema();
  try { matchMedia("(prefers-color-scheme: dark)").addEventListener("change", aplicarTema); } catch (e) { /* navegador antigo */ }
  $("#abas").innerHTML = ABAS.map(([id, nome, ic]) => `<a href="#${id}" data-aba="${id}">${ic}<span>${nome}</span>${id === "revisao" ? `<span class="badge" hidden></span>` : ""}</a>`).join("");
  iniciarModal(); iniciarSessao();
  $("#openSettings").addEventListener("click", () => { location.hash = "#perfil"; });
  ganchos.atualizar = () => {
    atualizar();
    if (aba === "trilha") { const cur = $(".brick.cur"); if (cur) cur.scrollIntoView({ block: "center", behavior: "auto" }); }
  };
  window.addEventListener("hashchange", () => ir(location.hash.slice(1)));
  ir(location.hash.slice(1) || "trilha", { rolar: false });

  if (__HOOK__) {
    window.__trilha = {
      get estado() { return S; },
      conteudo: CONTEUDO,
      hoje(d) { const r = forcarHoje(d); atualizar(); return r; },
      dia: hoje,
      abrirLicao, abrirDesafio, abrirRevisao,
      exercicioAtual: api.exercicioAtual,
      fase: api.fase,
      vidas: api.vidas,
      pularCartoes: api.pularCartoes,
      responderCerto: () => api.responder(true),
      responderErrado: () => api.responder(false),
      continuar: api.continuar,
      ir, atualizar,
    };
  }
}
