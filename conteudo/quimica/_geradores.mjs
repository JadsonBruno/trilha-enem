// Geradores de exercícios da Química: tf, match, order e fill criados POR CÓDIGO a partir dos modelos do Show
// (analyze, fromSpec, oxidize, esterify, combustion, PE, SOLUB, FUNCS, PREFIX). Nenhuma resposta é digitada:
// a certa sai do modelo; o checks/check-quimica.mjs recalcula tudo de novo, sem usar este arquivo.
import { MOLS, an, graphSig, WHYF } from "../../fonte/show-do-enem/questions.mjs";
import { FNAME, fText, analyze, fromSpec } from "../../fonte/show-do-enem/chem.mjs";
import { SOLUB_LEVEL, PREFIX, FUNCS, oxidize, esterify, combustion } from "../../fonte/show-do-enem/model.mjs";

import { doShow } from "../_comum/show.mjs";

export const slug = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const up = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const num = (x) => String(x).replace(".", ",").replace("-", "−");
export const nome = (k) => lc(MOLS[k].nome); // nome para frases ("timol", "etanoato de etila (acetato de etila)")
export const nomeCurto = (k) => an(k).name ?? lc(MOLS[k].nome); // nome IUPAC quando existe
const mol = (k, extra = {}) => ({ kind: "mol", k, ...extra });
const nm = (f) => FNAME[f];
// descrição curta do grupo; éter e éster ganham frases bem distintas (o que separa os dois é o C=O)
export const GRUPO = (f) => ({ eter: "−O− sem C=O ao lado", ester: "C=O ligado a −O−C" })[f] ?? FUNCS[f].grupo;
const ART = { alcool: "um álcool", fenol: "um fenol", eter: "um éter", aldeido: "um aldeído", cetona: "uma cetona", acido: "um ácido carboxílico", ester: "um éster" };
const SUFTXT = { alcool: "-ol álcool", aldeido: "-al aldeído", cetona: "-ona cetona", acido: "…oico ácido", ester: "…ato de …ila éster", eter: "…oxi…ano éter", fenol: "fenol (OH no anel)" };
const nmLc = (f) => FNAME[f].toLowerCase();

// figura com o grupo de uma função marcado (para os cartões): índices dos átomos do grupo, calculados por analyze
export function molFig(k, func) {
  if (!func) return mol(k);
  const A = an(k), g = A.groups.find((x) => x.func === func);
  if (!g) throw new Error(`molFig: ${k} não tem ${func}`);
  return mol(k, { mark: g.atoms.map((id) => A.atoms.findIndex((a) => a.id === id)) });
}

// receita → nome (cadeia normal montada por fromSpec e nomeada por analyze)
export const specName = (spec) => analyze(fromSpec(spec)).name;

function pronto(ex) {
  const lim = (v, n, c) => { if (typeof v === "string" && v.length > n) throw new Error(`${ex.id}: ${c} com ${v.length} > ${n}: ${v}`); };
  lim(ex.enunciado, 120, "enunciado"); lim(ex.explicacao, 150, "explicacao");
  if (ex.tipo === "match") ex.pares.forEach(([a, b]) => { lim(a, 40, "match"); lim(b, 40, "match"); });
  if (ex.tipo === "order") ex.itens.forEach((s) => lim(s, 50, "order"));
  if (ex.tipo === "fill") ex.opcoes.forEach((s) => lim(s, 30, "opção"));
  return ex;
}
const base = (id, tipo, nivel, enunciado, explicacao, gerador) => ({ id, tipo, nivel, enunciado, explicacao, origem: "gerado:" + gerador });

// ----------------------------------------------------------------------------- V ou F
export function tfFuncao(lid, k, f, nivel = 1) {
  const A = an(k), certa = A.funcs.includes(f);
  const tem = A.funcs.length ? A.funcs.map((x) => nmLc(x)).join(", ") : "só C e H (hidrocarboneto)";
  return pronto({
    ...base(`${lid}:tf-${f}-${slug(k)}`, "tf", nivel, `Esta molécula tem a função ${nmLc(f)}.`,
      certa ? `${up(nome(k))}: ${WHYF[f]}` : `${up(nome(k))} tem ${tem}, não ${nmLc(f)}. ${WHYF[f]}`, "tf-funcao"),
    fig: [mol(k)], certa,
  });
}
export function tfFormula(lid, k, delta = 0, nivel = 2) {
  const A = an(k), c = A.count, mostrada = fText({ ...c, H: c.H + delta });
  return pronto({
    ...base(`${lid}:tf-formula-${slug(k)}${delta ? "-" + (delta > 0 ? "m" : "n") + Math.abs(delta) : ""}`, "tf", nivel, `A fórmula molecular desta substância é ${mostrada}.`,
      `${up(nome(k))}: ${c.C} C, ${c.H} H${c.O ? `, ${c.O} O` : ""} → ${A.formula}. Cada C completa 4 ligações.`, "tf-formula"),
    fig: [mol(k)], certa: mostrada === A.formula,
  });
}
export function tfCarbonos(lid, k, mostrado, nivel = 1) {
  const A = an(k);
  return pronto({
    ...base(`${lid}:tf-carbonos-${slug(k)}-${mostrado}`, "tf", nivel, `Esta molécula tem ${mostrado} átomos de carbono.`,
      `${up(nome(k))} tem ${A.count.C} carbonos (pontas e dobras do bastão, ${A.formula}).`, "tf-carbonos"),
    fig: [mol(k)], certa: A.count.C === mostrado,
  });
}
const CAD = {
  ramificada: ["A cadeia carbônica desta molécula é ramificada.", (c) => c.ram === "ramificada"],
  normal: ["A cadeia carbônica desta molécula é normal (sem ramificação).", (c) => c.ram === "normal"],
  insaturada: ["Esta molécula tem cadeia insaturada (dupla ou tripla entre carbonos).", (c) => c.lig === "insaturada"],
  saturada: ["Esta molécula tem cadeia saturada (só ligações simples).", (c) => c.lig === "saturada"],
  heterogenea: ["A cadeia desta molécula é heterogênea (tem O entre carbonos).", (c) => c.het.startsWith("heterogênea")],
  fechada: ["A cadeia desta molécula é fechada (forma um anel).", (c) => c.forma.startsWith("fechada")],
};
export function tfCadeia(lid, k, prop, nivel = 1) {
  const A = an(k), [txt, f] = CAD[prop], c = A.chain;
  if ((prop === "insaturada" || prop === "saturada") && c.lig === "aromática") throw new Error(`tfCadeia: ${k} é aromática, ambíguo`);
  return pronto({
    ...base(`${lid}:tf-cadeia-${prop}-${slug(k)}`, "tf", nivel, txt, `${up(nome(k))}: cadeia ${c.forma.split(" ")[0]}, ${c.ram}, ${c.lig}, ${c.het.split(" ")[0]}.`, "tf-cadeia"),
    fig: [mol(k)], certa: f(c),
  });
}
export function tfFamilia(lid, k, fam, nivel = 1) {
  const A = an(k);
  return pronto({
    ...base(`${lid}:tf-familia-${slug(fam)}-${slug(k)}`, "tf", nivel, `Este hidrocarboneto é um ${fam}.`,
      `${up(nome(k))} é ${A.family.nome}${A.family.geral ? " (" + A.family.geral + ")" : ""}.`, "tf-familia"),
    fig: [mol(k)], certa: A.family.nome === fam,
  });
}
export function tfPE(lid, a, b, nivel = 2) {
  const A = an(a), B = an(b);
  const razao = A.forces.hbond !== B.forces.hbond ? `${up(nome(A.forces.hbond ? a : b))} tem O−H e faz ligação de hidrogênio.` : "Mesma força: pesa a cadeia maior.";
  return pronto({
    ...base(`${lid}:tf-pe-${slug(a)}-${slug(b)}`, "tf", nivel, `${up(nome(a))} ferve em temperatura mais alta que ${nome(b)}.`,
      `${up(nomeCurto(a))} ≈ ${num(A.pe)} °C; ${nomeCurto(b)} ≈ ${num(B.pe)} °C. ${razao}`, "tf-pe"),
    fig: [mol(a), mol(b)], certa: A.pe > B.pe,
  });
}
export function tfSolub(lid, k, nivel = 1) {
  const A = an(k);
  return pronto({
    ...base(`${lid}:tf-solub-${slug(k)}`, "tf", nivel, "Esta substância se mistura bem com a água.",
      `${up(nome(k))}: ${A.solub} em água.${A.func === "hidrocarboneto" ? " Só C e H: apolar." : ""}`, "tf-solub"),
    fig: [mol(k)], certa: !!A.mixes,
  });
}
export function tfHbond(lid, k, nivel = 1) {
  const A = an(k);
  return pronto({
    ...base(`${lid}:tf-hbond-${slug(k)}`, "tf", nivel, "As moléculas desta substância fazem ligação de hidrogênio entre si.",
      A.forces.hbond ? `${up(nome(k))} tem O−H: o H de uma molécula é atraído pelo O da vizinha.` : `${up(nome(k))} não tem H preso em O. Sem O−H, não há ligação de hidrogênio.`, "tf-hbond"),
    fig: [mol(k)], certa: A.forces.hbond,
  });
}
const SAMEFUNC = (a, b) => [...an(a).funcs].sort().join() === [...an(b).funcs].sort().join();
export const tipoIso = (a, b) => {
  const A = an(a), B = an(b);
  if (A.formula !== B.formula) return null;
  if (graphSig(MOLS[a].m) === graphSig(MOLS[b].m)) return null;
  if (!SAMEFUNC(a, b)) return "função";
  if (A.chain.ram !== B.chain.ram || A.chain.forma !== B.chain.forma) return "cadeia";
  return "posição";
};
export function tfIso(lid, a, b, nivel = 2) {
  const t = tipoIso(a, b);
  return pronto({
    ...base(`${lid}:tf-iso-${slug(a)}-${slug(b)}`, "tf", nivel, "Estas duas moléculas são isômeros.",
      t ? `${an(a).formula} e ${an(b).formula}: mesma fórmula, estruturas diferentes (isomeria de ${t}).` : `${an(a).formula} × ${an(b).formula}: fórmulas diferentes, não há isomeria.`, "tf-iso"),
    fig: [mol(a), mol(b)], certa: !!t,
  });
}
export function tfOxid(lid, a, mostradoK, nivel = 2) {
  const real = specName(oxidize(MOLS[a].spec));
  return pronto({
    ...base(`${lid}:tf-oxid-${slug(a)}-${slug(mostradoK)}`, "tf", nivel, `Oxidar o ${nomeCurto(a)} (perde 2 H) forma ${nomeCurto(mostradoK)}.`,
      `${up(nomeCurto(a))} oxidado → ${real}: ${oxidize(MOLS[a].spec).group === "CO" ? "OH no meio vira cetona." : "OH de ponta vira aldeído."}`, "tf-oxid"),
    fig: [mol(a), mol(mostradoK)], certa: nomeCurto(mostradoK) === real,
  });
}
export function tfEster(lid, acido, alcool, mostradoK, nivel = 2) {
  const real = specName(esterify(MOLS[acido].spec, MOLS[alcool].spec));
  return pronto({
    ...base(`${lid}:tf-ester-${slug(acido)}-${slug(alcool)}-${slug(mostradoK)}`, "tf", nivel, `${up(nomeCurto(acido))} + ${nomeCurto(alcool)} formam o éster da figura (e água).`,
      `Éster certo: ${real}. O lado do C=O vem do ácido; o lado do −O−C vem do álcool.`, "tf-ester"),
    fig: [mol(mostradoK)], certa: nomeCurto(mostradoK) === real,
  });
}
export function tfComb(lid, k, mostrado, nivel = 2) {
  const A = an(k), r = combustion(A);
  return pronto({
    ...base(`${lid}:tf-comb-${slug(k)}-${String(mostrado).replace(".", "v")}`, "tf", nivel, `Na combustão completa de 1 mol, esta substância consome ${num(mostrado)} mol de O₂.`,
      `${A.formula} + ${num(r.O2)} O₂ → ${r.CO2} CO₂ + ${r.H2O} H₂O.`, "tf-comb"),
    fig: [mol(k)], certa: r.O2 === mostrado,
  });
}

// ----------------------------------------------------------------------------- ligar (match)
export function matchFuncNome(lid, ks, nivel = 1) {
  const pares = ks.map((k) => { const A = an(k); if (A.funcs.length !== 1) throw new Error(k + " não tem 1 função"); return [nomeCurto(k), nm(A.funcs[0])]; });
  return pronto({ ...base(`${lid}:match-nome-funcao`, "match", nivel, "Ligue o nome da substância à sua função.", "Pelo final do nome: " + [...new Set(pares.map(([, d]) => Object.keys(FNAME).find((f) => FNAME[f] === d)))].map((f) => SUFTXT[f]).join("; ") + ".", "match-nome-funcao"), pares });
}
export function matchCtx(lid, ks, nivel = 1) {
  const pares = ks.map((k) => { const A = an(k); if (A.funcs.length !== 1 || !MOLS[k].ctx) throw new Error(k); return [up(MOLS[k].ctx), nm(A.funcs[0])]; });
  return pronto({ ...base(`${lid}:match-dia-a-dia`, "match", nivel, "Ligue a substância do dia a dia à sua função orgânica.", "O grupo de cada uma decide a função: −OH em carbono de cadeia é álcool, C=O no meio é cetona, −CHO é aldeído.", "match-dia-a-dia"), pares });
}
export function matchGrupo(lid, fs, nivel = 1) {
  const pares = fs.map((f) => [GRUPO(f), nm(f)]);
  const expl = fs.includes("eter") && fs.includes("ester") ? "Éter: O entre carbonos, sem C=O ao lado. Éster: o C=O está ligado a um −O− que segue para outro carbono." : "O que decide a função é o grupo com O e o que há em volta dele.";
  return pronto({ ...base(`${lid}:match-grupo-${fs.join("-")}`, "match", nivel, "Ligue o grupo funcional à função.", expl, "match-grupo"), pares });
}
export function matchPrefixo(lid, ns, nivel = 1) {
  const pares = ns.map((n) => [`${n} ${n === 1 ? "carbono" : "carbonos"}`, PREFIX[n - 1]]);
  return pronto({ ...base(`${lid}:match-prefixo`, "match", nivel, "Ligue o número de carbonos ao prefixo do nome.", "Prefixos: 1 met, 2 et, 3 prop, 4 but, 5 pent, 6 hex, 7 hept, 8 oct.", "match-prefixo"), pares });
}
export function matchFamilia(lid, ks, nivel = 1) {
  const pares = ks.map((k) => [nomeCurto(k), an(k).family.geral]);
  return pronto({ ...base(`${lid}:match-familia`, "match", nivel, "Ligue o hidrocarboneto ao que identifica sua família.", "Alcano CₙH₂ₙ₊₂; cada dupla tira 2 H (alceno), cada tripla tira 4 H (alcino). Benzeno: anel.", "match-familia"), pares });
}
export function matchOxid(lid, ks, nivel = 2) {
  const pares = ks.map((k) => [nomeCurto(k), specName(oxidize(MOLS[k].spec))]);
  return pronto({ ...base(`${lid}:match-oxidacao`, "match", nivel, "Ligue cada álcool ao produto da oxidação (perde 2 H).", "Álcool de ponta oxida a aldeído; álcool no meio da cadeia oxida a cetona.", "match-oxidacao"), pares });
}
export function matchEster(lid, prs, nivel = 2) {
  const pares = prs.map(([ac, al]) => [`${nomeCurto(ac)} + ${nomeCurto(al)}`, specName(esterify(MOLS[ac].spec, MOLS[al].spec))]);
  return pronto({ ...base(`${lid}:match-esterificacao`, "match", nivel, "Ligue ácido + álcool ao éster formado.", "O nome do éster junta o ácido (…ato) e o álcool (…ila).", "match-esterificacao"), pares });
}
export function matchIso(lid, prs, nivel = 2) {
  const pares = prs.map(([a, b]) => [`${nomeCurto(a)} × ${nomeCurto(b)}`, "Isomeria de " + tipoIso(a, b)]);
  return pronto({ ...base(`${lid}:match-isomeria`, "match", nivel, "Ligue cada par de isômeros ao seu tipo.", "Função: grupo muda. Cadeia: esqueleto muda. Posição: o grupo troca de lugar.", "match-isomeria"), pares });
}

// ----------------------------------------------------------------------------- ordenar (order)
export function orderOxid(lid, k, nivel = 2) {
  const itens = [nomeCurto(k)]; let sp = MOLS[k].spec;
  while ((sp = oxidize(sp))) itens.push(specName(sp));
  return pronto({ ...base(`${lid}:order-oxidacao-${slug(k)}`, "order", nivel, `Ordene a oxidação do ${nomeCurto(k)}, do começo ao fim.`, "Álcool → aldeído (perde 2 H) → ácido (ganha 1 O). É o caminho do vinho ao vinagre.", "order-oxidacao"), itens });
}
export function orderPE(lid, ks, nivel = 2) {
  const s = [...ks].sort((a, b) => an(a).pe - an(b).pe);
  if (new Set(s.map((k) => an(k).pe)).size !== s.length) throw new Error("PE repetido");
  return pronto({
    ...base(`${lid}:order-pe-${slug(ks[0])}`, "order", nivel, "Ordene de quem ferve primeiro (menor PE) até quem ferve por último.",
      `PE aprox.: ${s.map((k) => `${nomeCurto(k)} ${num(an(k).pe)} °C`).join(", ")}.`, "order-pe"),
    itens: s.map(nomeCurto),
  });
}
export function orderSolub(lid, ks, nivel = 2) {
  const s = [...ks].sort((a, b) => SOLUB_LEVEL[an(b).solub] - SOLUB_LEVEL[an(a).solub]);
  if (new Set(s.map((k) => SOLUB_LEVEL[an(k).solub])).size !== s.length) throw new Error("solubilidade repetida");
  return pronto({
    ...base(`${lid}:order-solub-${slug(ks[0])}`, "order", nivel, "Ordene da que mais se mistura com a água até a que menos se mistura.",
      s.map((k) => `${nomeCurto(k)} ${an(k).solub}`).join(" > ") + ".", "order-solub"),
    itens: s.map(nomeCurto),
  });
}
export function orderCarbonos(lid, ks, nivel = 1) {
  const s = [...ks].sort((a, b) => an(a).count.C - an(b).count.C);
  if (new Set(s.map((k) => an(k).count.C)).size !== s.length) throw new Error("nº de C repetido");
  return pronto({
    ...base(`${lid}:order-carbonos-${slug(ks[0])}`, "order", nivel, "Ordene do menor para o maior número de carbonos.", s.map((k) => `${nomeCurto(k)} ${an(k).count.C} C`).join(", ") + ".", "order-carbonos"),
    itens: s.map(nomeCurto),
  });
}
export function orderO2(lid, ks, nivel = 2) {
  const s = [...ks].sort((a, b) => combustion(an(a)).O2 - combustion(an(b)).O2);
  if (new Set(s.map((k) => combustion(an(k)).O2)).size !== s.length) throw new Error("O2 repetido");
  return pronto({
    ...base(`${lid}:order-o2-${slug(ks[0])}`, "order", nivel, "Ordene do que consome menos O₂ ao que consome mais (combustão completa, 1 mol).",
      s.map((k) => `${nomeCurto(k)} ${num(combustion(an(k)).O2)}`).join(", ") + " mol de O₂.", "order-o2"),
    itens: s.map(nomeCurto),
  });
}

// ----------------------------------------------------------------------------- completar (fill)
function opcoes(certa, outras, n = 4) {
  const todas = [certa, ...outras.filter((x) => x !== certa)].filter((x, i, a) => a.indexOf(x) === i).slice(0, n);
  return { opcoes: todas, certa: 0 };
}
export function fillFormula(lid, k, nivel = 1) {
  const A = an(k), c = A.count;
  const o = opcoes(A.formula, [fText({ ...c, H: c.H - 2 }), fText({ ...c, H: c.H + 2 }), fText({ ...c, C: c.C - 1, H: c.H - 2 })]);
  return pronto({ ...base(`${lid}:fill-formula-${slug(k)}`, "fill", nivel, "Complete com a fórmula molecular.", `${up(nome(k))}: ${c.C} C e ${c.H} H${c.O ? `, ${c.O} O` : ""} → ${A.formula}.`, "fill-formula"), frase: `A fórmula molecular de ${nome(k)} é ___.`, ...o });
}
export function fillPrefixo(lid, n, nivel = 1) {
  const o = opcoes(PREFIX[n - 1], [PREFIX[n], PREFIX[n - 2], PREFIX[n + 1]].filter(Boolean));
  return pronto({ ...base(`${lid}:fill-prefixo-${n}`, "fill", nivel, "Complete com o prefixo do nome.", "Prefixos: 1 met, 2 et, 3 prop, 4 but, 5 pent, 6 hex, 7 hept, 8 oct.", "fill-prefixo"), frase: `O prefixo para ${n} carbonos na cadeia é ___.`, ...o });
}
export function fillAlcanoH(lid, n, nivel = 2) {
  const h = analyze(fromSpec({ n })).count.H;
  const o = opcoes(String(h), [String(h - 2), String(h + 2), String(2 * n)]);
  return pronto({ ...base(`${lid}:fill-alcano-h-${n}`, "fill", nivel, "Complete com o número de hidrogênios.", `Alcano: CₙH₂ₙ₊₂. Com ${n} C: 2×${n}+2 = ${h} H.`, "fill-alcano-h"), frase: `Um alcano com ${n} carbonos tem ___ hidrogênios.`, ...o });
}
const SUF = (f) => (f === "acido" ? "…oico" : FUNCS[f].sufixo);
export function fillSufixo(lid, f, outras, nivel = 1) {
  const o = opcoes(SUF(f), outras.map(SUF));
  return pronto({ ...base(`${lid}:fill-sufixo-${f}`, "fill", nivel, "Complete com o final do nome.", `${nm(f)}: nome com ${SUF(f)} (${GRUPO(f)}).`, "fill-sufixo"), frase: `O nome de ${ART[f]} tem o final ___.`, ...o });
}
export function fillGrupoFunc(lid, f, outras, nivel = 1) {
  const o = opcoes(nm(f), outras.map(nm));
  return pronto({ ...base(`${lid}:fill-grupo-${f}`, "fill", nivel, "Complete com a função orgânica.", `${GRUPO(f)} → ${nmLc(f)}.`, "fill-grupo"), frase: `Quem tem o grupo «${GRUPO(f)}» é da função ___.`, ...o });
}
export function fillCombO2(lid, k, nivel = 2) {
  const A = an(k), r = combustion(A);
  const o = opcoes(num(r.O2), [num(r.CO2), num(r.H2O), num(r.O2 + 1)]);
  return pronto({ ...base(`${lid}:fill-comb-o2-${slug(k)}`, "fill", nivel, "Complete com o número de mol de O₂.", `${A.formula} + ${num(r.O2)} O₂ → ${r.CO2} CO₂ + ${r.H2O} H₂O.`, "fill-comb-o2"), frase: `Queimar 1 mol de ${nome(k)} por completo consome ___ mol de O₂.`, ...o });
}
export function fillPEmax(lid, a, b, nivel = 2) {
  const win = an(a).pe > an(b).pe ? a : b;
  const o = opcoes(nomeCurto(win), [nomeCurto(win === a ? b : a), "os dois fervem igual"]);
  return pronto({ ...base(`${lid}:fill-pemax-${slug(a)}-${slug(b)}`, "fill", nivel, "Complete com a substância de maior ponto de ebulição.", `${up(nomeCurto(a))} ≈ ${num(an(a).pe)} °C; ${nomeCurto(b)} ≈ ${num(an(b).pe)} °C.`, "fill-pemax"), frase: `Entre ${nomeCurto(a)} e ${nomeCurto(b)}, ferve mais alto: ___.`, ...o });
}
export function fillOxid(lid, k, nivel = 2) {
  const sp = MOLS[k].spec, n = sp.n, real = specName(oxidize(sp));
  const cands = [specName({ n, group: "CHO" }), specName({ n, group: "COOH" }), n >= 3 ? specName({ n, group: "CO", at: 2 }) : null, specName({ n, group: "OH", at: 1 })].filter(Boolean);
  const o = opcoes(real, cands.filter((x) => x !== real));
  return pronto({ ...base(`${lid}:fill-oxid-${slug(k)}`, "fill", nivel, "Complete com o produto da oxidação.", `${up(nomeCurto(k))} perde 2 H: o carbono do OH vira C=O → ${real}.`, "fill-oxid"), frase: `Oxidar o ${nomeCurto(k)} (perde 2 H) forma o(a) ___.`, ...o });
}
const AGUAS = { "H₂O": { C: 0, H: 2, O: 1 }, "CO₂": { C: 1, H: 0, O: 2 }, "H₂": { C: 0, H: 2, O: 0 }, "O₂": { C: 0, H: 0, O: 2 } };
export function fillAgua(lid, acido, alcool, nivel = 1) {
  const a = an(acido).count, b = an(alcool).count, e = analyze(fromSpec(esterify(MOLS[acido].spec, MOLS[alcool].spec))).count;
  const dif = { C: a.C + b.C - e.C, H: a.H + b.H - e.H, O: a.O + b.O - e.O };
  const certa = Object.keys(AGUAS).find((s) => ["C", "H", "O"].every((x) => AGUAS[s][x] === dif[x]));
  const o = opcoes(certa, Object.keys(AGUAS));
  return pronto({ ...base(`${lid}:fill-agua`, "fill", nivel, "Complete o que sai na esterificação.", `Átomos do ácido + álcool menos os do éster sobram ${dif.H} H e ${dif.O} O: água.`, "fill-agua"), frase: "Ácido + álcool → éster + ___.", ...o });
}
export function fillIso(lid, a, b, nivel = 2) {
  const t = tipoIso(a, b);
  const o = opcoes(t, ["função", "cadeia", "posição"]);
  return pronto({ ...base(`${lid}:fill-iso-${slug(a)}-${slug(b)}`, "fill", nivel, "Complete com o tipo de isomeria.", `${an(a).formula}: mesma fórmula. Muda a ${t}.`, "fill-iso"), frase: `${up(nomeCurto(a))} e ${nomeCurto(b)} são isômeros de ___.`, ...o });
}

// Reaproveita uma pergunta do Show. Alguns ids do Show têm acento, espaço ou maiúscula (inválidos no contrato da Trilha):
// nesses casos o id vira "qui-" + slug do id original (estável). A origem continua "show:<id original>".
export function show(id, extra = {}) {
  const ex = doShow(id, extra);
  if (!/^[a-z0-9][a-z0-9:_.-]*$/.test(ex.id)) ex.id = "qui-" + slug(id);
  return ex;
}

// V ou F: quantas funções diferentes a molécula tem
export function tfNFunc(lid, k, mostrado, nivel = 2) {
  const A = an(k), n = A.funcs.length;
  return pronto({
    ...base(`${lid}:tf-nfuncoes-${slug(k)}-${mostrado}`, "tf", nivel, `Esta molécula tem ${mostrado} funções orgânicas diferentes.`,
      `${up(nome(k))}: ${A.funcs.map(nmLc).join(" e ")} → ${n} ${n === 1 ? "função" : "funções"}. Função repetida conta uma vez.`, "tf-nfuncoes"),
    fig: [mol(k)], certa: n === mostrado,
  });
}
// pelo nome, qual a função? (alternativas = funções já ensinadas)
export function mcNomeFuncao(lid, k, funcoes, nivel = 1) {
  const A = an(k);
  if (A.funcs.length !== 1 || !A.name) throw new Error(k);
  const alts = funcoes.map(nm), certa = alts.indexOf(nm(A.funcs[0]));
  if (certa < 0) throw new Error("função certa fora das alternativas");
  return pronto({
    ...base(`${lid}:mc-nome-${slug(k)}`, "mc", nivel, `Pelo nome, qual é a função de ${A.name}?`, `O final do nome diz: ${SUFTXT[A.funcs[0]]}.`, "mc-nome-funcao"),
    fig: [mol(k)], alts, certa,
  });
}
// troca só o texto da dica de uma pergunta do Show (a figura e a marcação continuam)
export const comDica = (ex, t) => ({ ...ex, dica: { ...ex.dica, t } });
