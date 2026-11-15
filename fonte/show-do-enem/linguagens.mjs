// Matéria Linguagens: junta os três temas (cada um com suas perguntas e desenhos) + a base comum num SUBJECT só.
// Temas e contrato em PLANO-MATERIAS.md (seção "Linguagens"). Área "linguagens": fica fora do Mesclado.
import * as BASE from "./lin-base.mjs";
import * as FIG from "./lin-figuras.mjs";
import * as FUN from "./lin-funcoes.mjs";
import * as GEN from "./lin-generos.mjs";
import * as EF from "./lin-enem-figuras.mjs";
import * as EU from "./lin-enem-funcoes.mjs";
import * as EG from "./lin-enem-generos.mjs";

const LOTES = [FIG, FUN, GEN, EF, EU, EG];
const FIGS = { ...BASE.FIGS };
for (const L of LOTES) for (const [k, f] of Object.entries(L.FIGS)) {
  if (FIGS[k]) throw new Error(`Linguagens: figura "${k}" definida em dois lotes`);
  FIGS[k] = f;
}

export const SUBJECT = {
  id: "linguagens",
  nome: "Linguagens",
  area: "linguagens",
  cor: "#7d4fb3",
  PATTERNS: { 1: "Figuras de linguagem", 2: "Funções da linguagem", 3: "Gêneros textuais" },
  BANK: LOTES.flatMap((L) => L.QUESTIONS.map((q) => ({ ...q, subj: "linguagens" }))),
  FIGS,
};
