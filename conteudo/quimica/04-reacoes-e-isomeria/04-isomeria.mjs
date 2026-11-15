import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u4-l4";
export default {
  id: L, titulo: "Isomeria", temas: ["isomeria"],
  cartoes: [
    { tipo: "conceito", titulo: "Mesma fórmula, outra estrutura", texto: "Isômeros têm a mesma fórmula molecular e estruturas diferentes. Primeiro conte C, H e O. Se a fórmula bater, veja o que mudou.", fig: G.molFig("etanol") },
    { tipo: "analogia", titulo: "Três tipos", texto: "Função: o grupo muda (etanol × metoximetano). Cadeia: o esqueleto muda (butano × isobutano). Posição: o grupo troca de lugar (propan-1-ol × propan-2-ol)." },
    { tipo: "pegadinha", titulo: "Fórmula diferente não é isômero", texto: "Etanol (C₂H₆O) e etanal (C₂H₄O) parecem primos, mas a fórmula é outra. Sem fórmula igual, não existe isomeria.", fig: G.molFig("etanal") },
  ],
  exercicios: [
    doShow("iso-etanol-etanal"),
    doShow("iso-eteno-etano"),
    doShow("iso-etanol-metoximetano"),
    doShow("iso-propan-1-ol-propan-2-ol"),
    doShow("isof-propanona"),
    G.tfIso(L, "etanol", "metoximetano"),
    G.matchIso(L, [["etanol", "metoximetano"], ["butano", "isobutano"], ["propan-1-ol", "propan-2-ol"]]),
    G.fillIso(L, "propanal", "propanona"),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
