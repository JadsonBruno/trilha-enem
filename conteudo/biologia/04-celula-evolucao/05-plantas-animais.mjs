import { doShow, mcG, tfG, matchG, fillG, porNivel } from "../_util.mjs";
import { REF } from "../_modelos.mjs";

const L = "bio-u4-l5";
const quadro = (linhas, alvo, cap) => ({ kind: "cel-quadro", colunas: ["Coluna|vertebral", "Penas"], linhas, alvo, cap });
const LINHAS = [{ n: "Sapo", v: [true, false] }, { n: "Ave", v: [true, true] }, { n: "Aranha", v: [false, false] }, { n: "Peixe", v: [true, false] }];
const valor = (nome, col) => LINHAS.find((l) => l.n === nome).v[col];
const comPenas = LINHAS.filter((l) => l.v[1]).map((l) => l.n);
const LF = { antera: "A", estigma: "D", ovario: "B", petala: "C" };

export default {
  id: L, titulo: "Plantas e animais", temas: ["plantas-animais"],
  cartoes: [
    { tipo: "conceito", titulo: "Dois tubos na planta", texto: "O xilema leva água e sais das raízes às folhas. O floema leva o açúcar produzido nas folhas aos outros órgãos. A água sobe puxada pela transpiração.", fig: { kind: "cel-planta", modo: "vasos", alvo: "floema", cap: "Vasos da planta" } },
    { tipo: "exemplo", titulo: "Cordados", texto: "Cordados têm, em alguma fase da vida, notocorda, tubo nervoso dorsal e oco, fendas faríngeas e cauda pós-anal. Vertebrados são cordados com coluna vertebral.", fig: { kind: "cel-cordado", letras: { tubo: "B", noto: "D", fendas: "A", cauda: "C" }, cap: "Cordado em corte" } },
    { tipo: "pegadinha", titulo: "Polinização não é fecundação", texto: "Polinização é o grão de pólen chegar ao estigma. A fecundação vem depois, quando o gameta alcança o óvulo no ovário, que se desenvolve em fruto.", fig: { kind: "cel-flor", letras: { antera: "C", estigma: "A", ovario: "D", petala: "B" }, cap: "Flor em corte" } },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Quadros de características pedem o grupo que tem ou não um traço (coluna vertebral, penas). Leia a coluna certa, linha por linha, e cuidado com negações." },
  ],
  exercicios: porNivel([
    doShow("bio-plan-floema"),
    doShow("bio-plan-flor"),
    doShow("bio-plan-quadro-vertebra"),
    tfG(L, "tf-aranha-vertebrada", { k: "quadro-tf", linhas: LINHAS, nome: "Aranha", col: 0 }, {
      n: 1, q: "No quadro, a aranha é um animal vertebrado.", fig: [quadro(LINHAS, "Aranha", "Quatro animais")],
      certa: valor("Aranha", 0), why: "A aranha não tem coluna vertebral: é invertebrada, como a minhoca.", ref: REF.animais,
    }),
    tfG(L, "tf-so-ave-penas", { k: "quadro-penas", linhas: LINHAS }, {
      n: 1, q: "Entre os animais do quadro, só a ave tem penas.", fig: [quadro(LINHAS, "Ave", "Quatro animais")],
      certa: comPenas.length === 1 && comPenas[0] === "Ave", why: "Na coluna das penas só a ave está marcada: sapo, peixe e aranha não têm penas.", ref: REF.animais,
    }),
    mcG(L, "mc-letra-ovario", { k: "org-letra", tipo: "flor", letras: LF, alvo: "ovario" }, {
      n: 2, q: "Qual letra marca o ovário, que vira fruto depois da fecundação?", fig: [{ kind: "cel-flor", letras: LF, alvo: "ovario", cap: "Flor em corte" }],
      certo: LF.ovario, errados: ["A", "C", "D"], pos: 1,
      why: "O ovário guarda os óvulos; depois da fecundação ele se desenvolve em fruto e os óvulos viram sementes.", ref: REF.plantas,
    }),
    matchG(L, "match-planta-funcao", null, {
      manual: true, n: 1, q: "Ligue cada estrutura ou processo da planta ao seu papel.",
      pares: [["Xilema", "Leva água e sais às folhas"], ["Floema", "Leva açúcar das folhas aos órgãos"], ["Estômato", "Troca gases e perde vapor d'água"], ["Transpiração", "Puxa a água pelo xilema"]],
      why: "Xilema leva água, floema leva açúcar, os estômatos trocam gases e a transpiração puxa a água para cima.", ref: REF.plantas,
    }),
    fillG(L, "fill-xilema-transpiracao", null, {
      manual: true, n: 2, q: "Complete sobre o transporte de água.", frase: "A água sobe pelo ___, puxada pela transpiração das folhas.",
      certo: "xilema", errados: ["floema", "estômato"], pos: 0,
      why: "A água evapora nas folhas e a coluna de água do xilema é puxada das raízes até o topo.", ref: REF.plantas,
    }),
  ]),
};
