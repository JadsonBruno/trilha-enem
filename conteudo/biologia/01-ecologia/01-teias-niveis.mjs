import { doShow, mcG, tfG, matchG, orderG, fillG, porNivel } from "../_util.mjs";
import { M, TEIAS, nomeNo, teiaFig, CONSUMIDOR, ord, REF } from "../_modelos.mjs";

const L = "bio-u1-l1";
const am = M.amazonia, mg = M.mangue, ce = M.cerrado, pa = M.pantanal;
const nm = (k, id) => nomeNo(k, id);

// cadeia amazônica do produtor ao topo: cada passo é uma seta da teia
const cadeia = ["folhas", "insetos", "sapo", "jiboia", "onca"];
// consumidor secundário no manguezal: nível 3 (o siri só tem esse nível)
const secMg = ["alga", "caramujo", "siri", "tainha"].filter((id) => mg.niveis(id).includes(3));
if (secMg.length !== 1) throw new Error("manguezal: consumidor secundário ambíguo");

export default {
  id: L, titulo: "Teias e níveis tróficos", temas: ["ecologia"],
  cartoes: [
    { tipo: "conceito", titulo: "A seta mostra a energia", texto: "Na teia, a seta sai de quem é comido e aponta para quem come. Ela mostra o caminho da energia. O produtor (planta, alga) é o 1º nível.", fig: teiaFig("pantanal") },
    { tipo: "analogia", titulo: "Bastão de revezamento", texto: "A energia é um bastão passado de mão em mão: produtor, consumidor primário, secundário, terciário… Cada passada é um nível trófico, contado a partir do produtor." },
    { tipo: "pegadinha", titulo: "Um bicho, dois níveis", texto: "Quem come de mais de uma fonte pode ocupar dois níveis. A jiboia, que come cutia e sapo, é secundária e terciária. Conte o caminho, não o nome do bicho.", fig: teiaFig("amazonia") },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "A prova mostra uma teia e pergunta o nível de um organismo ou quem sofre se uma espécie sumir. Marque o produtor, siga as setas e veja quem fica sem alimento." },
  ],
  exercicios: porNivel([
    doShow("bio-eco-teia-cerrado-sec"),
    doShow("bio-eco-teia-seta-pantanal"),
    mcG(L, "mc-sec-mangue", { k: "teia-consumidor", teia: "mangue", nivel: 3, alts: ["alga", "caramujo", "siri", "tainha"] }, {
      n: 1, q: "No manguezal, qual destes organismos é consumidor secundário?", fig: [teiaFig("mangue", { cap: "Teia do manguezal" })],
      certo: nm("mangue", secMg[0]), errados: ["alga", "caramujo", "tainha"].map((i) => nm("mangue", i)), pos: 2,
      why: "A alga é produtora (1º nível); caramujo e tainha comem alga (2º); o siri come o caramujo e é secundário (3º).", ref: REF.teia,
    }),
    tfG(L, "tf-cutia-sec", { k: "teia-tf", teia: "amazonia", no: "cutia", nivel: 3 }, {
      n: 1, q: "Nesta teia, a cutia é consumidora secundária.", fig: [teiaFig("amazonia", { cap: "Teia da Amazônia" })],
      certa: am.niveis("cutia").includes(3),
      why: "A cutia come só fruto (produtor): é consumidora primária, do 2º nível. A onça é quem a come.", ref: REF.teia,
    }),
    tfG(L, "tf-sem-lambari-ariranha", { k: "teia-perde", teia: "pantanal", retirado: "lambari", alvo: "ariranha" }, {
      n: 2, q: "Se o lambari desaparecer, a ariranha também fica sem alimento.", fig: [teiaFig("pantanal", { cap: "Teia do Pantanal" })],
      certa: pa.perdeTudo("lambari").includes("ariranha"),
      why: "O dourado só come lambari e some; a ariranha só come dourado, então fica sem alimento também.", ref: REF.teia,
    }),
    orderG(L, "order-cadeia-amazonia", { k: "teia-cadeia", teia: "amazonia", caminho: cadeia }, {
      n: 2, q: "Pela teia, ordene a cadeia do produtor até a onça, passando pela jiboia.", fig: [teiaFig("amazonia", { cap: "Teia da Amazônia" })], itens: cadeia.map((id) => nm("amazonia", id)),
      why: "Cada seta leva a energia ao próximo: folhas, insetos, sapo, jiboia e, no fim, a onça.", ref: REF.teia,
    }),
    matchG(L, "match-niveis-cerrado", { k: "teia-match", teia: "cerrado" }, {
      n: 1, q: "Pela cadeia da figura, ligue cada organismo do Cerrado ao seu nível trófico.", fig: [teiaFig("cerrado", { cap: "Cadeia do Cerrado" })],
      pares: TEIAS.cerrado.nodes.map((n) => { const v = ce.nivel(n.id); return [n.n, `${ord(v)} nível: ${v === 1 ? "produtor" : "consumidor " + CONSUMIDOR[v]}`]; }),
      why: "Capim produz; gafanhoto come capim (primário); sapo come gafanhoto (secundário); cobra come sapo (terciário).", ref: REF.teia,
    }),
    fillG(L, "fill-dourado", { k: "teia-fill", teia: "pantanal", no: "dourado" }, {
      n: 1, q: "Complete sobre a cadeia do Pantanal.", frase: "No Pantanal, o dourado é consumidor ___.",
      certo: CONSUMIDOR[pa.nivel("dourado")], errados: ["primário", "terciário"].filter((x) => x !== CONSUMIDOR[pa.nivel("dourado")]), pos: 1,
      why: "Aguapé (1º), lambari (2º, primário), dourado (3º): consumidor secundário.", ref: REF.teia,
    }),
  ]),
};
