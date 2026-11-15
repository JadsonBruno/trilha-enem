// Ponte com o Show do ENEM: converte uma pergunta do banco original (fonte/show-do-enem, só leitura) num exercício da Trilha.
// A resposta certa continua a que o modelo/tabela do Show calculou (q.correct); nada é redigitado.
import { SUBJECT as QUIMICA } from "../../fonte/show-do-enem/quimica.mjs";
import { SUBJECT as BIOLOGIA } from "../../fonte/show-do-enem/biologia.mjs";
import { SUBJECT as LINGUAGENS } from "../../fonte/show-do-enem/linguagens.mjs";

export const SHOW = { quimica: QUIMICA, biologia: BIOLOGIA, linguagens: LINGUAGENS };
const POR_ID = new Map();
for (const S of Object.values(SHOW)) for (const q of S.BANK) POR_ID.set(q.id, q);

// id da Trilha: o do Show, com o prefixo da matéria quando faltar (Química do Show não tem prefixo).
const PREF = { quimica: "qui-", biologia: "bio-", linguagens: "lin-" };
// Ids do Show com acento/maiúscula/espaço viram slug (o schema só aceita [a-z0-9:_.-]); a origem guarda o id original.
const slug = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const idTrilha = (q) => {
  const id = q.id.startsWith(PREF[q.subj]) ? q.id : PREF[q.subj] + q.id;
  return /^[a-z0-9][a-z0-9:_.-]*$/.test(id) ? id : PREF[q.subj] + slug(q.id.startsWith(PREF[q.subj]) ? q.id.slice(PREF[q.subj].length) : q.id);
};

export const perguntaShow = (id) => {
  const q = POR_ID.get(id);
  if (!q) throw new Error(`doShow: pergunta "${id}" não existe no Show`);
  return q;
};

// doShow("bio-gen-cruz-aa-aa") ou doShow(q) → exercício mc | mc-figura | enem. `extra` sobrescreve campos (ex.: { enunciado }).
export function doShow(idOuQ, extra = {}) {
  const q = typeof idOuQ === "string" ? perguntaShow(idOuQ) : idOuQ;
  const figAlts = q.alts.some((a) => a.fig);
  const tipo = q.enem ? "enem" : figAlts ? "mc-figura" : "mc";
  const ex = {
    id: idTrilha(q), tipo, nivel: q.lvl, enunciado: q.text,
    alts: figAlts ? q.alts.map((a) => ({ fig: a.fig, cap: a.cap })) : q.alts.map((a) => a.t),
    certa: q.correct[0], explicacao: q.why, origem: "show:" + q.id,
  };
  if (q.fig?.length) ex.fig = q.fig;
  if (q.base) ex.base = q.base;
  if (q.hint) ex.dica = q.hint;
  if (q.src) ex.src = q.src;
  if (q.ref) ex.ref = q.ref;
  if (q.analise) ex.analise = q.analise;
  if (q.destaque) ex.destaque = q.destaque;
  if (figAlts && q.altCap) ex.altCap = true; // legenda das figuras visível antes de responder (senão só no reveal, como no Show)
  return { ...ex, ...extra };
}

// Todas as perguntas do Show de uma matéria (para escolher o que entra em cada lição/desafio).
export const bancoShow = (materia) => SHOW[materia].BANK;
