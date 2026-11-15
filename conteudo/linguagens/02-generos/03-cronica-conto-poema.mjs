import { doShow } from "../../_comum/show.mjs";
import { tfDef, orderPartes, fill, porNivel } from "../_gerar.mjs";

const L = "lin-u2-l3";
export default {
  id: L, titulo: "Crônica, conto e poema", temas: ["generos"],
  cartoes: [
    { tipo: "conceito", titulo: "Crônica: o cotidiano comentado", texto: "Crônica parte de uma cena do dia a dia ou do noticiário e a comenta, com humor ou lirismo. É curta, de tom leve e linguagem próxima da fala.", fig: { kind: "lin-gen-recorte", genero: "cronica", hl: ["cena", "coment"] } },
    { tipo: "conceito", titulo: "Conto: história curta inventada", texto: "Conto narra uma ficção curta: poucos personagens, um conflito que cresce até o clímax e termina no desfecho.", fig: { kind: "lin-gen-recorte", genero: "conto", hl: ["conflito", "climax", "desfecho"] } },
    { tipo: "exemplo", titulo: "Poema: versos e estrofes", texto: "Poema expressa emoções ou ideias em versos agrupados em estrofes, com ritmo, rima (às vezes) e muitas figuras de linguagem.", fig: { kind: "lin-gen-recorte", genero: "poema", hl: ["e1", "e2"] } },
    { tipo: "pegadinha", titulo: "Crônica × conto", texto: "Ambas são curtas, mas a crônica comenta a vida real, quase sem enredo. O conto inventa uma história com conflito, clímax e desfecho." },
  ],
  exercicios: porNivel([
    doShow("lin-gen-cronica-d"),
    doShow("lin-gen-poema-f1"),
    doShow("lin-gen-cronica-f3"),
    doShow("lin-gen-conto-f1"),
    orderPartes(L, "conto", 2),
    tfDef(L, "gen", "cronica", "conto", 2, "def"),
    fill(L, "gen", "poema", "def", 1),
  ]),
};
