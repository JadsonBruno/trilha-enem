import { show as doShow } from "../_geradores.mjs";

export default {
  id: "qui-u2", titulo: "Álcool, fenol, aldeído, cetona", descricao: "Ache o OH no anel ou na cadeia e o C=O na ponta ou no meio: quatro funções que a prova mistura.",
  temas: ["alcool-fenol", "aldeido-cetona"],
  desafio: [
    "qual-fenol-timol", "qual-alcool-alcool_benzilico", "marca-alcool_benzilico-7", "marca-propofol-6", "comum-timol-resveratrol",
    "qual-aldeido-canela", "qual-cetona-carvona", "comum-citral-canela", "marca-benzaldeido-7", "marca-mentona-6",
  ].map((id) => doShow(id)),
};
