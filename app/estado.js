// Progresso do aluno: estado único, localStorage (sempre em try/catch), datas, ofensiva, XP e revisão espaçada.
export const KEY = "trilha-enem.v1";
export const INTERVALOS = [0, 1, 3, 7, 16]; // dias até a próxima revisão, por caixa
export const METAS = [10, 20, 30, 50];
const DATA = /^\d{4}-\d{2}-\d{2}$/;
const CHAVE = /^[A-Za-z0-9][\w:.\-]{0,99}$/;

let _hoje = null;
const p2 = (n) => String(n).padStart(2, "0");
export const hoje = () => {
  if (_hoje) return _hoje;
  const d = new Date();
  return `${d.getFullYear()}-${p2(d.getMonth() + 1)}-${p2(d.getDate())}`;
};
export const forcarHoje = (d) => { _hoje = d && DATA.test(d) ? d : null; return hoje(); };
export function addDias(d, n) {
  const [a, m, di] = d.split("-").map(Number);
  const t = new Date(Date.UTC(a, m - 1, di + n));
  return `${t.getUTCFullYear()}-${p2(t.getUTCMonth() + 1)}-${p2(t.getUTCDate())}`;
}
export const rotuloData = (d) => {
  const h = hoje();
  if (d <= h) return "hoje";
  if (d === addDias(h, 1)) return "amanhã";
  const [, m, di] = d.split("-");
  return `${di}/${m}`;
};

export const padrao = () => ({ v: 1, xp: 0, streak: 0, lastDay: "", days: {}, done: {}, desafio: {}, review: {}, goal: 20, som: true, tema: "sistema", unlockAll: false, materia: "" });

const num = (v, def = 0, min = 0, max = 1e9) => (Number.isFinite(+v) ? Math.min(max, Math.max(min, Math.floor(+v))) : def);
// Aceita qualquer objeto e devolve um estado válido (usado ao ler o localStorage e ao importar).
export function normalizar(o) {
  const d = padrao();
  if (!o || typeof o !== "object" || Array.isArray(o)) return d;
  d.xp = num(o.xp); d.streak = num(o.streak);
  d.lastDay = DATA.test(o.lastDay) ? o.lastDay : "";
  for (const [k, v] of Object.entries(o.days || {})) if (DATA.test(k)) d.days[k] = num(v);
  for (const [k, v] of Object.entries(o.done || {})) if (CHAVE.test(k) && v && typeof v === "object") d.done[k] = { em: DATA.test(v.em) ? v.em : "", acertos: num(v.acertos, 0, 0, 99), total: num(v.total, 0, 0, 99) };
  for (const [k, v] of Object.entries(o.desafio || {})) if (CHAVE.test(k)) d.desafio[k] = num(v, 0, 0, 10);
  for (const [k, v] of Object.entries(o.review || {})) if (CHAVE.test(k) && v && typeof v === "object" && DATA.test(v.due)) d.review[k] = { box: num(v.box, 0, 0, 4), due: v.due };
  d.goal = METAS.includes(+o.goal) ? +o.goal : 20;
  d.som = o.som !== false;
  d.tema = ["sistema", "claro", "escuro"].includes(o.tema) ? o.tema : "sistema";
  d.unlockAll = o.unlockAll === true;
  d.materia = typeof o.materia === "string" ? o.materia.slice(0, 40) : "";
  return d;
}

export const S = padrao(); // objeto único: é mutado no lugar, então quem importa vê sempre o valor atual
export function substituir(novo) {
  const n = normalizar(novo);
  for (const k of Object.keys(S)) delete S[k];
  Object.assign(S, n);
}
export function carregar() {
  try { const t = localStorage.getItem(KEY); if (t) substituir(JSON.parse(t)); } catch (e) { /* sem armazenamento: segue em memória */ }
}
export function salvar() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignora */ }
}
export function apagarTudo() {
  substituir(padrao());
  try { localStorage.removeItem(KEY); } catch (e) { /* ignora */ }
}

// ---- ofensiva, XP e meta ----
export const xpHoje = () => S.days[hoje()] || 0;
export function streakAtual() {
  if (!S.lastDay) return 0;
  const h = hoje();
  return S.lastDay === h || S.lastDay === addDias(h, -1) ? S.streak : 0;
}
// chamada ao concluir uma lição/desafio/revisão: soma XP e atualiza a ofensiva
export function registrar(xp) {
  const h = hoje();
  S.xp += xp;
  S.days[h] = (S.days[h] || 0) + xp;
  if (S.lastDay !== h) {
    S.streak = S.lastDay === addDias(h, -1) ? S.streak + 1 : 1;
    S.lastDay = h;
  }
  salvar();
}
export function marcarFeita(id, acertos, total) {
  const ant = S.done[id];
  S.done[id] = { em: hoje(), acertos: ant ? Math.max(ant.acertos, acertos) : acertos, total };
  salvar();
}
export function melhorDesafio(uid, nota) {
  const nova = nota > (S.desafio[uid] ?? -1);
  if (nova) S.desafio[uid] = nota;
  salvar();
  return nova;
}

// ---- revisão espaçada: caixas hoje → 1 → 3 → 7 → 16 dias ----
export function revisaoErrou(id) { S.review[id] = { box: 0, due: hoje() }; salvar(); }
export function revisaoAcertou(id) {
  const r = S.review[id];
  if (!r) return;
  if (r.box >= INTERVALOS.length - 1) delete S.review[id];
  else { r.box++; r.due = addDias(hoje(), INTERVALOS[r.box]); }
  salvar();
}
const porData = (a, b) => (a[1].due < b[1].due ? -1 : a[1].due > b[1].due ? 1 : a[0] < b[0] ? -1 : 1);
export function vencidas(existe) {
  const h = hoje();
  return Object.entries(S.review).filter(([id, r]) => existe(id) && r.due <= h).sort(porData).map(([id]) => id);
}
export function proximas(existe) {
  const h = hoje();
  return Object.entries(S.review).filter(([id, r]) => existe(id) && r.due > h).sort(porData).map(([id, r]) => ({ id, ...r }));
}

// ---- exportar / importar ----
export function exportar() {
  const bytes = new TextEncoder().encode(JSON.stringify(S));
  let bin = "";
  for (const b of bytes) bin += String.fromCharCode(b);
  return "TE1:" + btoa(bin);
}
export function decodificar(texto) {
  const t = String(texto || "").replace(/\s+/g, "");
  if (!t.startsWith("TE1:")) throw new Error("O código precisa começar com TE1:");
  let obj;
  try {
    const bin = atob(t.slice(4));
    const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
    obj = JSON.parse(new TextDecoder().decode(bytes));
  } catch (e) { throw new Error("Código ilegível ou incompleto."); }
  if (!obj || typeof obj !== "object" || obj.v !== 1) throw new Error("Código de outra versão ou inválido.");
  return normalizar(obj);
}
export function mesclar(outro) {
  const a = S, b = outro;
  const m = normalizar(a);
  m.xp = Math.max(a.xp, b.xp);
  if (b.lastDay > a.lastDay || (b.lastDay === a.lastDay && b.streak > a.streak)) { m.streak = b.streak; m.lastDay = b.lastDay; }
  for (const [k, v] of Object.entries(b.days)) m.days[k] = Math.max(m.days[k] || 0, v);
  for (const [k, v] of Object.entries(b.done)) { const x = m.done[k]; if (!x || v.acertos > x.acertos || (v.acertos === x.acertos && v.em > x.em)) m.done[k] = { ...v, em: x && x.em > v.em ? x.em : v.em }; }
  for (const [k, v] of Object.entries(b.desafio)) m.desafio[k] = Math.max(m.desafio[k] || 0, v);
  for (const [k, v] of Object.entries(b.review)) { const x = m.review[k]; if (!x || v.due > x.due) m.review[k] = v; }
  return m;
}
