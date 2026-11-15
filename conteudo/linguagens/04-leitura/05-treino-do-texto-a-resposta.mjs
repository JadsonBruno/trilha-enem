import { mcInterpreta, mcTrap, tfTrap, porNivel } from "../_gerar.mjs";

const L = "lin-u4-l5";
export default {
  id: L, titulo: "Treino: do texto à resposta", temas: ["leitura", "efeito-sentido"],
  cartoes: [
    { tipo: "conceito", titulo: "Receita de resposta", texto: "Recurso + efeito + contexto. Ironia (recurso) que critica (efeito) o conserto que não vem (contexto). A certa costuma ter os três.", fig: { kind: "lin-cartao", titulo: "Recurso + efeito + contexto", icone: "livro" } },
    { tipo: "exemplo", titulo: "O caso do elevador", texto: "O síndico não é elogiado: o elevador parou três vezes no mês. O contexto desmente a frase, então é ironia com efeito de crítica.", fig: { kind: "lin-frase", texto: "Que serviço excelente, hein?", destaque: ["excelente"] } },
    { tipo: "pegadinha", titulo: "Releia antes de marcar", texto: "Antes de marcar, volte ao trecho e aponte o apoio da alternativa. Sem apoio no texto, é armadilha." },
  ],
  exercicios: porNivel([
    mcInterpreta(L, "a", 2, ["efeito-trocado", "recurso-ausente", "fuga-comando"]),
    mcInterpreta(L, "b", 3, ["extrapolacao", "generalizacao", "efeito-trocado"]),
    mcTrap(L, "b", "recurso-ausente", 2),
    mcTrap(L, "b", "generalizacao", 2),
    tfTrap(L, "b", "efeito-trocado", "efeito-trocado", 2),
    tfTrap(L, "b", "generalizacao", "efeito-trocado", 3),
    tfTrap(L, "b", "fuga-comando", "recurso-ausente", 3),
  ]),
};
