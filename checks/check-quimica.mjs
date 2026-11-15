// Check da matéria Química. Roda: node checks/check-quimica.mjs  (check-tudo.mjs --so quimica também chama)
// RECALCULA a resposta de cada exercício "gerado:*" a partir do que o exercício mostra (figura, frase, opções),
// SEM usar conteudo/quimica/_geradores.mjs: lê as moléculas (MOLS), analyze() e as tabelas PE/SOLUB do Show e refaz as contas
// (fórmula pela regra dos 4, O₂ da combustão pela fórmula, tipo de isomeria, produto da oxidação/esterificação pelo grafo).
// Também confere: 1 certa, distratores diferentes da certa, nada repetido entre lições, cobertura dos temas, desafio do Show.
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { readdirSync, statSync } from "node:fs";
import { MOLS, graphSig } from "../fonte/show-do-enem/questions.mjs";
import { analyze, fromSpec, FNAME } from "../fonte/show-do-enem/chem.mjs";
import { PE, SOLUB, SOLUB_LEVEL, PREFIX, FUNCS, oxidize, esterify } from "../fonte/show-do-enem/model.mjs";
import { doShow } from "../conteudo/_comum/show.mjs";

const RAIZ = join(dirname(fileURLToPath(import.meta.url)), "..");
// monta a árvore só da Química (não depende do manifesto, que reúne todas as matérias): mesma ordem do manifesto (prefixo numérico)
const PQ = join(RAIZ, "conteudo/quimica");
const imp = async (p) => (await import(pathToFileURL(p).href)).default;
const Q = { ...(await imp(join(PQ, "materia.mjs"))), unidades: [] };
for (const d of readdirSync(PQ).filter((d) => /^[0-9]{2}-[a-z0-9-]+$/.test(d) && statSync(join(PQ, d)).isDirectory()).sort()) {
  const u = { ...(await imp(join(PQ, d, "unidade.mjs"))), licoes: [] };
  for (const f of readdirSync(join(PQ, d)).filter((f) => /^[0-9]{2}-[a-z0-9-]+[.]mjs$/.test(f)).sort()) u.licoes.push(await imp(join(PQ, d, f)));
  Q.unidades.push(u);
}

let erros = 0;
const falha = (id, m) => { erros++; console.log(`ERRO  ${id}: ${m}`); };
if (!Q) { falha("quimica", "matéria não encontrada"); process.exit(1); }

// ----------------------------------------------------------------------------- ajudantes independentes
const AN = {};
const A = (k) => { if (!MOLS[k]) throw new Error("molécula " + k); return (AN[k] ??= analyze(MOLS[k].m)); };
const SUBD = "₀₁₂₃₄₅₆₇₈₉";
const sub = (n) => (n > 1 ? String(n).split("").map((d) => SUBD[+d]).join("") : "");
// fórmula pela regra dos 4 (sem olhar o analyze): H = 4·C + 2·O − 2·(soma das ordens das ligações)
function formulaOf(k) {
  const m = MOLS[k].m, c = m.atoms.filter((a) => a.el === "C").length, o = m.atoms.filter((a) => a.el === "O").length;
  const h = 4 * c + 2 * o - 2 * m.bonds.reduce((s, b) => s + b.o, 0);
  return { C: c, H: h, O: o, texto: `C${sub(c)}H${sub(h)}${o ? "O" + sub(o) : ""}` };
}
const lc = (s) => s.charAt(0).toLowerCase() + s.slice(1);
const nomeFrase = (k) => lc(MOLS[k].nome);
const kPorNomeIupac = (n) => Object.keys(MOLS).find((k) => A(k).name === n && MOLS[k].spec) ?? Object.keys(MOLS).find((k) => A(k).name === n); // várias chaves podem ter o mesmo nome (vinagre = ácido etanoico): prefere a que tem receita
const kPorNomeFrase = (n) => Object.keys(MOLS).find((k) => nomeFrase(k) === n);
const kPorNome = (n) => kPorNomeIupac(n) ?? kPorNomeFrase(n);
const fPorNome = (n) => Object.keys(FNAME).find((f) => FNAME[f] === n || FNAME[f].toLowerCase() === n.toLowerCase());
const grupoDe = (spec) => fromSpec(spec);
const mesmaMol = (m1, m2) => graphSig(m1) === graphSig(m2);
const num = (x) => String(x).replace(".", ",").replace("-", "−");
const o2Mol = (k) => { const f = formulaOf(k); return f.C + f.H / 4 - f.O / 2; };
const peDe = (k) => { const n = A(k).name; return n && PE[n] ? PE[n][0] : null; };
const sufixo = (f) => (f === "acido" ? "…oico" : FUNCS[f].sufixo);
// descrição do grupo: éter e éster têm frases próprias (o que os separa é o C=O); as demais vêm da tabela FUNCS
const grupo = (f) => ({ eter: "−O− sem C=O ao lado", ester: "C=O ligado a −O−C" })[f] ?? FUNCS[f].grupo;
const tipoIsomeria = (a, b) => {
  const fa = formulaOf(a), fb = formulaOf(b);
  if (fa.texto !== fb.texto || mesmaMol(MOLS[a].m, MOLS[b].m)) return null;
  const sa = [...A(a).funcs].sort().join(), sb = [...A(b).funcs].sort().join();
  if (sa !== sb) return "função";
  const ca = A(a).chain, cb = A(b).chain;
  if (ca.ram !== cb.ram || ca.forma !== cb.forma) return "cadeia";
  return "posição";
};
const oxidado = (k) => { const sp = MOLS[k].spec && oxidize(MOLS[k].spec); return sp ? fromSpec(sp) : null; };
const AGUAS = { "H₂O": [0, 2, 1], "CO₂": [1, 0, 2], "H₂": [0, 2, 0], "O₂": [0, 0, 2] };

// ----------------------------------------------------------------------------- um verificador por gerador
// cada um devolve a resposta esperada: tf → boolean; fill → predicado(opção) ; match/order → lista de erros (strings)
const VERIF = {
  "tf-funcao": (x) => { const f = fPorNome(x.enunciado.match(/função (.+)\.$/)[1]); return A(x.fig[0].k).funcs.includes(f); },
  "tf-formula": (x) => formulaOf(x.fig[0].k).texto === x.enunciado.match(/é (C\S+)\.$/)[1],
  "tf-carbonos": (x) => formulaOf(x.fig[0].k).C === +x.enunciado.match(/tem (\d+) átomos/)[1],
  "tf-cadeia": (x) => {
    const c = A(x.fig[0].k).chain, t = x.enunciado;
    if (/ramificada\.$/.test(t)) return c.ram === "ramificada";
    if (/normal/.test(t)) return c.ram === "normal";
    if (/insaturada/.test(t)) return c.lig === "insaturada";
    if (/saturada/.test(t)) return c.lig === "saturada";
    if (/heterogênea/.test(t)) return c.het.startsWith("heterogênea");
    if (/fechada/.test(t)) return c.forma.startsWith("fechada");
    throw new Error("propriedade de cadeia desconhecida");
  },
  "tf-familia": (x) => A(x.fig[0].k).family?.nome === x.enunciado.match(/é um (.+)\.$/)[1],
  "tf-pe": (x) => peDe(x.fig[0].k) > peDe(x.fig[1].k),
  "tf-solub": (x) => { const k = x.fig[0].k, n = A(k).name; const lv = A(k).func === "hidrocarboneto" ? 0 : SOLUB_LEVEL[SOLUB[n]]; return lv >= 2; },
  "tf-hbond": (x) => A(x.fig[0].k).atoms.some((a) => a.el === "O" && A(x.fig[0].k).info[a.id].h > 0),
  "tf-iso": (x) => !!tipoIsomeria(x.fig[0].k, x.fig[1].k),
  "tf-oxid": (x) => { const p = oxidado(x.fig[0].k); return !!p && mesmaMol(p, MOLS[x.fig[1].k].m); },
  "tf-ester": (x) => {
    const [, ac, al] = x.enunciado.match(/^(.+?) \+ (.+?) formam/);
    const kA = kPorNome(lc(ac)), kB = kPorNome(al);
    const sp = esterify(MOLS[kA].spec, MOLS[kB].spec);
    return !!sp && mesmaMol(fromSpec(sp), MOLS[x.fig[0].k].m);
  },
  "tf-nfuncoes": (x) => A(x.fig[0].k).funcs.length === +x.enunciado.match(/tem ([0-9]+) funções/)[1],
  "tf-comb": (x) => o2Mol(x.fig[0].k) === +x.enunciado.match(/consome ([\d,]+) mol/)[1].replace(",", "."),
};

const FILL = {
  "fill-formula": (x) => { const k = kPorNomeFrase(x.frase.match(/molecular de (.+) é ___/)[1]); return (o) => o === formulaOf(k).texto; },
  "fill-prefixo": (x) => { const n = +x.frase.match(/para (\d+) carbonos/)[1]; return (o) => o === PREFIX[n - 1]; },
  "fill-alcano-h": (x) => { const n = +x.frase.match(/com (\d+) carbonos/)[1]; const h = formulaOf(kPorNome(PREFIX[n - 1] + "ano")).H; return (o) => o === String(h); },
  "fill-sufixo": (x) => { const f = fPorNome(x.frase.match(/O nome de (?:um|uma) (.+) tem o final/)[1]); return (o) => o === sufixo(f); },
  "fill-grupo": (x) => { const g = x.frase.match(/«(.+)»/)[1]; const f = Object.keys(FUNCS).find((q) => grupo(q) === g); return (o) => o === FNAME[f]; },
  "fill-comb-o2": (x) => { const k = kPorNomeFrase(x.frase.match(/1 mol de (.+) por completo/)[1]); return (o) => o === num(o2Mol(k)); },
  "fill-pemax": (x) => { const [, a, b] = x.frase.match(/Entre (.+) e (.+), ferve/); const ka = kPorNome(a), kb = kPorNome(b); const pa = peDe(ka), pb = peDe(kb); return (o) => (pa > pb ? o === a : pb > pa ? o === b : o === "os dois fervem igual"); },
  "fill-oxid": (x) => { const k = kPorNome(x.frase.match(/Oxidar o (.+) \(perde/)[1]); const p = oxidado(k); return (o) => { const ko = kPorNome(o); return !!ko && !!p && mesmaMol(p, MOLS[ko].m); }; },
  "fill-agua": () => null, // tratado à parte (precisa do ácido e do álcool, vindos do id)
  "fill-iso": (x) => { const [, a, b] = x.frase.match(/^(.+?) e (.+?) são isômeros/); const t = tipoIsomeria(kPorNome(lc(a)), kPorNome(b)); return (o) => o === t; },
};

function verificaMatchOrder(x, g) {
  const out = [];
  if (x.tipo === "match") {
    for (const [l, r] of x.pares) {
      let ok = false;
      if (g === "match-nome-funcao") ok = A(kPorNomeIupac(l)).funcs.length === 1 && FNAME[A(kPorNomeIupac(l)).funcs[0]] === r;
      else if (g === "match-dia-a-dia") { const k = Object.keys(MOLS).find((q) => MOLS[q].ctx && MOLS[q].ctx.toLowerCase() === l.toLowerCase()); ok = !!k && A(k).funcs.length === 1 && FNAME[A(k).funcs[0]] === r; }
      else if (g === "match-grupo") { const f = fPorNome(r); ok = !!f && grupo(f) === l; }
      else if (g === "match-prefixo") ok = PREFIX[+l.match(/^(\d+)/)[1] - 1] === r;
      else if (g === "match-familia") { const k = kPorNomeIupac(l); ok = !!k && A(k).family?.geral === r; }
      else if (g === "match-oxidacao") { const p = oxidado(kPorNomeIupac(l)); const kr = kPorNomeIupac(r); ok = !!p && !!kr && mesmaMol(p, MOLS[kr].m); }
      else if (g === "match-esterificacao") { const [a, b] = l.split(" + "); const sp = esterify(MOLS[kPorNomeIupac(a)].spec, MOLS[kPorNomeIupac(b)].spec); const kr = kPorNomeIupac(r); ok = !!sp && (kr ? mesmaMol(fromSpec(sp), MOLS[kr].m) : analyze(fromSpec(sp)).name === r); }
      else if (g === "match-isomeria") { const [a, b] = l.split(" × "); ok = "Isomeria de " + tipoIsomeria(kPorNome(a), kPorNome(b)) === r; }
      else out.push("gerador de match desconhecido " + g);
      if (!ok) out.push(`par errado [${l}] ↔ [${r}]`);
    }
  } else {
    const ks = x.itens.map((n) => kPorNomeIupac(n));
    if (ks.some((k) => !k)) return [`item sem molécula: ${x.itens.join(", ")}`];
    const estrito = (vals, sentido) => vals.every((v, i) => v !== null && (i === 0 || (sentido > 0 ? v > vals[i - 1] : v < vals[i - 1])));
    if (g === "order-pe") { if (!estrito(ks.map(peDe), +1)) out.push("PE fora de ordem"); }
    else if (g === "order-solub") { if (!estrito(ks.map((k) => (A(k).func === "hidrocarboneto" ? 0 : SOLUB_LEVEL[SOLUB[A(k).name]])), -1)) out.push("solubilidade fora de ordem"); }
    else if (g === "order-carbonos") { if (!estrito(ks.map((k) => formulaOf(k).C), +1)) out.push("nº de C fora de ordem"); }
    else if (g === "order-o2") { if (!estrito(ks.map(o2Mol), +1)) out.push("O₂ fora de ordem"); }
    else if (g === "order-oxidacao") {
      for (let i = 1; i < ks.length; i++) { const p = oxidado(ks[i - 1]); if (!p || !mesmaMol(p, MOLS[ks[i]].m)) out.push(`etapa ${i} não é a oxidação da anterior`); }
      if (oxidado(ks[ks.length - 1])) out.push("a sequência pára antes do fim da oxidação");
    } else out.push("gerador de order desconhecido " + g);
  }
  return out;
}

// ----------------------------------------------------------------------------- varredura
const lic = Q.unidades.flatMap((u) => u.licoes.map((l) => ({ u, l })));
const sig = (x) => JSON.stringify([x.tipo, x.enunciado, x.fig, x.alts, x.pares, x.itens, x.frase, x.opcoes && [...x.opcoes].sort(), x.certa && x.tipo !== "tf" ? x.alts?.[x.certa] ?? x.opcoes?.[x.certa] : x.certa]);
const vistos = new Map();
const porGerador = {}, porTipoOrigem = { show: 0, gerado: 0, manual: 0 };
let tfV = 0, tfF = 0;

function confere(x, onde) {
  const o = x.origem.split(":");
  porTipoOrigem[o[0]]++;
  const s = sig(x);
  if (vistos.has(s)) falha(x.id, `exercício repetido (igual a ${vistos.get(s)})`); else vistos.set(s, x.id);
  if (o[0] === "show") {
    // integridade: o exercício é o do Show, sem alteração das alternativas nem da resposta
    let ref; try { ref = doShow(o[1]); } catch (e) { return falha(x.id, "pergunta do Show não existe: " + o[1]); }
    if (JSON.stringify(ref.alts) !== JSON.stringify(x.alts) || ref.certa !== x.certa) falha(x.id, "alternativas/certa diferem do Show");
    if (x.tipo === "mc-figura") {
      const sigs = x.alts.map((a) => graphSig(MOLS[a.fig.k].m));
      if (new Set(sigs).size !== sigs.length) falha(x.id, "duas alternativas são a mesma molécula");
    } else if (new Set(x.alts.map((a) => String(a).trim().toLowerCase())).size !== x.alts.length) falha(x.id, "alternativas de texto repetidas");
    return;
  }
  if (o[0] === "manual") return falha(x.id, "manual não esperado na Química");
  const g = o[1];
  porGerador[g] = (porGerador[g] || 0) + 1;
  try {
    if (x.tipo === "tf") {
      const v = VERIF[g]?.(x);
      if (v === undefined) return falha(x.id, "gerador tf desconhecido " + g);
      if (v !== x.certa) falha(x.id, `certa=${x.certa}, recalculado=${v}`);
      x.certa ? tfV++ : tfF++;
    } else if (x.tipo === "match" || x.tipo === "order") {
      for (const m of verificaMatchOrder(x, g)) falha(x.id, m);
    } else if (x.tipo === "fill") {
      if (g === "fill-agua") {
        const ac = Object.keys(MOLS).find((k) => /ácido etanoico/.test(k)), al = "etanol";
        const e = fromSpec(esterify(MOLS[ac].spec, MOLS[al].spec)), fe = e.atoms.reduce((s, a) => (s[a.el]++, s), { C: 0, O: 0 });
        const mm = (k) => formulaOf(k);
        const nE = { C: fe.C, O: fe.O, H: 4 * fe.C + 2 * fe.O - 2 * e.bonds.reduce((s, b) => s + b.o, 0) };
        const dif = [mm(ac).C + mm(al).C - nE.C, mm(ac).H + mm(al).H - nE.H, mm(ac).O + mm(al).O - nE.O];
        const quais = x.opcoes.filter((o2) => AGUAS[o2] && AGUAS[o2].every((v, i) => v === dif[i]));
        if (quais.length !== 1 || x.opcoes[x.certa] !== quais[0]) falha(x.id, "fill-agua: certa não é a única opção que fecha a conta");
      } else {
        const pred = FILL[g]?.(x);
        if (!pred) return falha(x.id, "gerador fill desconhecido " + g);
        const certas = x.opcoes.map((op, i) => (pred(op) ? i : -1)).filter((i) => i >= 0);
        if (certas.length !== 1) falha(x.id, `${certas.length} opções satisfazem a frase (esperado 1): ${x.opcoes.join(" | ")}`);
        else if (certas[0] !== x.certa) falha(x.id, `certa=${x.certa}, recalculado=${certas[0]}`);
      }
    } else if (x.tipo === "mc") {
      // pelo nome, qual a função? exatamente uma alternativa é a função do composto
      const k = kPorNomeIupac(x.enunciado.match(/função de (.+)[?]$/)[1]);
      const fs = A(k).funcs;
      const certas = x.alts.map((a, i) => (fs.length === 1 && FNAME[fs[0]] === a ? i : -1)).filter((i) => i >= 0);
      if (g !== "mc-nome-funcao") falha(x.id, "gerador mc desconhecido " + g);
      else if (certas.length !== 1 || certas[0] !== x.certa) falha(x.id, `mc: certa=${x.certa}, recalculado=${certas}`);
    } else falha(x.id, `tipo ${x.tipo} gerado não esperado`);
  } catch (e) { falha(x.id, "erro ao recalcular: " + e.message); }
}

// estrutura
if (Q.unidades.length !== 4) falha("quimica", `${Q.unidades.length} unidades (esperado 4)`);
for (const u of Q.unidades) if (u.licoes.length < 3 || u.licoes.length > 5) falha(u.id, `${u.licoes.length} lições (3–5)`);
const temasLicoes = {};
const idsLicao = new Set();
for (const { u, l } of lic) {
  for (const t of l.temas) temasLicoes[t] = (temasLicoes[t] || 0) + l.exercicios.length;
  for (const x of l.exercicios) { idsLicao.add(x.id); confere(x, l.id); if (x.tipo === "enem") falha(x.id, "Química não leva enem"); }
  l.exercicios.forEach((x, i) => { if (i && x.nivel < l.exercicios[i - 1].nivel) falha(x.id, "fora da ordem do fácil ao difícil"); });
  const tipos = new Set(l.exercicios.map((x) => x.tipo));
  if (tipos.size < 3) falha(l.id, `só ${tipos.size} tipos de exercício (esperado variedade, ≥ 3)`);
  if (!l.exercicios.some((x) => x.origem.startsWith("gerado"))) falha(l.id, "nenhum exercício gerado");
}
for (const u of Q.unidades) {
  const d = u.desafio;
  if (d.length !== 10) falha(u.id, `desafio com ${d.length} (10)`);
  for (const x of d) {
    if (idsLicao.has(x.id)) falha(x.id, "desafio repete exercício de lição");
    if (!x.origem.startsWith("show:")) falha(x.id, "desafio deve vir do Show");
    if (x.nivel < 2) falha(x.id, `desafio com nível ${x.nivel} (2–3)`);
    if (!["mc", "mc-figura"].includes(x.tipo)) falha(x.id, "desafio: tipo " + x.tipo);
    confere(x, u.id + "/desafio");
  }
}
// cobertura dos temas
if (Q.temas.length !== 8) falha("quimica", `${Q.temas.length} temas (esperado 8)`);
for (const t of Q.temas) { const n = temasLicoes[t.id] || 0; if (n < 5) falha("tema " + t.id, `só ${n} exercícios nas lições (mín. 5)`); }
const unidTemas = new Set(Q.unidades.flatMap((u) => u.temas));
for (const t of Q.temas) if (!unidTemas.has(t.id)) falha("tema " + t.id, "nenhuma unidade o cobre");
if (tfV < 5 || tfF < 5) falha("tf", `V/F desequilibrado: ${tfV} verdadeiros, ${tfF} falsos`);

const nEx = lic.reduce((s, { l }) => s + l.exercicios.length, 0);
console.log(`química: ${Q.unidades.length} unidades, ${lic.length} lições, ${nEx} exercícios (+${Q.unidades.length * 10} no desafio)`);
console.log(`origem: ${porTipoOrigem.show} do Show, ${porTipoOrigem.gerado} gerados; tf verdadeiros ${tfV}, falsos ${tfF}`);
console.log("gerados: " + Object.entries(porGerador).map(([k, v]) => `${k} ${v}`).join(", "));
console.log("exercícios por tema: " + Object.entries(temasLicoes).map(([k, v]) => `${k} ${v}`).join(", "));
console.log(erros ? `${erros} erro(s)` : "química confere");
process.exit(erros ? 1 : 0);
