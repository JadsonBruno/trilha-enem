import { doShow } from "../../_comum/show.mjs";
import { tfDef, matchPares, comFonte, porNivel } from "../_gerar.mjs";

const L = "lin-u3-l3";
export default {
  id: L, titulo: "Fática e os focos da comunicação", temas: ["funcoes"],
  cartoes: [
    { tipo: "conceito", titulo: "Fática: cuidar do canal", texto: "Abre, testa e mantém o contato: “Alô? Tá me ouvindo?”. Quase não informa nada; só garante que a conversa continua.", fig: { kind: "lin-frase", texto: "Alô? Tá me ouvindo bem? A linha tá ruim.", destaque: ["Alô", "ouvindo"] } },
    { tipo: "analogia", titulo: "Um elemento para cada função", texto: "Emissor: emotiva. Receptor: conativa. Assunto: referencial. Canal: fática. Código: metalinguística. Mensagem: poética.", fig: { kind: "lin-cartao", titulo: "Foco da função", icone: "telefone" } },
    { tipo: "pegadinha", titulo: "Fática × emotiva", texto: "Fática cuida do contato; emotiva mostra o sentimento de quem fala. “Alô?” é fática; “que saudade!” é emotiva. Pergunte: fala do canal ou do sentimento?" },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "As alternativas muitas vezes descrevem o foco (“o canal”, “o código”, “o receptor”). Ache o foco do trecho e só depois a marca que o prova." },
  ],
  exercicios: porNivel([
    doShow("lin-fun-fatica-nome2def-6"),
    doShow("lin-fun-emotivaF-def2nome-10"),
    doShow("lin-fun-fatica-marca2nome-12"),
    comFonte(doShow("lin-enem-fun-app-audio"), "Texto elaborado para o jogo, no formato de chamada de voz em aplicativo"),
    tfDef(L, "fun", "fatica-foco", "emotiva-foco", 2, "def"),
    doShow("lin-fun-conativaF-exemplo2nome-17"),
    matchPares(L, "fun", ["emotiva-foco", "fatica-foco", "conativa-foco"], "def", { nivel: 2 }),
  ]),
};
