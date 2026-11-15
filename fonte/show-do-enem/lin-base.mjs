// Base comum da matéria Linguagens: renderizadores `lin-cartao` e `lin-frase` + ajudantes para GERAR perguntas de uma tabela de fatos.
// Mesmo traço do jogo (bio-base.mjs). Contrato em PLANO-MATERIAS.md (seção "Linguagens").
//
// FATOS: cada tema tem uma tabela (array) de objetos
//   { id: "metafora",            // único na tabela; vira parte do id da pergunta
//     nome: "Metáfora",          // ≤ 46
//     def: "Compara sem usar 'como'",   // ≤ 46 (sai nas alternativas); NENHUMA def pode servir para dois itens
//     marca: "Troca direta: A é B",     // ≤ 46; sinal que denuncia o item; também única
//     exemplo: "Seus olhos são duas estrelas.", // frase ≤ 100 (vai em lin-frase)
//     fonte?: "autor/obra curta",       // atribuição do exemplo
//     destaque?: ["estrelas"],          // palavras pintadas no reveal (e circuladas na dica)
//     icone?: "balao",                  // ícone do lin-cartao do nome
//     ref: "Cegalla, Novíssima Gramática",  // fonte aberta do fato (obrigatório)
//     confunde: ["comparacao","metonimia","catacrese"] }  // ids (≥ 3) dos irmãos que mais se confundem com ele
//
// perguntaDeTabela({ fatos, alvo, formato, id, pat, lvl, rotulo?, text?, confunde?, hint?, why?, src?, sub? }) -> pergunta pronta
//   alvo: id do fato certo; formato: "de>para" com de/para em nome|def|marca|exemplo (ex.: "nome>def", "def>nome", "exemplo>nome").
//   O lado "de" vira a figura (nome -> lin-cartao; o resto -> lin-frase); o lado "para" vira as 4 alternativas de texto:
//   a certa = fato[para] do alvo; as 3 erradas = fato[para] dos ids em `confunde` (ou fato.confunde), completando com outros
//   itens da tabela se faltar. Ordem e posição da certa: sorteio determinístico pelo id (mesmo id = mesma pergunta).
//   id: obrigatório e único no app (ex.: "lin-fig-metafora-n2d"); rotulo: palavra no enunciado ("figura", "gênero"; padrão "conceito");
//   hint: { t?, mark? } (mark = palavras a circular no lin-frase; em exemplo>nome o padrão é fato.destaque); sub: subtítulo do cartão.
// checkTabela(fatos) -> lista de problemas ([] = ok): campos, ids, def/marca repetida ou que serve para dois itens, textos > 46.
// semente(str) / sorteio(str) -> PRNG determinístico; quebra(texto, max) -> linhas.
import { INK, MUTED, HINT, FILL, esc, r1, svg, text, rect, hintRing } from "./bio-base.mjs";

export const LIN = "#7d4fb3", LIN_SOFT = "#e2d6f5";
export const MAX_ALT = 46;

// ---------- texto ----------
export const quebra = (s, max) => { const out = []; let cur = ""; for (const w of String(s).split(/\s+/).filter(Boolean)) { if (cur && (cur + " " + w).length > max) { out.push(cur); cur = w; } else cur = cur ? cur + " " + w : w; } if (cur) out.push(cur); return out; };
const norm = (w) => w.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]/g, "");

// ---------- ícones (caixa 0..60) ----------
const S = `fill="${LIN_SOFT}" stroke="${INK}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"`;
const L = (d, w = 2.4) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${w}" stroke-linecap="round"/>`;
const ICONES = {
  balao: `<path d="M8 10h44a4 4 0 0 1 4 4v22a4 4 0 0 1-4 4H26l-12 11V40H8a4 4 0 0 1-4-4V14a4 4 0 0 1 4-4z" ${S}/>${L("M16 21h28M16 29h18")}`,
  lupa: `<circle cx="25" cy="25" r="16" ${S}/><path d="M37 37l16 16" stroke="${INK}" stroke-width="6" stroke-linecap="round"/>${L("M17 20a10 10 0 0 1 8-6")}`,
  livro: `<path d="M30 14C23 9 12 9 5 12v36c7-3 18-3 25 2z" ${S}/><path d="M30 14c7-5 18-5 25-2v36c-7-3-18-3-25 2z" ${S}/>${L("M11 22c4-1 8-1 13 1M11 31c4-1 8-1 13 1M36 23c5-2 9-2 13-1M36 32c5-2 9-2 13-1", 2)}`,
  megafone: `<path d="M8 23h10l24-12v38L18 37H8z" ${S}/><path d="M18 37l5 14h8l-4-12" ${S}/>${L("M48 21c4 4 4 14 0 18M53 15c7 7 7 23 0 30")}`,
  coracao: `<path d="M30 52C8 36 6 22 12 14c6-8 16-5 18 3 2-8 12-11 18-3 6 8 4 22-18 38z" fill="#f8d3e3" stroke="${INK}" stroke-width="2.4" stroke-linejoin="round"/>${L("M16 20c2-4 7-4 9-1", 2.2)}`,
  telefone: `<rect x="16" y="4" width="28" height="52" rx="6" ${S}/>${L("M16 14h28M16 44h28", 2.2)}<circle cx="30" cy="50" r="2.4" fill="${INK}"/>${L("M23 24h14M23 30h10M23 36h14", 2.2)}`,
  pena: `<path d="M50 6C30 8 14 22 12 44c14 0 32-10 38-38z" ${S}/>${L("M12 54L38 24M30 20l-8 2M22 30l-8 2M38 12l-8 2")}`,
  jornal: `<rect x="6" y="8" width="48" height="44" rx="4" ${S}/><rect x="12" y="14" width="24" height="9" fill="${INK}"/>${L("M42 16h6M42 22h6M12 30h36M12 36h36M12 42h22")}`,
};
export const ICONES_LISTA = Object.keys(ICONES);

// ---------- lin-cartao ----------
// main: viewBox 320x200 (~310 px na tela); alt: 160x118 (150 px, ou 140 em linha), só o título, fonte 16.
function cartao(fig, opts = {}) {
  const { titulo, sub, icone } = fig, alt = opts.size === "alt", rev = opts.mode === "reveal";
  const fill = rev ? FILL.verde : LIN_SOFT;
  if (alt) {
    const ls = quebra(titulo, 13).slice(0, 3), fs = 16, lh = 20, y0 = 59 - ((ls.length - 1) * lh) / 2 + fs * 0.35;
    return svg(160, 118, rect(4, 4, 152, 110, { fill, rx: 12 }) + ls.map((l, i) => text(80, y0 + i * lh, l, { size: fs, weight: 800 })).join(""), titulo);
  }
  const ls = titulo.length <= 14 ? [titulo] : quebra(titulo, titulo.length > 36 ? 20 : 18).slice(0, 3);
  const ic = icone && ICONES[icone];
  const fs = ls.length === 1 ? (ic ? 32 : Math.max(32, Math.min(40, 296 / (0.62 * titulo.length)))) : ls.length === 2 ? 26 : 22, lh = fs * 1.2;
  const subH = sub ? 22 : 0, icH = ic ? 84 : 0, blockH = icH + (ic ? 12 : 0) + ls.length * lh + subH;
  let y = 100 - blockH / 2 + 4, b = rect(4, 4, 312, 192, { fill, rx: 14 });
  if (ic) { b += `<g transform="translate(118 ${r1(y)}) scale(1.4)">${ic}</g>`; y += icH + 12; }
  const yt = y + fs * 0.85;
  b += ls.map((l, i) => text(160, yt + i * lh, l, { size: fs, weight: 800 })).join("");
  if (sub) b += text(160, yt + (ls.length - 1) * lh + 22, sub, { size: 14, weight: 700, fill: MUTED });
  if (opts.hint) b += hintRing(160, yt - fs * 0.3 + ((ls.length - 1) * lh) / 2, Math.min(150, 20 + Math.max(...ls.map((l) => l.length)) * fs * 0.32));
  return svg(320, 200, b, titulo + (sub ? ", " + sub : ""));
}

// ---------- lin-frase ----------
// main: viewBox 320x200, fonte 14,5 (3 linhas de ~34 caracteres; 4+ linhas de ~38 com fonte 13); alt: 160x118, fonte 14,5.
// Palavras de `destaque` (reveal) e de `hint` (ask/uni) são casadas sem acento/maiúscula; várias palavras seguidas valem como trecho.
function marcas(palavras, listas) {
  const toks = palavras.map(norm), set = new Set();
  for (const item of listas || []) {
    const alvo = String(item).split(/\s+/).map(norm).filter(Boolean); if (!alvo.length) continue;
    for (let i = 0; i + alvo.length <= toks.length; i++) if (alvo.every((t, j) => toks[i + j] === t)) alvo.forEach((_, j) => set.add(i + j));
  }
  return set;
}
function frase(fig, opts = {}) {
  const alt = opts.size === "alt", palavras = String(fig.texto).split(/\s+/).filter(Boolean);
  const hint = opts.hint ? [opts.hint].flat() : null;
  const hm = hint && opts.mode !== "reveal" ? marcas(palavras, hint) : new Set(), dm = opts.mode === "reveal" ? marcas(palavras, fig.destaque) : new Set();
  let fs = 14.5, max = alt ? 17 : 34, lh = alt ? 19.5 : 20;
  let ls = quebra(fig.texto, max);
  if (!alt) for (let f = 24; f >= 14.5; f -= 0.5) { const m = Math.floor(296 / (0.56 * f)), l = quebra(fig.texto, m); if (l.length <= 3) { fs = f; max = m; lh = f * 1.38; ls = l; break; } } // maior fonte que cabe em 3 linhas
  if (!alt && ls.length > 3) { fs = 13; max = 38; lh = 18.5; ls = quebra(fig.texto, max); }
  const maxL = alt ? 5 : 6; if (ls.length > maxL) { ls = ls.slice(0, maxL); ls[maxL - 1] += "…"; }
  let k = 0; const linhas = ls.map((l) => l.split(" ").map((w) => ({ w, i: k++ })));
  const W = alt ? 160 : 320, H = alt ? 118 : 200, fonte = !alt && fig.fonte ? fig.fonte : "";
  const blockH = ls.length * lh + (fonte ? 24 : 0), top = (H - blockH) / 2 + (alt ? 0 : 6);
  const tsp = (p) => {
    const sty = [], at = [];
    if (dm.has(p.i)) { at.push(`fill="${LIN}"`); sty.push("font-weight:800", "text-decoration:underline", "text-decoration-thickness:2px", "text-underline-offset:3px", `text-decoration-color:${LIN}`); }
    if (hm.has(p.i)) sty.push(`text-decoration:underline dashed ${HINT}`, "text-decoration-thickness:3px", "text-underline-offset:4px");
    return `<tspan${at.length ? " " + at.join(" ") : ""}${sty.length ? ` style="${sty.join(";")}"` : ""}>${esc(p.w)}</tspan>`;
  };
  let b = rect(4, 4, W - 8, H - 8, { fill: opts.mode === "reveal" ? "#f6fbf1" : "#fffdf6", rx: 14 });
  if (!alt) b += `<text x="16" y="44" font-size="40" font-weight="800" fill="${LIN_SOFT}" stroke="${INK}" stroke-width="1.2">“</text>`;
  b += linhas.map((ps, n) => `<text x="${W / 2}" y="${r1(top + n * lh + fs)}" font-size="${fs}" font-weight="700" fill="${INK}" text-anchor="middle">${ps.map((p, j) => (j ? " " : "") + tsp(p)).join("")}</text>`).join("");
  if (fonte) b += text(W / 2, top + ls.length * lh + 18, "— " + fonte, { size: 13, weight: 600, fill: MUTED });
  return svg(W, H, b, String(fig.texto));
}

export const FIGS = { "lin-cartao": cartao, "lin-frase": frase };

// ---------- geração de perguntas ----------
export const semente = (s) => { let h = 2166136261; for (const c of String(s)) { h ^= c.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
export const sorteio = (s) => { let a = semente(s); return () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const embaralha = (a, rnd) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

const TEXTO = { "nome>def": "Qual definição combina com o cartão?", "def>nome": "Que {r} esta definição descreve?", "exemplo>nome": "Que {r} aparece neste trecho?", "marca>nome": "Que {r} tem esta marca?", "nome>marca": "Qual é a marca do cartão?", "nome>exemplo": "Qual trecho mostra o que diz o cartão?", "def>marca": "Qual marca combina com esta definição?", "marca>def": "Qual definição combina com esta marca?", "exemplo>def": "Qual definição combina com este trecho?", "exemplo>marca": "Qual marca aparece neste trecho?" };
const figDe = (f, de, sub) => de === "nome"
  ? { kind: "lin-cartao", titulo: f.nome, ...(sub ? { sub } : {}), ...(f.icone ? { icone: f.icone } : {}) }
  : { kind: "lin-frase", texto: f[de], ...(de === "exemplo" && f.fonte ? { fonte: f.fonte } : {}), ...(de === "exemplo" && f.destaque ? { destaque: f.destaque } : {}) };

export function perguntaDeTabela({ fatos, alvo, formato, id, pat, lvl, rotulo = "conceito", text, confunde, hint, why, src, sub }) {
  const [de, para] = String(formato).split(">"), ok = ["nome", "def", "marca", "exemplo"];
  if (!ok.includes(de) || !ok.includes(para) || de === para) throw new Error(`formato inválido: ${formato}`);
  const by = Object.fromEntries(fatos.map((f) => [f.id, f])), f = by[alvo];
  if (!f) throw new Error(`alvo "${alvo}" não existe na tabela`);
  if (!id) throw new Error("passe `id` (ex.: lin-fig-metafora-n2d)");
  const rnd = sorteio(id), certa = f[para];
  const errs = embaralha((confunde || f.confunde || []).map((c) => { if (!by[c]) throw new Error(`${id}: confunde "${c}" não existe`); return by[c]; }), rnd);
  const vistos = new Set([String(certa).toLowerCase()]), pega = [];
  for (const e of [...errs, ...embaralha(fatos.filter((x) => x.id !== alvo && !errs.includes(x)), rnd)]) {
    const t = e[para]; if (e.id === alvo || !t || vistos.has(t.toLowerCase())) continue;
    vistos.add(t.toLowerCase()); pega.push(t); if (pega.length === 3) break;
  }
  if (pega.length < 3) throw new Error(`${id}: só ${pega.length} alternativas erradas distintas`);
  const alts = embaralha([certa, ...pega], rnd);
  const mark = hint?.mark || (de === "exemplo" ? f.destaque : undefined);
  return {
    id, subj: "linguagens", pat, lvl,
    text: text || (TEXTO[formato] || "Qual alternativa combina com isto?").replace("{r}", rotulo),
    fig: [figDe(f, de, sub)], alts: alts.map((t) => ({ t })), correct: [alts.indexOf(certa)],
    hint: { t: hint?.t || (de === "exemplo" ? "Olhe como o trecho é construído." : "Pense no que distingue este item dos parecidos."), fig: 0, ...(mark ? { mark } : {}) },
    why: (why || `${f.nome}: ${f.def}`).slice(0, 150), src: src || "no estilo do ENEM", ref: f.ref,
  };
}

// ---------- conferência da tabela ----------
const STOP = new Set("de da do das dos a o as os e em um uma que com para por se na no nas nos ao como".split(" "));
const toks = (s) => new Set(String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/).filter((w) => w.length > 2 && !STOP.has(w)));
const jacc = (a, b) => { const A = toks(a), B = toks(b); if (!A.size || !B.size) return 0; let n = 0; for (const x of A) if (B.has(x)) n++; return n / (A.size + B.size - n); };
export function checkTabela(fatos) {
  const m = [], ids = new Set();
  for (const f of fatos) {
    const t = `[${f.id}]`;
    for (const k of ["id", "nome", "def", "marca", "exemplo", "ref"]) if (!f[k] || typeof f[k] !== "string") m.push(`${t} campo "${k}" ausente`);
    if (ids.has(f.id)) m.push(`${t} id repetido`); ids.add(f.id);
    for (const k of ["nome", "def", "marca"]) if (f[k] && f[k].length > MAX_ALT) m.push(`${t} ${k} com ${f[k].length} caracteres (máx ${MAX_ALT}): "${f[k]}"`);
    if (f.exemplo && f.exemplo.length > 100) m.push(`${t} exemplo com ${f.exemplo.length} caracteres (máx 100)`);
    if (!Array.isArray(f.confunde) || f.confunde.length < 3) m.push(`${t} confunde precisa de ao menos 3 ids`);
    for (const c of f.confunde || []) { if (c === f.id) m.push(`${t} confunde a si mesmo`); else if (!fatos.some((x) => x.id === c)) m.push(`${t} confunde "${c}" que não existe`); }
    if (f.icone && !ICONES[f.icone]) m.push(`${t} ícone "${f.icone}" desconhecido`);
    for (const d of f.destaque || []) if (f.exemplo && !marcas(f.exemplo.split(/\s+/), [d]).size) m.push(`${t} destaque "${d}" não aparece no exemplo`);
  }
  for (let i = 0; i < fatos.length; i++) for (let j = i + 1; j < fatos.length; j++) {
    const a = fatos[i], b = fatos[j];
    for (const k of ["def", "marca"]) {
      if (!a[k] || !b[k]) continue;
      const x = a[k].toLowerCase().trim(), y = b[k].toLowerCase().trim();
      if (x === y) m.push(`[${a.id}] e [${b.id}] têm ${k} repetida: "${a[k]}"`);
      else if (jacc(x, y) >= 0.7) m.push(`[${a.id}] e [${b.id}] têm ${k} quase igual (serve para os dois): "${a[k]}" / "${b[k]}"`);
    }
    for (const [p, q] of [[a, b], [b, a]]) if (p.marca && q.def && jacc(p.marca, q.def) >= 0.7) m.push(`marca de [${p.id}] serve como def de [${q.id}]`);
  }
  return m;
}
