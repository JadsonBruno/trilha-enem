import { doShow } from "../../_comum/show.mjs";
import { mcTrap, tfTrap, matchPares, fill, porNivel } from "../_gerar.mjs";

const L = "lin-u4-l3";
export default {
  id: L, titulo: "Armadilhas das alternativas", temas: ["leitura"],
  cartoes: [
    { tipo: "conceito", titulo: "Cinco armadilhas", texto: "Extrapolação (vai além do texto), generalização (todos, sempre), efeito trocado, recurso ausente e fuga do comando (certa, mas não responde).", fig: { kind: "lin-cartao", titulo: "Armadilhas", icone: "lupa" } },
    { tipo: "exemplo", titulo: "Um caso na prática", texto: "No texto, “as calçadas viraram rios”. Certa: intensifica o alagamento. Errada, por extrapolação: “prova que a prefeitura abandonou a cidade”.", fig: { kind: "lin-frase", texto: "Prova que a prefeitura abandonou a cidade.", destaque: ["Prova"] } },
    { tipo: "pegadinha", titulo: "Palavra absoluta", texto: "“Sempre”, “nunca” e “todos” pedem desconfiança, mas não cortam sozinhos. Confira no texto: o erro é a afirmação sem apoio, não só a palavra." },
    { tipo: "enem", titulo: "Elimine, não adivinhe", texto: "Corte uma por uma, com o texto na mão. Sobrou mais de uma? Releia o comando: qual responde exatamente ao que se pede?" },
  ],
  exercicios: porNivel([
    mcTrap(L, "a", "extrapolacao", 2),
    mcTrap(L, "a", "efeito-trocado", 2),
    matchPares(L, "arm", ["extrapolacao", "efeito-trocado", "recurso-ausente", "fuga-comando"], "def", { nivel: 2, enun: "Ligue cada armadilha ao que ela faz." }),
    tfTrap(L, "a", "generalizacao", "generalizacao", 2),
    tfTrap(L, "a", "recurso-ausente", "fuga-comando", 2),
    fill(L, "arm", "generalizacao", "marca", 2),
    doShow("lin-enem-fig-aliteracao-sussurro"),
  ]),
};
