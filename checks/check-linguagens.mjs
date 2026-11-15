// Conferência do conteúdo de Linguagens: node checks/check-linguagens.mjs  (código 1 se falhar).
// 1) schema geral (checks/schema.mjs) só para esta matéria; 2) tabelas próprias (_leitura.mjs) com checkTabela;
// 3) cada exercício GERADO é reconferido contra a tabela de fatos de onde saiu (certa = fato do alvo; nenhum distrator com a mesma def/marca
//    nem coexistente com o alvo; V/F não ambíguo); 4) sem repetição entre lições; 5) limite de enem por unidade e desafios; 6) cobertura dos temas.
// Não depende do manifesto geral: lê só conteudo/linguagens (outras matérias podem estar em obras).
import { readdirSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
const PM = join(RAIZ, "conteudo/linguagens");
const imp = (p) => import(pathToFileURL(p).href);
let falhas = 0;
const erro = (m) => { falhas++; console.log("ERRO   " + m); };

const { FIGURAS } = await imp(join(RAIZ, "app/figuras/index.js"));
const { validar } = await imp(join(RAIZ, "checks/schema.mjs"));
const G = await imp(join(PM, "_gerar.mjs"));
const LEI = await imp(join(PM, "_leitura.mjs"));
const { checkTabela } = await imp(join(RAIZ, "fonte/show-do-enem/lin-base.mjs"));
const { FATOS: FIG } = await imp(join(RAIZ, "fonte/show-do-enem/lin-figuras.mjs"));
const { FATOS: FUN } = await imp(join(RAIZ, "fonte/show-do-enem/lin-funcoes.mjs"));
const { FATOS: GEN } = await imp(join(RAIZ, "fonte/show-do-enem/lin-generos.mjs"));

// ---------- carrega a matéria ----------
const M = { ...(await imp(join(PM, "materia.mjs"))).default, unidades: [] };
for (const u of readdirSync(PM).filter((d) => /^\d{2}-[a-z0-9-]+$/.test(d) && statSync(join(PM, d)).isDirectory()).sort()) {
  const pu = join(PM, u);
  if (!existsSync(join(pu, "unidade.mjs"))) { erro(`${u}: sem unidade.mjs`); continue; }
  const U = { ...(await imp(join(pu, "unidade.mjs"))).default, licoes: [] };
  for (const f of readdirSync(pu).filter((f) => /^\d{2}-[a-z0-9-]+\.mjs$/.test(f)).sort()) U.licoes.push((await imp(join(pu, f))).default);
  M.unidades.push(U);
}

// ---------- 1) schema ----------
const { erros, avisos, stats } = validar([M], FIGURAS);
for (const a of avisos) console.log("aviso  " + a);
for (const e of erros) erro(e);
console.log(`linguagens: ${stats.unidades} unidades, ${stats.licoes} lições, ${stats.cartoes} cartões, ${stats.exercicios} exercícios + ${stats.desafio} no desafio`);
console.log("por tipo: " + Object.entries(stats.porTipo).map(([k, v]) => `${k} ${v}`).join(", "));

// ---------- 2) tabelas próprias ----------
for (const [nome, fatos] of [["efeitos", LEI.EFEITOS], ["intenções", LEI.INTENCOES], ["passos", LEI.PASSOS], ["armadilhas (caso a)", LEI.fatosCaso("a")], ["armadilhas (caso b)", LEI.fatosCaso("b")], ["armadilhas (caso c)", LEI.fatosCaso("c")]])
  for (const p of checkTabela(fatos)) erro(`tabela ${nome}: ${p}`);
for (const [c, C] of Object.entries(LEI.CASOS)) {
  if (C.base.texto.length > 450) erro(`caso ${c}: base > 450`);
  if (!/^Texto elaborado para o jogo/.test(C.base.fonte)) erro(`caso ${c}: base.fonte deve dizer "Texto elaborado para o jogo"`);
  if (C.pergunta.length > 120 || C.correta.length > 70) erro(`caso ${c}: tamanhos`);
  for (const a of LEI.ARMADILHAS) if (!C.alts[a.id] || C.alts[a.id].length > 70) erro(`caso ${c}: alternativa de ${a.id} ausente ou > 70`);
  const todas = [C.correta, ...Object.values(C.alts)]; if (new Set(todas).size !== todas.length) erro(`caso ${c}: alternativas repetidas`);
}
for (const a of LEI.ARMADILHAS) for (const c of a.confunde) if (G.sobrepoe("arm", a.id, c)) erro(`armadilha ${a.id}: confunde "${c}" coexiste com ela`);

// ---------- coleta ----------
const todos = []; // { x, onde, desafio, unidade }
for (const U of M.unidades) {
  for (const L of U.licoes) for (const x of L.exercicios) todos.push({ x, onde: L.id, U, L });
  for (const x of U.desafio) todos.push({ x, onde: U.id + "/desafio", U, desafio: true });
}

// ---------- 3) gerados × tabelas ----------
const T = (tab) => G.TABS[tab].fatos;
const por = (tab, id) => G.fato(tab, id);
const lcf = G.lc;
const camposIguais = (a, b, k) => String(a[k]).toLowerCase().trim() === String(b[k]).toLowerCase().trim();
const contaGerados = {};
for (const { x, onde } of todos) {
  const m = G.META.get(x.id);
  if (!String(x.origem).startsWith("gerado:")) {
    if (m) erro(`${x.id}: tem META mas origem "${x.origem}"`);
    continue;
  }
  const o = `${onde}/${x.id}`;
  if (!m) { erro(`${o}: origem gerada sem registro META`); continue; }
  contaGerados[m.g] = (contaGerados[m.g] || 0) + 1;
  const sobre = (a, b, tab = m.tab) => G.sobrepoe(tab, a, b);
  switch (m.g) {
    case "tf-def": case "tf-marca": {
      const f = por(m.tab, m.alvo), g = por(m.tab, m.fonte), k = m.campo;
      if (x.certa !== (m.alvo === m.fonte)) erro(`${o}: certa do V/F não bate com a tabela`);
      const esperado = k === "def" ? `${f.nome}: ${lcf(g.def)}.` : `Marca de “${f.nome}”: ${g.marca}`;
      if (x.enunciado !== esperado) erro(`${o}: enunciado difere do que a tabela dá`);
      if (m.alvo !== m.fonte) {
        if (sobre(m.alvo, m.fonte)) erro(`${o}: ${m.alvo} e ${m.fonte} coexistem (V/F ambíguo)`);
        if (camposIguais(f, g, k)) erro(`${o}: ${k} igual nos dois`);
        for (const h of T(m.tab)) if (h.id !== m.alvo && camposIguais(h, f, k)) erro(`${o}: ${h.id} tem o mesmo ${k} que o alvo`);
        if (m.tab === "fun" && m.alvo.endsWith("-foco") !== m.fonte.endsWith("-foco")) erro(`${o}: linhas de tipos diferentes`);
      }
      break;
    }
    case "tf-trecho": {
      const f = por(m.tab, m.alvo);
      if (x.fig?.[0]?.texto !== f.exemplo) erro(`${o}: trecho não é o exemplo da tabela`);
      if (x.certa !== (m.alvo === m.fonte)) erro(`${o}: certa não bate`);
      if (m.alvo !== m.fonte) {
        if (!(G.SEGURAS_EXEMPLO[m.tab][m.alvo] || []).includes(m.fonte)) erro(`${o}: "${m.fonte}" não está na lista de ausentes do trecho`);
        if (m.tab === "fig" && G.SOBRE_EXEMPLO_FIG.some(([a, b]) => (a === m.alvo && b === m.fonte) || (b === m.alvo && a === m.fonte))) erro(`${o}: figuras que coexistem no mesmo trecho`);
        if (m.fonte === m.alvo.replace("-foco", "")) erro(`${o}: mesma função`);
      }
      break;
    }
    case "tf-recorte": {
      if (x.fig?.[0]?.genero !== m.alvo) erro(`${o}: recorte não é o do alvo`);
      if (x.certa !== (m.alvo === m.fonte)) erro(`${o}: certa não bate`);
      if (m.alvo !== m.fonte && G.jaccPartes(m.alvo, m.fonte) > G.LAYOUT_PARECIDO_MAX) erro(`${o}: recortes parecidos demais`);
      break;
    }
    case "tf-armadilha": {
      const f = por("arm", m.alvo), C = LEI.CASOS[m.caso];
      if (x.fig?.[0]?.texto !== C.alts[m.alvo]) erro(`${o}: alternativa não é a do caso`);
      if (x.certa !== (m.alvo === m.fonte)) erro(`${o}: certa não bate`);
      if (m.alvo !== m.fonte && (!f.confunde.includes(m.fonte) || sobre(m.alvo, m.fonte, "arm"))) erro(`${o}: armadilha "${m.fonte}" pode valer para a alternativa de ${m.alvo}`);
      if (!x.base || x.base.texto !== C.base.texto) erro(`${o}: sem o texto-base do caso`);
      break;
    }
    case "match": {
      const fs = m.ids.map((i) => por(m.tab, i));
      if (new Set(m.ids).size !== m.ids.length) erro(`${o}: ids repetidos`);
      x.pares.forEach(([a, b], i) => { if (a !== fs[i].nome || b !== fs[i][m.dir]) erro(`${o}: par ${i} não sai da tabela`); });
      for (let i = 0; i < m.ids.length; i++) for (let j = i + 1; j < m.ids.length; j++) {
        if (sobre(m.ids[i], m.ids[j])) erro(`${o}: ${m.ids[i]} e ${m.ids[j]} coexistem`);
        if (camposIguais(fs[i], fs[j], m.dir)) erro(`${o}: ${m.dir} igual em ${m.ids[i]} e ${m.ids[j]}`);
      }
      break;
    }
    case "fill": {
      const f = por(m.tab, m.alvo);
      if (x.opcoes[x.certa] !== f.nome) erro(`${o}: certa do completar não é o nome do alvo`);
      if (!x.frase.includes(m.campo === "def" ? f.def.replace(/[.…\s]+$/, "") : f.marca.replace(/[.…\s]+$/, ""))) erro(`${o}: frase não traz o ${m.campo} do alvo`);
      for (const id of m.ops) {
        if (id === m.alvo) continue;
        const h = por(m.tab, id);
        if (sobre(m.alvo, id)) erro(`${o}: opção ${id} coexiste com ${m.alvo}`);
        if (camposIguais(h, f, m.campo)) erro(`${o}: opção ${id} tem o mesmo ${m.campo}`);
        if (m.tab === "fun" && m.alvo.endsWith("-foco") !== id.endsWith("-foco")) erro(`${o}: opção de outro tipo`);
      }
      if (new Set(x.opcoes).size !== x.opcoes.length) erro(`${o}: opções repetidas`);
      break;
    }
    case "order": {
      let src;
      if (m.campo === "partes") src = por("gen", m.alvo).partes.map(G.cap);
      else if (m.campo === "destaque") src = por("fig", "gradacao").destaque.map((w) => G.cap(w.replace(/[.,;!?]+$/, "")));
      else src = LEI.PASSOS.map((p) => p.nome);
      if (JSON.stringify(x.itens) !== JSON.stringify(src)) erro(`${o}: ordem não bate com a tabela`);
      break;
    }
    case "mc-tab": case "mc-armadilha": {
      const [de, para] = m.formato ? m.formato.split(">") : ["exemplo", "nome"];
      const tab = m.tab, f = por(tab, m.alvo);
      if (x.alts[x.certa] !== f[para]) erro(`${o}: a certa não é ${para} do alvo`);
      x.alts.forEach((t, i) => {
        if (i === x.certa) return;
        const hs = T(tab).filter((h) => h[para] === t);
        if (m.g === "mc-armadilha") { /* alternativas de nome: dentro de confunde seguro */ }
        if (!hs.length) { erro(`${o}: distratora "${t}" não sai da tabela`); return; }
        for (const h of hs) {
          if (h.id === m.alvo) erro(`${o}: distratora é o próprio alvo`);
          if (camposIguais(h, f, para) || camposIguais(h, f, "def") || camposIguais(h, f, "marca")) erro(`${o}: distratora ${h.id} com mesma def/marca`);
          if (sobre(m.alvo, h.id)) erro(`${o}: distratora ${h.id} coexiste com ${m.alvo}`);
          if (m.g === "mc-armadilha" && !f.confunde.includes(h.id)) erro(`${o}: distratora ${h.id} não é segura para a alternativa de ${m.alvo}`);
          if (tab === "fun" && m.alvo.endsWith("-foco") !== h.id.endsWith("-foco")) erro(`${o}: distratora de outro tipo`);
        }
      });
      if (m.g === "mc-armadilha" && (!x.base || x.base.texto !== LEI.CASOS[m.caso].base.texto)) erro(`${o}: sem texto-base do caso`);
      break;
    }
    case "mc-interpreta": {
      const C = LEI.CASOS[m.caso];
      if (x.alts[x.certa] !== C.correta) erro(`${o}: a certa não é a do caso`);
      const outras = x.alts.filter((_, i) => i !== x.certa).sort(), esp = m.trapIds.map((t) => C.alts[t]).sort();
      if (JSON.stringify(outras) !== JSON.stringify(esp)) erro(`${o}: erradas não são as armadilhas do caso`);
      break;
    }
    default: erro(`${o}: gerador "${m.g}" sem conferência`);
  }
}

// ---------- 3b) mc de figuras reaproveitados do Show: nenhuma distratora que coexista com o alvo ----------
for (const { x, onde } of todos) {
  const mm = /^show:lin-fig-([a-z]+)-(n2d|d2n|e2n)$/.exec(String(x.origem)); if (!mm || x.tipo !== "mc") continue;
  const [, alvo, fmt] = mm, campo = fmt === "n2d" ? "def" : "nome";
  x.alts.forEach((t, i) => {
    if (i === x.certa) return;
    const h = FIG.find((y) => y[campo] === t); if (!h) return;
    const pares = fmt === "e2n" ? [...G.SOBRE_DEF_FIG, ...G.SOBRE_EXEMPLO_FIG] : G.SOBRE_DEF_FIG;
    if (pares.some(([a, b]) => (a === alvo && b === h.id) || (b === alvo && a === h.id))) erro(`${onde}/${x.id}: distratora "${h.id}" coexiste com "${alvo}" (alternativa defensável)`);
  });
}

// ---------- 4) sem repetição entre lições ----------
const chaves = new Map();
for (const { x, onde } of todos) {
  const m = G.META.get(x.id); if (!m) continue;
  const alvo = m.ids ? [...m.ids].sort().join("+") : m.alvo || m.caso;
  const k = [m.g, m.tab, alvo, m.fonte, m.campo || m.dir || m.formato, m.caso].join("|");
  if (chaves.has(k)) erro(`${onde}/${x.id}: repete ${chaves.get(k)} (mesmo gerador, alvo e campo)`);
  else chaves.set(k, `${onde}/${x.id}`);
}
// o mesmo par de tabela (match) nunca sai em duas lições; o mesmo trecho/recorte nunca vira V e F no app inteiro
{
  const pares = new Map();
  for (const { x, onde } of todos) {
    if (x.tipo !== "match") continue;
    for (const [a, b] of x.pares) { const k = a + "→" + b; if (pares.has(k)) erro(`${onde}/${x.id}: par "${k}" já usado em ${pares.get(k)}`); else pares.set(k, onde + "/" + x.id); }
  }
}

// ---------- 5) enem ----------
const nEnemTotal = todos.filter((t) => t.x.tipo === "enem").length;
for (const U of M.unidades) {
  const ex = U.licoes.flatMap((L) => L.exercicios), en = ex.filter((x) => x.tipo === "enem").length;
  if (en > Math.round(0.3 * ex.length)) erro(`${U.id}: ${en} enem em ${ex.length} exercícios (> 30%)`);
  if (U.licoes[0].exercicios.some((x) => x.tipo === "enem")) erro(`${U.id}: enem na 1ª lição`);
  const d = U.desafio;
  if (d.length !== 10) erro(`${U.id}: desafio com ${d.length}`);
  if (d.filter((x) => x.tipo === "enem").length < 4) erro(`${U.id}: desafio com menos de 4 enem`);
  if (d.some((x) => !["mc", "enem"].includes(x.tipo) || x.nivel < 2)) erro(`${U.id}: desafio só mc/enem de nível 2–3`);
  console.log(`${U.id}: ${U.licoes.length} lições, ${ex.length} exercícios (${Object.entries(ex.reduce((a, x) => ((a[x.tipo] = (a[x.tipo] || 0) + 1), a), {})).map(([k, v]) => `${k} ${v}`).join(", ")}), enem nas lições ${en}, no desafio ${d.filter((x) => x.tipo === "enem").length}`);
}
console.log(`enem usados: ${nEnemTotal} de 35`);
// V/F: nem tudo verdadeiro
{ const tf = todos.filter((t) => t.x.tipo === "tf").map((t) => t.x); const v = tf.filter((x) => x.certa).length; console.log(`V/F: ${v} verdadeiras, ${tf.length - v} falsas`); if (!tf.length || v / tf.length > 0.65 || v / tf.length < 0.3) erro(`V/F desbalanceado (${v}/${tf.length} verdadeiras)`); }
// posição da certa nos mc/enem: sem viés grosseiro
{ const pos = [0, 0, 0, 0, 0]; for (const { x } of todos) if (["mc", "enem"].includes(x.tipo)) pos[x.certa]++; console.log("posição da certa (mc/enem): " + pos.slice(0, 4).join("/")); }

// ---------- 6) cobertura ----------
const ids = new Set(todos.map((t) => t.x.id)), metas = [...G.META.values()];
const aparece = (tab, id, prefixoShow) => [...ids].some((i) => i.includes(prefixoShow + id + "-")) || metas.some((m) => m.tab === tab && (m.alvo === id || m.ids?.includes(id) || m.fonte === id || m.ops?.includes(id)));
for (const f of FIG) if (!aparece("fig", f.id, "lin-fig-") && !aparece("fig", f.id, "lin-enem-fig-")) erro(`cobertura: figura "${f.id}" não aparece em nenhuma lição/desafio`);
for (const f of FUN.filter((x) => !x.id.endsWith("-foco"))) if (!aparece("fun", f.id, "lin-fun-") && !aparece("fun", f.id + "-foco", "")) erro(`cobertura: função "${f.id}" não aparece`);
for (const f of GEN) if (!aparece("gen", f.id, "lin-gen-") && !aparece("gen", f.id, "lin-enem-gen-")) erro(`cobertura: gênero "${f.id}" não aparece`);
for (const t of M.temas) {
  const un = M.unidades.filter((u) => u.temas.includes(t.id)), li = M.unidades.flatMap((u) => u.licoes).filter((l) => l.temas.includes(t.id));
  if (!un.length || !li.length) erro(`cobertura: tema "${t.id}" sem unidade (${un.length}) ou sem lição (${li.length})`);
}
console.log("gerados por gerador: " + Object.entries(contaGerados).map(([k, v]) => `${k} ${v}`).join(", "));

console.log(falhas ? `\n${falhas} problema(s) em linguagens` : "\nlinguagens confere");
process.exit(falhas ? 1 : 0);
