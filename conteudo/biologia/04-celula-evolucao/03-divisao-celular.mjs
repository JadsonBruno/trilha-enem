import { doShow, mcG, tfG, matchG, orderG, fillG, porNivel } from "../_util.mjs";
import { divide, REF } from "../_modelos.mjs";

const L = "bio-u4-l3";
const fig = (proc, n2, cap) => ({ kind: "cel-divisao", proc, n2, cap: cap ?? `${proc === "mitose" ? "Mitose" : "Meiose"}, 2n = ${n2}` });
const txt = (d) => `${d.celulas} células com ${d.cromossomos} cromossomos`;
const dMe6 = divide("meiose", 6), dMi10 = divide("mitose", 10), dMe4 = divide("meiose", 4);
const dMi8 = divide("mitose", 8), dMe8 = divide("meiose", 8);
const gam = 23, mae = [46, 23, 92].find((n2) => divide("meiose", n2).cromossomos === gam);

export default {
  id: L, titulo: "Mitose e meiose", temas: ["citologia"],
  cartoes: [
    { tipo: "conceito", titulo: "Mitose copia, meiose reduz", texto: "Mitose: 1 célula 2n vira 2 células 2n, iguais (crescimento e reparo). Meiose: 1 célula 2n vira 4 células n, com metade dos cromossomos (gametas).", fig: fig("meiose", 4) },
    { tipo: "analogia", titulo: "Fotocópia e sorteio", texto: "A mitose é uma fotocópia: sai igual ao original. A meiose, em duas rodadas, reparte a coleção ao meio: cada gameta leva só um de cada par de cromossomos." },
    { tipo: "pegadinha", titulo: "n e 2n", texto: "2n = 8 quer dizer 8 cromossomos na célula normal. A meiose dá n = 4. A fecundação junta dois gametas (4 + 4) e refaz o 2n = 8 no zigoto." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Dão o 2n e perguntam quantas células e quantos cromossomos saem. Mitose: 2 células iguais à mãe. Meiose: 4 células com metade. Confira se o enunciado fala em gameta." },
  ],
  exercicios: porNivel([
    doShow("bio-cel-mitose-2n"),
    mcG(L, "mc-meiose-2n-6", { k: "div", proc: "meiose", n2: 6 }, {
      n: 2, q: "Uma célula com 2n = 6 entra em meiose. Quantas células se formam e com quantos cromossomos cada?", fig: [fig("meiose", 6)],
      certo: txt(dMe6), errados: ["2 células com 6 cromossomos", "2 células com 3 cromossomos", "4 células com 6 cromossomos"], pos: 0,
      why: "Meiose: 1 célula 2n origina 4 células n. Com 2n = 6, cada uma fica com 3 cromossomos.", ref: REF.meiose,
    }),
    mcG(L, "mc-mitose-2n-10", { k: "div", proc: "mitose", n2: 10 }, {
      n: 1, q: "Uma célula com 2n = 10 faz mitose. Quantas células se formam e com quantos cromossomos cada?", fig: [fig("mitose", 10)],
      certo: txt(dMi10), errados: ["4 células com 5 cromossomos", "2 células com 5 cromossomos", "4 células com 10 cromossomos"], pos: 2,
      why: "Mitose: 1 célula 2n origina 2 células 2n, iguais à mãe: 2 células com 10 cromossomos.", ref: REF.meiose,
    }),
    tfG(L, "tf-meiose-4-filhas-4", { k: "div-tf", proc: "meiose", n2: 4, claim: 4 }, {
      n: 2, q: "Nesta meiose (2n = 4), cada célula-filha tem 4 cromossomos.", fig: [fig("meiose", 4)],
      certa: dMe4.cromossomos === 4, why: "Na meiose o número cai pela metade: as 4 células-filhas têm 2 cromossomos, e não 4.", ref: REF.meiose,
    }),
    matchG(L, "match-processo-resultado", { k: "div-match", n2: 8 }, {
      n: 2, q: "Uma célula tem 2n = 8. Ligue cada processo ao resultado.",
      pares: [["Mitose", txt(dMi8)], ["Meiose", txt(dMe8)], ["Fecundação", `Zigoto volta a ter ${2 * dMe8.cromossomos} cromossomos`]],
      why: "Mitose mantém 8; meiose reduz a 4; na fecundação 4 + 4 refazem os 8 cromossomos do zigoto.", ref: REF.meiose,
    }),
    fillG(L, "fill-gameta-23", { k: "div-fill", n: gam }, {
      n: 2, q: "Um gameta humano tem 23 cromossomos. Complete sobre a célula que o formou.", frase: "A célula que o formou, por meiose, tinha ___.",
      certo: `${mae} cromossomos`, errados: ["23 cromossomos", "92 cromossomos"], pos: 1,
      why: "A meiose divide o número por 2: se o gameta tem 23, a célula-mãe tinha 46 (2n).", ref: REF.meiose,
    }),
    orderG(L, "order-fases-mitose", null, {
      manual: true, n: 1, q: "Ordene as fases da mitose.", itens: ["Prófase", "Metáfase", "Anáfase", "Telófase"],
      why: "Na prófase os cromossomos se condensam; na metáfase alinham-se; na anáfase se separam; na telófase formam-se dois núcleos.", ref: REF.mitose,
    }),
  ]),
};
