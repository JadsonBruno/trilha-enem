import { doShow } from "../../_comum/show.mjs";
import { tfDef, matchPares, fill, mcTab, comFonte, porNivel } from "../_gerar.mjs";

const L = "lin-u4-l2";
export default {
  id: L, titulo: "Do recurso ao efeito", temas: ["efeito-sentido", "figuras"],
  cartoes: [
    { tipo: "conceito", titulo: "O nome não basta", texto: "O ENEM pergunta o efeito: por que o autor usou o recurso? Hipérbole intensifica, eufemismo suaviza, ironia critica, antítese contrasta.", fig: { kind: "lin-cartao", titulo: "Recurso e efeito", icone: "lupa" } },
    { tipo: "exemplo", titulo: "Mesma cena, efeitos diferentes", texto: "“Esperei uma eternidade” intensifica a demora. “Ele nos deixou” suaviza a morte. Cada recurso muda o que o leitor sente.", fig: { kind: "lin-frase", texto: "Esperei uma eternidade pelo ônibus.", destaque: ["eternidade"] } },
    { tipo: "pegadinha", titulo: "Figura certa, efeito errado", texto: "Uma alternativa pode acertar a figura e trocar o efeito, como dizer que a ironia elogia. Confira se o efeito combina com o tom do texto." },
    { tipo: "enem", titulo: "Resposta completa", texto: "A melhor alternativa junta o recurso, o efeito e o contexto: o que foi usado, o que provoca e em que cena." },
  ],
  exercicios: porNivel([
    mcTab(L, "efe", "hiperbole", "nome>def", 1, { text: "Que efeito o recurso do cartão produz?" }),
    mcTab(L, "efe", "eufemismo", "def>nome", 1, { text: "Que recurso produz este efeito?" }),
    matchPares(L, "efe", ["hiperbole", "eufemismo", "antitese", "personificacao"], "def", { nivel: 2, enun: "Ligue cada recurso ao efeito que ele produz." }),
    tfDef(L, "efe", "ironia", "eufemismo", 2, "def"),
    fill(L, "efe", "ironia", "def", 2),
    comFonte(doShow("lin-enem-fig-refrao-morresse"), "Álvares de Azevedo, Se eu morresse amanhã (poema de c. 1852, publicado após a morte do autor)"),
  ]),
};
