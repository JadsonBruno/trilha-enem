import { doShow, mcG, tfG, matchG, fillG, porNivel } from "../_util.mjs";
import { antigens, canDonate, donorsOf, ALL_TYPES, typeFromAgglutination, REF } from "../_modelos.mjs";

const L = "bio-u2-l3";
const hem = (type, cap) => ({ kind: "gen-hemacia", type, cap });
const lista = (t) => { const a = antigens(t), k = ["A", "B", "D"].filter((x) => a[x]); return k.length === 0 ? "Nenhum antígeno" : k.length === 1 ? `Antígeno ${k[0]}` : `Antígenos ${k.slice(0, -1).join(", ")} e ${k.at(-1)}`; };
const agg = { A: false, B: true, D: true };
const doadores = (t) => donorsOf(t).join(" e ");

export default {
  id: L, titulo: "Sangue: ABO e Rh", temas: ["genetica"],
  cartoes: [
    { tipo: "conceito", titulo: "Antígenos e anticorpos", texto: "O tipo vem dos antígenos A, B e D (Rh) na hemácia. Quem não tem A ou B já tem anti-A ou anti-B no plasma. O anti-D só surge após contato com sangue Rh+ (sensibilização). Doe só hemácias sem antígeno que o receptor não tenha.", fig: hem("AB+", "Hemácia do tipo AB+") },
    { tipo: "analogia", titulo: "Bandeira e alarme", texto: "Cada antígeno é uma bandeira na hemácia. Anti-A e anti-B são alarmes já instalados contra as bandeiras que a pessoa não usa. Para o Rh, o alarme só é instalado depois do primeiro contato." },
    { tipo: "pegadinha", titulo: "Universal é de hemácias", texto: "O− doa hemácias a todos (sem A, B nem D). AB+ recebe de todos. Cuidado com o Rh: pessoa Rh− não deve receber Rh+, mesmo com ABO igual." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "A prova mostra a lâmina com soros anti-A, anti-B e anti-D (aglutinou = tem o antígeno) ou pede os tipos possíveis dos filhos. Faça o quadro de Punnett com IA, IB e i." },
  ],
  exercicios: porNivel([
    doShow("bio-gen-abo-lamina-tipagem"),
    doShow("bio-gen-abo-cruzamento-a-b"),
    mcG(L, "mc-lamina-b-positivo", { k: "abo-tipagem", agg }, {
      n: 1, q: "A lâmina mostra aglutinação com anti-B e anti-D. Qual o tipo sanguíneo da pessoa?", fig: [{ kind: "gen-sangue", agg, cap: "Aglutinou = tem o antígeno" }],
      certo: typeFromAgglutination(agg), errados: ["B−", "AB+", "O+"], pos: 1,
      why: "Aglutinou com anti-B e anti-D: tem os antígenos B e D, e não o A. Tipo B+.", ref: REF.abo,
    }),
    mcG(L, "mc-doadores-a-negativo", { k: "abo-doadores", receptor: "A−" }, {
      n: 2, q: "Um paciente A− precisa de hemácias. Quais doadores evitam aglutinação e sensibilização Rh?", fig: [hem("A−", "Hemácia do paciente")],
      certo: doadores("A−"), errados: ["A+ e O+", "B− e O−", "AB− e A−"], pos: 0,
      why: "A− não tem B nem D: só recebe hemácias sem B e sem D, ou seja, A− e O−.", ref: REF.abo,
    }),
    tfG(L, "tf-o-negativo-universal", { k: "abo-doa-todos", doador: "O−" }, {
      n: 1, q: "Hemácias O− podem ser doadas a qualquer um dos oito tipos.", fig: [hem("O−", "Hemácia do doador")],
      certa: ALL_TYPES.every((r) => canDonate("O−", r)), why: "O− não tem antígeno A, B nem D: nenhum plasma ataca suas hemácias.", ref: REF.abo,
    }),
    tfG(L, "tf-o-negativo-recebe-positivo", { k: "abo-recebe", receptor: "O−", doador: "O+" }, {
      n: 2, q: "Uma pessoa O− pode receber hemácias O+.", fig: [hem("O−", "Hemácia do receptor")],
      certa: canDonate("O+", "O−"), why: "O+ leva o D. O− ainda não tem anti-D, mas é sensibilizado e passa a produzi-lo: reage numa próxima exposição.", ref: REF.abo,
    }),
    matchG(L, "match-tipo-antigenos", { k: "abo-antigenos" }, {
      n: 1, q: "Ligue o tipo sanguíneo aos antígenos presentes nas hemácias.",
      pares: ["A+", "B−", "AB+", "O−"].map((t) => [t, lista(t)]),
      why: "A é o antígeno A; B, o B; AB tem os dois; O não tem A nem B. O sinal + indica o antígeno D (Rh).", ref: REF.abo,
    }),
    fillG(L, "fill-tipo-o", { k: "abo-fill-o" }, {
      n: 1, q: "Complete sobre o tipo O.", frase: "O sangue do tipo O não tem os antígenos ___ nas hemácias.",
      certo: ["O+", "O−"].every((t) => !antigens(t).A && !antigens(t).B) ? "A e B" : "?", errados: ["só A", "só B"], pos: 0,
      why: "Tipo O é a ausência de A e de B nas hemácias; por isso o plasma tem anti-A e anti-B.", ref: REF.abo,
    }),
  ]),
};
