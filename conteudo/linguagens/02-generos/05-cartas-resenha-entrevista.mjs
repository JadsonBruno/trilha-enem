import { doShow } from "../../_comum/show.mjs";
import { tfDef, orderPartes, matchPares, porNivel } from "../_gerar.mjs";

const L = "lin-u2-l5";
export default {
  id: L, titulo: "Cartas, resenha e entrevista", temas: ["generos"],
  cartoes: [
    { tipo: "conceito", titulo: "Carta aberta × carta do leitor", texto: "Carta aberta reivindica algo em público, em nome de um grupo. Carta do leitor é curta, assinada e comenta uma matéria já publicada no veículo.", fig: { kind: "lin-gen-recorte", genero: "cartaaberta", hl: ["vocativo", "assin"] } },
    { tipo: "conceito", titulo: "Resenha: resume e avalia", texto: "Resenha apresenta e descreve uma obra e depois a avalia, com pontos fortes e fracos. O resumo só condensa, sem julgar.", fig: { kind: "lin-gen-recorte", genero: "resenha", hl: ["aval"] } },
    { tipo: "exemplo", titulo: "Entrevista, verbete e receita", texto: "Entrevista alterna perguntas e respostas. Verbete traz a palavra-entrada e suas definições. Receita lista ingredientes e modo de preparo no imperativo.", fig: { kind: "lin-gen-recorte", genero: "entrevista", hl: ["p1", "r1", "p2"] } },
    { tipo: "pegadinha", titulo: "Gêneros híbridos", texto: "O ENEM gosta de misturar: um poema em forma de receita, uma propaganda em forma de verbete. Ache o gênero pela função real do texto, não pela forma emprestada." },
  ],
  exercicios: porNivel([
    doShow("lin-gen-cartaaberta-f1"),
    doShow("lin-gen-resenha-f4"),
    doShow("lin-enem-gen-resenha-farol"),
    doShow("lin-gen-entrevista-f1"),
    tfDef(L, "gen", "cartaaberta", "cartaleitor", 2, "def"),
    tfDef(L, "gen", "resumo", "resumo", 2, "def"),
    orderPartes(L, "resenha", 2),
    matchPares(L, "gen", ["verbete", "receita", "entrevista"], "def", { nivel: 2 }),
  ]),
};
