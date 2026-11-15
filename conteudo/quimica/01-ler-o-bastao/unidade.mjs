import { show as doShow } from "../_geradores.mjs";

export default {
  id: "qui-u1", titulo: "Ler o bastão", descricao: "Conte carbonos, ache os H escondidos, escreva a fórmula e classifique cadeias e hidrocarbonetos.",
  temas: ["ler-bastao", "cadeias"],
  desafio: [
    "formula-vanilina", "formula-mentol", "formula-aspirina", "hesc-limoneno", "cadeia-geraniol",
    "cadeia-banana", "aromatico-timol", "geral-etino", "familia-cicloalcano", "octanagem-ramificada",
  ].map((id) => doShow(id)),
};
