import { doShow, mcG, tfG, matchG, fillG, porNivel } from "../_util.mjs";
import { PEDS, MODES, compatibleModes, certainGeno, probGeno, fstr, isDomTok, REF } from "../_modelos.mjs";

const L = "bio-u2-l2";
const hered = (ped, mode, focus, cap = "Heredograma") => ({ kind: "gen-heredograma", people: ped, mode, focus, cap });
const modo = (ped) => { const m = compatibleModes(ped); if (m.length !== 1) throw new Error("heredograma ambíguo"); return m[0]; };
const rec = PEDS.recessiva, dom = PEDS.dominante;
const het = (g) => g.some(isDomTok) && g.some((t) => !isDomTok(t));
const pII2 = probGeno("AR", rec, "II-2", het);
const gI1 = certainGeno("AR", rec, "I-1"), gII1 = certainGeno("AR", rec, "II-1");

export default {
  id: L, titulo: "Heredogramas", temas: ["genetica"],
  cartoes: [
    { tipo: "conceito", titulo: "Lendo o heredograma", texto: "Quadrado é homem, círculo é mulher, preenchido é afetado. Pais normais com filho afetado: o alelo é recessivo e estava escondido. Pais afetados com filho normal: o alelo é dominante.", fig: hered(rec, "AR", ["I-1", "I-2", "II-1"]) },
    { tipo: "exemplo", titulo: "Ligada ao X", texto: "O homem tem um só X: se recebe o alelo recessivo, é afetado. Ele passa o X às filhas e o Y aos filhos. Daltonismo e hemofilia são recessivos ligados ao X; a mãe portadora é XDXd." },
    { tipo: "pegadinha", titulo: "Normal não é “AA”", texto: "Pessoa normal numa doença recessiva pode ser AA ou Aa. Se o texto diz que ela é normal, tire o aa das casas: sobram 3, e 2 são Aa. Chance de portador: 2/3." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Pedem o padrão de herança ou a chance de o próximo filho ser afetado. Primeiro defina o padrão; depois multiplique as chances de cada genitor ser portador pela de passar o alelo." },
  ],
  exercicios: porNivel([
    doShow("bio-gen-hered-pais-normais-recessiva"),
    doShow("bio-gen-hered-pais-afetados-dominante"),
    doShow("bio-gen-hered-portador-certo"),
    tfG(L, "tf-rec-ad", { k: "hered-modo", ped: "recessiva", modo: "AD" }, {
      n: 1, q: "Este heredograma é compatível com herança autossômica dominante.", fig: [hered(rec, modo(rec), ["I-1", "I-2", "II-1"])],
      certa: compatibleModes(rec).includes("AD"), why: "Pais normais não têm o alelo dominante; se fosse dominante, a filha afetada não existiria. É recessiva.", ref: REF.hered,
    }),
    tfG(L, "tf-dom-ad", { k: "hered-modo", ped: "dominante", modo: "AD" }, {
      n: 2, q: "Este heredograma indica herança autossômica dominante.", fig: [hered(dom, modo(dom), ["I-1", "I-2", "II-2"])],
      certa: compatibleModes(dom).includes("AD"), why: "Pais afetados tiveram filha normal (aa): o alelo afetado é dominante e os pais são Aa.", ref: REF.hered,
    }),
    matchG(L, "match-genotipos", { k: "hered-geno", ped: "recessiva" }, {
      n: 2, q: "Doença autossômica recessiva. Ligue cada pessoa ao seu genótipo.",
      pares: [["I-1 (pai normal)", `${gI1} (portador)`], ["II-1 (filha afetada)", `${gII1} (afetada)`], ["II-2 (normal, irmão da afetada)", `AA ou Aa (${fstr(pII2)} de ser Aa)`]],
      why: "Os pais normais têm filha aa, então são Aa. A filha afetada é aa. O irmão normal é AA ou Aa: 2/3 de ser Aa.", ref: REF.hered,
    }),
    mcG(L, "mc-portador-2-3", { k: "hered-prob", ped: "recessiva", id: "II-2" }, {
      n: 2, q: "Doença autossômica recessiva. Qual a chance de II-2 (normal, irmão da afetada) ser portador?", fig: [hered(rec, "AR", ["II-2"])],
      certo: fstr(pII2), errados: ["1/2", "1/3", "3/4"], pos: 2,
      why: "Filho de Aa × Aa e normal: 3 casas possíveis (AA, Aa, Aa), 2 são Aa = 2/3.", ref: REF.hered,
    }),
    fillG(L, "fill-padrao-pais-normais", { k: "hered-modo-fill", ped: "recessiva" }, {
      n: 1, q: "Complete o padrão de herança.", frase: "Pais normais com uma filha afetada indicam herança ___.",
      certo: MODES[modo(rec)].nome.toLowerCase(), errados: ["autossômica dominante", "dominante ligada ao X"], pos: 0,
      why: "O alelo estava escondido nos pais (Aa): recessivo e autossômico, pois o pai normal teve filha afetada.", ref: REF.hered,
    }),
  ]),
};
