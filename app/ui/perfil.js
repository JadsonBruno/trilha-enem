// Aba Perfil: tema, meta diária, som, liberar lições, exportar/importar, apagar, avisos e créditos.
import { esc } from "../util.js";
import { S, METAS, salvar, exportar, decodificar, mesclar, substituir, apagarTudo, streakAtual } from "../estado.js";
import { IDX } from "../conteudo.js";
import { toast, escolher, confirmar, beep } from "./comum.js";
import { ICON } from "../icones.js";

export function aplicarTema() {
  const r = document.documentElement;
  if (S.tema === "claro") r.dataset.theme = "light"; else if (S.tema === "escuro") r.dataset.theme = "dark"; else delete r.dataset.theme;
  const claro = S.tema === "claro" || (S.tema === "sistema" && !(window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches));
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", claro ? "#ffffff" : "#1f1e2e");
}

export function renderPerfil(raiz, atualizarTudo) {
  const seg = (nome, itens, atual) => `<div class="seg" role="group" aria-label="${nome}">${itens.map(([v, t]) => `<button type="button" data-${nome === "Tema" ? "tema" : "meta"}="${v}" aria-pressed="${String(v) === String(atual)}">${t}</button>`).join("")}</div>`;
  const feitas = Object.keys(S.done).filter((id) => IDX.licoes.has(id)).length;
  raiz.innerHTML = `<div class="hero"><h1>Perfil</h1><p>${S.xp} XP · ${feitas} ${feitas === 1 ? "lição feita" : "lições feitas"} · ofensiva de ${streakAtual()} ${streakAtual() === 1 ? "dia" : "dias"}</p></div>
  <div class="card stack"><b>Tema</b>${seg("Tema", [["sistema", "Sistema"], ["claro", "Claro"], ["escuro", "Escuro"]], S.tema)}</div>
  <div class="card stack"><b>Meta diária</b>${seg("Meta", METAS.map((m) => [m, m + " XP"]), S.goal)}</div>
  <div class="card stack">
    <label class="switch"><span>${ICON.sound} Som</span><button type="button" role="switch" id="swSom" aria-checked="${S.som}" aria-label="Som"><i></i></button></label>
    <label class="switch"><span>${ICON.lock} Liberar todas as lições</span><button type="button" role="switch" id="swLib" aria-checked="${S.unlockAll}" aria-label="Liberar todas as lições"><i></i></button></label>
  </div>
  <div class="card stack"><b>Seu progresso</b><p class="muted">Fica só neste aparelho. Para levar para outro, exporte o código e importe lá.</p>
    <button type="button" class="btn wide" id="btnExp">Exportar progresso</button>
    <div id="expBox" hidden class="stack"><textarea id="expTxt" readonly rows="4" aria-label="Código de progresso"></textarea><button type="button" class="btn small" id="btnCopiar">${ICON.copy} Copiar código</button></div>
    <textarea id="impTxt" rows="3" placeholder="Cole aqui um código TE1:…" aria-label="Código para importar"></textarea>
    <button type="button" class="btn wide" id="btnImp">Importar progresso</button>
    <button type="button" class="btn no wide" id="btnApagar">Apagar progresso</button></div>
  <p class="aviso">As notas do Desafio são ilustrativas: não são cálculo de TRI do ENEM.</p>
  <div class="card stack"><b>Créditos e fontes</b><p>O conteúdo vem do Show do ENEM: as questões usam modelos e tabelas próprios e referências abertas, indicadas em cada exercício (campos "ref" e "src"). Textos-base citam a obra e o autor. As questões são "no estilo do ENEM"; nenhuma é prova oficial.</p>
    <p class="muted">Frequência dos temas: cada tema do Mapa traz a sua fonte.</p>
    <p class="muted">Trilha ENEM · feito para estudar no celular, funciona sem internet depois de aberto.</p></div>`;

  raiz.querySelectorAll("[data-tema]").forEach((b) => b.addEventListener("click", () => { S.tema = b.dataset.tema; salvar(); aplicarTema(); renderPerfil(raiz, atualizarTudo); }));
  raiz.querySelectorAll("[data-meta]").forEach((b) => b.addEventListener("click", () => { S.goal = +b.dataset.meta; salvar(); atualizarTudo(); }));
  raiz.querySelector("#swSom").addEventListener("click", () => { S.som = !S.som; salvar(); if (S.som) beep("ok"); renderPerfil(raiz, atualizarTudo); });
  raiz.querySelector("#swLib").addEventListener("click", () => { S.unlockAll = !S.unlockAll; salvar(); atualizarTudo(); toast(S.unlockAll ? "Todas as lições liberadas." : "Lições em sequência de novo."); });
  raiz.querySelector("#btnExp").addEventListener("click", () => {
    raiz.querySelector("#expBox").hidden = false;
    const t = raiz.querySelector("#expTxt"); t.value = exportar(); t.focus(); t.select();
  });
  raiz.querySelector("#btnCopiar").addEventListener("click", async () => {
    const t = raiz.querySelector("#expTxt");
    try { await navigator.clipboard.writeText(t.value); toast("Código copiado."); }
    catch (e) { t.focus(); t.select(); try { document.execCommand("copy"); toast("Código copiado."); } catch (e2) { toast("Selecione o texto e copie à mão."); } }
  });
  raiz.querySelector("#btnImp").addEventListener("click", async () => {
    let novo;
    try { novo = decodificar(raiz.querySelector("#impTxt").value); } catch (e) { return toast(e.message); }
    const nl = Object.keys(novo.done).length;
    const r = await escolher("Importar progresso", `O código tem ${novo.xp} XP e ${nl} ${nl === 1 ? "lição feita" : "lições feitas"}. Mesclar mantém o melhor dos dois; substituir troca tudo o que está neste aparelho.`, [{ v: "m", t: "Mesclar", cls: "go" }, { v: "s", t: "Substituir tudo", cls: "no" }]);
    if (!r) return;
    const manter = { tema: S.tema, goal: S.goal, som: S.som, materia: S.materia, unlockAll: S.unlockAll };
    substituir(r === "m" ? mesclar(novo) : { ...novo, ...manter });
    salvar(); aplicarTema(); atualizarTudo(); toast("Progresso importado.");
  });
  raiz.querySelector("#btnApagar").addEventListener("click", async () => {
    if (!(await confirmar("Apagar progresso?", "Isso apaga XP, lições feitas, revisão e ofensiva deste aparelho. Não dá para desfazer.", "Apagar tudo", "no"))) return;
    apagarTudo(); aplicarTema(); atualizarTudo(); toast("Progresso apagado.");
  });
}
