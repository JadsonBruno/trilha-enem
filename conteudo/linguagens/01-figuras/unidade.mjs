import { doShow } from "../../_comum/show.mjs";
import { mcTab, porNivel } from "../_gerar.mjs";

export default {
  id: "lin-u1", titulo: "Figuras de linguagem",
  descricao: "Reconheça as 22 figuras mais cobradas pela marca e pelo efeito de sentido.",
  temas: ["figuras", "efeito-sentido"],
  desafio: porNivel([
    doShow("lin-fig-sinestesia-e2n"),
    doShow("lin-enem-fig-metafora-pantera"),
    doShow("lin-enem-fig-comparacao-floresta"),
    doShow("lin-fig-assonancia-n2d"),
    mcTab("lin-u1-d", "fig", "catacrese", "nome>def", 3, { confunde: ["metonimia", "hiperbole", "pleonasmo"] }),
    doShow("lin-enem-fig-metonimia-armas"),
    doShow("lin-fig-paradoxo-d2n"),
    doShow("lin-fig-zeugma-d2n"),
    doShow("lin-enem-fig-gradacao-vulto"),
    doShow("lin-fig-aliteracao-d2n"),
  ]),
};
