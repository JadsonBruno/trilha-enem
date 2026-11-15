// Sessão em tela cheia: cartões de ensino → exercícios → resultado. Serve a lição, o Desafio da unidade e a revisão espaçada.
import { $, esc, shuffle, fmtTempo, plural } from "../util.js";
import { S, registrar, marcarFeita, melhorDesafio, revisaoErrou, revisaoAcertou, vencidas, streakAtual, xpHoje } from "../estado.js";
import { IDX, existeEx, feita, destravada, desafioLiberado, licoesFeitasUnidade } from "../conteudo.js";
import { EXERCICIOS } from "../exercicios/index.js";
import { svgFig, redesenhar, figuras } from "../exercicios/_comum.js";
import { ICON, ROTULO_CARTAO } from "../icones.js";
import { beep, toast, confirmar, anel } from "./comum.js";

export const ganchos = { atualizar() {} }; // o app liga aqui o redesenho das telas ao sair da sessão
const VIDAS = 5;
let ses = null;

const stage = () => $("#stage");
const foot = () => $("#foot");
const footIn = () => $("#footIn");

function hud() {
  const total = ses.total || 1;
  const feitos = ses.modo === "licao" ? ses.certos.size : ses.respostas.length;
  $("#progFill").style.width = Math.round((100 * feitos) / total) + "%";
  const h = $("#hearts");
  if (ses.modo === "licao") { h.innerHTML = `${ICON.heart}<span aria-label="${ses.vidas} vidas">${ses.vidas}</span>`; h.hidden = false; }
  else if (ses.modo === "desafio") { h.innerHTML = `<span class="tagenem">estilo ENEM</span>`; h.hidden = false; }
  else { h.innerHTML = `<span class="mono">${Math.min(ses.respostas.length + 1, ses.total)}/${ses.total}</span>`; h.hidden = false; }
}
function rodape(html, cls = "") { foot().className = "foot gut " + cls; footIn().innerHTML = html; }
function irTopo() { const b = $(".sbody"); if (b) b.scrollTop = 0; }

// ---------- abertura ----------
function abrir(cfg) {
  ses = {
    ...cfg, vidas: VIDAS, xp: 0, combo: 0, melhorCombo: 0, certos: new Set(), errou: new Set(), requeue: new Set(),
    respostas: [], primeira: 0, fase: "cartoes", ci: 0, atual: null, est: null, resp: false, pronto: false, dicaUsada: false, inicio: Date.now(),
  };
  ses.fila = cfg.exercicios.slice();
  ses.total = cfg.exercicios.length;
  const sh = $("#sheet");
  sh.style.setProperty("--uc", cfg.cor);
  sh.hidden = false;
  document.body.classList.add("sem-rolagem");
  hud();
  if (cfg.cartoes && cfg.cartoes.length) cartao(0); else proximo();
}
export function abrirLicao(id) {
  const l = IDX.licoes.get(id);
  if (!l) return false;
  abrir({ modo: "licao", titulo: l.titulo, sub: `${l.uni.mat.nome} · Unidade ${l.uni.n}`, cor: l.uni.cor, cartoes: l.cartoes, exercicios: shuffle(l.exercicios), licao: l });
  return true;
}
export function abrirDesafio(uid) {
  const u = IDX.unidades.get(uid);
  if (!u || !u.desafio || !u.desafio.length) return false;
  abrir({ modo: "desafio", titulo: `Desafio: ${u.titulo}`, sub: `${u.mat.nome} · Unidade ${u.n}`, cor: u.cor, cartoes: [], exercicios: u.desafio.slice(), unidade: u });
  return true;
}
export function abrirRevisao() {
  const ids = vencidas(existeEx).slice(0, 10);
  if (!ids.length) { toast("Nada para revisar hoje."); return false; }
  const exs = ids.map((id) => IDX.exercicios.get(id));
  abrir({ modo: "revisao", titulo: "Revisão", sub: "Questões que você errou", cor: "var(--c4)", cartoes: [], exercicios: exs.map((e) => e.ex), info: new Map(exs.map((e) => [e.ex.id, e])) });
  return true;
}
function fechar() {
  $("#sheet").hidden = true;
  document.body.classList.remove("sem-rolagem");
  ses = null;
  ganchos.atualizar();
}

// ---------- cartões de ensino ----------
function cartao(i) {
  ses.fase = "cartoes"; ses.ci = i;
  const c = ses.cartoes[i], ult = i === ses.cartoes.length - 1;
  stage().innerHTML = `<div class="lesson-title"><span class="qtype">${esc(ses.sub)}</span><h1>${esc(ses.titulo)}</h1></div>
   <article class="lcard"><div class="kind"><span class="sq">${ICON[c.tipo] || ICON.conceito}</span><span class="qtype">${esc(ROTULO_CARTAO[c.tipo] || c.tipo)}</span></div>
   <h2>${esc(c.titulo)}</h2>${c.fig ? `<figure class="fig"><div class="fsvg">${svgFig(c.fig)}</div>${c.fig.cap ? `<figcaption>${esc(c.fig.cap)}</figcaption>` : ""}</figure>` : ""}
   <p class="big">${esc(c.texto)}</p></article>
   <div class="dots" aria-label="Cartão ${i + 1} de ${ses.cartoes.length}">${ses.cartoes.map((_, k) => `<i class="${k === i ? "on" : ""}"></i>`).join("")}</div>`;
  rodape(`<button type="button" class="btn go wide" id="btnCartao">${ult ? "Praticar" : "Continuar"}</button>`);
  $("#btnCartao").addEventListener("click", () => (ult ? proximo() : cartao(i + 1)));
  irTopo();
}

// ---------- exercícios ----------
function proximo() {
  if (!ses.fila.length) return fim();
  ses.atual = ses.fila.shift();
  mostrar();
}
function mostrar() {
  const ex = ses.atual, mod = EXERCICIOS[ex.tipo];
  if (!mod) { console.warn("tipo sem módulo:", ex.tipo); ses.certos.add(ex.id); ses.respostas.push({ ex, ok: true, pulado: true }); return proximo(); }
  ses.fase = "ex"; ses.resp = false; ses.pronto = false; ses.dicaUsada = false; ses.est = {};
  const ctx = { est: ses.est, modo: ses.modo, pronto: (b) => { ses.pronto = !!b; const bt = $("#btnConferir"); if (bt) bt.disabled = !b; } };
  const el = document.createElement("div");
  el.className = "qwrap";
  el.dataset.tipo = ex.tipo;
  el.innerHTML = mod.render(ex, ctx);
  stage().innerHTML = "";
  stage().append(el);
  ses.el = el;
  mod.ligar(el, ex, ctx);
  hud(); irTopo();
  const dica = ex.dica && ses.modo !== "desafio";
  rodape(`<div class="row2">${dica ? `<button type="button" class="btn" id="btnDica">${ICON.bulb}Dica</button>` : ""}<button type="button" class="btn go grow" id="btnConferir" ${ses.pronto ? "" : "disabled"}>Conferir</button></div>`);
  $("#btnConferir").addEventListener("click", conferir);
  if (dica) $("#btnDica").addEventListener("click", usarDica);
}
function usarDica() {
  const ex = ses.atual, b = $("#btnDica");
  if (ses.dicaUsada || ses.resp) return;
  ses.dicaUsada = true;
  b.disabled = true; b.innerHTML = `${ICON.bulb}Dica usada`;
  const html = `<div class="dicabox" role="note"><div><b>Dica</b> <span class="muted">(vale metade do XP)</span></div><p>${esc(ex.dica.t)}</p></div>`;
  const ref = ses.el.querySelector(".figs") || ses.el.querySelector(".q");
  ref.insertAdjacentHTML("afterend", html);
  if (Number.isInteger(ex.dica.fig)) redesenhar(ses.el, ex, "ask", ex.dica.fig, ex.dica.mark);
}
function conferir() {
  if (!ses || ses.resp || !ses.pronto || ses.fase !== "ex") return;
  const ex = ses.atual, mod = EXERCICIOS[ex.tipo];
  ses.resp = true;
  const ok = !!mod.conferir(ex, ses.est);
  const desafio = ses.modo === "desafio";
  let ganho = 0, extra = 0;
  if (ok) {
    ses.combo++; ses.melhorCombo = Math.max(ses.melhorCombo, ses.combo);
    if (desafio) ganho = 10;
    else {
      let base = ses.modo === "revisao" ? 5 : ses.errou.has(ex.id) ? 5 : 10;
      if (ses.dicaUsada) base = Math.round(base / 2);
      if (ses.combo >= 3) extra = Math.min(10, (ses.combo - 2) * 2);
      ganho = base + extra;
    }
    ses.xp += ganho; ses.certos.add(ex.id);
    if (!ses.errou.has(ex.id)) ses.primeira++;
    if (ses.modo === "revisao") revisaoAcertou(ex.id);
  } else {
    ses.combo = 0; ses.errou.add(ex.id);
    revisaoErrou(ex.id);
    if (ses.modo === "licao") {
      ses.vidas--;
      if (!ses.requeue.has(ex.id)) { ses.requeue.add(ex.id); ses.fila.push(ex); }
    }
  }
  ses.respostas.push({ ex, ok, escolha: mod.escolhaTexto ? mod.escolhaTexto(ex, ses.est) : "" });
  hud();
  if (desafio) {
    (mod.travar || (() => {}))(ses.el, ses.est);
    const ult = !ses.fila.length;
    rodape(`<div class="verdict"><b>Resposta registrada</b><p class="muted">No Desafio, o gabarito aparece no fim.</p></div><button type="button" class="btn ink wide" id="btnContinuar">${ult ? "Ver resultado" : "Continuar"}</button>`);
    beep("clique");
  } else {
    mod.revelar(ses.el, ex, ses.est, ok);
    const certa = !ok && mod.certaTexto ? `<p class="certa"><b>Resposta certa:</b> ${esc(mod.certaTexto(ex))}</p>` : "";
    const comboTxt = ok && ses.combo >= 3 ? `<span class="combo">Combo ×${ses.combo} · +${extra} XP extra</span>` : "";
    rodape(`<div class="verdict"><b>${ok ? "Isso aí!" : "Quase"}</b><p>${esc(ex.explicacao)}</p>${certa}<div class="row">${ok ? `<span class="ganho">+${ganho} XP</span>` : ""}${comboTxt}</div></div><button type="button" class="btn ${ok ? "go" : "no"} wide" id="btnContinuar">Continuar</button>`, ok ? "ok" : "bad");
    beep(ok ? "ok" : "bad");
  }
  $("#btnContinuar").addEventListener("click", continuar);
  $("#btnContinuar").focus({ preventScroll: true });
  // com o rodapé aberto, garante que a alternativa certa continue visível
  const alvo = ses.el.querySelector(".right, .opt.sel, .tile.sel");
  if (alvo && !desafio) setTimeout(() => alvo.scrollIntoView({ block: "nearest" }), 30);
}
function continuar() {
  if (!ses || !ses.resp) return;
  if (ses.modo === "licao" && ses.vidas <= 0) return semVidas();
  proximo();
}

// ---------- sem vidas ----------
function semVidas() {
  ses.fase = "fim";
  stage().innerHTML = `<div class="result"><div class="grande">${ICON.heartBroken}</div><h1 style="color:var(--bad)">Sem vidas</h1><p>Você errou ${VIDAS} vezes nesta lição. Releia os cartões e tente de novo: as questões erradas já foram para a Revisão.</p></div>`;
  rodape(`<button type="button" class="btn go wide" id="btnDeNovo">Tentar de novo</button><button type="button" class="btn wide" id="btnSair">Sair</button>`);
  $("#btnDeNovo").addEventListener("click", () => abrirLicao(ses.licao.id));
  $("#btnSair").addEventListener("click", fechar);
  beep("bad");
}

// ---------- fim e resultado ----------
function tiles(xp, acertos, total, tempo) {
  return `<div class="tiles3"><div class="rt"><div class="h" style="background:#8a5a00">XP</div><div class="v">+${xp}</div></div><div class="rt"><div class="h" style="background:#1e7b3a">Acertos</div><div class="v">${acertos}/${total}</div></div><div class="rt"><div class="h" style="background:#1d5fa8">Tempo</div><div class="v">${fmtTempo(tempo)}</div></div></div>`;
}
function metaHtml() {
  const x = xpHoje(), m = S.goal, s = streakAtual();
  return `<div class="metabox">${anel(x, m, 38)}<div><b>${x >= m ? "Meta diária batida!" : `Meta diária: ${x}/${m} XP`}</b><div class="muted">${s ? `Ofensiva de ${s} ${plural(s, "dia", "dias")}` : ""}</div></div></div>`;
}
function fim() {
  ses.fase = "fim";
  const tempo = Date.now() - ses.inicio;
  let corpo = "";
  if (ses.modo === "licao") {
    const l = ses.licao, bonus = ses.errou.size === 0 ? 10 : 0, xp = ses.xp + bonus;
    const ptes = destravadaAntes(l);
    registrar(xp); marcarFeita(l.id, ses.primeira, ses.total);
    const nova = novaDestravada(l, ptes);
    corpo = `<div class="result"><div class="grande ouro">${ICON.check}</div><h1>Lição concluída!</h1><p class="muted">${esc(l.titulo)}</p>${tiles(xp, ses.primeira, ses.total, tempo)}
      ${bonus ? `<p class="bonusnote">Bônus de 10 XP: lição sem erros.</p>` : ""}${ses.melhorCombo >= 3 ? `<p class="bonusnote">Maior combo: ×${ses.melhorCombo}</p>` : ""}
      ${nova}${metaHtml()}</div>`;
  } else if (ses.modo === "desafio") {
    const u = ses.unidade, nota = ses.certos.size;
    registrar(ses.xp);
    const rec = melhorDesafio(u.id, nota);
    const erradas = ses.respostas.filter((r) => !r.ok);
    corpo = `<div class="result"><div class="grande ouro">${ICON.trophy}</div><h1>Desafio concluído!</h1><p class="muted">${esc(u.titulo)}</p>
      <div class="nota"><span class="mono">${nota}/10</span><small>nota ilustrativa${rec ? " · novo recorde" : ""} · melhor: ${S.desafio[u.id]}/10</small></div>
      <p class="aviso">As notas do Desafio são ilustrativas: não são cálculo de TRI do ENEM.</p>
      ${tiles(ses.xp, nota, ses.total, tempo)}
      ${erradas.length ? `<div class="revdes"><h3>Revise as erradas (${erradas.length})</h3>${erradas.map(revisaoItem).join("")}<p class="muted">Elas entraram na aba Revisão.</p></div>` : `<p class="bonusnote">Sem nenhum erro. Ótimo!</p>`}
      ${metaHtml()}</div>`;
  } else {
    registrar(ses.xp);
    const n = ses.respostas.length, ac = ses.respostas.filter((r) => r.ok).length;
    corpo = `<div class="result"><div class="grande ouro">${ICON.revisao}</div><h1>Revisão feita!</h1><p class="muted">${ac} de ${n} ${plural(n, "questão", "questões")} corretas. As que você acertou voltam mais tarde; as erradas, hoje.</p>${tiles(ses.xp, ac, n, tempo)}${metaHtml()}</div>`;
  }
  hud();
  $("#progFill").style.width = "100%";
  stage().innerHTML = corpo;
  rodape(`<button type="button" class="btn go wide" id="btnFim">Continuar</button>`);
  $("#btnFim").addEventListener("click", fechar);
  irTopo(); beep("fim");
}
function revisaoItem(r) {
  const mod = EXERCICIOS[r.ex.tipo];
  return `<div class="card rev"><b>${esc(r.ex.enunciado)}</b>${figuras(r.ex, "reveal")}${r.escolha ? `<p class="bad-t">Você marcou: ${esc(r.escolha)}</p>` : ""}<p class="ok-t">Certa: ${esc(mod && mod.certaTexto ? mod.certaTexto(r.ex) : "")}</p><p class="muted">${esc(r.ex.explicacao)}</p></div>`;
}
// o que estava travado antes de concluir a lição (para anunciar o que destravou)
function destravadaAntes(l) {
  const seq = IDX.porMateria.get(l.mat.id), prox = seq[l.pos + 1];
  return { proxLiberada: prox ? destravada(prox) : true, desafioLiberado: desafioLiberado(l.uni) };
}
function novaDestravada(l, antes) {
  const seq = IDX.porMateria.get(l.mat.id), prox = seq[l.pos + 1];
  const partes = [];
  if (prox && !antes.proxLiberada && destravada(prox)) partes.push(`<b>Próxima lição destravada</b><span>${esc(prox.titulo)}</span>`);
  if (!antes.desafioLiberado && desafioLiberado(l.uni) && l.uni.desafio && l.uni.desafio.length) partes.push(`<b>Desafio da unidade destravado</b><span>${esc(l.uni.titulo)}</span>`);
  return partes.map((p) => `<div class="unlocked">${p}</div>`).join("");
}

// ---------- sair ----------
async function sair() {
  if (!ses) return;
  if (ses.fase === "fim") return fechar();
  const ok = await confirmar("Sair agora?", ses.modo === "licao" ? "O progresso desta lição será perdido." : ses.modo === "desafio" ? "O Desafio será descartado." : "O que você já respondeu fica salvo.", "Sair", "no");
  if (!ok || !ses) return;
  if (ses.modo === "revisao" && ses.respostas.length) registrar(ses.xp);
  fechar();
}

export function iniciarSessao() {
  $("#quit").addEventListener("click", sair);
  document.addEventListener("keydown", (e) => {
    if (!ses || $("#sheet").hidden || !$("#modal").hidden) return;
    if (e.key === "Enter" && (e.target === document.body || e.target.id === "btnContinuar")) {
      const b = $("#btnContinuar") || $("#btnCartao") || $("#btnConferir");
      if (b && !b.disabled && e.target !== b) b.click();
    }
  });
}

// ---------- gancho de teste ----------
export const api = {
  ativa: () => !!ses,
  fase: () => (ses ? ses.fase : null),
  exercicioAtual: () => (ses && ses.fase === "ex" ? ses.atual : null),
  vidas: () => (ses ? ses.vidas : null),
  pularCartoes() { if (ses && ses.fase === "cartoes") proximo(); },
  responder(certo) {
    if (!ses) return false;
    if (ses.fase === "cartoes") proximo();
    if (ses.fase !== "ex" || ses.resp) return false;
    const mod = EXERCICIOS[ses.atual.tipo];
    mod.auto(ses.el, ses.atual, ses.est, certo);
    conferir();
    return true;
  },
  continuar() { if (ses && ses.fase === "ex" && ses.resp) continuar(); else if (ses && ses.fase === "fim") { const b = $("#btnFim"); if (b) b.click(); } },
};
