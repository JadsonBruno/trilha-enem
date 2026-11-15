// Matéria Química do Show: embrulha questions.mjs (BANK/PATTERNS/MOLS/an) sem alterá-lo. Contrato em PLANO-MATERIAS.md.
// Os ids não mudam; só ganham subj e a figura de molécula vira kind "mol". Precisa de drawmol.gen.mjs (gen-drawmol.mjs).
import { toXY, FCOLOR, FNAME } from "./chem.mjs";
import { BANK as RAW, PATTERNS, MOLS, an } from "./questions.mjs";
import { drawMol, r1 } from "./drawmol.gen.mjs";

// modo: "ask" (grupo marcado em cinza), "uni" (cada O pintado pela função), "reveal" (resposta pintada)
// Largura aproximada que a figura ocupa a 390 px (mesmas regras de layout do motor: max-height e colunas do CSS).
const shownWidth = (asp, { size, paired, long }) =>
  size === "alt" ? (long ? Math.min(140, 92 * asp) : Math.min(150, 118 * asp)) : paired ? Math.min(150, 150 * asp) : Math.min(310, 200 * asp);
const MIN_PX = 12.5; // texto real na tela, em px (folga sobre os 11,5 px exigidos)

function figSvg(k, { mark, hintAtoms, mode = "ask", unit = 40, layout = {} } = {}) {
  const M = MOLS[k], A = an(k), ids = (idx) => idx.map((i) => M.m.atoms[i].id);
  let groups = [], tags = false;
  if (mode === "ask" && mark) groups = [{ func: "marca", atoms: ids(mark) }];
  // nome da função escrito só nas figuras grandes; nas alternativas (pequenas) fica só a cor
  if (mode === "uni" || mode === "reveal") { groups = mark && mode === "reveal" ? A.groups.filter((g) => ids(mark).every((id) => g.atoms.includes(id))) : A.groups; tags = unit >= 40 && groups.length > 0; }
  const d = drawMol(M.m, A, { view: "bastao", groups, tags, unit, pad: tags ? 1.35 : 0.85, label: M.nome });
  let svg = d.svg.replaceAll('"#999"', '"#a3abc2"'); // destaque neutro: não usa a cor de nenhuma função
  // texto que a molécula pequena encolheria abaixo de 12 px cresce até 12 px reais; rótulos compridos ("Ácido carboxílico")
  // ganham margem dos dois lados, proporcional ao tamanho da letra (duas passadas: a margem muda a largura e a largura muda a letra)
  let font = 0, mx = 0;
  for (let i = 0; i < 2; i++) {
    const w = d.W + 2 * mx, shown = shownWidth(w / d.H, { ...layout, size: unit < 40 ? "alt" : "main" });
    font = (MIN_PX * w) / shown;
    if (tags) mx = 46 * Math.max(1, font / 12.5);
  }
  svg = svg.replace(/font-size="([\d.]+)"/g, (_, f) => `font-size="${r1(Math.max(+f, font))}"`);
  svg = svg.replace(/<text (?![^>]*stroke=)/g, '<text stroke="#fffdf6" stroke-width="3.5" paint-order="stroke" '); // letra maior não briga com a ligação
  if (tags) svg = svg.replace(/viewBox="0 0 ([\d.]+) ([\d.]+)" width="([\d.]+)"/, (_, w, h) => `viewBox="${r1(-mx)} 0 ${r1(+w + 2 * mx)} ${h}" width="${r1(+w + 2 * mx)}"`);
  if (hintAtoms?.length) {
    const extra = hintAtoms.map((i) => { const a = M.m.atoms[i]; const [x, y] = toXY(a.q, a.r); return `<circle class="hintring" cx="${r1((x - d.box[0]) * unit)}" cy="${r1((y - d.box[1]) * unit)}" r="${r1(unit * 0.46)}" fill="none" stroke="#e08a2f" stroke-width="3.2" stroke-dasharray="5 4"/>`; }).join("");
    svg = svg.replace("</svg>", extra + "</svg>");
  }
  return svg;
}

const capF = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const BANK = RAW.map((q) => ({
  ...q, subj: "quimica",
  fig: q.fig.map((f) => ({ kind: "mol", ...f })),
  alts: q.alts.map((a) => (a.k ? { fig: { kind: "mol", k: a.k }, cap: capF(MOLS[a.k].nome), ok: a.ok } : a)),
  hint: q.hint && { ...q.hint, mark: q.hint.atoms },
}));

export const SUBJECT = {
  id: "quimica", nome: "Química", area: "natureza", cor: "#2a7f8f", PATTERNS, BANK,
  FIGS: { mol: (fig, opts) => figSvg(fig.k, { mark: fig.mark, hintAtoms: opts.hint, mode: opts.mode, unit: opts.size === "alt" ? 34 : 40, layout: { paired: opts.paired, long: opts.long } }) },
  // universitários da química: o motor pinta cada O pela função (mode "uni") e mostra a legenda
  uniTag: "cor dos O",
  uni(q) {
    const fs = new Set([...q.fig.map((f) => f.k), ...q.alts.filter((a) => a.fig).map((a) => a.fig.k)].flatMap((k) => an(k).funcs));
    const leg = [...fs].map((f) => `<span><i style="background:${FCOLOR[f]}"></i>${FNAME[f]}</span>`).join("") || "<span>nenhum O: só C e H</span>";
    return `pintamos cada O pela função.<div class="legend">${leg}</div>`;
  },
};
