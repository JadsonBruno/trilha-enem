import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u2-l1";
export default {
  id: L, titulo: "Álcool ou fenol?", temas: ["alcool-fenol"],
  cartoes: [
    { tipo: "conceito", titulo: "OH no anel é fenol", texto: "Álcool: OH num carbono de cadeia ou de anel sem duplas alternadas. Fenol: OH preso direto no anel aromático. A diferença é onde o OH está.", fig: G.molFig("timol", "fenol") },
    { tipo: "pegadinha", titulo: "Hexágono nem sempre é benzeno", texto: "O mentol tem hexágono, mas sem duplas alternadas. Não é aromático, então o OH é de ÁLCOOL. Procure as duplas no anel.", fig: G.molFig("mentol", "alcool") },
    { tipo: "exemplo", titulo: "No dia a dia", texto: "Etanol (álcool) é combustível e está nas bebidas. O timol (fenol) está no tomilho e em antissépticos bucais. O fenol é um ácido fraco.", fig: G.molFig("etanol", "alcool") },
  ],
  exercicios: [
    doShow("marca-etanol-2"),
    doShow("marca-hidroquinona-6"),
    doShow("qual-fenol-hidroquinona"),
    G.tfFuncao(L, "fenol", "fenol"),
    G.tfFuncao(L, "mentol", "fenol", 2),
    G.tfFuncao(L, "cicloexanol", "alcool", 2),
    G.fillGrupoFunc(L, "fenol", ["alcool", "aldeido", "cetona"]),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
