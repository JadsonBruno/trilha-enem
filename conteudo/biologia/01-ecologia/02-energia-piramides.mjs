import { doShow, mcG, tfG, matchG, orderG, fillG, porNivel } from "../_util.mjs";
import { energiaNivel, energiaNivel1, piramideEnergiaValida, piramideFig, fmt, ord, REF } from "../_modelos.mjs";

const L = "bio-u1-l2";
const kcal = (v) => `${fmt(v)} kcal`;
const TAXA = 0.1;
const nome4 = ["Capim", "Gafanhoto", "Sapo", "Cobra"];

// mc 1: produtor 5 000 kcal → 3º nível
const e1 = 5000, n3 = energiaNivel(e1, 3, TAXA);
const fig3 = piramideFig([1, 2, 3].map((n, i) => ({ n: ["Capim", "Gafanhoto", "Sapo"][i], s: energiaNivel(e1, n, TAXA) })), { mostrar: [0], cap: "Pirâmide de energia" });
// mc 2: 4º nível com 12 kcal → 2º nível
const v4 = 12, alvo2 = energiaNivel1(v4, 4 - 2 + 1 /* níveis entre 4 e 2, contando o 2º como 1 */, TAXA);
const fig4 = piramideFig([1, 2, 3, 4].map((n) => ({ n: nome4[n - 1], s: energiaNivel1(v4, 4 - n + 1, TAXA) })), { mostrar: [3], cap: "Pirâmide de energia" });
// tf: pirâmides possível e impossível
const okV = [8000, 900, 100, 10], badV = [300, 900, 40];
const pf = (vals, nomes) => piramideFig(vals.map((s, i) => ({ n: nomes[i], s })), { mostrar: vals.map((_, i) => i), scale: "lin", cap: "Energia por nível" });
// order
const dados = { Rato: 200, Coruja: 2, "Grão": 20000, Cobra: 20 };
const ordem = Object.entries(dados).sort((a, b) => b[1] - a[1]).map(([k]) => k);
// match
const base = 50000;

export default {
  id: L, titulo: "Energia e pirâmides", temas: ["ecologia"],
  cartoes: [
    { tipo: "conceito", titulo: "Só cerca de 10% passa", texto: "Em cada nível, boa parte da energia vira calor e movimento. Só uns 10% segue para o nível seguinte. Por isso as cadeias são curtas e a pirâmide de energia afina para cima.", fig: piramideFig([10000, 1000, 100, 10].map((s, i) => ({ n: nome4[i], s })), { mostrar: [0] }) },
    { tipo: "analogia", titulo: "Imposto de 90%", texto: "Imagine um imposto de 90% a cada passagem: 10 000 kcal viram 1 000, depois 100, depois 10. O topo recebe muito pouco." },
    { tipo: "pegadinha", titulo: "A de energia nunca inverte", texto: "A pirâmide de número de indivíduos pode inverter (uma árvore sustenta milhares de insetos). A de energia, não: cada nível tem menos que o de baixo." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "O texto dá a regra (10%) e um valor. Descendo na cadeia, multiplique por 0,1 a cada passo; subindo, divida por 0,1. Conte os passos entre níveis, não os organismos." },
  ],
  exercicios: porNivel([
    doShow("bio-eco-pir-10pct-4nivel"),
    mcG(L, "mc-3-nivel-5000", { k: "pir-nivel", e1, n: 3, taxa: TAXA }, {
      n: 1, q: "O capim tem 5 000 kcal. Com 10% de transferência, quanto chega ao 3º nível?", fig: [fig3],
      certo: kcal(n3), errados: [kcal(500), kcal(5), kcal(4500)], pos: 1,
      why: "5 000 → 500 (gafanhoto) → 50 kcal (sapo): dois passos, cada um guarda 10%.", ref: REF.energia,
    }),
    mcG(L, "mc-volta-2-nivel", { k: "pir-volta", dado: { nivel: 4, v: v4 }, alvo: 2, taxa: TAXA }, {
      n: 3, q: "O 4º nível tem 12 kcal. Com 10% de transferência, quanto havia no 2º nível?", fig: [fig4],
      certo: kcal(alvo2), errados: [kcal(120), kcal(12000), kcal(144)], pos: 2,
      why: "Voltando, multiplica-se por 10 a cada nível: 12 → 120 (3º) → 1 200 kcal (2º).", ref: REF.energia,
    }),
    tfG(L, "tf-piramide-possivel", { k: "pir-valida", vals: okV }, {
      n: 1, q: "Estes valores podem ser a energia por nível de uma cadeia? (Basta a energia diminuir a cada nível.)", fig: [pf(okV, ["Produtor", "1º cons.", "2º cons.", "3º cons."])],
      certa: piramideEnergiaValida(okV), why: "A energia diminui a cada nível (8 000 > 900 > 100 > 10): a pirâmide é possível, com transferências perto de 10%.", ref: REF.energia,
    }),
    tfG(L, "tf-piramide-invertida", { k: "pir-valida", vals: badV }, {
      n: 2, q: "Estes valores podem ser a energia por nível de uma cadeia? (Basta a energia diminuir a cada nível.)", fig: [pf(badV, ["Produtor", "1º cons.", "2º cons."])],
      certa: piramideEnergiaValida(badV), why: "O 1º consumidor teria mais energia que o produtor: impossível, pois a energia só diminui.", ref: REF.energia,
    }),
    orderG(L, "order-energia", { k: "pir-ordem", valores: dados }, {
      n: 2, q: "Ordene a cadeia pela energia (kcal): rato 200, coruja 2, grão 20 000, cobra 20.", itens: ordem,
      why: "Quanto mais alto o nível, menos energia: grão (produtor), rato, cobra e coruja (topo).", ref: REF.energia,
    }),
    matchG(L, "match-nivel-energia", { k: "pir-match", e1: base, niveis: 4, taxa: TAXA }, {
      n: 2, q: "O produtor tem 50 000 kcal. Ligue cada nível à sua energia (10%).",
      pares: [1, 2, 3, 4].map((n) => [`${ord(n)} nível`, kcal(energiaNivel(base, n, TAXA))]),
      why: "A cada nível a energia cai a um décimo: 50 000, 5 000, 500 e 50 kcal.", ref: REF.energia,
    }),
    fillG(L, "fill-taxa", { k: "pir-taxa", taxa: TAXA }, {
      n: 1, q: "Complete a regra da transferência de energia.", frase: "Em cada passagem de nível, chega cerca de ___ da energia.",
      certo: `${Math.round(TAXA * 100)}%`, errados: ["50%", "90%"], pos: 0,
      why: "A regra didática é ~10%: o resto vira calor, movimento e restos não aproveitados.", ref: REF.energia,
    }),
  ]),
};
