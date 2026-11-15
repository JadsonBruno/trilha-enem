import { doShow } from "../../_comum/show.mjs";
import { tfExemplo, matchPares, porNivel } from "../_gerar.mjs";

const L = "lin-u3-l2";
export default {
  id: L, titulo: "Metalinguística e poética", temas: ["funcoes"],
  cartoes: [
    { tipo: "conceito", titulo: "Metalinguística: a língua fala de si", texto: "O código explica o código: dicionário, gramática, ou o poema que fala de como se faz poema. O assunto do texto é a própria linguagem.", fig: { kind: "lin-frase", texto: "Adjetivo é a palavra que caracteriza o substantivo.", destaque: ["Adjetivo", "palavra"] } },
    { tipo: "conceito", titulo: "Poética: o jeito de dizer", texto: "Valoriza a forma da mensagem: sons, imagens, ritmo, rima, sentido figurado. A informação fica em segundo plano.", fig: { kind: "lin-frase", texto: "A lua é uma lâmpada pendurada no teto da noite.", destaque: ["lâmpada"] } },
    { tipo: "pegadinha", titulo: "Poema sobre poesia", texto: "Um poema que fala de fazer poesia mistura as duas. Pergunte qual é o assunto: a criação poética (metalinguística) ou um sentimento e a beleza do som (poética)?" },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "A metalinguística aparece com verbete, trecho de gramática e poema sobre poesia. A alternativa certa costuma dizer que o texto fala da própria linguagem." },
  ],
  exercicios: porNivel([
    doShow("lin-fun-metalinguistica-nome2def-1"),
    doShow("lin-fun-poetica-nome2def-5"),
    doShow("lin-enem-fun-ourives-bilac"),
    doShow("lin-fun-metalinguisticaF-marca2nome-14"),
    tfExemplo(L, "fun", "metalinguistica", "metalinguistica", 2),
    doShow("lin-enem-fun-violoes-cruz"),
    matchPares(L, "fun", ["metalinguistica-foco", "poetica-foco", "referencial-foco"], "def", { nivel: 2 }),
  ]),
};
