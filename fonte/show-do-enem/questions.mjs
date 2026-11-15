// Banco do Show do Milhão da Química (ENEM: hidrocarbonetos e funções oxigenadas).
// Nenhuma resposta é digitada à mão: cada alternativa recebe um valor calculado pelo modelo (analyze, fromSpec,
// oxidize, esterify, combustion, PE, SOLUB) e a pergunta diz qual regra vale. A certa é a única que passa na regra.
// Moléculas novas desenhadas na grade hexagonal (vértices do anel como em molecules.mjs: v0 = (1,0) … v5 = (1,−1);
// para fora de vk: 2·DIRS[k]). Fórmulas de literatura em NEW_FORMULA, conferidas por check-show.mjs.
import { analyze, fromSpec, mol, ringAtoms, ringBonds, clone, addAtom, addBond, FNAME, fText } from "./chem.mjs";
import { oxidize, esterify, combustion, SOLUB_LEVEL } from "./model.mjs";
import { HUNT } from "./molecules.mjs";

const ring6 = (aromatic, extra, bonds) => mol([...ringAtoms(0, 0), ...extra], [...ringBonds(0, aromatic), ...bonds]);

// ----------------------------------------------------------------------------- moléculas
export const MOLS = {};
const reg = (k, nome, ctx, m, spec) => (MOLS[k] = { k, nome, ctx, m, spec });
// ctx: como a molécula aparece na pergunta (contexto do dia a dia, sem entregar a função no nome)
const CTX = {
  etanol: "álcool combustível", acetona: "removedor de esmalte", vinagre: "substância do vinagre", eter: "antigo anestésico",
  banana: "aroma de banana", limoneno: "cheiro da casca da laranja", latico: "leite azedo, músculo cansado", mentol: "frescor da hortelã",
  timol: "tomilho, antisséptico bucal", canela: "cheiro da canela", carvona: "hortelã e cominho", vanilina: "aroma de baunilha",
  eugenol: "cravo-da-índia", salicilato: "pomada para dor muscular", aspirina: "aspirina (remédio para dor)", glicose: "açúcar do sangue",
};
for (const h of HUNT) reg(h.id, h.nome, CTX[h.id], h.m);

const NEW = [
  ["alcool_benzilico", "Álcool benzílico", "conservante de cosméticos", ring6(true, [["C", 2, 0], ["O", 3, -1]], [[0, 6], [6, 7]])],
  ["acido_benzoico", "Ácido benzoico", "conservante de alimentos", ring6(true, [["C", 2, 0], ["O", 3, -1], ["O", 2, 1]], [[0, 6], [6, 7, 2], [6, 8]])],
  ["benzaldeido", "Benzaldeído", "aroma de amêndoa", ring6(true, [["C", 2, 0], ["O", 3, -1]], [[0, 6], [6, 7, 2]])],
  ["benzoato_etila", "Benzoato de etila", "substância da própolis", ring6(true, [["C", 2, 0], ["O", 3, -1], ["O", 2, 1], ["C", 3, 1], ["C", 3, 2]], [[0, 6], [6, 7, 2], [6, 8], [8, 9], [9, 10]])],
  ["acetato_benzila", "Acetato de benzila", "aroma de jasmim", ring6(true, [["C", 2, 0], ["O", 2, 1], ["C", 3, 1], ["O", 4, 0], ["C", 3, 2]], [[0, 6], [6, 7], [7, 8], [8, 9, 2], [8, 10]])],
  ["acido_salicilico", "Ácido salicílico", "remédio para acne e verrugas", ring6(true, [["C", 2, -2], ["O", 2, -3], ["O", 3, -2], ["O", 2, 0]], [[5, 6], [6, 7, 2], [6, 8], [0, 9]])],
  ["hidroquinona", "Hidroquinona", "clareador de manchas na pele", ring6(true, [["O", -2, 2], ["O", 2, -2]], [[2, 6], [5, 7]])],
  ["tolueno", "Tolueno", "solvente de tintas e colas", ring6(true, [["C", 2, 0]], [[0, 6]])],
  ["cicloexanol", "Ciclo-hexanol", "matéria-prima do náilon", ring6(false, [["O", 2, 0]], [[0, 6]])],
  ["naftaleno", "Naftaleno", "naftalina (contra traças)", ring6(true, [["C", 2, 0], ["C", 2, 1], ["C", 1, 2], ["C", 0, 2]], [[0, 6], [6, 7, 2], [7, 8], [8, 9, 2], [9, 1]])],
  ["isobutano", "Metilpropano (isobutano)", "gás de isqueiro", mol([["C", 0, 0], ["C", 1, 0], ["C", 1, 1], ["C", 2, -1]], [[0, 1], [1, 2], [1, 3]])],
  ["isopreno", "Isopreno", "unidade da borracha natural", mol([["C", 0, 0], ["C", 1, 0], ["C", 1, 1], ["C", 2, 1], ["C", 2, -1]], [[0, 1, 2], [1, 2], [2, 3, 2], [1, 4]])],
  ["geraniol", "Geraniol", "óleo de rosas", mol([["O", 0, 0], ["C", 1, 0], ["C", 1, 1], ["C", 2, 1], ["C", 3, 0], ["C", 2, 2], ["C", 3, 2], ["C", 3, 3], ["C", 4, 3], ["C", 5, 2], ["C", 4, 4]], [[0, 1], [1, 2], [2, 3, 2], [3, 4], [3, 5], [5, 6], [6, 7], [7, 8, 2], [8, 9], [8, 10]])],
  ["citral", "Citral (geranial)", "cheiro do capim-limão", mol([["O", 0, 0], ["C", 1, 0], ["C", 1, 1], ["C", 2, 1], ["C", 3, 0], ["C", 2, 2], ["C", 3, 2], ["C", 3, 3], ["C", 4, 3], ["C", 5, 2], ["C", 4, 4]], [[0, 1, 2], [1, 2], [2, 3, 2], [3, 4], [3, 5], [5, 6], [6, 7], [7, 8, 2], [8, 9], [8, 10]])],
  ["hda", "Ácido 10-hidroxidec-2-enoico", "geleia real (sinal da abelha-rainha)", mol([["O", 0, 0], ["C", 1, 0], ["C", 1, 1], ["C", 2, 1], ["C", 2, 2], ["C", 3, 2], ["C", 3, 3], ["C", 4, 3], ["C", 4, 4], ["C", 5, 4], ["C", 5, 5], ["O", 6, 5], ["O", 4, 6]], [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 9, 2], [9, 10], [10, 11, 2], [10, 12]])],
  ["glicerol", "Glicerol (glicerina)", "sobra da produção de biodiesel", mol([["O", 0, 0], ["C", 1, 0], ["C", 1, 1], ["C", 2, 1], ["O", 2, 2], ["O", 0, 2]], [[0, 1], [1, 2], [2, 3], [3, 4], [2, 5]])],
  ["etilenoglicol", "Etilenoglicol (etano-1,2-diol)", "anticongelante; reciclagem do PET", mol([["O", 0, 0], ["C", 1, 0], ["C", 1, 1], ["O", 2, 1]], [[0, 1], [1, 2], [2, 3]])],
  ["anetol", "Anetol", "sabor de erva-doce", ring6(true, [["C", 2, 0], ["C", 2, 1], ["C", 3, 1], ["O", -2, 0], ["C", -3, 1]], [[0, 6], [6, 7, 2], [7, 8], [3, 9], [9, 10]])],
  ["estragol", "Estragol", "estragão e manjericão", ring6(true, [["C", 2, 0], ["C", 2, 1], ["C", 3, 1], ["O", -2, 0], ["C", -3, 1]], [[0, 6], [6, 7], [7, 8, 2], [3, 9], [9, 10]])],
  ["carvacrol", "Carvacrol", "óleo de orégano", ring6(true, [["O", 2, -2], ["C", 2, 0], ["C", -2, 0], ["C", -3, 1], ["C", -2, -1]], [[5, 6], [0, 7], [3, 8], [8, 9], [8, 10]])],
  ["propofol", "Propofol", "anestésico de hospital", ring6(true, [["O", 2, -2], ["C", 2, 0], ["C", 3, -1], ["C", 2, 1], ["C", 0, -2], ["C", -1, -2], ["C", 1, -3]], [[5, 6], [0, 7], [7, 8], [7, 9], [4, 10], [10, 11], [10, 12]])],
  ["ibuprofeno", "Ibuprofeno", "anti-inflamatório", ring6(true, [["C", 2, 0], ["C", 2, 1], ["C", 3, -1], ["O", 3, -2], ["O", 4, -1], ["C", -2, 0], ["C", -3, 1], ["C", -3, 2], ["C", -4, 1]], [[0, 6], [6, 7], [6, 8], [8, 9, 2], [8, 10], [3, 11], [11, 12], [12, 13], [12, 14]])],
  ["resveratrol", "Resveratrol", "casca da uva e vinho tinto", mol([...ringAtoms(0, 0), ["C", 2, 0], ["C", 2, 1], ...ringAtoms(4, 1), ["O", -2, 2], ["O", 0, -2], ["O", 6, 1]], [...ringBonds(0, true), [0, 6], [6, 7, 2], [7, 11], ...ringBonds(8, true), [2, 14], [4, 15], [8, 16]])],
];
for (const [k, nome, ctx, m] of NEW) reg(k, nome, ctx, m);
// fórmula e funções esperadas (literatura), para a conferência
export const NEW_FORMULA = {
  alcool_benzilico: "C₇H₈O", acido_benzoico: "C₇H₆O₂", benzaldeido: "C₇H₆O", benzoato_etila: "C₉H₁₀O₂", acetato_benzila: "C₉H₁₀O₂", acido_salicilico: "C₇H₆O₃",
  hidroquinona: "C₆H₆O₂", tolueno: "C₇H₈", cicloexanol: "C₆H₁₂O", naftaleno: "C₁₀H₈", isobutano: "C₄H₁₀", isopreno: "C₅H₈", geraniol: "C₁₀H₁₈O", citral: "C₁₀H₁₆O",
  hda: "C₁₀H₁₈O₃", glicerol: "C₃H₈O₃", etilenoglicol: "C₂H₆O₂", anetol: "C₁₀H₁₂O", estragol: "C₁₀H₁₂O", carvacrol: "C₁₀H₁₄O", propofol: "C₁₂H₁₈O",
  ibuprofeno: "C₁₃H₁₈O₂", resveratrol: "C₁₄H₁₂O₃",
};
export const NEW_FUNCS = {
  alcool_benzilico: ["alcool"], acido_benzoico: ["acido"], benzaldeido: ["aldeido"], benzoato_etila: ["ester"], acetato_benzila: ["ester"], acido_salicilico: ["acido", "fenol"],
  hidroquinona: ["fenol"], tolueno: [], cicloexanol: ["alcool"], naftaleno: [], isobutano: [], isopreno: [], geraniol: ["alcool"], citral: ["aldeido"],
  hda: ["acido", "alcool"], glicerol: ["alcool"], etilenoglicol: ["alcool"], anetol: ["eter"], estragol: ["eter"], carvacrol: ["fenol"], propofol: ["fenol"],
  ibuprofeno: ["acido"], resveratrol: ["fenol"],
};

// moléculas de cadeia normal, montadas pela receita do modelo (o nome sai de analyze e é a chave)
const SPECS = [
  { n: 1 }, { n: 2 }, { n: 3 }, { n: 4 }, { n: 5 }, { n: 6 }, { n: 7 }, { n: 8 }, { n: 2, bond: 2 }, { n: 3, bond: 2 }, { n: 2, bond: 3 },
  { n: 1, group: "OH", at: 1 }, { n: 2, group: "OH", at: 1 }, { n: 3, group: "OH", at: 1 }, { n: 3, group: "OH", at: 2 }, { n: 4, group: "OH", at: 1 }, { n: 4, group: "OH", at: 2 },
  { n: 6, group: "OH", at: 1 }, { n: 6, group: "OH", at: 2 }, { n: 6, group: "OH", at: 3 },
  { n: 1, group: "CHO" }, { n: 2, group: "CHO" }, { n: 3, group: "CHO" }, { n: 4, group: "CHO" }, { n: 6, group: "CHO" },
  { n: 3, group: "CO", at: 2 }, { n: 4, group: "CO", at: 2 }, { n: 6, group: "CO", at: 2 }, { n: 6, group: "CO", at: 3 }, { n: 7, group: "CO", at: 2 },
  { n: 1, group: "COOH" }, { n: 2, group: "COOH" }, { n: 3, group: "COOH" }, { n: 4, group: "COOH" }, { n: 6, group: "COOH" },
  { n: 1, group: "OR", r: 1 }, { n: 2, group: "OR", r: 1 }, { n: 2, group: "OR", r: 2 }, { n: 4, group: "OR", r: 2 },
  { n: 1, group: "COOR", r: 1 }, { n: 1, group: "COOR", r: 2 }, { n: 2, group: "COOR", r: 1 }, { n: 2, group: "COOR", r: 2 }, { n: 4, group: "COOR", r: 2 }, { n: 2, group: "COOR", r: 4 }, { n: 8, group: "COOR", r: 1 },
  { ring: 6, aromatic: true }, { ring: 6, aromatic: true, group: "OH" }, { ring: 6 },
];
const COMMON = {
  propanona: "propanona (acetona)", etanal: "etanal (acetaldeído)", metanal: "metanal (formol)", "ácido etanoico": "ácido etanoico (acético)",
  "ácido metanoico": "ácido metanoico (fórmico)", "etanoato de etila": "etanoato de etila (acetato de etila)", etoxietano: "etoxietano (éter comum)",
  "butanoato de etila": "butanoato de etila (aroma de abacaxi)", metoximetano: "metoximetano (éter dimetílico)", "hexan-3-ona": "hexan-3-ona (aroma)",
  "heptan-2-ona": "heptan-2-ona (alarme das abelhas)",
};
for (const spec of SPECS) {
  const m = fromSpec(spec), nm = analyze(m).name;
  if (MOLS[nm]) MOLS[nm].spec = spec; // o etanol já existe (molecules.mjs): só ganha a receita
  else reg(nm, COMMON[nm] || nm, null, m, spec);
}
export const SPEC_NAMES = SPECS.map((s) => analyze(fromSpec(s)).name);

const AN = {};
export const an = (k) => { if (!MOLS[k]) throw new Error("molécula desconhecida: " + k); return (AN[k] ??= analyze(MOLS[k].m)); };
const fx = (k) => an(k).funcs; // funções (sem hidrocarboneto)
const nmOf = (k) => an(k).name;
const label = (k) => MOLS[k].nome;
const ctxOf = (k) => (MOLS[k].ctx ? MOLS[k].ctx : MOLS[k].nome);
const nm = (f) => FNAME[f];
const num = (x) => String(x).replace(".", ",");

// ----------------------------------------------------------------------------- regras usadas pelas explicações e dicas
export const WHYF = {
  alcool: "OH num carbono comum (fora de anel aromático) → álcool.",
  fenol: "OH preso direto no anel aromático → fenol.",
  eter: "O entre dois carbonos, sem C=O vizinho → éter.",
  ester: "C=O com um −O− que segue para outro carbono (−COO−) → éster.",
  aldeido: "C=O na ponta da cadeia (com H) → aldeído.",
  cetona: "C=O entre dois carbonos → cetona.",
  acido: "C=O e OH no mesmo carbono (−COOH) → ácido carboxílico.",
  hidrocarboneto: "Só C e H → hidrocarboneto.",
};
const HINTF = {
  alcool: "Olhe o carbono que segura o OH: ele faz parte de um anel aromático (hexágono com duplas alternadas)?",
  fenol: "Olhe o carbono que segura o OH: ele faz parte de um anel aromático (hexágono com duplas alternadas)?",
  eter: "Olhe os dois carbonos vizinhos do O: algum deles tem um =O?",
  ester: "Olhe os dois carbonos vizinhos do O: algum deles tem um =O?",
  aldeido: "Conte os carbonos ligados ao carbono do C=O: é um só ou são dois?",
  cetona: "Conte os carbonos ligados ao carbono do C=O: é um só ou são dois?",
  acido: "Olhe o carbono do C=O: o que mais está preso nele, além do =O?",
};
const CONFUSE = {
  alcool: ["fenol", "eter", "acido"], fenol: ["alcool", "eter", "cetona"], eter: ["ester", "alcool", "cetona"], ester: ["eter", "acido", "cetona"],
  aldeido: ["cetona", "acido", "alcool"], cetona: ["aldeido", "ester", "eter"], acido: ["ester", "aldeido", "alcool"],
};
const ALLF = ["alcool", "fenol", "eter", "aldeido", "cetona", "acido", "ester"];

// ----------------------------------------------------------------------------- montagem das perguntas
export const BANK = [];
const PAT = { 1: "Funções na molécula", 2: "Função em comum", 3: "Ler o bastão", 4: "Estrutura → propriedade", 5: "Reações", 6: "Cadeia carbônica", 7: "Pegadinhas" };
export const PATTERNS = PAT;
// alts: [{ t } texto | { k } figura], cada uma com ok (calculado). fig: [{ k, mark? (índices de átomos), cap? }]
function Q(q) {
  q.correct = q.alts.map((a, i) => (a.ok ? i : -1)).filter((i) => i >= 0);
  BANK.push(q);
}
const atomsIdx = (k, ids) => ids.map((id) => MOLS[k].m.atoms.findIndex((a) => a.id === id));
const groupAt = (k, i) => { const id = MOLS[k].m.atoms[i].id; return an(k).groups.find((g) => g.atoms.includes(id)); };
const neighborsC = (k, idxs) => { const A = an(k), ids = idxs.map((i) => MOLS[k].m.atoms[i].id); return [...new Set(ids.flatMap((id) => A.nb[id].map((x) => x.id)).filter((id) => !ids.includes(id)))]; };

// 1a. Que função está marcada? (um grupo destacado em cinza; a cor de verdade só aparece na resposta)
const MARK = [
  ["etanol", 2, 1], ["acetona", 3, 1], ["vinagre", 3, 1], ["eter", 2, 1], ["banana", 3, 1], ["propanal", "O", 1], ["metanal", "O", 1],
  ["mentol", 6, 2], ["timol", 6, 2], ["canela", 9, 2], ["carvona", 6, 2], ["glicose", 6, 2], ["latico", 5, 2], ["cicloexanol", 6, 2], ["hidroquinona", 6, 2],
  ["anetol", 9, 2], ["acetato_benzila", 9, 2], ["ibuprofeno", 9, 2], ["citral", 0, 2], ["geraniol", 0, 2], ["benzaldeido", 7, 2],
  ["vanilina", 8, 3], ["vanilina", 9, 3], ["eugenol", 7, 3], ["salicilato", 10, 3], ["salicilato", 8, 3], ["aspirina", 9, 3], ["aspirina", 8, 3],
  ["alcool_benzilico", 7, 3], ["hda", 0, 3], ["propofol", 6, 3], ["resveratrol", 14, 3], ["acido_salicilico", 9, 3], ["benzoato_etila", 8, 3],
];
for (const [k, i0, lvl] of MARK) {
  const i = i0 === "O" ? MOLS[k].m.atoms.findIndex((a) => a.el === "O") : i0;
  const g = groupAt(k, i);
  const f = g.func;
  const opts = [f, ...CONFUSE[f]];
  const spec = !!MOLS[k].spec && !MOLS[k].ctx;
  Q({
    id: `marca-${k}-${i}`, pat: 1, lvl, text: "Que função orgânica está marcada na molécula?",
    fig: [{ k, mark: atomsIdx(k, g.atoms), cap: spec ? "" : ctxOf(k) }],
    alts: opts.map((x) => ({ t: nm(x), ok: x === f })),
    hint: { t: HINTF[f], fig: 0, atoms: atomsIdx(k, neighborsC(k, atomsIdx(k, g.atoms))) },
    why: `${spec ? "" : label(k) + ": "}${WHYF[f]}`,
    src: lvl === 3 ? "como no ENEM: remédios, aromas e hormônios em bastão" : "no estilo do ENEM",
  });
}

// 1b. Qual destas é um(a) …? (as alternativas são desenhos)
const WHICH = [
  ["fenol", ["timol", "mentol", "alcool_benzilico", "anetol"], 3, "ENEM PPL 2024 (timol)"],
  ["fenol", ["hidroquinona", "cicloexanol", "glicerol", "etilenoglicol"], 2],
  ["alcool", ["mentol", "timol", "anetol", "benzaldeido"], 2],
  ["alcool", ["alcool_benzilico", "carvacrol", "hidroquinona", "anetol"], 3],
  ["aldeido", ["canela", "carvona", "acido_benzoico", "acetato_benzila"], 2],
  ["cetona", ["carvona", "citral", "acido_benzoico", "benzoato_etila"], 2],
  ["cetona", ["propanona", "propanal", "propan-2-ol", "metoxietano"], 1],
  ["ester", ["acetato_benzila", "anetol", "acido_benzoico", "benzaldeido"], 2],
  ["ester", ["banana", "eter", "vinagre", "acetona"], 1, "ENEM 2021 (aromas de ésteres)"],
  ["eter", ["anetol", "acetato_benzila", "carvacrol", "cicloexanol"], 2],
  ["eter", ["etoxietano", "etanoato de etila", "etanol", "propanona"], 1],
  ["acido", ["ibuprofeno", "acetato_benzila", "propofol", "canela"], 2],
  ["acido", ["vinagre", "banana", "acetona", "etanol"], 1],
  ["aldeido", ["etanal", "propanona", "etanol", "ácido etanoico"], 1],
];
for (const [f, ks, lvl, src] of WHICH) {
  Q({
    id: `qual-${f}-${ks[0]}`, pat: 1, lvl, text: `Qual destas moléculas tem a função ${nm(f).toUpperCase()}?`,
    fig: [], alts: ks.map((k) => ({ k, ok: fx(k).includes(f) })),
    hint: { t: f === "fenol" || f === "alcool" ? HINTF.fenol : f === "eter" || f === "ester" ? HINTF.eter : f === "acido" ? HINTF.acido : HINTF.aldeido },
    why: `${label(ks[0])}: ${WHYF[f]}`, src: src ? "como no " + src : "no estilo do ENEM",
  });
}
const HC = [[["limoneno", "mentol", "carvona", "geraniol"], 1], [["naftaleno", "hidroquinona", "benzaldeido", "alcool_benzilico"], 1], [["isopreno", "citral", "glicerol", "ácido etanoico"], 1]];
for (const [ks, lvl] of HC) {
  Q({
    id: `qual-hc-${ks[0]}`, pat: 1, lvl, text: "Qual destas é um HIDROCARBONETO?", fig: [],
    alts: ks.map((k) => ({ k, ok: an(k).func === "hidrocarboneto" })),
    hint: { t: "No bastão, o O aparece escrito. Procure a figura em que não há nenhum O." },
    why: `${label(ks[0])}: ${WHYF.hidrocarboneto}`, src: "no estilo do ENEM",
  });
}

// 2. Função em comum entre duas moléculas
const PAIRS = [
  ["vanilina", "eugenol", "eter", 2], ["aspirina", "salicilato", "ester", 3], ["latico", "glicose", "alcool", 2], ["timol", "resveratrol", "fenol", 2],
  ["mentol", "geraniol", "alcool", 2], ["citral", "canela", "aldeido", 2], ["carvona", "heptan-2-ona", "cetona", 2], ["ibuprofeno", "acido_benzoico", "acido", 2],
  ["anetol", "eugenol", "eter", 3], ["acido_salicilico", "aspirina", "acido", 3], ["banana", "benzoato_etila", "ester", 2], ["hda", "latico", "acido", 3],
  ["vanilina", "acido_salicilico", "fenol", 3], ["propofol", "hidroquinona", "fenol", 2],
];
for (const [a, b, want, lvl] of PAIRS) {
  const A = fx(a), B = fx(b), inter = A.filter((f) => B.includes(f)), onlyOne = [...A, ...B].filter((f) => !inter.includes(f));
  const rest = [...new Set([...onlyOne, ...CONFUSE[want], ...ALLF])].filter((f) => !inter.includes(f));
  const opts = [want, ...rest.slice(0, 3)];
  Q({
    id: `comum-${a}-${b}`, pat: 2, lvl, text: "Que função orgânica as DUAS moléculas têm em comum?",
    fig: [{ k: a, cap: ctxOf(a) }, { k: b, cap: ctxOf(b) }],
    alts: opts.map((f) => ({ t: nm(f), ok: A.includes(f) && B.includes(f) })),
    hint: { t: "Ache cada O nas duas figuras e classifique pelo vizinho. Cuidado: a função tem de estar nas duas." },
    why: `As duas têm ${nm(want).toLowerCase()}: ${WHYF[want]}`, src: lvl === 3 ? "como no ENEM 2017 (morfina × coniina) e ENEM 2024 (pesticidas)" : "como no ENEM 2012 (piretrina × coronopilina)",
  });
}

// 3. Ler o bastão: fórmula molecular, H escondidos, carbonos
const FORM = [["vanilina", 2], ["eugenol", 2], ["mentol", 3], ["timol", 2], ["aspirina", 3], ["limoneno", 2], ["carvona", 3], ["ibuprofeno", 3], ["anetol", 2], ["geraniol", 3], ["resveratrol", 3], ["canela", 2], ["acetona", 1], ["banana", 2], ["propofol", 3], ["glicose", 3]];
for (const [k, lvl] of FORM) {
  const c = an(k).count;
  const cands = [c, { ...c, H: c.H - 2 }, { ...c, H: c.H + 2 }, { ...c, C: c.C - 1, H: c.H - 2 }, { ...c, H: c.H - 4 }].map(fText);
  const opts = [...new Set(cands)].slice(0, 4);
  Q({
    id: `formula-${k}`, pat: 3, lvl, text: "Qual é a fórmula molecular desta substância?", fig: [{ k, cap: ctxOf(k) }],
    alts: opts.map((t) => ({ t, ok: t === an(k).formula })),
    hint: { t: "Cada ponta e cada dobra do bastão é um C. Cada C faz 4 ligações: o que faltar é H escondido." },
    why: `${label(k)}: ${an(k).formula} (${c.C} C; cada C completa 4 ligações com H).`, src: "no estilo do ENEM (fórmula a partir do bastão)",
  });
}
const HIDDEN = [["limoneno", 2], ["mentol", 3], ["etanol", 1], ["eugenol", 2], ["carvona", 3], ["isopreno", 1], ["citral", 3]];
for (const [k, lvl] of HIDDEN) {
  const A = an(k), onC = A.atoms.filter((a) => a.el === "C").reduce((s, a) => s + A.info[a.id].h, 0), total = A.count.H;
  const opts = [...new Set([onC, total, onC - 2, onC + 2, onC - 1, onC + 1])].filter((x) => x >= 0).slice(0, 4);
  Q({
    id: `hesc-${k}`, pat: 3, lvl, text: "Quantos H estão ligados a CARBONOS (os escondidos do bastão)?", fig: [{ k, cap: ctxOf(k) }],
    alts: opts.map((n) => ({ t: String(n), ok: n === onC })),
    hint: { t: "Vá de carbono em carbono: 4 menos o número de ligações que ele já faz. O H do OH está escrito e não conta." },
    why: `${label(k)}: ${onC} H em carbonos${total !== onC ? ` (mais ${total - onC} no OH, que aparece escrito)` : ""}.`, src: "no estilo do ENEM",
  });
}
const NC = [["eugenol", 1], ["ibuprofeno", 2], ["resveratrol", 2], ["hda", 2]];
for (const [k, lvl] of NC) {
  const n = an(k).count.C;
  Q({
    id: `nc-${k}`, pat: 3, lvl, text: "Quantos átomos de carbono tem esta molécula?", fig: [{ k, cap: ctxOf(k) }],
    alts: [n, n - 1, n + 1, n - 2].map((x) => ({ t: String(x), ok: x === n })),
    hint: { t: "Conte as pontas e as dobras do bastão, inclusive os cantos do hexágono." },
    why: `${label(k)} tem ${n} carbonos (${an(k).formula}).`, src: "no estilo do ENEM",
  });
}

// 4. Estrutura → propriedade
const PEQ = [
  ["max", ["butano", "propanona", "propan-1-ol", "ácido etanoico"], 2, "massas parecidas (58–60 u)"],
  ["max", ["etano", "propano", "metoximetano", "etanol"], 1],
  ["max", ["pentano", "butanal", "butanona", "butan-1-ol"], 3],
  ["max", ["hexano", "heptano", "octano", "pentano"], 1],
  ["max", ["metanoato de metila", "ácido etanoico", "propan-1-ol", "propanal"], 3],
  ["min", ["metano", "metanol", "metanal", "ácido metanoico"], 1],
  ["min", ["etoxietano", "butan-1-ol", "ácido propanoico", "butanona"], 2],
  ["min", ["etanol", "metoximetano", "propan-1-ol", "propan-2-ol"], 3],
];
for (const [kind, ks, lvl] of PEQ) {
  const pes = ks.map((k) => an(k).pe), best = kind === "max" ? Math.max(...pes) : Math.min(...pes);
  const win = ks[pes.indexOf(best)];
  Q({
    id: `pe-${kind}-${ks.join("-")}`, pat: 4, lvl, text: kind === "max" ? "Qual delas tem o MAIOR ponto de ebulição?" : "Qual delas ferve na MENOR temperatura?",
    fig: [], altCap: true, alts: ks.map((k, i) => ({ k, ok: pes[i] === best })),
    hint: { t: "Quem tem O−H faz ligação de hidrogênio (a cola mais forte). O ácido faz duas. Sem O−H, pesa mais a cadeia maior." },
    why: `${label(win)} ferve a ${num(best)} °C (aprox.): ${an(win).forces.hbond ? "faz ligação de hidrogênio" : "não tem O−H para segurar as moléculas"}.`,
    src: "como no ENEM 2019 (frações do petróleo e forças intermoleculares)",
  });
}
const GAS = [[["propano", "pentano", "etanol", "hexano"], 1], [["metoximetano", "etoxietano", "etanol", "propanona"], 3]];
for (const [ks, lvl] of GAS) {
  Q({
    id: `gas-${ks[0]}`, pat: 4, lvl, text: "Qual delas é GÁS na temperatura ambiente (25 °C)?", fig: [], altCap: true,
    alts: ks.map((k) => ({ k, ok: an(k).state === "gás" })),
    hint: { t: "Gás = ferve abaixo de 25 °C: molécula pequena e sem O−H para se segurar." },
    why: `${label(ks.find((k) => an(k).state === "gás"))} ferve a ${num(an(ks.find((k) => an(k).state === "gás")).pe)} °C: já é gás a 25 °C.`, src: "no estilo do ENEM",
  });
}
const SOL = [["max", ["etanol", "hexano", "etoxietano", "butanoato de etila"], 1], ["max", ["propanona", "butanal", "benzeno", "etanoato de butila"], 2], ["min", ["metanol", "etanol", "propan-1-ol", "butan-1-ol"], 3]];
for (const [kind, ks, lvl] of SOL) {
  const lv = ks.map((k) => SOLUB_LEVEL[an(k).solub]), best = kind === "max" ? Math.max(...lv) : Math.min(...lv), win = ks[lv.indexOf(best)];
  Q({
    id: `sol-${kind}-${ks[0]}`, pat: 4, lvl, text: kind === "max" ? "Qual delas se mistura MELHOR com a água?" : "Qual destes álcoois é o MENOS solúvel em água?",
    fig: [], altCap: true, alts: ks.map((k, i) => ({ k, ok: lv[i] === best })),
    hint: { t: "A água gosta da parte com O (polar). Uma cadeia grande de C e H (apolar) atrapalha a mistura." },
    why: `${label(win)}: ${an(win).solub} em água.`, src: "como no ENEM 2015 (organoclorados de baixa polaridade na gordura)",
  });
}
const HB = [[["etoxietano", "propanona", "etanoato de etila", "propan-1-ol"], 2], [["metoximetano", "etanal", "ácido metanoico", "metanoato de metila"], 2]];
for (const [ks, lvl] of HB) {
  Q({
    id: `hb-${ks[0]}`, pat: 4, lvl, text: "Qual delas faz LIGAÇÃO DE HIDROGÊNIO entre suas próprias moléculas?", fig: [], altCap: true,
    alts: ks.map((k) => ({ k, ok: an(k).forces.hbond })),
    hint: { t: "Precisa de um H preso direto num O. Procure o OH escrito na figura." },
    why: `${label(ks.find((k) => an(k).forces.hbond))} tem O−H: o H de uma molécula é atraído pelo O da vizinha.`, src: "no estilo do ENEM",
  });
}
const ACID = [[["carvacrol", "mentol", "anetol", "limoneno"], 3, "como no ENEM PPL 2024 (timol se dissolve em NaOH)"], [["ibuprofeno", "geraniol", "citral", "isopreno"], 2, "no estilo do ENEM"]];
for (const [ks, lvl, src] of ACID) {
  Q({
    id: `acidez-${ks[0]}`, pat: 4, lvl, text: "Qual delas reage com soda cáustica (NaOH) e forma um sal, por ter caráter ácido?", fig: [], altCap: true,
    alts: ks.map((k) => ({ k, ok: fx(k).includes("fenol") || fx(k).includes("acido") })),
    hint: { t: "Álcool comum quase não solta H⁺. Quem solta: OH no anel aromático ou o −COOH." },
    why: `${label(ks[0])}: ${fx(ks[0]).includes("fenol") ? "fenol é ácido fraco e reage com NaOH (álcool não)" : "o −COOH solta H⁺ e reage com NaOH"}.`, src,
  });
}
Q({
  id: "gordura-naftaleno", pat: 4, lvl: 1, text: "Qual delas tende a se acumular na GORDURA, por ser a menos polar?", fig: [], altCap: true,
  alts: ["naftaleno", "glicerol", "glicose", "etilenoglicol"].map((k) => ({ k, ok: an(k).func === "hidrocarboneto" })),
  hint: { t: "Gordura é apolar: atrai quem não tem O (só C e H)." },
  why: "Naftaleno: só C e H, apolar. As outras têm vários OH e preferem a água.", src: "como no ENEM 2015 (organoclorados nos peixes)",
});

// 5. Reações
const nameIs = (target) => (k) => nmOf(k) === target;
const specName = (spec) => analyze(fromSpec(spec)).name;
// ácido + álcool que formam o éster: quebra a ligação C(=O)−O no grafo e compara os pedaços
const sig = (m) => { const A = analyze(m); return A.formula + "|" + [...A.funcs].sort().join(","); };
const hydro = (k) => {
  const A = an(k), g = A.groups.find((x) => x.func === "ester"), [c, , os] = g.atoms, mm = clone(MOLS[k].m);
  mm.bonds = mm.bonds.filter((b) => !((b.a === c && b.b === os) || (b.a === os && b.b === c)));
  addBond(mm, c, addAtom(mm, "O", 99, 99), 1);
  const comp = [], seen = new Set();
  for (const a of mm.atoms) {
    if (seen.has(a.id)) continue;
    const ids = [], st = [a.id];
    while (st.length) { const x = st.pop(); if (seen.has(x)) continue; seen.add(x); ids.push(x); for (const b of mm.bonds) { if (b.a === x) st.push(b.b); if (b.b === x) st.push(b.a); } }
    comp.push({ atoms: mm.atoms.filter((y) => ids.includes(y.id)), bonds: mm.bonds.filter((b) => ids.includes(b.a)) });
  }
  return comp.map(sig).sort().join(" + ");
};
{
  const etanal = specName(oxidize(MOLS.etanol.spec));
  Q({
    id: "bafometro", pat: 5, lvl: 2, text: "No bafômetro, o etanol é oxidado e perde 2 H. Que produto se forma?",
    fig: [{ k: "etanol", cap: "etanol do hálito" }], alts: ["etanal", "eteno", "metoximetano", "propanona"].map((k) => ({ k, ok: nameIs(etanal)(k) })),
    hint: { t: "Oxidar um álcool de ponta: sai o H do OH e um H do carbono, e aparece C=O." },
    why: "Etanol oxidado → etanal (aldeído): o C do OH vira C=O.", src: "como no ENEM PPL 2016 e ENEM 2014 (bafômetro)",
  });
  const acet = specName(oxidize(oxidize(MOLS.etanol.spec)));
  Q({
    id: "vinagre-final", pat: 5, lvl: 2, text: "O vinho azeda: o etanol se oxida até o fim. Que substância fica?",
    fig: [{ k: "etanol", cap: "etanol do vinho" }], alts: ["ácido etanoico", "etanoato de etila", "etoxietano", "ácido butanoico"].map((k) => ({ k, ok: nameIs(acet)(k) })),
    hint: { t: "Álcool de ponta → aldeído → … mais um O no mesmo carbono." },
    why: "Etanol → etanal → ácido etanoico (vinagre): no fim, o carbono fica com =O e OH.", src: "no estilo do ENEM",
  });
  const target = "hexan-3-ona";
  Q({
    id: "hexan-3-ona", pat: 5, lvl: 3, text: "Esta cetona dá aroma a alimentos. Qual álcool, oxidado, forma ela?",
    fig: [{ k: target, cap: "hexan-3-ona" }], alts: ["hexan-3-ol", "hexan-1-ol", "hexan-2-ol", "ácido hexanoico"].map((k) => ({ k, ok: !!MOLS[k].spec && !!oxidize(MOLS[k].spec) && specName(oxidize(MOLS[k].spec)) === target })),
    hint: { t: "Oxidar álcool no meio da cadeia dá cetona no MESMO carbono. Em que carbono está o C=O?" },
    why: "Hexan-3-ol (OH no C3) oxidado → hexan-3-ona (C=O no C3).", src: "como no ENEM 2024 (hexan-3-ona)",
  });
  const ona = specName(oxidize(MOLS["propan-2-ol"].spec));
  Q({
    id: "oxida-propan-2-ol", pat: 5, lvl: 2, text: "Oxidando este álcool (o do álcool de limpeza), que produto se forma?",
    fig: [{ k: "propan-2-ol", cap: "propan-2-ol (isopropanol)" }], alts: ["propanona", "propanal", "ácido propanoico", "propeno"].map((k) => ({ k, ok: nameIs(ona)(k) })),
    hint: { t: "O OH está no carbono do meio. O C=O vai aparecer nesse mesmo carbono." },
    why: "Propan-2-ol (álcool secundário) oxidado → propanona (cetona).", src: "no estilo do ENEM",
  });
  const est = specName(esterify(MOLS["ácido butanoico"].spec, MOLS.etanol.spec));
  Q({
    id: "abacaxi", pat: 5, lvl: 3, text: "Ácido butanoico + etanol → éster (aroma de abacaxi) + água. Qual é o éster?",
    fig: [{ k: "ácido butanoico", cap: "ácido butanoico" }, { k: "etanol", cap: "etanol" }],
    alts: ["butanoato de etila", "etanoato de butila", "etoxibutano", "ácido hexanoico"].map((k) => ({ k, ok: nameIs(est)(k) })),
    hint: { t: "O lado do C=O vem do ácido (4 C); o lado depois do −O− vem do álcool (2 C)." },
    why: "Esterificação: o OH do ácido e o H do álcool saem como água → butanoato de etila.", src: "como no ENEM 2021 (flavorizantes) e ENEM 2012",
  });
  const est2 = specName(esterify(MOLS["ácido etanoico"].spec, MOLS.etanol.spec));
  Q({
    id: "acetato-etila", pat: 5, lvl: 2, text: "Ácido etanoico + etanol → éster + água. Qual é o éster?",
    fig: [{ k: "ácido etanoico", cap: "ácido etanoico (vinagre)" }, { k: "etanol", cap: "etanol" }],
    alts: ["etanoato de etila", "etoxietano", "butanona", "ácido butanoico"].map((k) => ({ k, ok: nameIs(est2)(k) })),
    hint: { t: "Éster tem C=O e um −O− seguido de carbono, tudo junto (−COO−)." },
    why: "Ácido + álcool → etanoato de etila (éster de esmalte e cola) + água.", src: "no estilo do ENEM",
  });
  const trans = specName(esterify({ n: MOLS["etanoato de etila"].spec.n, group: "COOH" }, MOLS.metanol.spec));
  Q({
    id: "transester", pat: 5, lvl: 3, text: "Biodiesel em miniatura: este éster troca o etanol por metanol (transesterificação). Que éster sai?",
    fig: [{ k: "etanoato de etila", cap: "etanoato de etila" }, { k: "metanol", cap: "metanol" }],
    alts: ["etanoato de metila", "metanoato de etila", "ácido etanoico", "metoxietano"].map((k) => ({ k, ok: nameIs(trans)(k) })),
    hint: { t: "A parte do C=O fica igual. Só muda o pedaço depois do −O−." },
    why: "A parte ácida (etanoato) fica; o grupo etila sai e entra metila → etanoato de metila.", src: "como no ENEM 2017 e ENEM PPL 2012 (biodiesel)",
  });
  Q({
    id: "biodiesel-funcao", pat: 5, lvl: 1, text: "O biodiesel é feito de moléculas como esta. Qual é a função orgânica dela?",
    fig: [{ k: "octanoato de metila", cap: "éster metílico do biodiesel" }], alts: ["ester", "eter", "acido", "cetona"].map((f) => ({ t: nm(f), ok: fx("octanoato de metila").includes(f) })),
    hint: { t: HINTF.ester }, why: `Biodiesel: ${WHYF.ester}`, src: "como no ENEM 2017 (biodiesel)",
  });
  const PAIRSE = [["vinagre", "alcool_benzilico"], ["acido_benzoico", "etanol"], ["acido_benzoico", "metanol"], ["fenol", "ácido propanoico"]];
  for (const [k, cap, src] of [["benzoato_etila", "substância da própolis", "como no ENEM 2012 (éster da própolis)"], ["acetato_benzila", "aroma de jasmim", "no estilo do ENEM"]]) {
    const want = hydro(k);
    Q({
      id: `hidrolise-${k}`, pat: 5, lvl: 3, text: "Que ácido e que álcool reagem para formar este éster?", fig: [{ k, cap }],
      alts: PAIRSE.map(([x, y]) => ({ t: `${label(x)} + ${label(y).charAt(0).toLowerCase() + label(y).slice(1)}`, ok: [sig(MOLS[x].m), sig(MOLS[y].m)].sort().join(" + ") === want })),
      hint: { t: "Corte entre o C=O e o −O−: o lado do C=O vira ácido (ganha OH); o outro vira álcool (ganha H)." },
      why: `${label(k)}: o lado do C=O vem do ácido e o lado do −O−C vem do álcool.`, src,
    });
  }
  // combustão completa
  const COMB = [["etanol", "O2", 2], ["metano", "O2", 1], ["propano", "O2", 2], ["octano", "O2", 3], ["glicose", "O2", 3], ["butano", "CO2", 1], ["etanol", "H2O", 2]];
  for (const [k, what, lvl] of COMB) {
    const A = an(k), r = combustion(A), ok = r[what];
    const cands = what === "O2" ? [ok, (2 * A.count.C + A.count.H / 2) / 2, r.CO2, r.H2O, ok + 1, ok * 2] : what === "CO2" ? [ok, ok * 2, ok - 1, A.count.H / 2, ok + 1] : [ok, A.count.H, ok - 1, ok + 1];
    const opts = [...new Set(cands)].filter((x) => x > 0).slice(0, 4);
    const W = { O2: "O₂ são consumidos", CO2: "CO₂ são produzidos", H2O: "H₂O são produzidos" }[what];
    Q({
      id: `comb-${k}-${what}`, pat: 5, lvl, text: `Na combustão completa de 1 mol desta substância, quantos mol de ${W}?`,
      fig: [{ k, cap: `${label(k)} · ${A.formula}` }], alts: opts.map((x) => ({ t: num(x), ok: x === ok })),
      hint: { t: "Todo C vira CO₂ e todo H vai para H₂O (2 H por água). Depois conte os O que faltam." },
      why: `${A.formula} + ${num(r.O2)} O₂ → ${r.CO2} CO₂ + ${r.H2O} H₂O.`, src: "no estilo do ENEM (combustíveis)",
    });
  }
}

// 6. Cadeia carbônica
const desc = (c) => `${c.forma.split(" ")[0]}, ${c.ram}, ${c.lig}, ${c.het.split(" ")[0]}`;
const CHAIN = [["geraniol", 2], ["citral", 2], ["isopreno", 1], ["banana", 3], ["eter", 1], ["glicerol", 1], ["latico", 2], ["hda", 3], ["butanoato de etila", 2], ["heptan-2-ona", 2], ["isobutano", 1], ["etoxibutano", 2], ["ciclo-hexano", 1], ["propeno", 1]];
for (const [k, lvl] of CHAIN) {
  const c = an(k).chain;
  const flip = { ram: { normal: "ramificada", ramificada: "normal" }, lig: { saturada: "insaturada", insaturada: "saturada", aromática: "saturada" }, het: { homogênea: "heterogênea (O no meio)", "heterogênea (O no meio)": "homogênea" } };
  const opts = [c, { ...c, ram: flip.ram[c.ram] }, { ...c, lig: flip.lig[c.lig] }, { ...c, het: flip.het[c.het] }].map(desc);
  Q({
    id: `cadeia-${k}`, pat: 6, lvl, text: "Como se classifica a cadeia carbônica desta molécula?", fig: [{ k, cap: ctxOf(k) }],
    alts: opts.map((t) => ({ t, ok: t === desc(c) })),
    hint: { t: "Quatro perguntas: tem ponta solta? tem carbono com 3 carbonos vizinhos? tem dupla C=C? tem O entre dois C?" },
    why: `${label(k)}: ${desc(c)}.`, src: "como no ENEM 2014 e ENEM 2024 (cadeia ramificada × normal)",
  });
}
const PI = [["limoneno", 2], ["citral", 3], ["geraniol", 2], ["canela", 3], ["isopreno", 1], ["carvona", 3]];
for (const [k, lvl] of PI) {
  const n = an(k).bonds.reduce((s, b) => s + b.o - 1, 0);
  Q({
    id: `pi-${k}`, pat: 6, lvl, text: "Quantas ligações duplas (pi) há nesta molécula, contando C=C e C=O?", fig: [{ k, cap: ctxOf(k) }],
    alts: [n, n - 1, n + 1, n + 2].map((x) => ({ t: String(x), ok: x === n })),
    hint: { t: "Cada traço duplo do bastão é uma ligação pi. Não esqueça as duplas do anel e o C=O." },
    why: `${label(k)}: ${n} ligações duplas, cada uma com 1 ligação pi.`, src: "como no ENEM PPL 2017 (contar ligações pi)",
  });
}
Q({
  id: "aromatico-timol", pat: 6, lvl: 2, text: "Qual destas moléculas tem anel AROMÁTICO (benzênico)?", fig: [],
  alts: ["timol", "mentol", "cicloexanol", "limoneno"].map((k) => ({ k, ok: an(k).aromatic.length > 0 })),
  hint: { t: "Aromático = hexágono com três duplas alternadas. Hexágono só com simples não conta." },
  why: "Timol: anel com duplas alternadas (aromático). Mentol e ciclo-hexanol têm anel sem duplas.", src: "no estilo do ENEM",
});

// 7. Pegadinhas: isômeros
const isoKind = (a, b) => {
  const A = an(a), B = an(b);
  if (A.formula !== B.formula) return "não são isômeros (fórmulas diferentes)";
  if ([...A.funcs].sort().join() !== [...B.funcs].sort().join()) return "isômeros de função";
  if (A.chain.ram !== B.chain.ram || A.chain.forma !== B.chain.forma) return "isômeros de cadeia";
  return "isômeros de posição";
};
const KINDS = ["isômeros de função", "isômeros de cadeia", "isômeros de posição", "não são isômeros (fórmulas diferentes)"];
const ISO = [["etanol", "metoximetano", 2], ["propan-1-ol", "propan-2-ol", 2], ["butano", "isobutano", 2], ["propanal", "propanona", 2], ["anetol", "estragol", 3], ["timol", "carvacrol", 3], ["ácido butanoico", "etanoato de etila", 3], ["hexano", "ciclo-hexano", 3], ["etanol", "etanal", 1]];
for (const [a, b, lvl] of ISO) {
  const kind = isoKind(a, b);
  Q({
    id: `iso-${a}-${b}`, pat: 7, lvl, text: "Que relação existe entre estas duas moléculas?", fig: [{ k: a, cap: label(a) }, { k: b, cap: label(b) }],
    alts: KINDS.map((t) => ({ t, ok: t === kind })),
    hint: { t: "Primeiro compare as fórmulas (conte C, H e O). Se forem iguais, veja o que mudou: a função, o esqueleto ou só o lugar." },
    why: `${an(a).formula} × ${an(b).formula}: ${kind}.`, src: "no estilo do ENEM (isomeria plana)",
  });
}
const ISOF = [["etanol", ["metoximetano", "metanol", "etanal", "propan-1-ol"], 2], ["propan-1-ol", ["metoxietano", "propan-2-ol", "propanal", "etanol"], 3], ["propanal", ["propanona", "propan-1-ol", "butanal", "etanal"], 2],
  ["ácido butanoico", ["etanoato de etila", "butanal", "butan-1-ol", "ácido propanoico"], 3], ["butan-1-ol", ["etoxietano", "butan-2-ol", "butanal", "propan-1-ol"], 3]];
for (const [x, ks, lvl] of ISOF) {
  Q({
    id: `isof-${x}`, pat: 7, lvl, text: `Qual destas é ISÔMERO DE FUNÇÃO do ${nmOf(x)} (mesma fórmula, ${an(x).formula}, outra função)?`, fig: [{ k: x, cap: label(x) }],
    alts: ks.map((k) => ({ k, ok: an(k).formula === an(x).formula && [...fx(k)].sort().join() !== [...fx(x)].sort().join() })),
    hint: { t: "Conte C, H e O de cada figura. Das que batem com a fórmula, qual mudou de função?" },
    why: `${label(ks[0])}: também ${an(ks[0]).formula}, mas ${nm(fx(ks[0])[0]).toLowerCase()}.`, src: "no estilo do ENEM (isomeria de função)",
  });
}

// ============================================================================= LOTE 2
// Mira nas lacunas do lote 1: hidrocarbonetos puros (petróleo, alceno/alcino, octanagem, índice de iodo — ENEM 2012,
// 2013, 2018, 2019), função em comum e pegadinhas fáceis, e moléculas reais novas com 2 ou 3 funções.
const NEW2 = [
  ["framboesa", "Cetona de framboesa", "aroma de framboesa", ring6(true, [["C", 2, 0], ["C", 2, 1], ["C", 3, 1], ["C", 3, 2], ["O", 4, 0], ["O", -2, 0]], [[0, 6], [6, 7], [7, 8], [8, 9], [8, 10, 2], [3, 11]])],
  ["zingerona", "Zingerona", "sabor do gengibre cozido", ring6(true, [["C", 2, 0], ["C", 2, 1], ["C", 3, 1], ["C", 3, 2], ["O", 4, 0], ["O", -2, 0], ["O", -2, 2], ["C", -3, 2]], [[0, 6], [6, 7], [7, 8], [8, 9], [8, 10, 2], [3, 11], [2, 12], [12, 13]])],
  ["acido_galico", "Ácido gálico", "antioxidante do chá e da uva", ring6(true, [["C", 2, 0], ["O", 3, -1], ["O", 2, 1], ["O", -2, 2], ["O", -2, 0], ["O", 0, -2]], [[0, 6], [6, 7, 2], [6, 8], [2, 9], [3, 10], [4, 11]])],
  ["acido_cafeico", "Ácido cafeico", "presente no café", ring6(true, [["C", 2, 0], ["C", 2, 1], ["C", 3, 1], ["O", 4, 0], ["O", 3, 2], ["O", -2, 0], ["O", -2, 2]], [[0, 6], [6, 7, 2], [7, 8], [8, 9, 2], [8, 10], [3, 11], [2, 12]])],
  ["cumarina", "Cumarina", "cheiro de grama cortada", ring6(true, [["O", 2, 0], ["C", 2, 1], ["C", 1, 2], ["C", 0, 2], ["O", 3, 1]], [[0, 6], [6, 7], [7, 8], [8, 9, 2], [9, 1], [7, 10, 2]])],
  ["diacetil", "Butanodiona (diacetil)", "aroma de manteiga da pipoca", mol([["C", 0, 0], ["C", 1, 0], ["C", 1, 1], ["C", 2, 1], ["O", 2, -1], ["O", 0, 2]], [[0, 1], [1, 2], [2, 3], [1, 4, 2], [2, 5, 2]])],
  ["acido_oxalico", "Ácido oxálico", "espinafre; tira-manchas de ferrugem", mol([["C", 0, 0], ["C", 1, 0], ["O", 0, -1], ["O", -1, 1], ["O", 1, 1], ["O", 2, -1]], [[0, 1], [0, 2, 2], [0, 3], [1, 4, 2], [1, 5]])],
  ["acido_malico", "Ácido málico", "acidez da maçã verde", mol([["C", 0, 0], ["C", 1, 0], ["C", 1, 1], ["C", 2, 1], ["O", 0, -1], ["O", -1, 1], ["O", 2, -1], ["O", 3, 0], ["O", 2, 2]], [[0, 1], [1, 2], [2, 3], [0, 4, 2], [0, 5], [1, 6], [3, 7, 2], [3, 8]])],
  ["acido_piruvico", "Ácido pirúvico", "quebra da glicose nas células", mol([["C", 0, 0], ["C", 1, 0], ["C", 1, 1], ["O", 2, -1], ["O", 2, 1], ["O", 0, 2]], [[0, 1], [1, 2], [1, 3, 2], [2, 4, 2], [2, 5]])],
  ["acido_sorbico", "Ácido sórbico", "conservante de pães e queijos", mol([["C", 0, 0], ["C", 1, 0], ["C", 1, 1], ["C", 2, 1], ["C", 2, 2], ["C", 3, 2], ["O", 4, 1], ["O", 3, 3]], [[0, 1], [1, 2, 2], [2, 3], [3, 4, 2], [4, 5], [5, 6, 2], [5, 7]])],
  ["mentona", "Mentona", "óleo de hortelã", ring6(false, [["O", 2, -2], ["C", 2, 0], ["C", 3, -1], ["C", 2, 1], ["C", -2, 0]], [[5, 6, 2], [0, 7], [7, 8], [7, 9], [3, 10]])],
];
for (const [k, nome, ctx, m] of NEW2) reg(k, nome, ctx, m);
Object.assign(NEW_FORMULA, {
  framboesa: "C₁₀H₁₂O₂", zingerona: "C₁₁H₁₄O₃", acido_galico: "C₇H₆O₅", acido_cafeico: "C₉H₈O₄", cumarina: "C₉H₆O₂", diacetil: "C₄H₆O₂",
  acido_oxalico: "C₂H₂O₄", acido_malico: "C₄H₆O₅", acido_piruvico: "C₃H₄O₃", acido_sorbico: "C₆H₈O₂", mentona: "C₁₀H₁₈O",
});
Object.assign(NEW_FUNCS, {
  framboesa: ["cetona", "fenol"], zingerona: ["cetona", "eter", "fenol"], acido_galico: ["acido", "fenol"], acido_cafeico: ["acido", "fenol"], cumarina: ["ester"],
  diacetil: ["cetona"], acido_oxalico: ["acido"], acido_malico: ["acido", "alcool"], acido_piruvico: ["acido", "cetona"], acido_sorbico: ["acido"], mentona: ["cetona"],
});

// transformações no grafo: oxidar o álcool (C−OH vira C=O) e hidrogenar (C=C e C≡C viram simples; anel aromático fica)
export function graphSig(m) {
  const A = analyze(m);
  let lab = Object.fromEntries(m.atoms.map((a) => [a.id, a.el + A.info[a.id].h]));
  for (let it = 0; it < 4; it++) lab = Object.fromEntries(m.atoms.map((a) => [a.id, lab[a.id] + "(" + A.nb[a.id].map((x) => x.o + lab[x.id]).sort().join(",") + ")"]));
  return Object.values(lab).sort().join("|");
}
const sameMol = (m, k) => graphSig(m) === graphSig(MOLS[k].m);
const oxidizeG = (m) => {
  const A = analyze(m), g = A.groups.find((x) => x.func === "alcool");
  if (!g || !A.info[g.atoms[1]].h) return null;
  const mm = clone(m);
  mm.bonds.find((b) => (b.a === g.atoms[0] && b.b === g.atoms[1]) || (b.b === g.atoms[0] && b.a === g.atoms[1])).o = 2;
  return mm;
};
const hydrogenate = (m) => {
  const A = analyze(m), aro = new Set(A.aromatic.flat()), el = (id) => m.atoms.find((a) => a.id === id).el, mm = clone(m);
  for (const b of mm.bonds) if (b.o > 1 && el(b.a) === "C" && el(b.b) === "C" && !(aro.has(b.a) && aro.has(b.b))) b.o = 1;
  return mm;
};
const ccDouble = (k) => { const A = an(k), aro = new Set(A.aromatic.flat()), el = (id) => A.atoms.find((a) => a.id === id).el; return A.bonds.filter((b) => b.o > 1 && el(b.a) === "C" && el(b.b) === "C" && !(aro.has(b.a) && aro.has(b.b))).length; };
const ohCount = (k) => an(k).groups.filter((g) => ["alcool", "fenol", "acido"].includes(g.func)).length;
const up1 = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// 1a. função marcada, moléculas novas
const MARK2 = [
  ["diacetil", 4, 1], ["acido_sorbico", 6, 1], ["acido_oxalico", 2, 1], ["framboesa", 10, 2], ["zingerona", 10, 2], ["acido_galico", 8, 2], ["acido_cafeico", 9, 2],
  ["mentona", 6, 2], ["acido_malico", 6, 2], ["zingerona", 11, 3], ["zingerona", 12, 3], ["acido_galico", 10, 3], ["acido_cafeico", 11, 3], ["cumarina", 10, 3], ["acido_piruvico", 3, 3],
];
for (const [k, i, lvl] of MARK2) {
  const g = groupAt(k, i), f = g.func;
  Q({
    id: `marca-${k}-${i}`, pat: 1, lvl, text: "Que função orgânica está marcada na molécula?",
    fig: [{ k, mark: atomsIdx(k, g.atoms), cap: ctxOf(k) }], alts: [f, ...CONFUSE[f]].map((x) => ({ t: nm(x), ok: x === f })),
    hint: { t: HINTF[f], fig: 0, atoms: atomsIdx(k, neighborsC(k, atomsIdx(k, g.atoms))) },
    why: `${label(k)}: ${WHYF[f]}${k === "cumarina" ? " Aqui o éster fecha um anel." : ""}`,
    src: lvl === 3 ? "como no ENEM: aromas, alimentos e remédios em bastão" : "no estilo do ENEM",
  });
}
// 1b. quantas funções diferentes
for (const [k, lvl] of [["zingerona", 3], ["vanilina", 3], ["acido_cafeico", 2], ["acido_piruvico", 2], ["cumarina", 3]]) {
  const n = fx(k).length;
  Q({
    id: `nfunc-${k}`, pat: 1, lvl, text: "Quantas funções orgânicas DIFERENTES esta molécula tem?", fig: [{ k, cap: ctxOf(k) }],
    alts: [1, 2, 3, 4].map((x) => ({ t: String(x), ok: x === n })),
    hint: { t: "Classifique cada O pelo vizinho. Dois O podem formar um grupo só (−COOH, −COO−)." },
    why: `${label(k)}: ${fx(k).map((f) => nm(f).toLowerCase()).join(", ")} → ${n} ${n === 1 ? "função" : "funções"}.`, src: "como no ENEM 2012 e 2024 (funções em moléculas reais)",
  });
}
// 1c. qual destas é…
const WHICH2 = [
  ["cetona", ["framboesa", "cumarina", "acido_cafeico", "anetol"], 2], ["ester", ["cumarina", "diacetil", "acido_malico", "zingerona"], 3],
  ["fenol", ["framboesa", "mentona", "geraniol", "cicloexanol"], 2], ["aldeido", ["metanal", "metanol", "ácido metanoico", "metoximetano"], 1],
  ["alcool", ["acido_malico", "diacetil", "acido_sorbico", "acido_oxalico"], 2], ["aldeido", ["butanal", "butanona", "butan-2-ol", "ácido butanoico"], 1],
];
for (const [f, ks, lvl] of WHICH2) {
  Q({
    id: `qual-${f}-${ks[0]}`, pat: ks[0] === "butanal" ? 7 : 1, lvl, text: `Qual destas moléculas tem a função ${nm(f).toUpperCase()}?`, fig: [],
    alts: ks.map((k) => ({ k, ok: fx(k).includes(f) })),
    hint: { t: f === "fenol" || f === "alcool" ? HINTF.fenol : f === "ester" ? HINTF.ester : HINTF.aldeido },
    why: `${label(ks[0])}: ${WHYF[f]}`, src: "no estilo do ENEM",
  });
}
// 1d. hidrocarbonetos: família e fórmula geral
const FAM = [["alceno", ["propeno", "propano", "etino", "benzeno"], 1], ["alcino", ["etino", "eteno", "etano", "ciclo-hexano"], 1], ["aromático", ["tolueno", "ciclo-hexano", "isopreno", "limoneno"], 1], ["cicloalcano", ["ciclo-hexano", "hexano", "benzeno", "propeno"], 2]];
const FAMWHY = { alceno: "uma dupla C=C, cadeia aberta", alcino: "uma tripla C≡C", aromático: "anel com duplas alternadas", cicloalcano: "anel só com ligações simples" };
for (const [fam, ks, lvl] of FAM) {
  Q({
    id: `familia-${fam}`, pat: 1, lvl, text: `Qual destes hidrocarbonetos é um ${fam.toUpperCase()}?`, fig: [],
    alts: ks.map((k) => ({ k, ok: an(k).family?.nome === fam })),
    hint: { t: "Olhe as ligações entre carbonos: só simples, uma dupla, uma tripla, ou anel com duplas alternadas?" },
    why: `${label(ks[0])}: ${FAMWHY[fam]} → ${fam}.`, src: "no estilo do ENEM (hidrocarbonetos)",
  });
}
const GERAL = ["CₙH₂ₙ₊₂", "CₙH₂ₙ", "CₙH₂ₙ₋₂", "CₙH₂ₙ₋₆"];
for (const [k, lvl] of [["propeno", 1], ["etino", 2], ["ciclo-hexano", 3]]) {
  const A = an(k);
  Q({
    id: `geral-${k}`, pat: 3, lvl, text: "Este hidrocarboneto segue qual fórmula geral?", fig: [{ k, cap: `${label(k)} · ${A.formula}` }],
    alts: GERAL.map((t) => ({ t, ok: t === A.family.geral })),
    hint: { t: `Conte: ${A.count.C} carbonos e ${A.count.H} hidrogênios. Quanto vale H em função de n = ${A.count.C}?` },
    why: `${up1(label(k))} (${A.family.nome}): ${A.formula} → ${A.family.geral}.${k === "ciclo-hexano" ? " Igual à dos alcenos." : ""}`, src: "no estilo do ENEM (hidrocarbonetos)",
  });
}

// 2. função em comum (inclui as fáceis que faltavam)
const PAIRS2 = [
  ["etanol", "glicerol", "alcool", 1], ["vinagre", "ácido metanoico", "acido", 1], ["acetona", "butanona", "cetona", 1], ["banana", "etanoato de etila", "ester", 1],
  ["framboesa", "zingerona", "cetona", 2], ["mentona", "carvona", "cetona", 2], ["acido_piruvico", "latico", "acido", 2], ["acido_cafeico", "acido_galico", "fenol", 3],
];
for (const [a, b, want, lvl] of PAIRS2) {
  const A = fx(a), B = fx(b), inter = A.filter((f) => B.includes(f)), onlyOne = [...A, ...B].filter((f) => !inter.includes(f));
  const rest = [...new Set([...onlyOne, ...CONFUSE[want], ...ALLF])].filter((f) => !inter.includes(f));
  Q({
    id: `comum-${a}-${b}`, pat: 2, lvl, text: "Que função orgânica as DUAS moléculas têm em comum?", fig: [{ k: a, cap: ctxOf(a) }, { k: b, cap: ctxOf(b) }],
    alts: [want, ...rest.slice(0, 3)].map((f) => ({ t: nm(f), ok: A.includes(f) && B.includes(f) })),
    hint: { t: "Ache cada O nas duas figuras e classifique pelo vizinho. Cuidado: a função tem de estar nas duas." },
    why: `As duas têm ${nm(want).toLowerCase()}: ${WHYF[want]}`, src: lvl === 3 ? "como no ENEM 2017 (morfina × coniina) e ENEM 2024 (pesticidas)" : "como no ENEM 2012 (piretrina × coronopilina)",
  });
}

// 3. ler o bastão
for (const [k, lvl] of [["zingerona", 3], ["acido_galico", 2], ["acido_cafeico", 2], ["cumarina", 3], ["framboesa", 2]]) {
  const c = an(k).count;
  const opts = [...new Set([c, { ...c, H: c.H - 2 }, { ...c, H: c.H + 2 }, { ...c, C: c.C - 1, H: c.H - 2 }, { ...c, H: c.H - 4 }].map(fText))].slice(0, 4);
  Q({
    id: `formula-${k}`, pat: 3, lvl, text: "Qual é a fórmula molecular desta substância?", fig: [{ k, cap: ctxOf(k) }],
    alts: opts.map((t) => ({ t, ok: t === an(k).formula })),
    hint: { t: "Cada ponta e cada dobra do bastão é um C. Cada C faz 4 ligações: o que faltar é H escondido." },
    why: `${label(k)}: ${an(k).formula} (${c.C} C; cada C completa 4 ligações com H).`, src: "no estilo do ENEM (fórmula a partir do bastão)",
  });
}
for (const [k, lvl] of [["mentona", 2], ["acido_sorbico", 1]]) {
  const A = an(k), onC = A.atoms.filter((a) => a.el === "C").reduce((s, a) => s + A.info[a.id].h, 0), total = A.count.H;
  const opts = [...new Set([onC, total, onC - 2, onC + 2, onC - 1, onC + 1])].filter((x) => x >= 0).slice(0, 4);
  Q({
    id: `hesc-${k}`, pat: 3, lvl, text: "Quantos H estão ligados a CARBONOS (os escondidos do bastão)?", fig: [{ k, cap: ctxOf(k) }],
    alts: opts.map((n) => ({ t: String(n), ok: n === onC })),
    hint: { t: "Vá de carbono em carbono: 4 menos o número de ligações que ele já faz. O H do OH está escrito e não conta." },
    why: `${label(k)}: ${onC} H em carbonos${total !== onC ? ` (mais ${total - onC} no OH, que aparece escrito)` : ""}.`, src: "no estilo do ENEM",
  });
}
{
  const n = an("zingerona").count.C;
  Q({
    id: "nc-zingerona", pat: 3, lvl: 1, text: "Quantos átomos de carbono tem esta molécula?", fig: [{ k: "zingerona", cap: ctxOf("zingerona") }],
    alts: [n, n - 1, n + 1, n - 2].map((x) => ({ t: String(x), ok: x === n })),
    hint: { t: "Conte as pontas e as dobras do bastão, inclusive os cantos do hexágono e o CH₃ do −O−CH₃." },
    why: `Zingerona tem ${n} carbonos (${an("zingerona").formula}).`, src: "no estilo do ENEM",
  });
}

// 4 e 6. estrutura → propriedade e cadeia (petróleo, ramificação, insaturação, ligação de H, polaridade)
{
  const ks = ["butano", "hexano", "octano", "heptano"], low = Math.min(...ks.map((x) => an(x).pe));
  Q({
    id: "petroleo-primeiro", pat: 4, lvl: 1, text: "Na destilação do petróleo, qual destes sai PRIMEIRO (ferve antes)?", fig: [], altCap: true,
    alts: ks.map((k) => ({ k, ok: an(k).pe === low })),
    hint: { t: "Só C e H: quanto menor a cadeia, mais fraca a atração entre as moléculas." },
    why: `Butano ferve a ${num(low)} °C: cadeia menor, forças de London mais fracas.`, src: "como no ENEM 2019 (destilação fracionada do petróleo)",
  });
}
Q({
  id: "octanagem-ramificada", pat: 6, lvl: 2, text: "Cadeias ramificadas aguentam mais compressão no motor (octanagem). Qual é RAMIFICADA?", fig: [], altCap: true,
  alts: ["isobutano", "butano", "pentano", "hexano"].map((k) => ({ k, ok: an(k).chain.ram === "ramificada" })),
  hint: { t: "Ramificada: algum carbono está ligado a 3 outros carbonos." },
  why: "Metilpropano: o carbono do meio segura 3 carbonos → cadeia ramificada.", src: "como no ENEM PPL 2012 (octanagem) e ENEM 2024",
});
for (const [ks, lvl] of [[["acido_sorbico", "acido_cafeico", "latico", "acido_malico"], 2], [["limoneno", "mentona", "mentol", "cicloexanol"], 1]]) {
  const v = ks.map(ccDouble), best = Math.max(...v);
  Q({
    id: `iodo-${ks[0]}`, pat: 6, lvl, text: "Qual tem MAIS ligações duplas C=C (maior grau de insaturação)?", fig: [],
    alts: ks.map((k, i) => ({ k, ok: v[i] === best })),
    hint: { t: "Conte só as duplas entre dois carbonos. C=O não entra." },
    why: `${label(ks[v.indexOf(best)])}: ${best} duplas C=C.`, src: "como no ENEM PPL 2013 (índice de iodo dos óleos)",
  });
}
for (const [ks, lvl] of [[["etoxietano", "butan-1-ol", "butanona", "butanal"], 2], [["metanoato de etila", "ácido propanoico", "propanal", "propan-1-ol"], 3]]) {
  Q({
    id: `hetero-${ks[0]}`, pat: 6, lvl, text: "Qual destas tem cadeia HETEROGÊNEA?", fig: [], altCap: true,
    alts: ks.map((k) => ({ k, ok: an(k).chain.het.startsWith("heterogênea") })),
    hint: { t: "Heterogênea: um O no MEIO da cadeia, entre dois carbonos. O pendurado na ponta não conta." },
    why: `${up1(label(ks[0]))}: o O fica entre dois carbonos → heterogênea.`, src: "no estilo do ENEM (cadeia carbônica)",
  });
}
for (const [k, lvl] of [["diacetil", 1], ["acido_malico", 2], ["acido_sorbico", 2], ["acido_piruvico", 2], ["metanoato de etila", 2]]) {
  const c = an(k).chain;
  const flip = { ram: { normal: "ramificada", ramificada: "normal" }, lig: { saturada: "insaturada", insaturada: "saturada" }, het: { homogênea: "heterogênea (O no meio)", "heterogênea (O no meio)": "homogênea" } };
  const opts = [c, { ...c, ram: flip.ram[c.ram] }, { ...c, lig: flip.lig[c.lig] }, { ...c, het: flip.het[c.het] }].map(desc);
  Q({
    id: `cadeia-${k}`, pat: 6, lvl, text: "Como se classifica a cadeia carbônica desta molécula?", fig: [{ k, cap: ctxOf(k) }],
    alts: opts.map((t) => ({ t, ok: t === desc(c) })),
    hint: { t: "Quatro perguntas: tem ponta solta? tem carbono com 3 carbonos vizinhos? tem dupla C=C? tem O entre dois C?" },
    why: `${up1(label(k))}: ${desc(c)}.`, src: "como no ENEM 2014 e ENEM 2024 (cadeia ramificada × normal)",
  });
}
{
  const ks = ["glicerol", "etilenoglicol", "etanol", "propan-1-ol"], most = Math.max(...ks.map(ohCount));
  Q({
    id: "mais-oh-glicerol", pat: 4, lvl: 2, text: "Qual faz MAIS ligações de hidrogênio por molécula (por isso é a mais viscosa)?", fig: [], altCap: true,
    alts: ks.map((k) => ({ k, ok: ohCount(k) === most })),
    hint: { t: "Conte os OH de cada molécula: cada um faz ligações de hidrogênio." },
    why: "Glicerol tem 3 OH: mais ligações de hidrogênio, líquido grosso como xarope.", src: "no estilo do ENEM (forças intermoleculares)",
  });
}
for (const [kind, ks, lvl] of [["max", ["etanoato de etila", "ácido butanoico", "butan-1-ol", "butanona"], 2], ["min", ["pentano", "butanal", "propan-1-ol", "ácido etanoico"], 1]]) {
  const pes = ks.map((k) => an(k).pe), best = kind === "max" ? Math.max(...pes) : Math.min(...pes), win = ks[pes.indexOf(best)];
  Q({
    id: `pe-${kind}-${ks.join("-")}`, pat: 4, lvl, text: kind === "max" ? "Qual delas tem o MAIOR ponto de ebulição?" : "Qual delas ferve na MENOR temperatura?",
    fig: [], altCap: true, alts: ks.map((k, i) => ({ k, ok: pes[i] === best })),
    hint: { t: "Quem tem O−H faz ligação de hidrogênio (a cola mais forte). O ácido faz duas. Sem O−H, pesa mais a cadeia maior." },
    why: `${up1(label(win))} ferve a ${num(best)} °C (aprox.): ${an(win).forces.hbond ? "faz ligação de hidrogênio" : "não tem O−H para segurar as moléculas"}.`,
    src: "como no ENEM 2019 (forças intermoleculares)",
  });
}
Q({
  id: "nao-mistura-hexano", pat: 4, lvl: 1, text: "Qual destas NÃO se mistura com a água (como a gasolina)?", fig: [], altCap: true,
  alts: ["hexano", "etanol", "propanona", "ácido etanoico"].map((k) => ({ k, ok: an(k).solub === "insolúvel" })),
  hint: { t: "A água atrai quem tem O. Só C e H é apolar." },
  why: "Hexano: só C e H, apolar → forma duas fases com a água.", src: "como no ENEM PPL 2015 (gasolina adulterada e água)",
});
Q({
  id: "acidez-acido_galico", pat: 4, lvl: 2, text: "Qual delas reage com soda cáustica (NaOH) e forma um sal, por ter caráter ácido?", fig: [], altCap: true,
  alts: ["acido_galico", "mentona", "geraniol", "diacetil"].map((k) => ({ k, ok: fx(k).includes("fenol") || fx(k).includes("acido") })),
  hint: { t: "Álcool comum e cetona quase não soltam H⁺. Quem solta: OH no anel aromático ou o −COOH." },
  why: "Ácido gálico: tem −COOH e OH de fenol, que soltam H⁺ e reagem com NaOH.", src: "como no ENEM PPL 2024 (timol em NaOH)",
});
Q({
  id: "gordura-limoneno", pat: 4, lvl: 1, text: "Qual delas tende a se acumular na GORDURA, por ser a menos polar?", fig: [], altCap: true,
  alts: ["limoneno", "glicerol", "acido_malico", "acido_oxalico"].map((k) => ({ k, ok: an(k).func === "hidrocarboneto" })),
  hint: { t: "Gordura é apolar: atrai quem não tem O (só C e H)." },
  why: "Limoneno: só C e H, apolar. As outras têm vários O e preferem a água.", src: "como no ENEM 2015 (organoclorados nos peixes)",
});

// 5. reações
{
  const prod = (spec) => specName(oxidize(spec));
  Q({
    id: "oxida-metanol", pat: 5, lvl: 1, text: "Oxidando o metanol (perde 2 H), forma-se o gás do formol. Qual é ele?", fig: [{ k: "metanol", cap: "metanol" }],
    alts: ["metanal", "metano", "ácido metanoico", "metoximetano"].map((k) => ({ k, ok: nmOf(k) === prod(MOLS.metanol.spec) })),
    hint: { t: "Sai o H do OH e um H do carbono: aparece C=O no mesmo carbono." }, why: "Metanol oxidado → metanal (aldeído), o formol.", src: "no estilo do ENEM",
  });
  Q({
    id: "oxida-butan-1-ol", pat: 5, lvl: 2, text: "Oxidando este álcool de ponta (perde 2 H), que produto se forma?", fig: [{ k: "butan-1-ol", cap: "butan-1-ol" }],
    alts: ["butanal", "butanona", "etoxietano", "butan-2-ol"].map((k) => ({ k, ok: nmOf(k) === prod(MOLS["butan-1-ol"].spec) })),
    hint: { t: "O OH está na ponta. O C=O aparece nesse mesmo carbono da ponta." }, why: "Álcool de ponta oxidado → aldeído: butanal.", src: "como no ENEM PPL 2016 (bafômetro)",
  });
}
for (const [from, alts, lvl, text, why, src] of [
  ["mentol", ["mentona", "timol", "carvona", "cicloexanol"], 3, "O mentol da hortelã oxida e vira outra substância do óleo. Qual?", "Mentol (OH no carbono do anel) oxidado → mentona (cetona no mesmo carbono).", "como no ENEM 2024 (álcool → cetona)"],
  ["latico", ["acido_piruvico", "acido_malico", "glicerol", "propanona"], 3, "No corpo, o ácido lático é oxidado (perde 2 H). Que substância se forma?", "O C−OH do ácido lático vira C=O → ácido pirúvico (cetona + ácido).", "no estilo do ENEM"],
]) {
  const out = oxidizeG(MOLS[from].m);
  Q({
    id: `oxida-${from}`, pat: 5, lvl, text, fig: [{ k: from, cap: ctxOf(from) }], alts: alts.map((k) => ({ k, ok: sameMol(out, k) })),
    hint: { t: "Só o carbono que segura o OH muda: ele perde um H e o O vira =O. O resto da molécula fica igual." }, why, src,
  });
}
Q({
  id: "hidrogena-propeno", pat: 5, lvl: 1, text: "O propeno recebe H₂ (hidrogenação) e a dupla vira simples. Que produto se forma?", fig: [{ k: "propeno", cap: "propeno" }],
  alts: ["propano", "etano", "propan-1-ol", "ciclo-hexano"].map((k) => ({ k, ok: sameMol(hydrogenate(MOLS.propeno.m), k) })),
  hint: { t: "Cada H₂ abre uma dupla: os 3 carbonos continuam, só ganham 2 H." }, why: "Propeno + H₂ → propano (alceno vira alcano).", src: "no estilo do ENEM (hidrogenação, como na margarina)",
});
Q({
  id: "hidrogena-sorbico", pat: 5, lvl: 2, text: "O ácido sórbico recebe 2 H₂ e as duas duplas C=C viram simples. Que produto se forma?", fig: [{ k: "acido_sorbico", cap: ctxOf("acido_sorbico") }],
  alts: ["ácido hexanoico", "hexanal", "hexan-1-ol", "ácido butanoico"].map((k) => ({ k, ok: sameMol(hydrogenate(MOLS.acido_sorbico.m), k) })),
  hint: { t: "A hidrogenação só mexe nas duplas C=C. O −COOH fica igual." }, why: "As duplas C=C somem; o −COOH fica → ácido hexanoico.", src: "no estilo do ENEM (hidrogenação)",
});
{
  const f = analyze(hydrogenate(MOLS.limoneno.m)).count;
  const opts = [f, { ...f, H: f.H - 2 }, { ...f, H: f.H + 2 }, { ...f, H: f.H - 4 }].map(fText);
  Q({
    id: "hidrogena-limoneno", pat: 5, lvl: 3, text: "O limoneno é totalmente hidrogenado (todas as C=C viram simples). Qual a fórmula do produto?",
    fig: [{ k: "limoneno", cap: `${ctxOf("limoneno")} · ${an("limoneno").formula}` }], alts: opts.map((t) => ({ t, ok: t === fText(f) })),
    hint: { t: "Conte as duplas C=C: cada uma recebe 1 H₂ (2 H a mais)." }, why: `Limoneno (${an("limoneno").formula}) + 2 H₂ → ${fText(f)}.`, src: "no estilo do ENEM (hidrogenação)",
  });
}
for (const [acid, alc, alts, lvl, why, src] of [
  ["ácido metanoico", "etanol", ["metanoato de etila", "etanoato de metila", "ácido propanoico", "etoxietano"], 2, "Ácido metanoico + etanol → metanoato de etila (aroma de rum) + água.", "como no ENEM 2021 (flavorizantes)"],
  ["ácido etanoico", "butan-1-ol", ["etanoato de butila", "butanoato de etila", "ácido hexanoico", "etoxibutano"], 3, "O lado do C=O vem do ácido etanoico (2 C) e o lado do −O− vem do butanol (4 C).", "como no ENEM 2021 (flavorizantes) e ENEM 2012"],
]) {
  const est = specName(esterify(MOLS[acid].spec, MOLS[alc].spec)), short = (k) => label(k).replace(/ \(.*\)/, "");
  Q({
    id: `ester-${acid}-${alc}`, pat: 5, lvl, text: `${up1(short(acid))} + ${short(alc)} → éster + água. Qual é o éster?`,
    fig: [{ k: acid, cap: label(acid) }, { k: alc, cap: label(alc) }], alts: alts.map((k) => ({ k, ok: nmOf(k) === est })),
    hint: { t: "O lado do C=O vem do ácido; o lado depois do −O− vem do álcool." }, why, src,
  });
}
{
  const want = hydro("etanoato de etila"), short = (k) => label(k).replace(/ \(.*\)/, "");
  const P = [["ácido etanoico", "etanol"], ["ácido metanoico", "propan-1-ol"], ["ácido propanoico", "metanol"], ["ácido butanoico", "metanol"]];
  Q({
    id: "hidrolise-acetato-etila", pat: 5, lvl: 2, text: "Que ácido e que álcool reagem para formar este éster (o do removedor de esmalte)?", fig: [{ k: "etanoato de etila", cap: "etanoato de etila (acetato de etila)" }],
    alts: P.map(([x, y]) => ({ t: `${up1(short(x))} + ${short(y)}`, ok: [sig(MOLS[x].m), sig(MOLS[y].m)].sort().join(" + ") === want })),
    hint: { t: "Corte entre o C=O e o −O−: o lado do C=O vira ácido; o outro vira álcool." }, why: "2 C do lado do C=O (ácido etanoico) + 2 C do lado do −O− (etanol).", src: "como no ENEM 2012 (éster da própolis)",
  });
}
for (const [what, ks, lvl] of [["CO2max", ["metano", "etanol", "octano", "propano"], 1], ["O2min", ["metano", "etanol", "propano", "butano"], 1]]) {
  const v = ks.map((k) => combustion(an(k))[what === "CO2max" ? "CO2" : "O2"]), best = what === "CO2max" ? Math.max(...v) : Math.min(...v), win = ks[v.indexOf(best)];
  Q({
    id: `comb-${what}`, pat: 5, lvl, text: what === "CO2max" ? "Queimando 1 mol de cada, qual libera MAIS CO₂?" : "Queimando 1 mol de cada, qual consome MENOS O₂?", fig: [], altCap: true,
    alts: ks.map((k, i) => ({ k, ok: v[i] === best })),
    hint: { t: what === "CO2max" ? "Todo carbono vira CO₂: conte os carbonos." : "Mais C e H pedem mais O₂. O O da própria molécula ajuda um pouco." },
    why: what === "CO2max" ? `${up1(label(win))}: ${an(win).count.C} carbonos → ${best} CO₂.` : `${up1(label(win))}: só ${num(best)} O₂ por mol (molécula menor).`, src: "no estilo do ENEM (combustíveis e efeito estufa)",
  });
}
for (const [k, lvl] of [["etino", 2], ["glicerol", 3]]) {
  const A = an(k), r = combustion(A), ok = r.O2;
  const opts = [...new Set([ok, (2 * A.count.C + A.count.H / 2) / 2, r.CO2, r.H2O, ok + 1, ok * 2])].filter((x) => x > 0).slice(0, 4);
  Q({
    id: `comb-${k}-O2`, pat: 5, lvl, text: "Na combustão completa de 1 mol desta substância, quantos mol de O₂ são consumidos?", fig: [{ k, cap: `${label(k)} · ${A.formula}` }],
    alts: opts.map((x) => ({ t: num(x), ok: x === ok })),
    hint: { t: "Todo C vira CO₂ e todo H vai para H₂O (2 H por água). Depois conte os O que faltam." },
    why: `${A.formula} + ${num(r.O2)} O₂ → ${r.CO2} CO₂ + ${r.H2O} H₂O.`, src: k === "etino" ? "no estilo do ENEM (maçarico de acetileno)" : "no estilo do ENEM (glicerina do biodiesel)",
  });
}

// 7. pegadinhas: isomeria
for (const [a, b, lvl] of [["butan-1-ol", "butan-2-ol", 2], ["hexan-2-ol", "hexan-3-ol", 2], ["propan-2-ol", "metoxietano", 2], ["butanal", "butanona", 1], ["ácido propanoico", "etanoato de metila", 3], ["eteno", "etano", 1]]) {
  const kind = isoKind(a, b);
  Q({
    id: `iso-${a}-${b}`, pat: 7, lvl, text: "Que relação existe entre estas duas moléculas?", fig: [{ k: a, cap: label(a) }, { k: b, cap: label(b) }],
    alts: KINDS.map((t) => ({ t, ok: t === kind })),
    hint: { t: "Primeiro compare as fórmulas (conte C, H e O). Se forem iguais, veja o que mudou: a função, o esqueleto ou só o lugar." },
    why: `${an(a).formula} × ${an(b).formula}: ${kind}.`, src: "no estilo do ENEM (isomeria plana)",
  });
}
for (const [x, ks, lvl] of [["propanona", ["propanal", "propan-2-ol", "butanona", "etanal"], 1], ["metoximetano", ["etanol", "metanol", "etanal", "etoxietano"], 1], ["butanona", ["butanal", "butan-2-ol", "propanona", "ácido butanoico"], 2]]) {
  Q({
    id: `isof-${x}`, pat: 7, lvl, text: `Qual destas é ISÔMERO DE FUNÇÃO de ${label(x).replace(/ \(.*\)/, "")} (mesma fórmula, ${an(x).formula}, outra função)?`, fig: [{ k: x, cap: label(x) }],
    alts: ks.map((k) => ({ k, ok: an(k).formula === an(x).formula && [...fx(k)].sort().join() !== [...fx(x)].sort().join() })),
    hint: { t: "Conte C, H e O de cada figura. Das que batem com a fórmula, qual mudou de função?" },
    why: `${up1(label(ks[0]))}: também ${an(ks[0]).formula}, mas ${nm(fx(ks[0])[0]).toLowerCase()}.`, src: "no estilo do ENEM (isomeria de função)",
  });
}
