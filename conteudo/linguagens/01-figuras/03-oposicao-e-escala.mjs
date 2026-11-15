import { doShow } from "../../_comum/show.mjs";
import { tfDef, orderGradacao, porNivel } from "../_gerar.mjs";

const L = "lin-u1-l3";
export default {
  id: L, titulo: "Antítese, paradoxo e gradação", temas: ["figuras", "efeito-sentido"],
  cartoes: [
    { tipo: "conceito", titulo: "Antítese: dois polos", texto: "Antítese põe palavras de sentido oposto lado a lado: riso e choro, pobre e rica. O contraste destaca cada uma das ideias.", fig: { kind: "lin-frase", texto: "Entre o riso e o choro, ela aprendeu a viver.", destaque: ["riso", "choro,"] } },
    { tipo: "conceito", titulo: "Paradoxo: contradição que faz sentido", texto: "Paradoxo junta ideias que parecem se anular, mas ganham sentido: “cego de amor, vejo tudo com clareza”. Faz o leitor parar e pensar.", fig: { kind: "lin-frase", texto: "Estou cego de amor e vejo tudo com clareza.", destaque: ["cego", "vejo"] } },
    { tipo: "exemplo", titulo: "Gradação: uma escada", texto: "Gradação ordena ideias em escala: chuvisco, chuva, tempestade. Cada termo é mais forte (ou mais fraco) que o anterior.", fig: { kind: "lin-frase", texto: "Veio um chuvisco, depois a chuva, por fim a tempestade.", destaque: ["chuvisco,", "chuva,", "tempestade."] } },
    { tipo: "pegadinha", titulo: "Antítese × paradoxo", texto: "É a dupla mais confundida. Pergunte: são só dois polos opostos (antítese) ou uma afirmação que se contradiz e ainda faz sentido (paradoxo)?" },
  ],
  exercicios: porNivel([
    doShow("lin-fig-antitese-d2n"),
    doShow("lin-fig-paradoxo-n2d"),
    tfDef(L, "fig", "antitese", "paradoxo", 2, "def"),
    doShow("lin-fig-gradacao-d2n"),
    orderGradacao(L, 2),
    doShow("lin-enem-fig-antitese-bahia"),
    doShow("lin-enem-fig-paradoxo-amor"),
  ]),
};
