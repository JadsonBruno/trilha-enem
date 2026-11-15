// Índice do CONTEUDO (matérias → unidades → lições). O motor não conhece matéria nenhuma: só percorre esta árvore.
import { S } from "./estado.js";
import { corUnidade, paraBranco } from "./cores.js";

export const IDX = { materias: [], exercicios: new Map(), licoes: new Map(), unidades: new Map(), porMateria: new Map() };

export function indexar(CONTEUDO) {
  IDX.materias = (CONTEUDO || []).filter((m) => m && m.unidades && m.unidades.length);
  IDX.exercicios.clear(); IDX.licoes.clear(); IDX.unidades.clear(); IDX.porMateria.clear();
  for (const m of IDX.materias) {
    m.corTexto = paraBranco(m.cor);
    const seq = [];
    m.unidades.forEach((u, ui) => {
      u.n = ui + 1; u.mat = m; u.cor = corUnidade(m.cor, ui);
      IDX.unidades.set(u.id, u);
      u.licoes.forEach((l, li) => {
        l.uni = u; l.mat = m; l.n = li + 1; l.pos = seq.length; seq.push(l);
        IDX.licoes.set(l.id, l);
        for (const x of l.exercicios) IDX.exercicios.set(x.id, { ex: x, mat: m, uni: u, lic: l, desafio: false });
      });
      for (const x of u.desafio || []) IDX.exercicios.set(x.id, { ex: x, mat: m, uni: u, lic: null, desafio: true });
    });
    IDX.porMateria.set(m.id, seq);
  }
}
export const materiaAtual = () => IDX.materias.find((m) => m.id === S.materia) || IDX.materias[0];
export const feita = (l) => !!S.done[l.id];
export function destravada(l) {
  if (S.unlockAll) return true;
  const seq = IDX.porMateria.get(l.mat.id);
  return l.pos === 0 || feita(seq[l.pos - 1]);
}
export const licoesFeitasUnidade = (u) => u.licoes.filter(feita).length;
export const desafioLiberado = (u) => S.unlockAll || licoesFeitasUnidade(u) === u.licoes.length;
export const proximaLicao = (m) => IDX.porMateria.get(m.id).find((l) => !feita(l) && destravada(l));
export const existeEx = (id) => IDX.exercicios.has(id);
