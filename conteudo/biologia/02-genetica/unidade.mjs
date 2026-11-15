import { desafioShow } from "../_util.mjs";
export default {
  id: "bio-u2", titulo: "Genética e DNA", descricao: "Cruzamentos, heredogramas, sangue, código genético e biotecnologia, com contas exatas.",
  temas: ["genetica", "biotecnologia"],
  desafio: desafioShow([
    "bio-gen-punnett-letal-amarelo", "bio-gen-hered-prob-1-3", "bio-gen-hered-irmaos-afetados-1-9", "bio-gen-x-heredograma-1-4", "bio-gen-lei2-diibrido-3-16",
    "bio-gen-codigo-mutacao-menor-proteina", "bio-gen-codigo-traducao-peptideo", "bio-gen-abo-transfusao-b-negativo", "bio-gen-x-daltonismo-filhos", "bio-biotec-gel-excluidos",
  ]),
};
