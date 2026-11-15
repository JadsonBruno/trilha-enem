import { doShow, mcG, tfG, matchG, fillG, porNivel } from "../_util.mjs";
import { RELACAO, relacaoPorSinais, relFig, sinais, REF } from "../_modelos.mjs";

const L = "bio-u1-l5";
const ABELHA = relFig("Abelha", "recebe néctar", "+", "Flor", "é polinizada", "+", "Abelha e flor");
const ARVORES = relFig("Árvore|nova", "perde luz", "-", "Árvore|velha", "perde luz", "-", "Duas árvores disputam luz");
const CARRAP = relFig("Carrapato", "suga sangue", "+", "Cachorro", "perde sangue", "-", "Carrapato no cachorro");
const opcoes = ["Mutualismo", "Comensalismo", "Parasitismo", "Competição"];

export default {
  id: L, titulo: "Relações ecológicas", temas: ["ecologia"],
  cartoes: [
    { tipo: "conceito", titulo: "Os sinais contam a história", texto: "Marque o efeito em cada espécie: + ganha, − perde, 0 não muda. Ganha e ganha: mutualismo. Ganha e fica indiferente: comensalismo. Ganha e perde: parasitismo. Perde e perde: competição.", fig: relFig("Fungo", "recebe açúcar", "+", "Alga", "recebe proteção", "+", "Líquen") },
    { tipo: "analogia", titulo: "Sócios, caroneiro, sanguessuga", texto: "Mutualismo é sociedade em que os dois lucram. Comensalismo é carona: um ganha, o outro nem nota. Parasitismo é o sanguessuga: um ganha à custa do outro." },
    { tipo: "pegadinha", titulo: "Comensal ou parasita?", texto: "Bromélia sobre a árvore só se apoia: comensalismo. Pulga no cachorro suga sangue e prejudica: parasitismo. A pergunta é sempre: o hospedeiro perde algo?" },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "A prova descreve uma convivência e pede o nome. Responda ao contrário: o que cada lado ganha ou perde? Em dúvida, escreva os dois sinais e consulte a tabela." },
  ],
  exercicios: porNivel([
    doShow("bio-eco-rel-liquen"),
    doShow("bio-eco-rel-orquidea"),
    matchG(L, "match-sinais", { k: "rel-sinais" }, {
      n: 1, q: "Ligue o efeito sobre as duas espécies ao nome da relação.",
      pares: [["+", "+"], ["+", "0"], ["+", "-"], ["-", "-"]].map(([a, b]) => [`${sinais(a)} e ${sinais(b)}`, relacaoPorSinais(a, b) + (a === "+" && b === "-" ? " (ou predação)" : "")]),
      why: "Dois ganhos: mutualismo; ganho e nada: comensalismo; ganho e perda: parasitismo; duas perdas: competição.", ref: REF.comunidade,
    }),
    mcG(L, "mc-abelha-flor", { k: "rel-mc", a: "+", b: "+", opcoes }, {
      n: 1, q: "Abelhas recebem néctar e a flor é polinizada. Qual é a relação?", fig: [ABELHA],
      certo: ABELHA.nome, errados: ["Parasitismo", "Comensalismo", "Competição"], pos: 0,
      why: "As duas espécies ganham (+ e +): mutualismo.", ref: REF.comunidade,
    }),
    mcG(L, "mc-arvores-luz", { k: "rel-mc", a: "-", b: "-", opcoes }, {
      n: 2, q: "Duas árvores disputam a mesma luz e as duas crescem menos. Qual é a relação?", fig: [ARVORES],
      certo: ARVORES.nome, errados: ["Mutualismo", "Parasitismo", "Comensalismo"], pos: 3,
      why: "As duas perdem (− e −): competição, pois disputam o mesmo recurso.", ref: REF.comunidade,
    }),
    tfG(L, "tf-carrapato-comensal", { k: "rel-tf", a: "+", b: "-", claim: "Comensalismo" }, {
      n: 2, q: "A relação entre o carrapato e o cachorro é comensalismo.", fig: [CARRAP],
      certa: CARRAP.nome === "Comensalismo", why: "O carrapato ganha (+) e o cachorro perde sangue (−): parasitismo, não comensalismo.", ref: REF.comunidade,
    }),
    fillG(L, "fill-dois-ganham", { k: "rel-fill", a: "+", b: "+" }, {
      n: 1, q: "Complete com o nome da relação.", frase: "Quando as duas espécies ganham, a relação é ___.",
      certo: relacaoPorSinais("+", "+"), errados: ["Parasitismo", "Competição"], pos: 2,
      why: "Ganho para os dois lados é mutualismo, como o líquen (fungo + alga).", ref: REF.comunidade,
    }),
  ]),
};
