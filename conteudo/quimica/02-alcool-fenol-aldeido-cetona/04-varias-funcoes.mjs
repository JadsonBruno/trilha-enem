import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u2-l4";
export default {
  id: L, titulo: "Várias funções numa molécula", temas: ["alcool-fenol", "aldeido-cetona"],
  cartoes: [
    { tipo: "conceito", titulo: "Uma molécula, várias funções", texto: "Aromas e remédios misturam funções. Classifique cada O pelo vizinho: OH no anel é fenol, C=O no meio é cetona, e assim por diante.", fig: G.molFig("framboesa") },
    { tipo: "analogia", titulo: "Lista de conferência", texto: "Dê um rótulo a cada O do desenho: álcool, fenol, cetona… No fim, conte as funções DIFERENTES. Função repetida não soma." },
    { tipo: "exemplo", titulo: "Cetona de framboesa", texto: "O aroma de framboesa tem um OH no anel (fenol) e um C=O no meio (cetona): duas funções diferentes na mesma molécula.", fig: G.molFig("framboesa", "cetona") },
  ],
  exercicios: [
    doShow("marca-framboesa-10"),
    doShow("marca-canela-9"),
    doShow("marca-carvona-6"),
    doShow("marca-glicose-6"),
    doShow("comum-propofol-hidroquinona"),
    G.tfNFunc(L, "framboesa", 2),
    G.tfNFunc(L, "glicose", 3),
    G.matchCtx(L, ["etanol", "acetona", "canela", "timol"]),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
