import { show as doShow } from "../_geradores.mjs";

export default {
  id: "qui-u3", titulo: "Ácido, éster, éter e propriedades", descricao: "Separe ácido, éster e éter e depois preveja quem ferve primeiro e quem se mistura com a água.",
  temas: ["acido-ester-eter", "propriedades"],
  desafio: [
    "pe-max-butano-propanona-propan-1-ol-ácido etanoico", "pe-max-pentano-butanal-butanona-butan-1-ol", "pe-min-etoxietano-butan-1-ol-ácido propanoico-butanona",
    "pe-min-etanol-metoximetano-propan-1-ol-propan-2-ol", "sol-max-propanona", "sol-min-metanol", "acidez-carvacrol",
    "qual-ester-cumarina", "marca-eugenol-7", "qual-acido-ibuprofeno",
  ].map((id) => doShow(id)),
};
