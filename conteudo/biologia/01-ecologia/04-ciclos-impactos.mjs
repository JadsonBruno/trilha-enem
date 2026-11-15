import { doShow, mcG, tfG, porNivel } from "../_util.mjs";
import { CICLOS, REF } from "../_modelos.mjs";

const L = "bio-u1-l4";
const seta = (tipo, n) => CICLOS[tipo].arrows.find((a) => a.n === n);
// a seta devolve CO₂ ao ar quando termina no retângulo do CO₂ (o 1º, no alto da figura)
const devolveCO2 = (a) => a.p[3] < 60;
const s6 = seta("carbono", 6), s3a = seta("agua", 3), absorcao = CICLOS.nitrogenio.arrows.find((a) => a.role === "Absorção");

export default {
  id: L, titulo: "Ciclos e impactos", temas: ["ecologia"],
  cartoes: [
    { tipo: "conceito", titulo: "A matéria circula", texto: "A energia passa de nível em nível e se perde; a matéria circula. Carbono: a fotossíntese retira CO₂ do ar; respiração, decomposição e queima de combustíveis o devolvem. Fósseis e desmatamento elevam o CO₂.", fig: { kind: "eco-ciclo", tipo: "carbono", cap: "Ciclo do carbono" } },
    { tipo: "exemplo", titulo: "Ciclo da água", texto: "O oceano evapora, as plantas transpiram, a chuva (precipitação) devolve a água e os rios escoam. Derrubar a floresta reduz a transpiração.", fig: { kind: "eco-ciclo", tipo: "agua", cap: "Ciclo da água" } },
    { tipo: "pegadinha", titulo: "Fixar não é nitrificar", texto: "Fixação: bactérias transformam N₂ do ar em amônia. Nitrificação: amônia vira nitrato. Desnitrificação devolve N₂ ao ar. Leia o rótulo da seta." },
    { tipo: "enem", titulo: "Gráficos: o que cobram", texto: "Eutrofização: nutrientes geram algas e, ao morrerem, a decomposição gasta O₂. Fragmentos pequenos abrigam menos espécies. A população estabiliza na capacidade de suporte (K)." },
  ],
  exercicios: porNivel([
    doShow("bio-eco-ciclo-carbono-seta1"),
    doShow("bio-eco-ciclo-nitrogenio-soja"),
    doShow("bio-eco-imp-co2-tendencia"),
    tfG(L, "tf-seta6-co2", { k: "ciclo-co2", tipo: "carbono", seta: 6 }, {
      n: 1, q: "No ciclo do carbono, a seta 6 mostra um processo que devolve CO₂ ao ar.", fig: [{ kind: "eco-ciclo", tipo: "carbono", hl: 6, cap: "Ciclo do carbono" }],
      certa: devolveCO2(s6), why: "A seta 6 é a combustão de fósseis: queimar carvão e petróleo lança CO₂ na atmosfera.", ref: REF.ciclos,
    }),
    tfG(L, "tf-seta3-agua", { k: "ciclo-papel", tipo: "agua", seta: 3, papel: "Evaporação" }, {
      n: 2, q: "No ciclo da água, a seta 3 mostra a evaporação do oceano.", fig: [{ kind: "eco-ciclo", tipo: "agua", hl: 3, cap: "Ciclo da água" }],
      certa: s3a.role === "Evaporação", why: "A seta 3 sai da floresta: é a transpiração das plantas. A evaporação do oceano é a seta 1.", ref: REF.ciclos,
    }),
    mcG(L, "mc-absorcao-nitrato", { k: "ciclo-seta", tipo: "nitrogenio", papel: "Absorção" }, {
      n: 2, q: "No ciclo do nitrogênio, que seta mostra a absorção do nitrato pelas plantas?", fig: [{ kind: "eco-ciclo", tipo: "nitrogenio", hl: absorcao.n, cap: "Ciclo do nitrogênio" }],
      certo: `Seta ${absorcao.n}`, errados: [1, 2, 4].map((n) => `Seta ${n}`), pos: 2,
      why: "A seta 3 vai do nitrato às plantas: absorção pelas raízes. A 2 é nitrificação; a 1, fixação; a 4, desnitrificação.", ref: REF.ciclos,
    }),
    doShow("bio-eco-imp-fragmento-especies"),
    doShow("bio-eco-pop-capacidade-suporte"),
  ]),
};
