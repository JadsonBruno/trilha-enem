// Ajudantes da matéria Biologia: construtores de exercícios gerados e registro de especificações (ESPECS).
// Cada exercício gerado registra em ESPECS a sua "spec" (só entradas do modelo, nunca a resposta);
// checks/check-biologia.mjs refaz a conta com código próprio e confere com o que o exercício diz.
import { doShow } from "../_comum/show.mjs";
export { doShow };

export const ESPECS = new Map(); // id → spec
const SRC = "no estilo do ENEM";

function base(lic, slug, tipo, o, spec) {
  const id = `${lic}:${slug}`;
  if (spec) ESPECS.set(id, spec);
  const x = { id, tipo, nivel: o.n, enunciado: o.q, explicacao: o.why, origem: spec && !o.manual ? "gerado:" + spec.k : "manual", src: o.src ?? SRC };
  if (o.fig) x.fig = o.fig;
  if (o.ref) x.ref = o.ref;
  if (o.dica) x.dica = o.dica;
  return x;
}
// alternativa certa entra na posição pos; erradas na ordem dada
function mistura(certo, errados, pos) {
  const a = [...errados];
  a.splice(pos, 0, certo);
  return a;
}
export const mcG = (lic, slug, spec, o) => ({ ...base(lic, slug, "mc", o, spec), alts: mistura(o.certo, o.errados, o.pos), certa: o.pos });
export const tfG = (lic, slug, spec, o) => ({ ...base(lic, slug, "tf", o, spec), certa: o.certa });
export const matchG = (lic, slug, spec, o) => ({ ...base(lic, slug, "match", o, spec), pares: o.pares });
export const orderG = (lic, slug, spec, o) => ({ ...base(lic, slug, "order", o, spec), itens: o.itens });
export const fillG = (lic, slug, spec, o) => ({ ...base(lic, slug, "fill", o, spec), frase: o.frase, opcoes: mistura(o.certo, o.errados, o.pos), certa: o.pos });

// desafio: 10 perguntas do Show, em ordem crescente de nível
export const desafioShow = (ids) => {
  const xs = ids.map((i) => doShow(i));
  return xs.map((x, i) => [x.nivel, i, x]).sort((a, b) => a[0] - b[0] || a[1] - b[1]).map((t) => t[2]);
};

// ordena os exercícios da lição do mais fácil ao mais difícil (estável)
export const porNivel = (xs) => xs.map((x, i) => [x, i]).sort((a, b) => a[0].nivel - b[0].nivel || a[1] - b[1]).map((t) => t[0]);
