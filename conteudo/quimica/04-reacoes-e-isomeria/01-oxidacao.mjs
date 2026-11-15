import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u4-l1";
export default {
  id: L, titulo: "Oxidação de álcoois", temas: ["reacoes"],
  cartoes: [
    { tipo: "conceito", titulo: "Oxidar é tirar 2 H", texto: "Oxidar um álcool tira 2 H (um do OH, um do carbono) e forma C=O. Álcool de ponta vira aldeído. Álcool no meio da cadeia vira cetona.", fig: G.molFig("etanol", "alcool") },
    { tipo: "analogia", titulo: "Do vinho ao vinagre", texto: "Etanol → etanal → ácido etanoico. O etanol perde 2 H e vira etanal. O etanal ganha um O e vira ácido etanoico. É assim que o vinho azeda.", fig: G.molFig("ácido etanoico", "acido") },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "No bafômetro, o dicromato oxida o etanol do hálito até ácido etanoico (o etanal é só intermediário) e muda de cor. Se a prova diz «perde 2 H», o produto é o aldeído." },
  ],
  exercicios: [
    doShow("oxida-butan-1-ol"),
    doShow("vinagre-final"),
    doShow("oxida-propan-2-ol", { enunciado: "Oxidando este álcool (isopropílico, o do limpa-telas), que produto se forma?" }),
    doShow("oxida-metanol"),
    G.orderOxid(L, "etanol"),
    G.matchOxid(L, ["etanol", "propan-2-ol", "butan-1-ol", "metanol"]),
    G.tfOxid(L, "propan-2-ol", "propanal"),
    G.fillOxid(L, "butan-1-ol"),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
