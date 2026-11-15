import { doShow, mcG, tfG, matchG, fillG, porNivel } from "../_util.mjs";
import { crossGrid, probWhere, countBy, keysWhere, keyOf, phenD, fr, fstr, feq, REF } from "../_modelos.mjs";

const L = "bio-u2-l1";
const Aa = [["A", "a"]], aa = [["a", "a"]], AA = [["A", "A"]];
const pun = (p1, p2, ph, cap, extra = {}) => ({ kind: "gen-punnett", p1, p2, ...(ph ? { ph } : {}), cap, ...extra });
const prob = (p1, p2, alvo) => probWhere(crossGrid(p1, p2), (g) => keyOf(g) === alvo);
const GRUPOS = [["Heterozigoto × heterozigoto", Aa, Aa], ["Heterozigoto × recessivo", Aa, aa], ["Homozigoto dominante × recessivo", AA, aa], ["Homozigoto dominante × heterozigoto", AA, Aa]];
const razao = (p1, p2) => {
  const m = countBy(crossGrid(p1, p2), keyOf);
  const ks = [...m.keys()].sort((a, b) => (a.match(/[a-z]/g) || []).length - (b.match(/[a-z]/g) || []).length);
  const gcd = (x, y) => (y ? gcd(y, x % y) : x), g = [...m.values()].reduce(gcd);
  const g2 = (k) => (k === "Aa" ? "heterozigotos" : k);
  if (ks.length === 1) return `Todos ${g2(ks[0])} (${ks[0]})`;
  if (ks.length === 2 && m.get(ks[0]) === m.get(ks[1])) return `Metade ${g2(ks[0])}, metade ${g2(ks[1])}`;
  return ks.map((k) => `${m.get(k) / g} ${k}`).join(" : ");
};
const rec = (p1, p2) => probWhere(crossGrid(p1, p2), (g) => phenD(g) === "r");
const dih1 = [["A", "a"], ["B", "b"]], dih2 = [["a", "a"], ["b", "b"]];

export default {
  id: L, titulo: "Cruzamentos e Punnett", temas: ["genetica"],
  cartoes: [
    { tipo: "conceito", titulo: "Gametas e quadro", texto: "Cada genitor dá um alelo por gameta, sorteado como uma moeda (50% cada). O quadro de Punnett cruza os gametas: Aa × Aa dá AA, Aa, Aa e aa. Aa é heterozigoto; AA e aa são homozigotos.", fig: pun(Aa, Aa, ["dominante", "recessivo"], "Aa × Aa") },
    { tipo: "exemplo", titulo: "Dois genes e letal", texto: "Com dois genes em cromossomos diferentes, AaBb faz 4 gametas: AB, Ab, aB, ab. “A_ bb” é pelo menos um A e dois b. Se um genótipo é letal, tire a casa dele da conta." },
    { tipo: "pegadinha", titulo: "Genótipo × fenótipo", texto: "Aa × Aa: genótipo 1 AA : 2 Aa : 1 aa, mas fenótipo 3 dominantes : 1 recessivo. Veja qual proporção o enunciado pede. “Entre os dominantes” reduz o total de casas." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Cai probabilidade: monte o quadro, risque as casas que o texto exclui (letal, “já nasceu normal”) e divida as casas pedidas pelas que sobraram." },
  ],
  exercicios: porNivel([
    doShow("bio-gen-punnett-ervilha-rugosa"),
    doShow("bio-gen-punnett-coelho-proporcao"),
    doShow("bio-gen-punnett-heterozigoto-2-3"),
    tfG(L, "tf-aa-aa-um-quarto", { k: "pun-prob", p1: Aa, p2: Aa, alvo: "aa", claim: [1, 4] }, {
      n: 1, q: "No cruzamento Aa × Aa, 1/4 dos filhos é aa.", fig: [pun(Aa, Aa, ["dominante", "recessivo"], "Aa × Aa", { hl: keysWhere(crossGrid(Aa, Aa), (g) => keyOf(g) === "aa") })],
      certa: feq(prob(Aa, Aa, "aa"), fr(1, 4)), why: "Das 4 casas (AA, Aa, Aa, aa) só uma é aa: 1/4.", ref: REF.hered,
    }),
    tfG(L, "tf-aa-aa-aa-um-quarto", { k: "pun-prob", p1: Aa, p2: aa, alvo: "aa", claim: [1, 4] }, {
      n: 1, q: "No cruzamento Aa × aa, 1/4 dos filhos é aa.", fig: [pun(Aa, aa, ["dominante", "recessivo"], "Aa × aa")],
      certa: feq(prob(Aa, aa, "aa"), fr(1, 4)), why: "Aa × aa dá Aa, Aa, aa e aa: metade (1/2) é aa, e não 1/4.", ref: REF.hered,
    }),
    mcG(L, "mc-vv-vv-branca", { k: "pun-fen-rec", p1: [["V", "v"]], p2: [["v", "v"]] }, {
      n: 2, q: "Flor vermelha (V) domina a branca (v). Em Vv × vv, que fração dos filhos é branca?",
      fig: [pun([["V", "v"]], [["v", "v"]], ["vermelha", "branca"], "Vv × vv")],
      certo: fstr(rec([["V", "v"]], [["v", "v"]])), errados: ["1/4", "3/4", "1"], pos: 1,
      why: "Vv × vv dá Vv, Vv, vv e vv: duas casas vv em quatro, 1/2 de flores brancas.", ref: REF.hered,
    }),
    matchG(L, "match-cruzamento-genotipos", { k: "pun-razao" }, {
      n: 2, q: "Ligue cada cruzamento à proporção de genótipos dos filhos.",
      pares: GRUPOS.map(([t, a, b]) => [t, razao(a, b)]),
      why: "Aa × Aa: 1 AA : 2 Aa : 1 aa. Aa × aa: 1 Aa : 1 aa. AA × aa: todos Aa. AA × Aa: metade AA, metade Aa.", ref: REF.hered,
    }),
    fillG(L, "fill-aabb", { k: "pun-prob", p1: dih1, p2: dih2, alvo: "aabb", claim: [1, 4] }, {
      n: 3, q: "Genes em cromossomos diferentes. Complete a chance.", frase: "Em AaBb × aabb, a chance de um filho aabb é ___.",
      certo: fstr(probWhere(crossGrid(dih1, dih2), (g) => keyOf(g) === "aabb")), errados: ["1/16", "1/2"], pos: 1,
      why: "AaBb faz 4 gametas e aabb só um (ab): 4 filhos possíveis, 1 é aabb = 1/4.", ref: REF.hered,
    }),
  ]),
};
