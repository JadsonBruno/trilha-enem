import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u3-l2";
export default {
  id: L, titulo: "Éter ou éster?", temas: ["acido-ester-eter"],
  cartoes: [
    { tipo: "conceito", titulo: "Éter é C−O−C", texto: "Éter: um O entre dois carbonos, sem C=O (nome …oxi…ano, como etoxietano). Éster também tem C−O−C, mas um carbono tem =O. O =O é a pista.", fig: G.molFig("eter", "eter") },
    { tipo: "pegadinha", titulo: "Procure o =O", texto: "Achou um O entre carbonos? Olhe os vizinhos dele. Algum carbono tem =O? Então é éster. Nenhum? É éter.", fig: G.molFig("banana", "ester") },
    { tipo: "exemplo", titulo: "No dia a dia", texto: "O éter dietílico foi anestésico e hoje é solvente. Ésteres dão aroma a frutas, flores e doces.", fig: G.molFig("anetol", "eter") },
  ],
  exercicios: [
    doShow("marca-eter-2"),
    doShow("marca-anetol-9"),
    doShow("comum-banana-etanoato de etila"),
    doShow("comum-vinagre-ácido metanoico"),
    G.tfFuncao(L, "metoximetano", "ester", 2),
    G.tfFuncao(L, "acetato_benzila", "ester", 2),
    G.matchFuncNome(L, ["etoxietano", "etanoato de etila", "ácido etanoico", "etanal"]),
    G.fillSufixo(L, "ester", ["eter", "acido", "aldeido"]),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
