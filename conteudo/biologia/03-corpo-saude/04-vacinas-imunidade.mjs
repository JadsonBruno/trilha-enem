import { doShow, mcG, tfG, matchG, fillG, porNivel } from "../_util.mjs";
import { figShow, clone, REF, juntar } from "../_modelos.mjs";

const L = "bio-u3-l4";
const ac = clone(figShow("bio-saude-curva-segunda-dose")); delete ac.hl;
const vs = figShow("bio-saude-vacina-soro-cobra");
const pts = ac.series[0].pts, [d1, d2] = ac.doses;
const pico = (a, b) => pts.filter((p) => p[0] >= a && p[0] < b).reduce((m, p) => (p[1] > m[1] ? p : m), [0, -1]);
const p1 = pico(d1, d2), p2 = pico(d2, ac.x1 + 1);
const soro = vs.cards.find((c) => c.id === "soro");

export default {
  id: L, titulo: "Vacinas e imunidade", temas: ["doencas-vacinas"],
  cartoes: [
    { tipo: "conceito", titulo: "Vacina treina, soro socorre", texto: "A vacina traz antígeno inofensivo: o corpo faz anticorpos e guarda memória, mas leva dias. O soro traz anticorpos prontos: age já, mas dura pouco e não deixa memória.", fig: vs },
    { tipo: "exemplo", titulo: "RNAm e antibióticos", texto: "Vacina de RNAm: as células leem o RNAm, fabricam a proteína viral e o corpo faz anticorpos e memória. Antibiótico não cria bactéria resistente: elimina as sensíveis e as resistentes se multiplicam.", fig: figShow("bio-saude-rnam-ordem") },
    { tipo: "pegadinha", titulo: "A 2ª dose é diferente", texto: "Na 2ª exposição as células de memória respondem mais rápido e produzem muito mais anticorpos. Por isso o pico da 2ª dose é maior e vem mais cedo." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Gráfico de anticorpos com duas doses: compare a altura e o tempo de subida dos dois picos. Soro para urgência (cobra, tétano); vacina para prevenir." },
  ],
  exercicios: porNivel([
    doShow("bio-saude-vacina-soro-cobra"),
    tfG(L, "tf-pico-segunda-dose", { k: "vac-pico" }, {
      n: 1, q: "O pico de anticorpos depois da 2ª dose é maior que o da 1ª.", fig: [ac],
      certa: p2[1] > p1[1], why: "O 1º pico chega a cerca de 10; o 2º, a 80. A memória imunológica amplia a resposta.", ref: REF.imune,
    }),
    tfG(L, "tf-antibiotico-cria-resistencia", { k: "selecao-tf" }, {
      n: 2, q: "O antibiótico cria bactérias resistentes que antes não existiam na placa.", fig: [figShow("bio-saude-resistencia-selecao")],
      certa: !figShow("bio-saude-resistencia-selecao").antes.includes(1), why: "Já havia uma bactéria resistente (marcada no 1º momento). O antibiótico mata as sensíveis e ela se multiplica: é seleção.", ref: "Seleção natural: OpenStax Biology 2e, 18.1 (aberta e lida): https://openstax.org/books/biology-2e/pages/18-1-understanding-evolution",
    }),
    tfG(L, "tf-soro-sem-memoria", { k: "vac-soro" }, {
      n: 2, q: "O soro dá proteção imediata, mas não cria memória imunológica.", fig: [vs],
      certa: soro.inicio === "imediato" && soro.linhas.includes("sem memória"), why: "Soro traz anticorpos prontos, de outro organismo: age já, mas o corpo não aprende e a proteção passa.", ref: juntar(REF.imune, REF.crie),
    }),
    mcG(L, "mc-dia-do-pico", { k: "vac-dia-pico" }, {
      n: 2, q: "Em que dia o pico de anticorpos da 1ª dose é atingido?", fig: [ac],
      certo: `${p1[0]} dias`, errados: ["7 dias", "21 dias", "28 dias"], pos: 1,
      why: "A curva da 1ª dose sobe até o dia 14 e depois cai; no dia 28 vem a 2ª dose.", ref: REF.imune,
    }),
    mcG(L, "mc-vezes-pico", { k: "vac-razao" }, {
      n: 3, q: "Quantas vezes o pico de anticorpos da 2ª dose é maior que o da 1ª?", fig: [ac],
      certo: `${p2[1] / p1[1]} vezes`, errados: ["2 vezes", "4 vezes", "16 vezes"], pos: 3,
      why: "Pico da 2ª dose: 80; da 1ª: 10. A razão é 80 ÷ 10 = 8 vezes.", ref: REF.imune,
    }),
    matchG(L, "match-termos-imunidade", null, {
      manual: true, n: 1, q: "Ligue cada termo ao seu significado.",
      pares: [["Vacina", "Estimula anticorpos e cria memória"], ["Soro", "Dá anticorpos prontos, sem memória"], ["Antígeno", "Molécula que o sistema imune reconhece"], ["Célula de memória", "Responde rápido na 2ª exposição"]],
      why: "Vacina treina, soro empresta anticorpos, o antígeno é o alvo e a célula de memória acelera a resposta seguinte.", ref: juntar(REF.imune, REF.crie),
    }),
    fillG(L, "fill-celulas-memoria", null, {
      manual: true, n: 1, q: "Complete sobre a 2ª exposição ao mesmo antígeno.", frase: "Na 2ª exposição, as células de ___ respondem mais rápido.",
      certo: "memória", errados: ["plaquetas", "hemácias"], pos: 0,
      why: "Células de memória reconhecem o antígeno já visto e viram produtoras de anticorpos mais depressa.", ref: REF.imune,
    }),
  ]),
};
