import { doShow, mcG, tfG, matchG, orderG, fillG, porNivel } from "../_util.mjs";
import { figShow, clone, REF } from "../_modelos.mjs";

const L = "bio-u3-l2";
const sem = (f, cap) => { const g = clone(f); delete g.hl; if (cap) g.cap = cap; return g; };
const glic = sem(figShow("bio-corpo-glicemia-insulina"));
const jej = sem(figShow("bio-corpo-jejum-glucagon"));
const pts = glic.series[0].pts;
const pico = pts.reduce((m, p) => (p[1] > m[1] ? p : m), pts[0]);
const interp = (P, x) => { for (let i = 0; i < P.length - 1; i++) { const [x1, y1] = P[i], [x2, y2] = P[i + 1]; if (x >= x1 && x <= x2) return y1 + ((y2 - y1) * (x - x1)) / (x2 - x1 || 1); } return P.at(-1)[1]; };
const [ins, glu] = jej.series.map((s) => s.pts);
const horas = (v) => `${String(v).replace(".", ",")} h`;

export default {
  id: L, titulo: "Glicemia e hormônios", temas: ["fisiologia"],
  cartoes: [
    { tipo: "conceito", titulo: "Insulina e glucagon", texto: "Depois de comer, a glicemia sobe e o pâncreas libera insulina: as células captam glicose e o fígado a guarda. No jejum, o glucagon manda o fígado liberar glicose.", fig: glic },
    { tipo: "analogia", titulo: "Termostato", texto: "Insulina e glucagon agem como o aquecedor e o ar-condicionado de uma casa: um empurra a glicemia para baixo, o outro para cima, mantendo-a na faixa normal." },
    { tipo: "pegadinha", titulo: "Hormônios opostos", texto: "Insulina reduz a glicemia; glucagon a eleva. Não confunda o pico (valor máximo da curva) com o momento em que a glicemia volta ao normal." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Vem um gráfico de glicemia ou de hormônios no tempo. Leia o eixo x (horas), compare as curvas e use a faixa “normal” desenhada como referência." },
  ],
  exercicios: porNivel([
    doShow("bio-corpo-glicemia-insulina"),
    mcG(L, "mc-hora-do-pico", { k: "glic-pico" }, {
      n: 1, q: "Em que hora após a refeição a glicemia atinge o valor máximo?", fig: [glic],
      certo: horas(pico[0]), errados: ["0,5 h", "1,5 h", "2 h"], pos: 1,
      why: "A curva sobe até 150 mg/dL em 1 h e depois cai: esse é o pico.", ref: REF.pancreas,
    }),
    tfG(L, "tf-1h-dentro-normal", { k: "glic-dentro", x: 1 }, {
      n: 2, q: "Uma hora depois da refeição, a glicemia está dentro da faixa normal (70 a 100 mg/dL).", fig: [glic],
      certa: interp(pts, 1) >= glic.band.lo && interp(pts, 1) <= glic.band.hi, why: "Em 1 h a glicemia está no pico, 150 mg/dL, bem acima da faixa normal: só volta a ela cerca de 2 h depois.", ref: REF.pancreas,
    }),
    tfG(L, "tf-jejum-insulina-maior", { k: "jejum-maior", ate: 4 }, {
      n: 2, q: "Nas 4 primeiras horas de jejum, a insulina está acima do glucagon (escala relativa).", fig: [jej],
      certa: [0, 2, 4].every((x) => interp(ins, x) > interp(glu, x)), why: "Em 0, 2 e 4 h a insulina (azul) está acima do glucagon (vermelho); eles só se cruzam em 6 h.", ref: REF.pancreas,
    }),
    matchG(L, "match-orgao-hormonio", null, {
      manual: true, n: 1, q: "Ligue cada termo ao seu papel no controle da glicemia.",
      pares: [["Pâncreas", "Produz insulina e glucagon"], ["Fígado", "Guarda e libera glicose"], ["Insulina", "Faz a glicemia cair"], ["Glucagon", "Faz a glicemia subir"]],
      why: "O pâncreas libera os dois hormônios; o fígado guarda glicose (insulina) ou a libera (glucagon).", ref: REF.pancreas,
    }),
    orderG(L, "order-pos-refeicao", null, {
      manual: true, n: 2, q: "Ordene o que acontece depois de uma refeição rica em açúcar.",
      itens: ["Glicemia sobe", "Pâncreas libera insulina", "Células captam glicose", "Glicemia volta ao normal"],
      why: "A subida da glicemia estimula a insulina, que faz as células captarem glicose e a glicemia voltar à faixa normal.", ref: REF.pancreas,
    }),
    fillG(L, "fill-jejum-hormonio", { k: "jejum-sobe" }, {
      n: 1, q: "Complete sobre o jejum.", frase: "No jejum, o hormônio ___ aumenta e o fígado libera glicose.",
      certo: jej.series.find((s) => s.pts.at(-1)[1] > s.pts[0][1]).nome.toLowerCase(), errados: ["insulina", "melatonina"], pos: 2,
      why: "No gráfico do jejum o glucagon sobe e a insulina cai; o glucagon manda o fígado soltar glicose.", ref: REF.pancreas,
    }),
  ]),
};
