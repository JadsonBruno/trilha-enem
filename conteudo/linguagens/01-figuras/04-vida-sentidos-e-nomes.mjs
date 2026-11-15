import { doShow } from "../../_comum/show.mjs";
import { tfExemplo, matchPares, fill, mcTab, porNivel } from "../_gerar.mjs";

const L = "lin-u1-l4";
export default {
  id: L, titulo: "Personificação, sinestesia e catacrese", temas: ["figuras", "efeito-sentido"],
  cartoes: [
    { tipo: "conceito", titulo: "Personificação: coisa com jeito de gente", texto: "Dá ação ou sentimento humano a coisa ou bicho: “o vento sussurrava”. Procure um verbo de gente em um sujeito que não é gente.", fig: { kind: "lin-frase", texto: "O vento sussurrava segredos nas janelas.", destaque: ["sussurrava"] } },
    { tipo: "conceito", titulo: "Sinestesia: sentidos misturados", texto: "Mistura sensações de sentidos diferentes: voz quente (ouvido e tato), cheiro doce (olfato e paladar). Conte quantos sentidos aparecem.", fig: { kind: "lin-frase", texto: "Ela tem uma voz quente e aveludada.", destaque: ["voz", "quente"] } },
    { tipo: "pegadinha", titulo: "Catacrese: metáfora que virou nome", texto: "Pé da mesa, braço da cadeira, boca do rio: a metáfora ficou tão comum que virou o nome da peça. Não há outro nome, por isso ninguém sente a imagem.", fig: { kind: "lin-frase", texto: "O pé da mesa quebrou.", destaque: ["pé"] } },
    { tipo: "exemplo", titulo: "Apóstrofe: chamar direto", texto: "Apóstrofe chama alguém ou algo pelo nome: “Senhor, ouvi a minha prece!”. Se a coisa chamada age como gente, a personificação vem junto.", fig: { kind: "lin-frase", texto: "Senhor, ouvi a minha prece!", destaque: ["Senhor,"] } },
  ],
  exercicios: porNivel([
    mcTab(L, "fig", "personificacao", "nome>def", 1, { confunde: ["apostrofe", "hiperbole", "comparacao"] }),
    mcTab(L, "fig", "catacrese", "def>nome", 2, { confunde: ["metonimia", "hiperbole", "pleonasmo"] }),
    tfExemplo(L, "fig", "sinestesia", "sinestesia", 2),
    doShow("lin-enem-fig-personificacao-cortico"),
    matchPares(L, "fig", ["personificacao", "sinestesia", "catacrese", "onomatopeia"], "marca", { nivel: 2 }),
    doShow("lin-enem-fig-sinestesia-harmonia"),
    fill(L, "fig", "apostrofe", "def", 2),
  ]),
};
