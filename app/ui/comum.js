// Peças de interface compartilhadas: modal, confirmação, toast, som, chips de matéria, anel da meta.
import { $, esc } from "../util.js";
import { S } from "../estado.js";
import { IDX } from "../conteudo.js";

// ---- som (beep curto via WebAudio; só depois de um toque do usuário) ----
let ac = null;
export function beep(tipo) {
  if (!S.som) return;
  try {
    ac = ac || new (window.AudioContext || window.webkitAudioContext)();
    if (ac.state === "suspended") ac.resume();
    const notas = { ok: [[660, 0], [880, 0.09]], bad: [[220, 0], [165, 0.11]], fim: [[523, 0], [659, 0.1], [784, 0.2], [1047, 0.3]], clique: [[600, 0]] }[tipo] || [];
    for (const [f, t] of notas) {
      const o = ac.createOscillator(), g = ac.createGain(), t0 = ac.currentTime + t;
      o.type = tipo === "bad" ? "triangle" : "sine"; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.14, t0 + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.16);
      o.connect(g); g.connect(ac.destination); o.start(t0); o.stop(t0 + 0.18);
    }
  } catch (e) { /* sem áudio: segue */ }
}

// ---- toast ----
let tt = null;
export function toast(msg) {
  const el = $("#toast");
  el.textContent = msg; el.hidden = false;
  clearTimeout(tt);
  tt = setTimeout(() => { el.hidden = true; }, 2600);
}

// ---- modal ----
let focoAntes = null;
export function abrirModal(html, aoFechar) {
  const m = $("#modal"), p = $("#modalIn");
  focoAntes = document.activeElement;
  p.innerHTML = html;
  m.hidden = false;
  m._aoFechar = aoFechar;
  const f = p.querySelector("[autofocus],button,textarea");
  if (f) f.focus();
  return p;
}
export function fecharModal() {
  const m = $("#modal");
  if (m.hidden) return;
  m.hidden = true;
  const cb = m._aoFechar; m._aoFechar = null;
  if (focoAntes && focoAntes.focus) try { focoAntes.focus(); } catch (e) { /* ignora */ }
  if (cb) cb();
}
export function iniciarModal() {
  const m = $("#modal");
  m.addEventListener("click", (e) => { if (e.target === m || e.target.closest("[data-fechar]")) fecharModal(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") fecharModal(); });
}
// confirmação com botões; devolve Promise<string|false> (o `v` do botão escolhido; false se cancelou)
export function escolher(titulo, texto, botoes) {
  return new Promise((ok) => {
    let res = false;
    const p = abrirModal(`<h2>${esc(titulo)}</h2><p>${esc(texto)}</p><div class="stack">${botoes.map((b) => `<button type="button" class="btn ${b.cls || ""} wide" data-v="${esc(b.v)}">${esc(b.t)}</button>`).join("")}<button type="button" class="btn wide" data-fechar>Cancelar</button></div>`, () => ok(res));
    p.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => { res = b.dataset.v; fecharModal(); }));
  });
}
export const confirmar = (titulo, texto, sim = "Confirmar", cls = "go") => escolher(titulo, texto, [{ v: "s", t: sim, cls }]).then((r) => r === "s");

// ---- anel da meta diária ----
export function anel(xp, meta, tam = 30) {
  const r = 12, c = 2 * Math.PI * r, f = Math.min(1, xp / meta);
  const cheio = xp >= meta;
  return `<svg class="ring" width="${tam}" height="${tam}" viewBox="0 0 30 30" role="img" aria-label="Meta diária: ${xp} de ${meta} XP"><circle cx="15" cy="15" r="${r}" fill="none" stroke="var(--line)" stroke-width="4"/><circle cx="15" cy="15" r="${r}" fill="none" stroke="${cheio ? "var(--ok)" : "var(--gold)"}" stroke-width="4" stroke-linecap="round" stroke-dasharray="${(c * f).toFixed(1)} ${c.toFixed(1)}" transform="rotate(-90 15 15)"/>${cheio ? `<path d="m10 15.5 3.4 3.4 6.6-7" fill="none" stroke="var(--ok)" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>` : ""}</svg>`;
}

// ---- seletor de matéria (chips com a cor de cada matéria) ----
export function chipsMateria(atualId) {
  return `<div class="chips" role="tablist" aria-label="Matéria">${IDX.materias.map((m) => `<button type="button" role="tab" class="mchip" data-materia="${esc(m.id)}" aria-selected="${m.id === atualId}" style="--mc:${m.corTexto}">${esc(m.nome)}</button>`).join("")}</div>`;
}
export function ligarChips(raiz, aoMudar) {
  raiz.querySelectorAll("[data-materia]").forEach((b) => b.addEventListener("click", () => aoMudar(b.dataset.materia)));
}
