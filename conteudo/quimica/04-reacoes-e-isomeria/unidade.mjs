import { show as doShow } from "../_geradores.mjs";

export default {
  id: "qui-u4", titulo: "Reações e isomeria", descricao: "Oxidação, esterificação e combustão calculadas passo a passo, e como reconhecer isômeros.",
  temas: ["reacoes", "isomeria"],
  desafio: [
    "abacaxi", "transester", "hexan-3-ona", "oxida-mentol", "comb-octano-O2",
    "comb-glicose-O2", "iso-anetol-estragol", "iso-ácido butanoico-etanoato de etila", "isof-ácido butanoico", "hidrolise-acetato_benzila",
  ].map((id) => doShow(id)),
};
