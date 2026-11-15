// Teste rápido do motor multi-matéria: node test-motor.mjs
// ids únicos no app inteiro, 1 certa, 4 alternativas diferentes, figura em fig ou nas alternativas, e FIGS[kind] para cada kind usado.
import { genDrawMol } from "./gen-drawmol.mjs";
genDrawMol(); // quimica.mjs importa drawmol.gen.mjs
const { SUBJECTS } = await import("./subjects.mjs");

let bad = 0;
const fail = (m) => { bad++; console.log("ERRO  " + m); };
const ids = new Set();
const kindsOf = (q) => [...(q.fig || []), ...q.alts.map((a) => a.fig).filter(Boolean)].map((f) => f.kind);
for (const S of SUBJECTS) {
  if (!S.id || !S.nome || !/^#[0-9a-f]{6}$/i.test(S.cor) || !S.PATTERNS || !S.FIGS || !Array.isArray(S.BANK)) fail(`${S.id}: matéria incompleta`);
  const n = [0, 0, 0, 0];
  for (const q of S.BANK) {
    const t = `${S.id}/${q.id}`;
    if (ids.has(q.id)) fail(`${t}: id repetido no app`); ids.add(q.id);
    if (q.subj !== S.id) fail(`${t}: subj ${q.subj} ≠ ${S.id}`);
    if (S.id !== "quimica" && !q.id.startsWith(S.id.slice(0, 3) + "-")) fail(`${t}: id sem prefixo da matéria`);
    if (!S.PATTERNS[q.pat]) fail(`${t}: padrão ${q.pat} sem rótulo`);
    if (![1, 2, 3].includes(q.lvl)) fail(`${t}: nível ${q.lvl}`); else n[q.lvl]++;
    if (q.correct.length !== 1) fail(`${t}: ${q.correct.length} certas`);
    if (q.alts.length !== 4) fail(`${t}: ${q.alts.length} alternativas`);
    if (!q.alts.length || q.correct[0] === undefined || q.correct[0] < 0 || q.correct[0] > 3) fail(`${t}: índice da certa inválido`);
    const keys = q.alts.map((a) => (a.fig ? "fig:" + JSON.stringify({ ...a.fig, cap: 0 }) : "txt:" + String(a.t).toLowerCase()));
    if (new Set(keys).size !== 4) fail(`${t}: alternativas repetidas`);
    const kinds = kindsOf(q);
    if (!kinds.length && !q.base) fail(`${t}: sem figura nem texto-base`);
    if (q.base) {
      if (typeof q.base.texto !== "string" || !q.base.texto.trim()) fail(`${t}: base.texto vazio`);
      if (q.enem && !q.base.fonte) fail(`${t}: base.fonte obrigatório`);
    }
    if (q.hint?.trecho != null && (typeof q.hint.trecho !== "string" || !q.base?.texto.includes(q.hint.trecho))) fail(`${t}: hint.trecho não é um trecho do texto-base`);
    for (const d of [].concat(q.destaque ?? [])) if (typeof d !== "string" || !q.base?.texto.includes(d)) fail(`${t}: destaque "${d}" não está no texto-base`);
    if (q.enem) {
      if (!q.base) fail(`${t}: enem sem base`);
      else if (q.base.texto.length > 450) fail(`${t}: base.texto com ${q.base.texto.length} caracteres (máx 450)`);
      for (const a of q.alts) if (a.t && a.t.length > 100) fail(`${t}: alternativa com ${a.t.length} caracteres (máx 100)`);
      if (!Array.isArray(q.analise) || q.analise.length !== 4) fail(`${t}: analise precisa de 4 linhas`);
    }
    for (const k of kinds) if (typeof S.FIGS[k] !== "function") fail(`${t}: FIGS.${k} não existe em ${S.id}`);
    for (const k of new Set(kinds)) {
      for (const f of [...(q.fig || []), ...q.alts.map((a) => a.fig).filter(Boolean)].filter((f) => f.kind === k))
        for (const opts of [{ mode: "ask", size: "main" }, { mode: "reveal", size: "alt", hint: q.hint?.mark }]) {
          let svg = ""; try { svg = S.FIGS[k](f, opts); } catch (e) { fail(`${t}: FIGS.${k} lançou ${e.message}`); }
          if (!/^<svg[^>]*viewBox="[-\d. ]+"/.test(svg)) fail(`${t}: FIGS.${k} não devolveu <svg viewBox>`);
        }
    }
    if (!q.text || q.text.length > 120) fail(`${t}: enunciado fora de 1–120`);
    if (!q.why || q.why.length > 150) fail(`${t}: explicação fora de 1–150`);
  }
  console.log(`${S.nome.padEnd(10)} ${S.BANK.length} perguntas (fácil/média/difícil: ${n.slice(1).join(" / ")}), figuras: ${Object.keys(S.FIGS).join(", ")}`);
}
console.log(bad ? `\n${bad} erros` : `\nmotor: tudo confere (${ids.size} perguntas, ${SUBJECTS.length} matérias)`);
process.exitCode = bad ? 1 : 0;
