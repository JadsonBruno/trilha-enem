import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u1-l4";
export default {
  id: L, titulo: "Hidrocarbonetos", temas: ["cadeias"],
  cartoes: [
    { tipo: "conceito", titulo: "Só C e H", texto: "Hidrocarboneto tem só carbono e hidrogênio. Alcano: só simples. Alceno: uma dupla. Alcino: uma tripla. Aromático: anel de benzeno.", fig: G.molFig("propeno") },
    { tipo: "analogia", titulo: "O meio do nome", texto: "O meio do nome conta a ligação: an (simples), en (dupla), in (tripla). Propano, propeno, propino: mesmo prefixo, ligação diferente." },
    { tipo: "exemplo", titulo: "Fórmulas gerais", texto: "Alcano CₙH₂ₙ₊₂, alceno CₙH₂ₙ, alcino CₙH₂ₙ₋₂. Cada dupla tira 2 H. Cicloalcano também é CₙH₂ₙ: o anel fecha a cadeia.", fig: G.molFig("etino") },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Gasolina e gás de cozinha são misturas de hidrocarbonetos. A prova costuma mostrar o bastão e perguntar a família ou a fórmula geral." },
  ],
  exercicios: [
    doShow("familia-alceno"),
    doShow("familia-alcino"),
    doShow("familia-aromático"),
    doShow("geral-propeno"),
    G.matchFamilia(L, ["etano", "eteno", "etino", "benzeno"]),
    G.tfFamilia(L, "ciclo-hexano", "alceno"),
    G.tfFamilia(L, "propeno", "alceno"),
    G.fillAlcanoH(L, 4),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
