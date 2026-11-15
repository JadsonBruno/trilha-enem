import { tfG, mcG, matchG, orderG, fillG, porNivel } from "../_util.mjs";
import { figShow, clone, REF } from "../_modelos.mjs";

const L = "bio-u3-l5";
const sem = (f) => { const g = clone(f); delete g.hl; return g; };
const pul = sem(figShow("bio-corpo-alveolo-trocas")), neu = figShow("bio-corpo-sinapse-neurotransmissor"), nef = sem(figShow("bio-corpo-rim-reabsorcao"));
const SHOW = "refs do Show (OpenStax A&P 2e 22.1, 12.5 e 25.5), não reabertas";
const refPul = `OpenStax A&P 2e, 22.1 Organs and Structures of the Respiratory System (${SHOW}): https://openstax.org/books/anatomy-and-physiology-2e/pages/22-1-organs-and-structures-of-the-respiratory-system`;
const refNeu = `OpenStax A&P 2e, 12.5 Communication Between Neurons (${SHOW}): https://openstax.org/books/anatomy-and-physiology-2e/pages/12-5-communication-between-neurons`;
const refRim = `OpenStax A&P 2e, 25.5 Physiology of Urine Formation (${SHOW}): https://openstax.org/books/anatomy-and-physiology-2e/pages/25-5-physiology-of-urine-formation`;
const voltou = nef.filtrado - nef.urina;

export default {
  id: L, titulo: "Respiração, nervos e rim", temas: ["fisiologia"],
  cartoes: [
    { tipo: "conceito", titulo: "O ar até o sangue", texto: "O ar desce pela traqueia, brônquios e bronquíolos até os alvéolos. Eles têm parede finíssima e capilares ao redor: ali o O₂ entra no sangue e o CO₂ sai. Os outros tubos só conduzem o ar.", fig: pul },
    { tipo: "exemplo", titulo: "Mensagem entre neurônios", texto: "Entre dois neurônios há a fenda sináptica. O terminal libera neurotransmissores, que cruzam a fenda e se ligam ao neurônio seguinte. O impulso elétrico não salta a fenda.", fig: neu },
    { tipo: "conceito", titulo: "Rim: filtra e devolve", texto: "O néfron filtra o sangue, mas quase tudo (cerca de 99%) volta ao sangue por reabsorção. O que sobra é a urina.", fig: nef },
  ],
  exercicios: porNivel([
    tfG(L, "tf-trocas-alveolos", { k: "pulmao-tf", parte: "Alvéolos" }, {
      n: 1, q: "No pulmão, a troca de gases com o sangue ocorre nos alvéolos, e não nos brônquios.", fig: [pul],
      certa: pul.parts.find((p) => p.capilares).nome === "Alvéolos", why: "Só os alvéolos têm capilares envolvendo a parede finíssima; traqueia e brônquios apenas conduzem o ar.", ref: refPul,
    }),
    orderG(L, "order-caminho-ar", { k: "pulmao-ordem" }, {
      n: 1, q: "Ordene o caminho do ar, da entrada até onde o O₂ passa ao sangue.", itens: pul.parts.map((p) => p.nome),
      why: "O ar desce pela traqueia, brônquios e bronquíolos e chega aos alvéolos, onde ocorre a troca com o sangue.", ref: refPul,
    }),
    tfG(L, "tf-neurotransmissor", { k: "sinapse-tf" }, {
      n: 2, q: "Entre os neurônios, a mensagem passa por neurotransmissores que atravessam a fenda sináptica.", fig: [neu],
      certa: neu.sinapse === "química", why: "No terminal, vesículas liberam neurotransmissores; eles cruzam a fenda e se ligam a receptores do próximo neurônio.", ref: refNeu,
    }),
    tfG(L, "tf-reabsorcao-90", { k: "rim-tf", min: 90 }, {
      n: 2, q: "Mais de 90% do que o néfron filtra volta ao sangue.", fig: [nef],
      certa: (voltou / nef.filtrado) * 100 > 90, why: "De 100 partes filtradas só 1 sai como urina: 99 partes voltam ao sangue por reabsorção.", ref: refRim,
    }),
    mcG(L, "mc-partes-reabsorvidas", { k: "rim-mc" }, {
      n: 2, q: "O néfron filtrou 100 partes e formou 1 de urina. Quantas partes voltaram ao sangue?", fig: [nef],
      certo: `${voltou} partes`, errados: ["1 parte", "50 partes", "100 partes"], pos: 2,
      why: "O que não virou urina foi reabsorvido: 100 − 1 = 99 partes.", ref: refRim,
    }),
    matchG(L, "match-estrutura-funcao", null, {
      manual: true, n: 1, q: "Ligue cada estrutura à sua função.",
      pares: [["Alvéolo", "Troca gases com o sangue"], ["Sinapse", "Passa a mensagem entre neurônios"], ["Néfron", "Filtra o sangue e forma a urina"], ["Neurotransmissor", "Mensageiro químico da sinapse"]],
      why: "O alvéolo faz a troca gasosa; a sinapse liga neurônios; o néfron forma a urina; o neurotransmissor leva a mensagem.", ref: `${refPul}; ${refNeu}`.slice(0, 399),
    }),
    fillG(L, "fill-urina-reabsorcao", null, {
      manual: true, n: 2, q: "Complete sobre o rim.", frase: "A urina é o que sobra depois da ___ de quase tudo o que o néfron filtra.",
      certo: "reabsorção", errados: ["filtração", "digestão"], pos: 1,
      why: "A filtração é a etapa que forma o filtrado; depois, quase tudo volta ao sangue pela reabsorção.", ref: refRim,
    }),
  ]),
};
