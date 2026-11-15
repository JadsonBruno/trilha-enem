import { show as doShow } from "../_geradores.mjs";
import * as G from "../_geradores.mjs";

const L = "qui-u3-l4";
export default {
  id: L, titulo: "Mistura com a água?", temas: ["propriedades"],
  cartoes: [
    { tipo: "conceito", titulo: "Semelhante dissolve semelhante", texto: "A água é polar e cheia de O−H. Quem tem O−H e é pequeno se mistura. O O com par livre também recebe o H da água: acetona e éter pequenos misturam. Cadeia grande de C e H (apolar) atrapalha: óleo e gasolina boiam.", fig: G.molFig("etanol", "alcool") },
    { tipo: "analogia", titulo: "A cauda pesa", texto: "Metanol, etanol e propanol misturam na água. Do butanol em diante, a cauda de carbonos pesa mais que o OH e a mistura piora." },
    { tipo: "pegadinha", titulo: "O−H tem de ser da molécula", texto: "Éter e cetona não têm O−H próprio: não fazem ligação de hidrogênio entre si. Mas o O deles aceita o H da água, e os pequenos se misturam.", fig: G.molFig("etoxietano") },
  ],
  exercicios: [
    doShow("sol-max-etanol"),
    doShow("nao-mistura-hexano"),
    doShow("hb-etoxietano"),
    doShow("gordura-limoneno"),
    G.tfSolub(L, "etanol"),
    G.tfSolub(L, "butanoato de etila", 2),
    G.tfHbond(L, "propan-1-ol"),
    G.orderSolub(L, ["etanol", "butan-1-ol", "butanoato de etila"]),
  ].sort((a, b) => a.nivel - b.nivel), // do fácil ao difícil (estável)
};
