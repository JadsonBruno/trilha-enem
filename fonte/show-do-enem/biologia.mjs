// Matéria Biologia: junta os quatro lotes (cada um com suas perguntas e seus desenhos) num SUBJECT só.
// Temas e quantidades seguem a frequência no ENEM (pesquisa-biologia-enem.md); contrato em PLANO-MATERIAS.md.
import * as GEN from "./bio-genetica.mjs";
import * as ECO from "./bio-ecologia.mjs";
import * as CORPO from "./bio-corpo.mjs";
import * as CEL from "./bio-celula.mjs";

const LOTES = [ECO, GEN, CORPO, CEL];
const FIGS = {};
for (const L of LOTES) for (const [k, f] of Object.entries(L.FIGS)) {
  if (FIGS[k]) throw new Error(`Biologia: figura "${k}" definida em dois lotes`);
  FIGS[k] = f;
}

export const SUBJECT = {
  id: "biologia",
  nome: "Biologia",
  area: "natureza",
  cor: "#4c9a3c",
  PATTERNS: { 1: "Ecologia", 2: "Genética", 3: "Corpo humano", 4: "Célula e metabolismo", 5: "Doenças e vacinas", 6: "Evolução", 7: "Biotecnologia", 8: "Plantas e animais" },
  BANK: LOTES.flatMap((L) => L.QUESTIONS.map((q) => ({ ...q, subj: "biologia" }))),
  FIGS,
};
