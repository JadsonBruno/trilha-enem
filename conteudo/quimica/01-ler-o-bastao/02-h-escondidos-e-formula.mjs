import { show as doShow, comDica } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u1-l2";
export default {
  id: L, titulo: "H escondidos e fórmula", temas: ["ler-bastao"],
  cartoes: [
    { tipo: "conceito", titulo: "A regra dos 4", texto: "Cada carbono faz 4 ligações. O bastão só desenha as ligações com outros átomos. O que faltar para 4 é H escondido.", fig: G.molFig("etanol") },
    { tipo: "analogia", titulo: "Mãos ocupadas", texto: "Carbono tem 4 mãos, oxigênio 2, hidrogênio 1. Toda mão precisa segurar alguém. Mão livre no desenho é um H.", fig: G.molFig("acetona") },
    { tipo: "pegadinha", titulo: "O H do OH também conta", texto: "O H do OH aparece escrito, mas entra na fórmula. Esqueceu dele? Errou por 1 H. Confira: etanol é C₂H₆O.", fig: G.molFig("etanol", "alcool") },
  ],
  exercicios: [
    comDica(doShow("hesc-isopreno"), "Vá de carbono em carbono: 4 menos o número de ligações que ele já faz. Dupla conta como 2."),
    doShow("hesc-acido_sorbico"),
    doShow("formula-acetona"),
    G.tfFormula(L, "canela", 2),
    G.tfFormula(L, "timol", 0),
    G.fillFormula(L, "etanol"),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
