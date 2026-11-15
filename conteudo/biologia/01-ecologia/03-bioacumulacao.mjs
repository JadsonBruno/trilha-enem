import { mcG, tfG, matchG, orderG, fillG, porNivel } from "../_util.mjs";
import { concNivel, fmt, REF } from "../_modelos.mjs";

const L = "bio-u1-l3";
const ug = (v) => `${fmt(v)} µg/g`;
const TOP = "Mercúrio (µg/g) em cada nível";
const nomes4 = ["Fitoplâncton", "Peixe pequeno", "Peixe grande", "Ave"];

// mc 1: valor inicial 0,02 → 4º nível
const v0 = 0.02, topo4 = concNivel(v0, 0, 3);
const fig1 = { kind: "eco-bioacum", rows: [{ id: "A", n: 4, gl: 0, v: v0, names: nomes4 }], sp: 120, x0: 80, noLetter: true, pergunta: true, hlRow: "A", top: TOP, cap: "Cadeia com mercúrio" };
// mc 2: quatro cadeias; vence a de 3 níveis com valor inicial alto
const CAD = [{ id: "A", n: 3, gl: 0, v: 4 }, { id: "B", n: 5, gl: 0, v: 0.02 }, { id: "C", n: 4, gl: 0, v: 0.3 }, { id: "D", n: 2, gl: 0, v: 25 }];
const topos = CAD.map((c) => concNivel(c.v, c.gl, c.n - 1));
const venc = topos.indexOf(Math.max(...topos));
if (topos.filter((t) => t === topos[venc]).length !== 1) throw new Error("bioacum: empate");
// tf
const rowTf = { id: "A", n: 4, gl: 0, v: 0.1, names: nomes4 };
const fTf = { kind: "eco-bioacum", rows: [rowTf], sp: 120, x0: 80, noLetter: true, hlRow: "A", top: TOP, cap: "Cadeia com mercúrio" };
const rowRz = { id: "A", n: 3, gl: 0, v: 0.5, names: ["Fitoplâncton", "Peixe", "Ave"] };
const fRz = { kind: "eco-bioacum", rows: [rowRz], sp: 120, x0: 80, noLetter: true, hlRow: "A", top: TOP, cap: "Três níveis, ×10" };
// match
const vm = 0.04;
// order
const trof = ["Alga", "Girino", "Peixe", "Garça"];

export default {
  id: L, titulo: "Bioacumulação e biomagnificação", temas: ["ecologia"],
  cartoes: [
    { tipo: "conceito", titulo: "Poluente que se acumula", texto: "Bioacumulação: o poluente persistente (mercúrio, DDT) se acumula no corpo e não sai. Biomagnificação: a concentração sobe a cada nível da cadeia, pois o predador come muitas presas. O topo é o mais atingido.", fig: { ...fig1, rows: [{ ...fig1.rows[0], v: 0.05 }] } },
    { tipo: "analogia", titulo: "Bola de neve", texto: "A bola de neve junta mais neve a cada metro que desce. A concentração se soma a cada nível trófico (biomagnificação): quem está no topo carrega o acúmulo de toda a cadeia." },
    { tipo: "pegadinha", titulo: "Produtor tem a menor dose", texto: "O produtor tem a menor concentração; o predador de topo, a maior. E mais níveis nem sempre vencem: confira o valor inicial e o número de níveis juntos." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Vem um quadro de cadeias com valores iniciais. Calcule o topo de cada uma (×10 por nível, se o texto disser) e compare. Não decida só pelo valor inicial." },
  ],
  exercicios: porNivel([
    mcG(L, "mc-topo-ave", { k: "bio-topo", v: v0, gl: 0, n: 4, f: 10 }, {
      n: 1, q: "O fitoplâncton tem 0,02 µg/g de mercúrio. Com ×10 por nível, quanto tem a ave (4º nível)?", fig: [fig1],
      certo: ug(topo4), errados: [ug(2), ug(0.2), ug(200)], pos: 1,
      why: "Três passagens de ×10: 0,02 → 0,2 → 2 → 20 µg/g. A ave soma o mercúrio de todas as presas.", ref: REF.energia,
    }),
    mcG(L, "mc-cadeias-topo", { k: "bio-cadeias", rows: CAD }, {
      n: 2, q: "Mercúrio é ×10 por nível. Qual cadeia deixa o predador de topo mais contaminado?",
      fig: [{ kind: "eco-bioacum", rows: CAD, pergunta: true, top: TOP, cap: "Quatro cadeias com mercúrio" }],
      certo: `Cadeia ${CAD[venc].id}`, errados: CAD.filter((_, i) => i !== venc).map((c) => `Cadeia ${c.id}`), pos: 2,
      why: `Em A, 4 vira ${fmt(topos[0])} µg/g no 3º nível; B, com mais níveis, chega só a ${fmt(topos[1])}: confira valor e níveis.`, ref: REF.energia,
    }),
    tfG(L, "tf-produtor-maior", { k: "bio-tf-produtor", n: rowTf.n, v: rowTf.v }, {
      n: 1, q: "O fitoplâncton (produtor) é o nível com maior concentração de mercúrio.", fig: [fTf],
      certa: concNivel(rowTf.v, 0, 0) > concNivel(rowTf.v, 0, rowTf.n - 1),
      why: "O fitoplâncton tem a menor dose; a concentração cresce a cada nível e é máxima na ave de topo.", ref: REF.energia,
    }),
    tfG(L, "tf-razao-100", { k: "bio-tf-razao", de: 1, para: 3, f: 10, claim: 100, v: rowRz.v }, {
      n: 2, q: "No 3º nível, a concentração é 100 vezes a do 1º.", fig: [fRz],
      certa: concNivel(rowRz.v, 0, 2) / concNivel(rowRz.v, 0, 0) === 100,
      why: "São duas passagens de ×10: 10 × 10 = 100 vezes (0,5 → 50 µg/g).", ref: REF.energia,
    }),
    matchG(L, "match-niveis-valor", { k: "bio-match", v: vm, n: 4 }, {
      n: 1, q: "O fitoplâncton tem 0,04 µg/g de mercúrio. Ligue cada nível ao valor (×10).",
      pares: nomes4.map((nm, i) => [`${nm} (${i + 1}º nível)`, ug(concNivel(vm, 0, i))]),
      why: "Cada nível multiplica por 10: 0,04; 0,4; 4 e 40 µg/g.", ref: REF.energia,
    }),
    orderG(L, "order-contaminacao", { k: "bio-ordem", niveis: trof }, {
      n: 1, q: "Alga → girino → peixe → garça. Ordene do menos ao mais contaminado por um poluente persistente.", itens: trof,
      why: "A contaminação cresce com o nível trófico: alga (produtor), girino, peixe e garça (topo).", ref: REF.energia,
    }),
    fillG(L, "fill-quanto-mais-alto", { k: "bio-fill", f: 10 }, {
      n: 1, q: "Complete sobre poluentes persistentes na cadeia.", frase: "Quanto mais alto o nível trófico, ___ a concentração do poluente.",
      certo: concNivel(1, 0, 3) > concNivel(1, 0, 0) ? "maior" : "menor", errados: ["menor", "igual"].filter((x) => x !== "maior"), pos: 0,
      why: "O poluente se acumula nos tecidos e não é eliminado: o topo tem a maior concentração (biomagnificação).", ref: REF.energia,
    }),
  ]),
};
