import { tfDef, matchPares, fill, orderPassos, mcTab, porNivel } from "../_gerar.mjs";

const L = "lin-u4-l1";
export default {
  id: L, titulo: "O passo a passo da questão", temas: ["leitura"],
  cartoes: [
    { tipo: "conceito", titulo: "Comando antes das alternativas", texto: "Leia primeiro o comando: ele diz o que a questão pede. Depois leia o texto-base e só então olhe as alternativas.", fig: { kind: "lin-cartao", titulo: "Leitura em 5 passos", icone: "lupa" } },
    { tipo: "exemplo", titulo: "Os cinco passos", texto: "1) Ler o comando. 2) Ler o texto-base. 3) Achar o recurso. 4) Ligar ao efeito. 5) Eliminar o que o texto não sustenta." },
    { tipo: "pegadinha", titulo: "Verdadeira não basta", texto: "Uma alternativa pode ser verdadeira sobre o texto e errar por não responder ao comando. E um único erro já basta para cortá-la." },
  ],
  exercicios: porNivel([
    orderPassos(L, 2),
    matchPares(L, "pas", ["comando", "textobase", "recurso", "efeito"], "def", { nivel: 1, enun: "Ligue cada passo ao que ele faz." }),
    tfDef(L, "pas", "comando", "eliminar", 1, "def"),
    tfDef(L, "pas", "eliminar", "eliminar", 1, "def"),
    tfDef(L, "pas", "textobase", "recurso", 2, "def"),
    fill(L, "pas", "eliminar", "def", 2),
    mcTab(L, "pas", "recurso", "exemplo>nome", 2, { text: "Que passo de leitura esta ação mostra?" }),
  ]),
};
