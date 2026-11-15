import { doShow } from "../../_comum/show.mjs";
import { porNivel } from "../_gerar.mjs";

export default {
  id: "lin-u3", titulo: "Funções da linguagem",
  descricao: "Referencial, emotiva, conativa, fática, metalinguística e poética: ache o foco e a marca no texto.",
  temas: ["funcoes", "intencao"],
  desafio: porNivel([
    doShow("lin-fun-conativa-nome2marca-7"),
    doShow("lin-fun-referencial-def2nome-11"),
    doShow("lin-enem-fun-meus-oito-anos", { enunciado: "A função predominante se evidencia pelo(a)…" }),
    doShow("lin-fun-poetica-exemplo2nome-18"),
    doShow("lin-enem-fun-campanha-vacina"),
    doShow("lin-fun-poetica-nome2marca-8"),
    doShow("lin-enem-fun-verbete-saudade"),
    doShow("lin-fun-metalinguisticaF-nome2def-9"),
    doShow("lin-enem-fun-autopsicografia"),
    doShow("lin-fun-emotivaF-exemplo2nome-20"),
  ]),
};
