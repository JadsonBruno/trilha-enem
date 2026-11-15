// Geradores de exercícios de Linguagens: tf, match, fill, order e mc a partir das TABELAS DE FATOS (fonte/show-do-enem e _leitura.mjs).
// A resposta certa SEMPRE sai da tabela; as erradas vêm dos irmãos que mais confundem, sem sobreposição (coexistência) com o alvo.
// Cada exercício gerado entra em META (id → como foi gerado) para o check-linguagens.mjs reconferir contra as tabelas.
import { FATOS as FIG, PARES_SOBREPOSTOS } from "../../fonte/show-do-enem/lin-figuras.mjs";
import { FATOS as FUN } from "../../fonte/show-do-enem/lin-funcoes.mjs";
import { FATOS as GEN, PARTES } from "../../fonte/show-do-enem/lin-generos.mjs";
import { perguntaDeTabela, sorteio } from "../../fonte/show-do-enem/lin-base.mjs";
import { doShow } from "../_comum/show.mjs";
import { ARMADILHAS, EFEITOS, INTENCOES, PASSOS, CASOS, fatosCaso, SOBREPOSTAS_ARM, SOBREPOSTAS_EFE } from "./_leitura.mjs";

export const META = new Map();

// ---------- coexistência ----------
// Nível da DEFINIÇÃO: figuras cuja definição também serve à outra (a primeira é caso particular da segunda ou vice-versa).
export const SOBRE_DEF_FIG = [["elipse", "zeugma"], ["catacrese", "metafora"], ["personificacao", "metafora"], ["sinestesia", "metafora"]];
// Nível do EXEMPLO (um mesmo trecho pode ter as duas): o que o Show já declarava em lin-figuras.mjs.
export const SOBRE_EXEMPLO_FIG = PARES_SOBREPOSTOS;

export const TABS = {
  fig: { fatos: FIG, rotulo: "figura", Rot: "Figura", sub: "figura de linguagem", sobre: SOBRE_DEF_FIG },
  fun: { fatos: FUN, rotulo: "função", Rot: "Função", sub: "função da linguagem", sobre: [] },
  gen: { fatos: GEN, rotulo: "gênero", Rot: "Gênero", sub: "gênero textual", sobre: [] },
  arm: { fatos: ARMADILHAS, rotulo: "armadilha", Rot: "Armadilha", sub: "armadilha de alternativa", sobre: SOBREPOSTAS_ARM },
  efe: { fatos: EFEITOS, rotulo: "recurso", Rot: "Recurso", sub: "recurso e efeito", sobre: SOBREPOSTAS_EFE },
  int: { fatos: INTENCOES, rotulo: "intenção", Rot: "Intenção", sub: "intenção do autor", sobre: [] },
  pas: { fatos: PASSOS, rotulo: "passo", Rot: "Passo", sub: "passo da leitura", sobre: [] },
};
const POR = Object.fromEntries(Object.entries(TABS).map(([k, t]) => [k, Object.fromEntries(t.fatos.map((f) => [f.id, f]))]));
export const fato = (tab, id) => { const f = POR[tab]?.[id]; if (!f) throw new Error(`tabela ${tab}: "${id}" não existe`); return f; };
export const sobrepoe = (tab, a, b) => TABS[tab].sobre.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
const tipoFun = (id) => id.endsWith("-foco");
const mesmoTipo = (tab, a, b) => tab !== "fun" || tipoFun(a) === tipoFun(b);

// Trechos (exemplo) → figuras/funções que SEGURAMENTE não aparecem neles (único conjunto aceito como "falsa" num V/F de trecho).
export const SEGURAS_EXEMPLO = {
  fig: {
    metafora: ["comparacao", "hiperbole", "antitese", "ironia", "onomatopeia", "eufemismo"],
    comparacao: ["hiperbole", "antitese", "ironia", "metonimia"],
    metonimia: ["comparacao", "hiperbole", "ironia", "antitese", "onomatopeia", "eufemismo"],
    catacrese: ["hiperbole", "ironia", "antitese", "comparacao", "onomatopeia"],
    antitese: ["hiperbole", "comparacao", "onomatopeia", "eufemismo"],
    paradoxo: ["comparacao", "onomatopeia", "eufemismo"],
    hiperbole: ["comparacao", "antitese", "onomatopeia", "eufemismo"],
    eufemismo: ["hiperbole", "comparacao", "antitese", "onomatopeia", "ironia"],
    ironia: ["comparacao", "onomatopeia", "eufemismo", "metonimia"],
    personificacao: ["comparacao", "hiperbole", "antitese", "ironia", "eufemismo"],
    sinestesia: ["comparacao", "hiperbole", "antitese", "ironia", "eufemismo", "onomatopeia"],
    elipse: ["comparacao", "hiperbole", "antitese", "metafora", "ironia", "onomatopeia"],
    zeugma: ["comparacao", "hiperbole", "antitese", "ironia", "metafora"],
    gradacao: ["comparacao", "ironia", "eufemismo", "onomatopeia", "metonimia", "antitese"],
    pleonasmo: ["comparacao", "antitese", "ironia", "onomatopeia", "eufemismo"],
    anafora: ["comparacao", "hiperbole", "ironia", "eufemismo", "onomatopeia", "metonimia"],
    aliteracao: ["comparacao", "hiperbole", "antitese", "ironia", "eufemismo"],
    assonancia: ["comparacao", "ironia", "antitese", "metonimia", "eufemismo"],
    onomatopeia: ["comparacao", "hiperbole", "antitese", "ironia", "eufemismo", "metonimia"],
    hiperbato: ["comparacao", "hiperbole", "antitese", "ironia", "onomatopeia", "eufemismo"],
    polissindeto: ["comparacao", "hiperbole", "antitese", "ironia", "eufemismo", "metonimia"],
    apostrofe: ["comparacao", "hiperbole", "antitese", "ironia", "onomatopeia", "eufemismo"],
  },
  fun: {
    referencial: ["emotiva", "poetica", "metalinguistica", "fatica"],
    emotiva: ["conativa", "metalinguistica", "fatica"],
    conativa: ["metalinguistica", "fatica"],
    fatica: ["metalinguistica", "poetica"],
    metalinguistica: ["emotiva", "conativa", "fatica", "poetica"],
    poetica: ["metalinguistica", "conativa", "fatica"],
    "referencial-foco": ["emotiva-foco", "conativa-foco", "fatica-foco", "metalinguistica-foco", "poetica-foco"],
    "emotiva-foco": ["conativa-foco", "metalinguistica-foco", "fatica-foco"],
    "conativa-foco": ["metalinguistica-foco", "poetica-foco"],
    "fatica-foco": ["metalinguistica-foco", "poetica-foco"],
    "metalinguistica-foco": ["emotiva-foco", "conativa-foco", "fatica-foco", "poetica-foco"],
    "poetica-foco": ["conativa-foco", "fatica-foco", "emotiva-foco"],
  },
};

// ---------- ajudantes ----------
export const lc = (s) => (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ](\s|$)/.test(s) ? s : s.charAt(0).toLowerCase() + s.slice(1));
export const porNivel = (arr) => arr.map((x, i) => [x, i]).sort((a, b) => a[0].nivel - b[0].nivel || a[1] - b[1]).map((p) => p[0]);
export const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const semPonto = (s) => String(s).replace(/[.…\s]+$/, "");
const lim = (s, max, onde) => { if (s.length > max) throw new Error(`${onde}: texto com ${s.length} > ${max}: "${s}"`); return s; };
const embaralha = (a, rnd) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const reg = (id, meta) => { if (META.has(id)) throw new Error(`id gerado repetido: ${id}`); META.set(id, meta); };
const CARTAO = (f, tab) => ({ kind: "lin-cartao", titulo: f.nome, sub: TABS[tab].sub, ...(f.icone ? { icone: f.icone } : {}) });

function exerc(lid, tipo, slug, o) {
  const id = `${lid}:${tipo}-${slug}`;
  lim(o.enunciado, 120, id + " enunciado"); lim(o.explicacao, 150, id + " explicação");
  return { id, tipo, nivel: o.nivel ?? 1, ...o };
}

// ---------- V ou F ----------
// campo "def" ou "marca": a afirmação usa o fato `fonte` (o próprio alvo = verdadeira; outro irmão = falsa).
export function tfDef(lid, tab, alvo, fonte = alvo, nivel = 1, campo = "def") {
  const f = fato(tab, alvo), g = fato(tab, fonte), verdade = alvo === fonte;
  if (!verdade) {
    if (!mesmoTipo(tab, alvo, fonte)) throw new Error(`${lid}: ${alvo} × ${fonte} de tipos diferentes`);
    if (sobrepoe(tab, alvo, fonte)) throw new Error(`${lid}: ${alvo} e ${fonte} coexistem; V/F ambíguo`);
    if (f[campo].toLowerCase() === g[campo].toLowerCase()) throw new Error(`${lid}: ${campo} igual`);
  }
  const enunciado = campo === "def" ? `${f.nome}: ${lc(g.def)}.` : `Marca de “${f.nome}”: ${g.marca}`;
  const explicacao = campo === "def"
    ? (verdade ? `${f.nome}: ${lc(f.def)}.` : `Isso descreve ${g.nome}. ${f.nome}: ${lc(f.def)}.`)
    : (verdade ? `${f.nome}: ${f.marca}.` : `Isso é marca de ${g.nome}. ${f.nome}: ${f.marca}.`);
  const slug = `${campo}-${alvo}${verdade ? "" : "-x-" + fonte}`;
  const x = exerc(lid, "tf", slug, { nivel, enunciado, certa: verdade, explicacao, fig: [CARTAO(f, tab)], origem: "gerado:tf-" + campo, ref: f.ref });
  reg(x.id, { g: "tf-" + campo, tab, alvo, fonte, verdade, campo });
  return x;
}

// trecho (exemplo do alvo) + afirmação "neste trecho há X": X = alvo (V) ou uma figura/função segura (F).
export function tfExemplo(lid, tab, alvo, outro = alvo, nivel = 1) {
  if (tab !== "fig" && tab !== "fun") throw new Error("tfExemplo só para fig/fun");
  const f = fato(tab, alvo), g = fato(tab, outro), verdade = alvo === outro;
  if (!verdade && !(SEGURAS_EXEMPLO[tab][alvo] || []).includes(tab === "fun" ? outro : outro)) throw new Error(`${lid}: "${outro}" não é segura para o trecho de ${alvo}`);
  const enunciado = tab === "fig" ? `Neste trecho há ${lc(g.nome)}.` : `Neste trecho predomina a função ${lc(g.nome)}.`;
  const explicacao = verdade ? `${f.nome}: ${lc(f.def)}.` : `Não é ${g.nome}. O trecho traz ${f.nome}: ${lc(f.def)}.`;
  const x = exerc(lid, "tf", `trecho-${alvo}${verdade ? "" : "-x-" + outro}`, {
    nivel, enunciado, certa: verdade, explicacao,
    fig: [{ kind: "lin-frase", texto: f.exemplo, ...(f.fonte ? { fonte: f.fonte } : {}), ...(f.destaque ? { destaque: f.destaque } : {}) }],
    origem: "gerado:tf-trecho", ref: f.ref,
  });
  reg(x.id, { g: "tf-trecho", tab, alvo, fonte: outro, verdade });
  return x;
}

// recorte esquemático de um gênero + "este recorte é de X". Falsa só quando os layouts são bem diferentes (Jaccard das partes ≤ 0,34).
export const jaccPartes = (a, b) => { const A = new Set(PARTES[a] || []), B = new Set(PARTES[b] || []); let n = 0; for (const k of A) if (B.has(k)) n++; return n / (A.size + B.size - n); };
export const LAYOUT_PARECIDO_MAX = 0.34;
export function tfRecorte(lid, alvo, outro = alvo, nivel = 1) {
  const f = fato("gen", alvo), g = fato("gen", outro), verdade = alvo === outro;
  if (!PARTES[alvo]) throw new Error(`${alvo} sem recorte`);
  if (!verdade && jaccPartes(alvo, outro) > LAYOUT_PARECIDO_MAX) throw new Error(`${lid}: recortes de ${alvo} e ${outro} parecidos demais`);
  const x = exerc(lid, "tf", `recorte-${alvo}${verdade ? "" : "-x-" + outro}`, {
    nivel, enunciado: `O recorte mostra o gênero ${g.nome}.`, certa: verdade,
    explicacao: verdade ? `${f.nome}: ${lc(f.def)}.` : `O recorte é de ${f.nome}, não de ${g.nome}. ${f.nome}: ${lc(f.def)}.`,
    fig: [{ kind: "lin-gen-recorte", genero: alvo }], origem: "gerado:tf-recorte", ref: f.ref,
  });
  reg(x.id, { g: "tf-recorte", tab: "gen", alvo, fonte: outro, verdade });
  return x;
}

// alternativa-exemplo de um caso de leitura + "esta alternativa erra por X" (X = a armadilha dela, ou uma que seguramente não se aplica)
export function tfTrap(lid, caso, alvo, outro = alvo, nivel = 2) {
  const f = fato("arm", alvo), g = fato("arm", outro), verdade = alvo === outro, C = CASOS[caso];
  if (!verdade && !f.confunde.includes(outro)) throw new Error(`${lid}: "${outro}" não é segura para a alternativa de ${alvo}`);
  const x = exerc(lid, "tf", `armadilha-${caso}-${alvo}${verdade ? "" : "-x-" + outro}`, {
    nivel, enunciado: `Esta alternativa erra por ${lc(g.nome)}.`, certa: verdade,
    explicacao: verdade ? `${f.nome}: ${lc(f.def)}.` : `Não: o erro dela é ${lc(f.nome)}, que ${lc(f.def)}.`,
    fig: [{ kind: "lin-frase", texto: C.alts[alvo] }], base: { ...C.base, titulo: C.pergunta },
    origem: "gerado:tf-armadilha", ref: f.ref,
  });
  reg(x.id, { g: "tf-armadilha", tab: "arm", caso, alvo, fonte: outro, verdade });
  return x;
}

// ---------- ligar ----------
const ENUN_MATCH = { def: (r) => `Ligue cada ${r} à sua definição.`, marca: (r) => `Ligue cada ${r} ao seu sinal.`, funcao: (r) => `Ligue cada ${r} à sua função.` };
export function matchPares(lid, tab, ids, dir = "def", { nivel = 2, enun, slug } = {}) {
  const T = TABS[tab];
  const fs = ids.map((i) => fato(tab, i));
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) {
    if (sobrepoe(tab, ids[i], ids[j])) throw new Error(`${lid}: ${ids[i]} e ${ids[j]} coexistem no mesmo ligar`);
    if (!mesmoTipo(tab, ids[i], ids[j])) throw new Error(`${lid}: tipos misturados`);
  }
  const pares = fs.map((f) => [lim(f.nome, 40, lid + " nome"), lim(f[dir], 40, `${lid} ${f.id}.${dir}`)]);
  let explicacao = "";
  for (const [a, b] of pares) { const t = `${a}: ${lc(b)}. `; if ((explicacao + t).trim().length <= 150) explicacao += t; }
  const x = exerc(lid, "match", slug || `${dir}-${ids.join("-")}`, {
    nivel, enunciado: enun || ENUN_MATCH[dir](T.rotulo), pares, explicacao: explicacao.trim(), origem: "gerado:match-" + dir, ref: fs[0].ref,
  });
  reg(x.id, { g: "match", tab, ids, dir });
  return x;
}

// ---------- completar ----------
export function fill(lid, tab, alvo, campo = "def", nivel = 2) {
  const T = TABS[tab], f = fato(tab, alvo), rnd = sorteio(`${lid}:fill-${campo}-${alvo}`);
  const base = campo === "def" ? semPonto(f.def) + "." : `Sinal: ${semPonto(f.marca)}.`;
  const frase = lim(`${base} ${T.Rot}: ___.`, 160, lid + " frase");
  if (base.includes("___")) throw new Error("frase com ___");
  const cand = [...f.confunde, ...T.fatos.map((x) => x.id)].filter((c, i, a) => a.indexOf(c) === i && c !== alvo && mesmoTipo(tab, alvo, c) && !sobrepoe(tab, alvo, c));
  const erradas = [];
  for (const c of cand) { const n = fato(tab, c).nome; if (n.length <= 30 && n.toLowerCase() !== f.nome.toLowerCase() && !erradas.some((e) => e.nome === n)) erradas.push({ id: c, nome: n }); if (erradas.length === 3) break; }
  if (erradas.length < 3) throw new Error(`${lid}: poucas opções para ${alvo}`);
  const ops = embaralha([{ id: alvo, nome: f.nome }, ...erradas], rnd);
  if (f.nome.length > 30) throw new Error(`${alvo}: nome > 30`);
  const x = exerc(lid, "fill", `${campo}-${alvo}`, {
    nivel, enunciado: `Complete com ${["gen", "efe", "pas"].includes(tab) ? "o" : "a"} ${T.rotulo} que combina.`, frase, opcoes: ops.map((o) => o.nome), certa: ops.findIndex((o) => o.id === alvo),
    explicacao: campo === "def" ? `${f.nome}: ${lc(f.def)}.` : `${f.nome}: ${f.marca}.`, origem: "gerado:fill-" + campo, ref: f.ref,
  });
  reg(x.id, { g: "fill", tab, alvo, campo, ops: ops.map((o) => o.id) });
  return x;
}

// ---------- ordenar ----------
export function orderLista(lid, slug, itens, { enunciado, explicacao, nivel = 2, origem, ref, meta }) {
  itens.forEach((s) => lim(s, 50, lid + " item"));
  const x = exerc(lid, "order", slug, { nivel, enunciado, itens, explicacao: explicacao || `Ordem certa: ${itens.join(" → ")}.`, origem, ref });
  reg(x.id, { g: "order", ...meta, itens });
  return x;
}
export function orderPartes(lid, alvo, nivel = 2) {
  const f = fato("gen", alvo);
  return orderLista(lid, `partes-${alvo}`, f.partes.map(cap), {
    nivel, enunciado: `Gênero ${f.nome}: ponha as partes na ordem em que aparecem.`, explicacao: `${f.nome}: ${f.partes.join(" → ")}.`,
    origem: "gerado:order-partes", ref: f.ref, meta: { tab: "gen", alvo, campo: "partes" },
  });
}
// gradação: os termos do exemplo da tabela, em escala crescente (a ordem do destaque é a do próprio exemplo)
export function orderGradacao(lid, nivel = 2) {
  const f = fato("fig", "gradacao"), itens = f.destaque.map((w) => cap(w.replace(/[.,;!?]+$/, "")));
  return orderLista(lid, "gradacao", itens, {
    nivel, enunciado: "Gradação crescente: ponha os termos do mais fraco ao mais forte.", explicacao: `Gradação: ${itens.join(" → ").toLowerCase()}, em escala crescente.`,
    origem: "gerado:order-gradacao", ref: f.ref, meta: { tab: "fig", alvo: "gradacao", campo: "destaque" },
  });
}
export function orderPassos(lid, nivel = 2) {
  const itens = PASSOS.map((p) => p.nome);
  return orderLista(lid, "passos", itens, {
    nivel, enunciado: "Ponha os passos de uma questão de interpretação na ordem certa.", explicacao: `Ordem: ${itens.join(" → ")}.`,
    origem: "gerado:order-passos", ref: PASSOS[0].ref, meta: { tab: "pas", campo: "ordem" },
  });
}

// ---------- múltipla escolha geradas ----------
export function mcTab(lid, tab, alvo, formato, nivel, { slug, text, confunde, hint } = {}) {
  const T = TABS[tab], f = fato(tab, alvo);
  const conf = confunde || f.confunde.filter((c) => mesmoTipo(tab, alvo, c) && !sobrepoe(tab, alvo, c));
  if (conf.length < 3) throw new Error(`${lid}: confunde de ${alvo} com ${conf.length}`);
  const id = `${lid}:mc-${slug || alvo + "-" + formato.replace(">", "2")}`;
  const q = perguntaDeTabela({ fatos: T.fatos, alvo, formato, id, pat: 4, lvl: nivel, rotulo: T.rotulo, text, confunde: conf, hint: hint ? { t: hint } : undefined, why: `${f.nome}: ${lc(f.def)}.` });
  const x = doShow(q, { id, origem: "gerado:mc-" + tab });
  if (new Set(x.alts).size !== x.alts.length) throw new Error(id + ": alts repetidas");
  reg(id, { g: "mc-tab", tab, alvo, formato, certaTexto: x.alts[x.certa], alts: x.alts });
  return x;
}
export function mcTrap(lid, caso, alvo, nivel = 2, slug) {
  const f = fato("arm", alvo), C = CASOS[caso], id = `${lid}:mc-${slug || "armadilha-" + caso + "-" + alvo}`;
  const q = perguntaDeTabela({ fatos: fatosCaso(caso), alvo, formato: "exemplo>nome", id, pat: 4, lvl: nivel, rotulo: "armadilha", text: "Que armadilha esta alternativa traz?", confunde: f.confunde, hint: { t: "Compare a alternativa com o que o texto realmente diz." }, why: `${f.nome}: ${lc(f.def)}.` });
  const x = doShow(q, { id, origem: "gerado:mc-armadilha", base: { ...C.base, titulo: C.pergunta } });
  reg(id, { g: "mc-armadilha", tab: "arm", caso, alvo, certaTexto: x.alts[x.certa], alts: x.alts });
  return x;
}
// "qual alternativa interpreta bem o trecho": a certa é a `correta` do caso; as erradas são 3 alternativas-armadilha do mesmo caso
export function mcInterpreta(lid, caso, nivel, trapIds, slug) {
  const C = CASOS[caso], id = `${lid}:mc-interpreta-${slug || caso}`, rnd = sorteio(id);
  if (trapIds.length !== 3) throw new Error("3 armadilhas");
  const alts = embaralha([C.correta, ...trapIds.map((t) => C.alts[t])], rnd);
  const x = {
    id, tipo: "mc", nivel, enunciado: C.pergunta, alts, certa: alts.indexOf(C.correta), base: C.base,
    explicacao: lim(`Certa: ${C.correta} As outras erram por ${trapIds.map((t) => lc(fato("arm", t).nome)).join(", ")}.`, 150, id), origem: "gerado:mc-interpreta", ref: ARMADILHAS[0].ref,
  };
  reg(id, { g: "mc-interpreta", caso, trapIds, certaTexto: C.correta, alts });
  return x;
}

// reaproveita um enem do Show trocando só a fonte exibida (ex.: corrigir a descrição do suporte); o texto-base não muda
export const comFonte = (x, fonte) => ({ ...x, base: { ...x.base, fonte } });
