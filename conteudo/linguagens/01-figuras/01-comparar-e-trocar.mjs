import { doShow } from "../../_comum/show.mjs";
import { tfDef, tfExemplo, matchPares, fill, mcTab, porNivel } from "../_gerar.mjs";

const L = "lin-u1-l1";
export default {
  id: L, titulo: "Metáfora, comparação e metonímia", temas: ["figuras"],
  cartoes: [
    { tipo: "conceito", titulo: "O que é figura de linguagem", texto: "É um jeito de dizer que foge do sentido literal para dar força, beleza ou crítica à frase. No ENEM, o nome importa menos que o efeito.", fig: { kind: "lin-cartao", titulo: "Figuras de linguagem", icone: "pena" } },
    { tipo: "exemplo", titulo: "Metáfora ou comparação?", texto: "Metáfora troca direto: “O tempo é um rio.” Comparação usa conectivo: “O tempo é como um rio.” Achou “como”, “tal qual” ou “igual a”? Comparação.", fig: { kind: "lin-frase", texto: "O tempo é um rio que não volta.", destaque: ["rio"] } },
    { tipo: "analogia", titulo: "Semelhança × vizinhança", texto: "Metáfora é semelhança: o tempo lembra um rio. Metonímia é vizinhança: quem diz “li Machado” troca o autor pela obra, que é algo ligado a ele.", fig: { kind: "lin-frase", texto: "Li Machado de Assis até de madrugada.", destaque: ["Machado de Assis"] } },
    { tipo: "pegadinha", titulo: "Procure o conectivo primeiro", texto: "Na dúvida entre metáfora e comparação, procure o conectivo. Tem “como”? É comparação. Não tem e a troca é direta? É metáfora." },
  ],
  exercicios: porNivel([
    mcTab(L, "fig", "metafora", "nome>def", 1, { confunde: ["comparacao", "metonimia", "hiperbole"] }),
    doShow("lin-fig-comparacao-d2n"),
    tfDef(L, "fig", "metafora", "comparacao", 1, "marca"),
    tfExemplo(L, "fig", "comparacao", "comparacao", 1),
    matchPares(L, "fig", ["metafora", "comparacao", "metonimia", "ironia"], "marca", { nivel: 2 }),
    doShow("lin-fig-metonimia-e2n"),
    fill(L, "fig", "metonimia", "def", 2),
  ]),
};
