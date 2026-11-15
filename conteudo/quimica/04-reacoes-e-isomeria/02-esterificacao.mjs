import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u4-l2";
export default {
  id: L, titulo: "Esterificação", temas: ["reacoes"],
  cartoes: [
    { tipo: "conceito", titulo: "Ácido + álcool = éster + água", texto: "O OH do ácido e o H do álcool saem como água. O que sobra se junta e forma o éster (−COO−). O lado do C=O vem do ácido.", fig: G.molFig("etanoato de etila", "ester") },
    { tipo: "exemplo", titulo: "O nome do éster", texto: "Etanoato de etila: etanoato vem do ácido (2 C), etila vem do álcool (2 C). Ácido etanoico + etanol dá etanoato de etila." },
    { tipo: "exemplo", titulo: "Trocar o álcool", texto: "Na transesterificação, o éster troca o grupo do álcool por outro (etila por metila, por exemplo). É assim que se faz o biodiesel." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Essências de abacaxi e banana são ésteres. A prova mostra o éster e pede o ácido e o álcool de origem, ou o contrário." },
  ],
  exercicios: [
    doShow("acetato-etila"),
    doShow("ester-ácido metanoico-etanol"),
    doShow("hidrolise-acetato-etila"),
    G.matchEster(L, [["ácido etanoico", "metanol"], ["ácido metanoico", "etanol"], ["ácido propanoico", "metanol"]]),
    G.tfEster(L, "ácido etanoico", "metanol", "etanoato de metila"),
    G.tfEster(L, "ácido propanoico", "metanol", "metanoato de etila"),
    G.fillAgua(L, "ácido etanoico", "etanol"),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
