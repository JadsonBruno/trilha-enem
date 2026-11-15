import { doShow } from "../../_comum/show.mjs";
import { mcInterpreta, mcTrap, mcTab, porNivel } from "../_gerar.mjs";

const D = "lin-u4-d";
export default {
  id: "lin-u4", titulo: "Leitura no estilo ENEM",
  descricao: "Como ler o comando, o texto-base e as alternativas: ache o recurso, o efeito e corte as armadilhas.",
  temas: ["leitura", "efeito-sentido", "intencao"],
  desafio: porNivel([
    doShow("lin-fig-anafora-d2n"),
    mcTrap(D, "c", "fuga-comando", 2),
    doShow("lin-enem-fig-anafora-nosso"),
    mcTab(D, "efe", "personificacao", "def>nome", 2, { text: "Que recurso produz este efeito?", slug: "efeito-personificacao" }),
    doShow("lin-enem-fun-anuncio-colchao"),
    doShow("lin-fig-pleonasmo-e2n"),
    mcInterpreta(D, "c", 3, ["extrapolacao", "efeito-trocado", "recurso-ausente"]),
    doShow("lin-enem-gen-carta-caminha"),
    mcTrap(D, "c", "extrapolacao", 3),
    doShow("lin-enem-gen-abaixo-assinado-escola"),
  ]),
};
