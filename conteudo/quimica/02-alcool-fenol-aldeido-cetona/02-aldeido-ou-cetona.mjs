import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u2-l2";
export default {
  id: L, titulo: "Aldeído ou cetona?", temas: ["aldeido-cetona"],
  cartoes: [
    { tipo: "conceito", titulo: "C=O: ponta ou meio", texto: "O C=O é a carbonila. Na ponta da cadeia (com um H) é aldeído. No meio, com carbono dos dois lados, é cetona.", fig: G.molFig("propanal", "aldeido") },
    { tipo: "analogia", titulo: "Fim de linha ou meio", texto: "Aldeído: o C=O fica na ponta, com pelo menos um H (no metanal, dois H). Cetona: o C=O fica no meio, com carbono dos dois lados.", fig: G.molFig("acetona", "cetona") },
    { tipo: "exemplo", titulo: "No dia a dia", texto: "Metanal (formol) e o cheiro da canela são aldeídos. A propanona, acetona do removedor de esmalte, é cetona.", fig: G.molFig("canela", "aldeido") },
  ],
  exercicios: [
    doShow("marca-propanal-3"),
    doShow("marca-acetona-3"),
    doShow("qual-cetona-propanona"),
    doShow("qual-aldeido-etanal"),
    G.tfFuncao(L, "hexanal", "aldeido"),
    G.tfFuncao(L, "heptan-2-ona", "aldeido", 2),
    G.fillGrupoFunc(L, "cetona", ["aldeido", "alcool", "fenol"]),
    G.matchGrupo(L, ["alcool", "fenol", "aldeido", "cetona"]),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
