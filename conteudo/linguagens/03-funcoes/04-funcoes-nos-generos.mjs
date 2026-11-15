import { doShow } from "../../_comum/show.mjs";
import { tfExemplo, matchPares, fill, porNivel } from "../_gerar.mjs";

const L = "lin-u3-l4";
export default {
  id: L, titulo: "Funções nos gêneros", temas: ["funcoes", "generos"],
  cartoes: [
    { tipo: "conceito", titulo: "Cada gênero tem sua tendência", texto: "Notícia tende ao referencial, diário à emotiva, anúncio à conativa, verbete à metalinguística, poema à poética, telefonema à fática.", fig: { kind: "lin-cartao", titulo: "Gênero e função", icone: "jornal" } },
    { tipo: "pegadinha", titulo: "Predominante não é única", texto: "Um anúncio pode trazer dado e imagem poética, mas o foco no leitor o torna conativo. Procure a função que manda no texto, não as que aparecem de enfeite." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "A pergunta é “qual função predomina e por quê?”. A resposta certa aponta o foco e a marca: imperativo (conativa), dados (referencial), 1ª pessoa (emotiva)." },
  ],
  exercicios: porNivel([
    doShow("lin-fun-conativaF-marca2nome-13"),
    doShow("lin-fun-poeticaF-def2nome-15"),
    doShow("lin-fun-metalinguisticaF-exemplo2nome-19"),
    doShow("lin-enem-fun-noticia-ciclovia"),
    matchPares(L, "fun", ["referencial-foco", "emotiva-foco", "conativa-foco", "metalinguistica-foco"], "marca", { nivel: 2, enun: "Ligue cada função aos gêneros em que mais aparece." }),
    tfExemplo(L, "fun", "poetica-foco", "poetica-foco", 2),
    fill(L, "fun", "fatica-foco", "marca", 2),
  ]),
};
