// Modelos e tabelas de Biologia usados pelos geradores. Os modelos vêm de fonte/show-do-enem (só leitura);
// aqui só entram ajudantes de formatação, as figuras montadas com os dados dos modelos e as tabelas conceituais com ref.
import { perguntaShow } from "../_comum/show.mjs";
import { TEIAS, CICLOS, modeloTeia, energiaNivel, energiaNivel1, concNivel, piramideEnergiaValida, relacaoPorSinais, RELACAO, fmt } from "../../fonte/show-do-enem/bio-ecologia.mjs";
import * as GEN from "../../fonte/show-do-enem/bio-genetica.mjs";
import * as CEL from "../../fonte/show-do-enem/bio-celula.mjs";

export { TEIAS, CICLOS, modeloTeia, energiaNivel, energiaNivel1, concNivel, piramideEnergiaValida, relacaoPorSinais, RELACAO, fmt, GEN, CEL };

export const clone = (o) => JSON.parse(JSON.stringify(o));
// figura de uma pergunta do Show (cópia, para ajustar parâmetros)
export const figShow = (id, i = 0) => clone(perguntaShow(id).fig[i]);

// ---- ecologia
export const M = Object.fromEntries(Object.entries(TEIAS).map(([k, t]) => [k, modeloTeia(t.nodes, t.edges)]));
export const nomeNo = (k, id) => TEIAS[k].nodes.find((n) => n.id === id).n;
export const teiaFig = (k, extra = {}) => ({ kind: "eco-teia", ...clone(TEIAS[k]), ...extra });
export const CONSUMIDOR = { 2: "primário", 3: "secundário", 4: "terciário", 5: "quaternário" };
export const ord = (n) => `${n}º`;
// pirâmide de energia: níveis com valor dado (t) ou "?" ; vals = lista de {n, s}
export const piramideFig = (niveis, { mostrar = [0], cap = "Pirâmide de energia", scale } = {}) => ({
  kind: "eco-piramide", tipo: "Energia (kcal) por nível", cap, ...(scale ? { scale } : {}),
  levels: niveis.map((l, i) => ({ n: l.n, s: l.s, t: mostrar.includes(i) ? fmt(l.s) : "?", tr: fmt(l.s) })),
});
export const sinais = (s) => s.replace("-", "−");
export const relFig = (a, ea, sa, b, eb, sb, cap) => ({ kind: "eco-relacao", a, ea, sa, b, eb, sb, nome: relacaoPorSinais(sa, sb), cap });

// ---- genética
export const { fr, fstr, feq, crossGrid, probWhere, countBy, keysWhere, phenD, keyOf, gametes, cells,
  MODES, PEDS, compatibleModes, certainGeno, probGeno, enumerate, isDomTok,
  antigens, canDonate, donorsOf, ALL_TYPES, typeFromAgglutination, CODONS, transcribe, translate, mutate } = GEN;
export const AA_PT = { Met: "Metionina", Trp: "Triptofano", Phe: "Fenilalanina", Gly: "Glicina", Lys: "Lisina", Pro: "Prolina", Leu: "Leucina", Ser: "Serina", Pare: "Parada" };
export const spaced = (s) => s.match(/.{3}/g).join(" ");

// ---- célula
export const { osmose, divide, nearest, isMono, compativeis, paternas } = CEL;

// ---- referências abertas (páginas lidas ao escrever o conteúdo)
const OSA = "OpenStax Anatomy & Physiology 2e, ";
const OSB = "OpenStax Biology 2e, ";
export const REF = {
  teia: "OpenStax Biology 2e, 46.1 Ecology of Ecosystems: https://openstax.org/books/biology-2e/pages/46-1-ecology-of-ecosystems",
  energia: "OpenStax Biology 2e, 46.2 Energy Flow through Ecosystems: https://openstax.org/books/biology-2e/pages/46-2-energy-flow-through-ecosystems",
  ciclos: "OpenStax Biology 2e, 46.3 Biogeochemical Cycles: https://openstax.org/books/biology-2e/pages/46-3-biogeochemical-cycles",
  comunidade: "OpenStax Biology 2e, 45.6 Community Ecology: https://openstax.org/books/biology-2e/pages/45-6-community-ecology",
  hered: "OpenStax Biology 2e, 12.2 Characteristics and Traits: https://openstax.org/books/biology-2e/pages/12-2-characteristics-and-traits",
  abo: "OpenStax Anatomy & Physiology 2e, 18.6 Blood Typing: https://openstax.org/books/anatomy-and-physiology-2e/pages/18-6-blood-typing",
  codigo: "OpenStax Biology 2e, 15.1 The Genetic Code: https://openstax.org/books/biology-2e/pages/15-1-the-genetic-code",
  biotec: "OpenStax Biology 2e, 17.1 Biotechnology (aberta e lida): https://openstax.org/books/biology-2e/pages/17-1-biotechnology",
  dig: OSA + "23.7 Chemical Digestion and Absorption (aberta e lida): https://openstax.org/books/anatomy-and-physiology-2e/pages/23-7-chemical-digestion-and-absorption-a-closer-look",
  cor: OSA + "19.1 Heart Anatomy (aberta e lida): https://openstax.org/books/anatomy-and-physiology-2e/pages/19-1-heart-anatomy",
  pancreas: OSA + "17.9 The Endocrine Pancreas (aberta e lida): https://openstax.org/books/anatomy-and-physiology-2e/pages/17-9-the-endocrine-pancreas",
  imune: OSB + "42.2 Adaptive Immune Response (aberta e lida): https://openstax.org/books/biology-2e/pages/42-2-adaptive-immune-response",
  org: OSB + "4.3 Eukaryotic Cells (aberta e lida): https://openstax.org/books/biology-2e/pages/4-3-eukaryotic-cells",
  endo: OSB + "4.4 The Endomembrane System and Proteins (aberta e lida): https://openstax.org/books/biology-2e/pages/4-4-the-endomembrane-system-and-proteins",
  mitose: OSB + "10.2 The Cell Cycle (aberta e lida): https://openstax.org/books/biology-2e/pages/10-2-the-cell-cycle",
  osmose: OSB + "5.2 Passive Transport: https://openstax.org/books/biology-2e/pages/5-2-passive-transport",
  meiose: OSB + "11.1 The Process of Meiosis: https://openstax.org/books/biology-2e/pages/11-1-the-process-of-meiosis",
  esp: OSB + "18.2 Formation of New Species (ref já usada no Show; não reaberta): https://openstax.org/books/biology-2e/pages/18-2-formation-of-new-species",
  evo: OSB + "18.1 Understanding Evolution (aberta e lida): https://openstax.org/books/biology-2e/pages/18-1-understanding-evolution",
  filo: OSB + "20.1 Organizing Life on Earth: https://openstax.org/books/biology-2e/pages/20-1-organizing-life-on-earth",
  plantas: OSB + "30.5 Transport of Water and Solutes in Plants (aberta e lida): https://openstax.org/books/biology-2e/pages/30-5-transport-of-water-and-solutes-in-plants",
  dengue: "CDC, Dengue (aberta e lida): https://www.cdc.gov/dengue/about/index.html",
  leish: "CDC, Leishmaniasis (aberta e lida): https://www.cdc.gov/leishmaniasis/about/index.html",
  malaria: "Ministério da Saúde, Malária (ref já usada no Show; não reaberta): https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/m/malaria",
  chagas: "Ministério da Saúde, Doença de Chagas (ref já usada no Show; não reaberta): https://www.gov.br/saude/pt-br/assuntos/saude-de-a-a-z/doenca-de-chagas",
  animais: "OpenStax Biology 2e, 27.1 Features of the Animal Kingdom (ref já usada no Show; não reaberta): https://openstax.org/books/biology-2e/pages/27-1-features-of-the-animal-kingdom",
  oms: "OMS, Soil-transmitted helminth infections (aberta e lida): https://www.who.int/news-room/fact-sheets/detail/soil-transmitted-helminth-infections",
  crie: "Ministério da Saúde, Manual dos CRIE, 3ª ed. (ref já usada no Show; não reaberto): https://www.gov.br/saude/pt-br/vacinacao/manuais/manual_centro_referencia_imunobiologicos-1.pdf",
};
export const juntar = (...r) => r.join("; ");
