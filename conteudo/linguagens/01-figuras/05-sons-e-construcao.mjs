import { doShow } from "../../_comum/show.mjs";
import { tfDef, tfExemplo, matchPares, fill, porNivel } from "../_gerar.mjs";

const L = "lin-u1-l5";
export default {
  id: L, titulo: "Sons e construção da frase", temas: ["figuras"],
  cartoes: [
    { tipo: "conceito", titulo: "Figuras de som", texto: "Onomatopeia imita um som (dlim-dlom). Aliteração repete consoantes; assonância repete vogais. Leia em voz baixa: o que se repete?", fig: { kind: "lin-frase", texto: "O sino fez dlim-dlom no fim da tarde.", destaque: ["dlim-dlom"] } },
    { tipo: "conceito", titulo: "Repetições", texto: "Anáfora repete a palavra no começo dos versos. Polissíndeto repete conectivos (“e… e… e”). Pleonasmo repete a ideia: “vi com meus olhos”.", fig: { kind: "lin-frase", texto: "Não quero ouvir, não quero ver, não quero esquecer.", destaque: ["Não quero", "não quero"] } },
    { tipo: "exemplo", titulo: "Elipse e zeugma", texto: "Elipse omite o termo que se deduz: “Fui à feira. Comprei pão.” Zeugma omite o que já apareceu na frase: “Ana, o pão; Bia, o leite.”", fig: { kind: "lin-frase", texto: "Ana comprou o pão; Bia, o leite.", destaque: ["Bia,"] } },
    { tipo: "enem", titulo: "Efeito, não só nome", texto: "Repetição raramente vale só pelo nome: o ENEM pergunta o efeito. A anáfora reforça uma ideia; a aliteração imita um som ou dá ritmo." },
  ],
  exercicios: porNivel([
    doShow("lin-fig-onomatopeia-d2n"),
    doShow("lin-fig-aliteracao-e2n"),
    doShow("lin-fig-polissindeto-d2n"),
    tfDef(L, "fig", "anafora", "polissindeto", 2, "def"),
    matchPares(L, "fig", ["onomatopeia", "aliteracao", "assonancia", "hiperbato"], "def", { nivel: 2 }),
    fill(L, "fig", "pleonasmo", "def", 2),
    tfExemplo(L, "fig", "aliteracao", "ironia", 2),
    fill(L, "fig", "elipse", "def", 2),
  ]),
};
