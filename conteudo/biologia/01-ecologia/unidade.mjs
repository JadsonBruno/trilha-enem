import { desafioShow } from "../_util.mjs";
export default {
  id: "bio-u1", titulo: "Ecologia", descricao: "Teias, energia, bioacumulação, ciclos e relações: o tema que mais cai na prova.",
  temas: ["ecologia"],
  desafio: desafioShow([
    "bio-eco-teia-sagui-niveis", "bio-eco-teia-manguezal-retirada", "bio-eco-teia-amazonia-onca", "bio-eco-pir-energia-impossivel", "bio-eco-pir-10pct-volta",
    "bio-eco-bio-mercurio-cadeias", "bio-eco-bio-mercurio-ariranha", "bio-eco-ciclo-agua-desmatamento", "bio-eco-imp-eutrofizacao", "bio-eco-rel-erva-passarinho",
  ]),
};
