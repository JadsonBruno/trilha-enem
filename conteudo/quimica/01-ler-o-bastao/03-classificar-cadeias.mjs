import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u1-l3";
export default {
  id: L, titulo: "Classificar cadeias", temas: ["cadeias"],
  cartoes: [
    { tipo: "conceito", titulo: "Quatro perguntas", texto: "Aberta ou fechada (anel)? Normal ou ramificada? Saturada (só simples entre carbonos) ou insaturada (dupla ou tripla entre carbonos; o C=O não conta)? Homogênea ou heterogênea (O no meio)?", fig: G.molFig("geraniol") },
    { tipo: "analogia", titulo: "Corrente de bicicleta", texto: "A cadeia é uma corrente de elos. Ramificada tem um elo pendurado de lado. Heterogênea tem um elo de outro metal: o O entre dois carbonos.", fig: G.molFig("isobutano") },
    { tipo: "pegadinha", titulo: "O na ponta não conta", texto: "Heterogênea é só quando o O está ENTRE dois carbonos (como no éter). OH ou =O na ponta não tornam a cadeia heterogênea.", fig: G.molFig("eter") },
  ],
  exercicios: [
    doShow("cadeia-isobutano"),
    doShow("cadeia-ciclo-hexano"),
    doShow("cadeia-eter"),
    G.tfCadeia(L, "isobutano", "ramificada"),
    G.tfCadeia(L, "butano", "ramificada"),
    G.tfCadeia(L, "propeno", "insaturada"),
    doShow("hetero-etoxietano"),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
