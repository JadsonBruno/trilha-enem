import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u1-l1";
export default {
  id: L, titulo: "Contar carbonos", temas: ["ler-bastao"],
  cartoes: [
    { tipo: "conceito", titulo: "Ponta e dobra são carbono", texto: "No bastão, o carbono não aparece escrito. Cada ponta e cada dobra da linha é um átomo de C. O oxigênio aparece escrito (OH, O).", fig: G.molFig("butan-1-ol") },
    { tipo: "analogia", titulo: "Mapa de metrô", texto: "Pense num mapa de metrô: cada esquina é uma estação. No desenho da molécula, cada esquina é um carbono, mesmo sem a letra C.", fig: G.molFig("etanol") },
    { tipo: "pegadinha", titulo: "Canto do hexágono conta", texto: "Em anel, cada canto do hexágono é um C. O anel sozinho já tem 6 carbonos. O que sai dele soma mais.", fig: G.molFig("timol") },
  ],
  exercicios: [
    doShow("nc-eugenol"),
    G.tfCarbonos(L, "limoneno", 10),
    G.matchPrefixo(L, [1, 3, 4, 6]),
    G.fillPrefixo(L, 5),
    G.tfCarbonos(L, "mentol", 9),
    G.orderCarbonos(L, ["butan-1-ol", "etanol", "hexan-1-ol", "propan-1-ol"]),
    doShow("nc-ibuprofeno"),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
