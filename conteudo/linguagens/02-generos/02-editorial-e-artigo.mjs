import { doShow } from "../../_comum/show.mjs";
import { tfRecorte, matchPares, mcTab, porNivel } from "../_gerar.mjs";

const L = "lin-u2-l2";
export default {
  id: L, titulo: "Editorial e artigo de opinião", temas: ["generos"],
  cartoes: [
    { tipo: "conceito", titulo: "Editorial: a voz do jornal", texto: "Editorial expressa a opinião do próprio veículo. Não é assinado e usa voz coletiva (“nós”, “este jornal”) para argumentar sobre tema público.", fig: { kind: "lin-gen-recorte", genero: "editorial", hl: ["assin"] } },
    { tipo: "conceito", titulo: "Artigo: a voz de um autor", texto: "Artigo de opinião defende o ponto de vista de uma pessoa, que assina o texto. Tem tese, argumentos e conclusão, e aceita a 1ª pessoa.", fig: { kind: "lin-gen-recorte", genero: "artigo", hl: ["assin"] } },
    { tipo: "pegadinha", titulo: "A assinatura decide", texto: "Os dois argumentam. Sem assinatura e com voz coletiva: editorial. Autor identificado e opinião pessoal: artigo de opinião." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "A pergunta costuma ser: quem fala, o veículo ou uma pessoa? Procure “nós”, “este jornal” (editorial) ou marcas de autoria e interesse próprio (artigo)." },
  ],
  exercicios: porNivel([
    doShow("lin-gen-editorial-c"),
    mcTab(L, "gen", "editorial", "def>nome", 2),
    doShow("lin-enem-gen-editorial-calcada"),
    doShow("lin-gen-artigo-f3"),
    matchPares(L, "gen", ["editorial", "artigo", "noticia", "reportagem"], "def", { nivel: 2 }),
    doShow("lin-enem-gen-autoral-candidatura"),
    tfRecorte(L, "artigo", "artigo", 2),
  ]),
};
