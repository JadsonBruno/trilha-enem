import { doShow } from "../../_comum/show.mjs";
import { tfDef, tfExemplo, matchPares, fill, porNivel } from "../_gerar.mjs";

const L = "lin-u3-l1";
export default {
  id: L, titulo: "Referencial, emotiva e conativa", temas: ["funcoes"],
  cartoes: [
    { tipo: "conceito", titulo: "Todo texto tem um foco", texto: "A função da linguagem é o foco da mensagem. Referencial: o assunto. Emotiva: quem fala. Conativa: quem ouve ou lê.", fig: { kind: "lin-cartao", titulo: "Funções da linguagem", icone: "balao" } },
    { tipo: "exemplo", titulo: "Referencial: informar", texto: "Informa de modo objetivo: 3ª pessoa, dados, tom neutro. É a função típica de notícia, relatório e texto científico.", fig: { kind: "lin-frase", texto: "O IBGE divulgou hoje os dados do novo censo.", destaque: ["divulgou", "dados"] } },
    { tipo: "exemplo", titulo: "Emotiva: sentir", texto: "Mostra o sentimento de quem fala: 1ª pessoa, exclamação, reticências. Aparece em diário, carta pessoal e desabafo.", fig: { kind: "lin-frase", texto: "Ai, como eu me sinto sozinho hoje!", destaque: ["eu", "sinto"] } },
    { tipo: "pegadinha", titulo: "Conativa: levar a agir", texto: "Quer convencer ou mandar: imperativo, vocativo, “você”. Cuidado: dado num anúncio ou campanha pode servir só para empurrar o leitor, e então a função é conativa." },
  ],
  exercicios: porNivel([
    doShow("lin-fun-referencial-nome2def-2"),
    doShow("lin-fun-referencial-exemplo2nome-16"),
    doShow("lin-fun-conativa-nome2def-4"),
    tfDef(L, "fun", "referencial", "conativa", 1, "def"),
    tfExemplo(L, "fun", "emotiva", "emotiva", 1),
    matchPares(L, "fun", ["referencial", "emotiva", "conativa"], "def", { nivel: 1 }),
    fill(L, "fun", "conativa", "marca", 2),
  ]),
};
