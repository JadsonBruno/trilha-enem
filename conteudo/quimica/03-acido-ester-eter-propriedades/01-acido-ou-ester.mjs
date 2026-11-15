import { show as doShow, comDica } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u3-l1";
export default {
  id: L, titulo: "Ácido ou éster?", temas: ["acido-ester-eter"],
  cartoes: [
    { tipo: "conceito", titulo: "−COOH e −COO−", texto: "Os dois têm C=O. Ácido: o C=O e um OH no mesmo carbono (−COOH). Éster: no lugar do OH há um O ligado a outro carbono (−COO−).", fig: G.molFig("vinagre", "acido") },
    { tipo: "analogia", titulo: "H trocado por carbono", texto: "Éster é um ácido que trocou o H do OH por um grupo de carbonos. Sem o H, perde a acidez. Os ésteres pequenos têm cheiro de fruta.", fig: G.molFig("banana", "ester") },
    { tipo: "exemplo", titulo: "No dia a dia", texto: "Vinagre é ácido etanoico. Essências de banana e abacaxi são ésteres. O biodiesel também é feito de ésteres.", fig: G.molFig("octanoato de metila", "ester") },
  ],
  exercicios: [
    doShow("marca-vinagre-3"),
    doShow("marca-acido_sorbico-6"),
    doShow("marca-banana-3"),
    doShow("marca-acetato_benzila-9"),
    doShow("biodiesel-funcao", { fig: [{ kind: "mol", k: "octanoato de metila", cap: "modelo pequeno de éster do biodiesel" }] }),
    G.tfFuncao(L, "acido_benzoico", "acido", 2),
    G.tfFuncao(L, "etanoato de etila", "acido"),
    G.matchGrupo(L, ["acido", "ester", "eter"]),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
