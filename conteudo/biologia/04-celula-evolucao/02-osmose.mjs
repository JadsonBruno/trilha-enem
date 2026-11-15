import { doShow, mcG, tfG, matchG, fillG, porNivel } from "../_util.mjs";
import { osmose, REF } from "../_modelos.mjs";

const L = "bio-u4-l2";
const cena = (tipo, ci, outs, cap) => ({ kind: "cel-osmose", tipo, in: ci, cena: outs.map((out) => ({ out })), cap });
const TXT_HEM = { normal: "Fica com o mesmo volume", incha: "Incha e pode estourar", murcha: "Murcha, com a superfície crenada", divide: "Divide-se em duas células" };
const TXT_VEG = { "túrgida": "Fica túrgida: a parede impede o estouro", plasmolisada: "Plasmólise: a membrana se afasta da parede", estoura: "Estoura, como a hemácia em água pura", inalterada: "Nada muda, pois a parede é impermeável" };
const pc = (v) => String(v).replace(".", ",") + "%";
const hemIso = osmose({ in: 0.9, out: 0.9 }), vegDil = osmose({ in: 0.9, out: 0.1, parede: true }), hemHiper = osmose({ in: 0.9, out: 3 });
const meios = [0.3, 0.9, 2];
const RES = { incha: "Incha", normal: "Fica normal", murcha: "Murcha" };

export default {
  id: L, titulo: "Membrana e osmose", temas: ["citologia"],
  cartoes: [
    { tipo: "conceito", titulo: "A água vai ao mais concentrado", texto: "Osmose é a água atravessando a membrana do meio mais diluído para o mais concentrado. Meio hipotônico: a célula ganha água. Hipertônico: perde. Isotônico: nada muda.", fig: cena("hemacia", 0.9, [0.3, 0.9, 2], "Hemácia em três meios") },
    { tipo: "analogia", titulo: "Sal na salada", texto: "O sal na salada faz a alface murchar: a água sai da folha para o meio mais concentrado. É a mesma regra que murcha uma hemácia num meio salgado demais." },
    { tipo: "pegadinha", titulo: "Parede muda o final", texto: "Hemácia (sem parede) em meio diluído incha e pode estourar. Célula vegetal fica túrgida, pois a parede segura. Em meio concentrado, a vegetal sofre plasmólise." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Comparam o sal dentro e fora da célula. Decida se o meio é hipo, hiper ou isotônico, siga a água (para o mais concentrado) e só então diga o que acontece com a célula." },
  ],
  exercicios: porNivel([
    doShow("bio-cel-osmose-hemacia"),
    doShow("bio-cel-osmose-vegetal"),
    mcG(L, "mc-hemacia-soro", { k: "osm-hem", in: 0.9, out: 0.9 }, {
      n: 1, q: "Uma hemácia (0,9% de sal) é colocada em soro a 0,9%. O que acontece com ela?", fig: [cena("hemacia", 0.9, [0.9], "Hemácia em soro")],
      certo: TXT_HEM[hemIso.result], errados: ["incha", "murcha", "divide"].map((k) => TXT_HEM[k]), pos: 0,
      why: "Meio isotônico: entra e sai a mesma quantidade de água, e a hemácia mantém o volume.", ref: REF.osmose,
    }),
    mcG(L, "mc-vegetal-diluido", { k: "osm-veg", in: 0.9, out: 0.1 }, {
      n: 2, q: "Uma célula vegetal (0,9% de sal) é posta em solução a 0,1%. O que acontece com ela?", fig: [cena("vegetal", 0.9, [0.1], "Célula vegetal em meio diluído")],
      certo: TXT_VEG[vegDil.result], errados: ["plasmolisada", "estoura", "inalterada"].map((k) => TXT_VEG[k]), pos: 1,
      why: "Meio hipotônico: a água entra e a célula incha até a parede resistir, ficando túrgida, sem estourar.", ref: REF.osmose,
    }),
    tfG(L, "tf-agua-sai", { k: "osm-flow", in: 0.9, out: 3 }, {
      n: 1, q: "Neste meio, a água sai da hemácia por osmose.", fig: [cena("hemacia", 0.9, [3], "Hemácia em meio a 3%")],
      certa: hemHiper.flow === "sai", why: "O meio (3%) é mais concentrado que a hemácia (0,9%): a água vai para fora e a célula murcha.", ref: REF.osmose,
    }),
    matchG(L, "match-meio-efeito", { k: "osm-match", in: 0.9, meios }, {
      n: 1, q: "Hemácias têm 0,9% de sal. Ligue o meio ao que acontece com a célula.",
      pares: meios.map((o) => [`Meio a ${pc(o)}`, RES[osmose({ in: 0.9, out: o }).result]]),
      why: "Meio a 0,3% é hipotônico (incha); a 0,9% é isotônico (normal); a 2% é hipertônico (murcha).", ref: REF.osmose,
    }),
    fillG(L, "fill-hipertonico", { k: "osm-fill", in: 0.9, out: 2 }, {
      n: 1, q: "Complete com o tipo de meio.", frase: "Em um meio ___, a água sai da célula e ela murcha.",
      certo: osmose({ in: 0.9, out: 2 }).tonic, errados: ["hipotônico", "isotônico"], pos: 2,
      why: "Meio hipertônico é mais concentrado que a célula: a água sai para equilibrar e a célula murcha.", ref: REF.osmose,
    }),
  ]),
};
