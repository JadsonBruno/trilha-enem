import { desafioShow } from "../_util.mjs";
export default {
  id: "bio-u3", titulo: "Corpo e saúde", descricao: "Digestão, sangue, hormônios, parasitas e vacinas, lendo esquemas e gráficos.",
  temas: ["fisiologia", "doencas-vacinas"],
  desafio: desafioShow([
    "bio-corpo-lipase-pancreas", "bio-corpo-arteria-venoso", "bio-corpo-alveolo-trocas", "bio-corpo-rim-reabsorcao", "bio-corpo-jejum-glucagon",
    "bio-corpo-sinapse-neurotransmissor", "bio-saude-wolbachia-dengue", "bio-saude-curva-segunda-dose", "bio-saude-rnam-ordem", "bio-saude-resistencia-selecao",
  ]),
};
