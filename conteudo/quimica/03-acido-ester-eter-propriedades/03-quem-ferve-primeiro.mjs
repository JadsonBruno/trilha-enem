import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u3-l3";
export default {
  id: L, titulo: "Quem ferve primeiro?", temas: ["propriedades"],
  cartoes: [
    { tipo: "conceito", titulo: "Puxão entre moléculas", texto: "Ferver é separar as moléculas. Quanto mais forte o puxão entre elas, mais alto o ponto de ebulição. O puxão mais forte é a ligação de hidrogênio (O−H).", fig: G.molFig("etanol", "alcool") },
    { tipo: "analogia", titulo: "Velcro, ímã e abraço", texto: "London é velcro: cresce com o tamanho da cadeia. Dipolo é ímã fraco: aparece com O. Ligação de hidrogênio é abraço: precisa de O−H." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Com massas parecidas, ferve mais quem tem O−H. O ácido faz dois abraços e ferve ainda mais. Sem O−H, pesa a cadeia maior." },
  ],
  exercicios: [
    doShow("pe-max-etano-propano-metoximetano-etanol"),
    doShow("pe-max-hexano-heptano-octano-pentano"),
    doShow("pe-min-metano-metanol-metanal-ácido metanoico"),
    doShow("gas-propano"),
    G.orderPE(L, ["metano", "etano", "propano", "butano"], 1),
    G.orderPE(L, ["etano", "metoximetano", "etanol", "ácido etanoico"]),
    G.tfPE(L, "etanol", "metoximetano"),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
