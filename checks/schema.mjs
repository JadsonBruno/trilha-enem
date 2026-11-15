// Validação única do conteúdo da Trilha ENEM (contrato em PLANO.md / CONTRIBUINDO.md).
// validar(CONTEUDO, FIGURAS) → { erros: [], avisos: [], stats }
import { LARGURA, LETRA_MIN } from "../app/figuras/index.js";

export const TIPOS = ["mc", "mc-figura", "enem", "tf", "match", "order", "fill"];
export const TIPOS_DESAFIO = ["mc", "mc-figura", "enem"];
const CARTOES = ["conceito", "analogia", "exemplo", "enem", "pegadinha"];
const FREQ = ["alta", "media", "baixa"];

const str = (v, min, max) => typeof v === "string" && v.trim().length >= min && v.length <= max;
const len = (v) => (typeof v === "string" ? v.length : 0);

// menor letra real (px) de um svg mostrado com a largura dada
export function menorLetra(svg, largura) {
  const m = /viewBox="\s*([-\d.]+)[\s,]+([-\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)"/.exec(svg);
  if (!m) return 0;
  const fs = [...svg.matchAll(/font-size(?:="|:\s*)([\d.]+)/g)].map((x) => +x[1]);
  if (!fs.length) return Infinity;
  return (Math.min(...fs) * largura) / +m[3];
}

export function validar(CONTEUDO, FIGURAS) {
  const erros = [], avisos = [];
  const err = (onde, m) => erros.push(`${onde}: ${m}`);
  const ids = new Map(); // id → onde
  const uniq = (id, onde) => {
    if (typeof id !== "string" || !/^[a-z0-9][a-z0-9:_.-]*$/.test(id)) return err(onde, `id inválido "${id}"`);
    if (ids.has(id)) err(onde, `id "${id}" repetido (já em ${ids.get(id)})`);
    ids.set(id, onde);
  };
  const stats = { materias: 0, unidades: 0, licoes: 0, exercicios: 0, desafio: 0, cartoes: 0, porTipo: {} };

  const fig1 = (f, onde, size) => {
    if (!f || typeof f !== "object" || typeof f.kind !== "string") return err(onde, "figura sem kind");
    const fn = FIGURAS[f.kind];
    if (typeof fn !== "function") return err(onde, `figura kind "${f.kind}" não está no registro app/figuras`);
    for (const mode of ["ask", "reveal"]) {
      let s = "";
      try { s = fn(f, { mode, size }); } catch (e) { return err(onde, `figura ${f.kind} lançou ${e.message}`); }
      if (!/^<svg[^>]*viewBox="[-\d. ,]+"/.test(s)) return err(onde, `figura ${f.kind} não devolveu <svg viewBox>`);
      const px = menorLetra(s, LARGURA[size]);
      if (px < LETRA_MIN - 1e-6) err(onde, `figura ${f.kind} (${size}) com letra de ${px.toFixed(1)} px reais (mín. ${LETRA_MIN})`);
    }
  };

  const enemPorMateria = {};
  const exercicio = (x, onde, prefixo, materia) => {
    const o = `${onde}/${x?.id}`;
    if (!x || typeof x !== "object") return err(onde, "exercício vazio");
    uniq(x.id, onde);
    if (typeof x.id === "string" && !x.id.startsWith(prefixo + "-")) err(o, `id sem o prefixo "${prefixo}-"`);
    if (!TIPOS.includes(x.tipo)) return err(o, `tipo "${x.tipo}" desconhecido`);
    stats.porTipo[x.tipo] = (stats.porTipo[x.tipo] || 0) + 1;
    if (![1, 2, 3].includes(x.nivel)) err(o, `nivel ${x.nivel} (1, 2 ou 3)`);
    if (!str(x.enunciado, 1, 120)) err(o, `enunciado com ${len(x.enunciado)} caracteres (1–120)`);
    if (!str(x.explicacao, 1, 150)) err(o, `explicacao com ${len(x.explicacao)} caracteres (1–150)`);
    if (typeof x.origem !== "string" || !/^(show:|gerado:|manual$)/.test(x.origem)) err(o, `origem "${x.origem}" (show:<id> | gerado:<gerador> | manual)`);
    if (x.origem === "manual" && !str(x.ref, 8, 400)) err(o, "exercício manual sem ref de fonte aberta");
    if (/\b(19|20)\d\d\b/.test(x.src || "") && !/https?:|inep|enem \d{4} \(/i.test(x.src)) avisos.push(`${o}: src cita ano (${x.src}) — confira a fonte`);
    if (x.fig != null) {
      if (!Array.isArray(x.fig) || x.fig.length > 2) err(o, "fig deve ser lista de 0 a 2 figuras");
      else x.fig.forEach((f, i) => fig1(f, `${o}/fig${i}`, "main"));
    }
    if (x.base != null) {
      if (!str(x.base.texto, 1, 450)) err(o, `base.texto com ${len(x.base?.texto)} caracteres (1–450)`);
      if (!str(x.base.fonte, 3, 200)) err(o, "base.fonte obrigatório");
    }
    const temVisual = (x.fig?.length || 0) > 0 || !!x.base;
    const alts = x.alts;
    const distintas = (arr) => new Set(arr.map((s) => String(s).trim().toLowerCase())).size === arr.length;
    const idxOk = (n) => Number.isInteger(x.certa) && x.certa >= 0 && x.certa < n;
    switch (x.tipo) {
      case "mc":
        if (!Array.isArray(alts) || alts.length < 3 || alts.length > 4 || !alts.every((a) => str(a, 1, 70))) err(o, "mc: 3–4 alternativas de texto, cada uma 1–70");
        else { if (!distintas(alts)) err(o, "alternativas repetidas"); if (!idxOk(alts.length)) err(o, "certa inválida"); }
        if (!temVisual) err(o, "mc precisa de fig ou base");
        break;
      case "mc-figura":
        if (!Array.isArray(alts) || alts.length !== 4 || !alts.every((a) => a && a.fig)) err(o, "mc-figura: 4 alternativas com fig");
        else {
          alts.forEach((a, i) => fig1(a.fig, `${o}/alt${i}`, "alt"));
          if (new Set(alts.map((a) => JSON.stringify({ ...a.fig, cap: 0 }))).size !== 4) err(o, "figuras repetidas nas alternativas");
          if (!idxOk(4)) err(o, "certa inválida");
        }
        break;
      case "enem":
        if (!x.base) err(o, "enem sem base (texto-base)");
        if (!Array.isArray(alts) || alts.length < 4 || alts.length > 5 || !alts.every((a) => str(a, 1, 100))) err(o, "enem: 4–5 alternativas, cada uma 1–100");
        else {
          if (!distintas(alts)) err(o, "alternativas repetidas");
          if (!idxOk(alts.length)) err(o, "certa inválida");
          if (!Array.isArray(x.analise) || x.analise.length !== alts.length) err(o, "analise precisa de 1 linha por alternativa");
          const L = alts.map((a) => a.length), mx = Math.max(...L);
          const e = (enemPorMateria[materia] ??= { n: 0, maior: 0 });
          e.n++;
          if (L[x.certa] === mx && L.filter((l) => l === mx).length === 1) e.maior++;
        }
        break;
      case "tf":
        if (typeof x.certa !== "boolean") err(o, "tf: certa deve ser true ou false");
        if (!temVisual) err(o, "tf precisa de fig ou base");
        break;
      case "match": {
        const p = x.pares;
        if (!Array.isArray(p) || p.length < 3 || p.length > 4 || !p.every((q) => Array.isArray(q) && q.length === 2 && str(q[0], 1, 40) && str(q[1], 1, 40))) err(o, "match: 3–4 pares, cada lado 1–40");
        else if (!distintas(p.map((q) => q[0])) || !distintas(p.map((q) => q[1]))) err(o, "match: lados repetidos");
        break;
      }
      case "order":
        if (!Array.isArray(x.itens) || x.itens.length < 3 || x.itens.length > 5 || !x.itens.every((s) => str(s, 1, 50))) err(o, "order: 3–5 itens, cada um 1–50");
        else if (!distintas(x.itens)) err(o, "order: itens repetidos");
        break;
      case "fill":
        if (typeof x.frase !== "string" || x.frase.split("___").length !== 2 || x.frase.length > 160) err(o, "fill: frase (≤ 160) com exatamente um ___");
        if (!Array.isArray(x.opcoes) || x.opcoes.length < 3 || x.opcoes.length > 4 || !x.opcoes.every((s) => str(s, 1, 30))) err(o, "fill: 3–4 opções, cada uma 1–30");
        else { if (!distintas(x.opcoes)) err(o, "fill: opções repetidas"); if (!idxOk(x.opcoes.length)) err(o, "certa inválida"); }
        break;
    }
    if (x.dica?.fig != null && !(Number.isInteger(x.dica.fig) && x.fig?.[x.dica.fig])) err(o, "dica.fig aponta para figura que não existe");
  };

  if (!Array.isArray(CONTEUDO) || !CONTEUDO.length) err("conteudo", "nenhuma matéria");
  for (const M of CONTEUDO) {
    const om = `materia ${M.id}`;
    stats.materias++;
    uniq(M.id, om);
    if (!str(M.nome, 1, 20) || !/^#[0-9a-f]{6}$/i.test(M.cor || "") || !str(M.area, 1, 40) || !/^[a-z]{2,5}$/.test(M.prefixo || "")) err(om, "nome (≤ 20), cor #rrggbb, area e prefixo (2–5 letras) obrigatórios");
    if (!str(M.descricao, 1, 120)) err(om, "descricao 1–120");
    const temas = new Set();
    if (!Array.isArray(M.temas) || !M.temas.length) err(om, "temas (linhas do mapa) vazio");
    else for (const t of M.temas) {
      if (!str(t.id, 1, 40) || !str(t.nome, 1, 40) || !FREQ.includes(t.freq) || !str(t.ref, 3, 300)) err(om, `tema ${t.id}: id, nome (≤ 40), freq (alta|media|baixa) e ref obrigatórios`);
      temas.add(t.id);
    }
    const temasUsados = new Set();
    const temasOk = (lista, onde) => { if (!Array.isArray(lista) || !lista.length) return err(onde, "temas vazio"); for (const t of lista) { if (!temas.has(t)) err(onde, `tema "${t}" não existe na matéria`); temasUsados.add(t); } };
    if (!M.unidades?.length) err(om, "matéria sem unidades");
    for (const U of M.unidades || []) {
      const ou = `${M.id}/${U.id}`;
      stats.unidades++;
      uniq(U.id, ou);
      if (!U.id?.startsWith(M.prefixo + "-")) err(ou, "id da unidade sem prefixo da matéria");
      if (!str(U.titulo, 1, 40) || !str(U.descricao, 1, 110)) err(ou, "titulo (≤ 40) e descricao (≤ 110)");
      temasOk(U.temas, ou);
      if (!U.licoes?.length) err(ou, "unidade sem lições");
      let nEx = 0, nEnem = 0;
      const idsLicoes = new Set();
      (U.licoes || []).forEach((L, li) => {
        const ol = `${ou}/${L.id}`;
        stats.licoes++;
        uniq(L.id, ol);
        if (!L.id?.startsWith(M.prefixo + "-")) err(ol, "id da lição sem prefixo");
        if (!str(L.titulo, 1, 40)) err(ol, "titulo 1–40");
        temasOk(L.temas, ol);
        if (!Array.isArray(L.cartoes) || L.cartoes.length < 1 || L.cartoes.length > 4) err(ol, "1 a 4 cartões de ensino");
        for (const [ci, c] of (L.cartoes || []).entries()) {
          stats.cartoes++;
          if (!CARTOES.includes(c.tipo)) err(ol, `cartão ${ci}: tipo "${c.tipo}"`);
          if (!str(c.titulo, 1, 40)) err(ol, `cartão ${ci}: titulo 1–40`);
          if (!str(c.texto, 1, 240)) err(ol, `cartão ${ci}: texto com ${len(c.texto)} caracteres (1–240)`);
          if (c.fig) fig1(c.fig, `${ol}/cartao${ci}`, "main");
        }
        if (!Array.isArray(L.exercicios) || L.exercicios.length < 5 || L.exercicios.length > 8) err(ol, `${L.exercicios?.length} exercícios (5–8)`);
        for (const x of L.exercicios || []) {
          stats.exercicios++;
          exercicio(x, ol, M.prefixo, M.id);
          idsLicoes.add(x.id);
          nEx++;
          if (x.tipo === "enem") { nEnem++; if (li === 0) err(ol, `${x.id}: a 1ª lição da unidade não leva enem`); }
        }
      });
      if (nEnem > Math.round(0.3 * nEx)) err(ou, `${nEnem} de ${nEx} exercícios no formato enem (máx. 30%)`);
      if (!Array.isArray(U.desafio) || U.desafio.length !== 10) err(ou, `desafio com ${U.desafio?.length} questões (exatamente 10)`);
      for (const x of U.desafio || []) {
        stats.desafio++;
        if (!TIPOS_DESAFIO.includes(x.tipo)) err(`${ou}/desafio`, `${x.id}: tipo ${x.tipo} (só mc, mc-figura, enem)`);
        exercicio(x, `${ou}/desafio`, M.prefixo, M.id);
      }
    }
    for (const t of temas) if (!temasUsados.has(t)) avisos.push(`${om}: tema "${t}" não é usado por nenhuma unidade/lição`);
  }
  for (const [m, e] of Object.entries(enemPorMateria))
    if (e.n >= 5 && e.maior / e.n > 0.4) err(`materia ${m}`, `a certa é a alternativa mais longa em ${e.maior} de ${e.n} questões enem (máx. 40%)`);
  return { erros, avisos, stats };
}
