import { doShow } from "../../_comum/show.mjs";
import { tfDef, tfRecorte, orderPartes, fill, porNivel } from "../_gerar.mjs";

const L = "lin-u2-l1";
export default {
  id: L, titulo: "Notícia e reportagem", temas: ["generos"],
  cartoes: [
    { tipo: "conceito", titulo: "Notícia: o fato em poucas linhas", texto: "Notícia informa um fato recente de modo objetivo. O lide, logo abaixo do título, responde: o quê, quem, quando, onde, como e por quê.", fig: { kind: "lin-gen-recorte", genero: "noticia", hl: ["lide"] } },
    { tipo: "exemplo", titulo: "Reportagem: a história por trás", texto: "Reportagem aprofunda o assunto. É mais longa e traz falas de fontes, dados e as causas e consequências do fato.", fig: { kind: "lin-gen-recorte", genero: "reportagem", hl: ["falas", "dados"] } },
    { tipo: "analogia", titulo: "Foto × álbum", texto: "A notícia é a foto do acontecimento: responde “o que houve?”. A reportagem é o álbum: mostra por que aconteceu e o que muda depois." },
    { tipo: "pegadinha", titulo: "As duas são impessoais", texto: "Ambas informam, em 3ª pessoa. O que decide é a profundidade: curta e só o fato, é notícia; longa, com falas e dados, é reportagem." },
  ],
  exercicios: porNivel([
    doShow("lin-gen-noticia-c"),
    doShow("lin-gen-noticia-f2"),
    tfRecorte(L, "noticia", "noticia", 1),
    orderPartes(L, "noticia", 1),
    doShow("lin-gen-reportagem-f1"),
    tfDef(L, "gen", "noticia", "reportagem", 2, "def"),
    fill(L, "gen", "reportagem", "def", 2),
  ]),
};
