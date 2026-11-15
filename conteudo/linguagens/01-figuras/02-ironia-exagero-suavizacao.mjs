import { doShow } from "../../_comum/show.mjs";
import { tfDef, fill, porNivel } from "../_gerar.mjs";

const L = "lin-u1-l2";
export default {
  id: L, titulo: "Ironia, hipérbole e eufemismo", temas: ["figuras", "efeito-sentido"],
  cartoes: [
    { tipo: "conceito", titulo: "Ironia: o contrário disfarçado", texto: "Ironia diz uma coisa para dar a entender o contrário. Só se percebe pelo contexto: “Que ótima ideia: derrubou o bolo!” é crítica, não elogio.", fig: { kind: "lin-frase", texto: "Que ótima ideia: derrubou o bolo inteiro!", destaque: ["ótima", "ideia"] } },
    { tipo: "analogia", titulo: "O botão de volume", texto: "Hipérbole gira o volume para cima: “esperei uma eternidade”. Eufemismo gira para baixo: “ele nos deixou” suaviza a morte. Um aumenta, o outro abranda.", fig: { kind: "lin-frase", texto: "Esperei uma eternidade pelo ônibus.", destaque: ["eternidade"] } },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Machado e Lima Barreto são clássicos da ironia. A pergunta de fundo é sempre: o narrador diz isso a sério? Se o contexto desmente a frase, é ironia: ela se infere pelo contexto, não pela palavra solta." },
    { tipo: "pegadinha", titulo: "Exagero crítico não é ironia", texto: "Teste: a frase diz o oposto do que se pensa (ironia) ou só aumenta a ideia (hipérbole)? Elogio falso é ironia; exagero verdadeiro é hipérbole." },
  ],
  exercicios: porNivel([
    doShow("lin-fig-ironia-n2d"),
    doShow("lin-fig-hiperbole-e2n"),
    doShow("lin-fig-eufemismo-e2n"),
    tfDef(L, "fig", "hiperbole", "eufemismo", 1, "def"),
    doShow("lin-enem-fig-ironia-joalheiros"),
    fill(L, "fig", "eufemismo", "marca", 2),
    doShow("lin-enem-fig-hiperbole-quaresma", { enunciado: "Ao comparar a chegada do personagem a um eclipse, o narrador produz o efeito de…" }),
  ]),
};
