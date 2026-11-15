import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";
import { an } from "../../../fonte/show-do-enem/questions.mjs";
import { combustion } from "../../../fonte/show-do-enem/model.mjs";

// a equação do exemplo sai do modelo (combustion), não é digitada
const eq = (() => { const A = an("etanol"), r = combustion(A); return `${A.formula} + ${String(r.O2).replace(".", ",")} O₂ → ${r.CO2} CO₂ + ${r.H2O} H₂O`; })();

const L = "qui-u4-l3";
export default {
  id: L, titulo: "Combustão", temas: ["reacoes"],
  cartoes: [
    { tipo: "conceito", titulo: "Queimar dá CO₂ e H₂O", texto: "Na combustão completa, todo C vira CO₂ e todo H vai para H₂O (2 H por água). O O₂ que falta fecha a conta. Atalho: mol de O₂ = C + H/4 − O/2." },
    { tipo: "exemplo", titulo: "Etanol queimando", texto: `${eq}. Conte: 2 C viram 2 CO₂ e 6 H viram 3 H₂O. Depois ajuste o O₂.`, fig: G.molFig("etanol") },
    { tipo: "pegadinha", titulo: "Completa × incompleta", texto: "Com pouco O₂ sai CO e fuligem (C), não só CO₂. A conta '1 C = 1 CO₂' vale para a combustão COMPLETA." },
  ],
  exercicios: [
    doShow("comb-metano-O2"),
    doShow("comb-butano-CO2"),
    doShow("comb-etanol-O2"),
    doShow("comb-CO2max"),
    G.fillCombO2(L, "propan-1-ol"),
    G.tfComb(L, "propano", 4),
    G.orderO2(L, ["metano", "etano", "propano", "butano"]),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
