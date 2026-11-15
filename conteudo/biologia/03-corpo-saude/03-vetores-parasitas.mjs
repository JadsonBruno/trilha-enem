import { doShow, mcG, tfG, matchG, orderG, porNivel } from "../_util.mjs";
import { figShow, clone, REF, juntar } from "../_modelos.mjs";

const L = "bio-u3-l3";
const mal = figShow("bio-saude-malaria-vetor"), asc = figShow("bio-saude-ascaridiase-saneamento");
const vetorMal = mal.nodes.find((n) => n.papel === "vetor").nome;
// ciclo da dengue com o mesmo tipo de figura (nós e setas); o vetor é o nó "m"
const dengue = clone(mal);
dengue.label = "Ciclo da dengue entre pessoas e mosquito";
dengue.nodes = [
  { id: "p1", x: 80, y: 190, lines: ["Pessoa com", "dengue"], fill: "#f6c9c4", papel: "hospedeiro" },
  { id: "m", x: 220, y: 52, lines: ["Mosquito"], fill: "#ffe4a6", papel: "vetor", nome: "Aedes aegypti" },
  { id: "p2", x: 360, y: 190, lines: ["Pessoa", "sadia"], fill: "#cfe8c4", papel: "hospedeiro" },
];
dengue.cap = "O mosquito liga uma pessoa à outra";
const vetorDengue = dengue.nodes.find((n) => n.papel === "vetor").nome;
// caminho da lombriga: nós e rótulos das setas, na ordem em que as setas se encadeiam
const txt = (v) => (Array.isArray(v) ? v.join(" ") : v);
const cap1 = (s) => s[0].toUpperCase() + s.slice(1);
const noDe = (id) => cap1(asc.nodes.find((n) => n.id === id).lines.join(" ").replace("Pessoa com lombriga", "Pessoa com lombriga").replace("Pessoa sadia", "Pessoa sadia"));
const cadeia = [];
{
  let cur = asc.nodes.find((n) => !asc.arrows.some((a) => a.b === n.id)).id;
  cadeia.push(noDe(cur));
  while (true) {
    const a = asc.arrows.find((x) => x.a === cur);
    if (!a) break;
    cadeia.push(cap1(txt(a.ask)));
    cadeia.push(noDe(a.b));
    cur = a.b;
  }
}

export default {
  id: L, titulo: "Vetores e parasitas", temas: ["doencas-vacinas"],
  cartoes: [
    { tipo: "conceito", titulo: "Agente, vetor e hospedeiro", texto: "O agente causa a doença (vírus, protozoário). O vetor leva o agente de um hospedeiro a outro (mosquito, barbeiro). Combater o vetor e melhorar o saneamento quebra o ciclo.", fig: mal },
    { tipo: "exemplo", titulo: "Método Wolbachia", texto: "Aedes com a bactéria Wolbachia passam a bactéria aos filhotes, e o vírus da dengue fica bloqueado dentro do mosquito. Eles não são transgênicos e não vacinam as pessoas." },
    { tipo: "pegadinha", titulo: "Vetor não é o agente", texto: "Malária: agente Plasmodium, vetor Anopheles. Dengue: vírus, vetor Aedes aegypti. Chagas: o parasita entra pelas fezes do barbeiro, não pela picada." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Vem o ciclo da doença e pedem uma medida de prevenção. Descubra por onde o agente passa (vetor, água, alimento) e escolha a ação que corta esse passo." },
  ],
  exercicios: porNivel([
    doShow("bio-saude-malaria-vetor"),
    doShow("bio-saude-chagas-fezes"),
    doShow("bio-saude-ascaridiase-saneamento"),
    tfG(L, "tf-vetor-malaria-plasmodium", { k: "vetor-tf", fig: "malaria", claim: "Plasmodium" }, {
      n: 1, q: "O vetor da malária é o próprio protozoário Plasmodium.", fig: [mal],
      certa: /Plasmodium/.test(vetorMal), why: "O Plasmodium é o agente. O vetor, que o leva de pessoa a pessoa, é a fêmea do mosquito Anopheles.", ref: juntar(REF.malaria),
    }),
    mcG(L, "mc-vetor-dengue", { k: "vetor-mc", fig: "dengue", esperado: "Aedes aegypti" }, {
      n: 1, q: "Na dengue, qual organismo é o vetor, isto é, leva o vírus de uma pessoa a outra?", fig: [dengue],
      certo: `Mosquito ${vetorDengue}`, errados: ["Mosquito Anopheles", "Barbeiro (triatomíneo)", "Flebotomíneo"], pos: 0,
      why: "O vírus é o agente; o vetor é o mosquito Aedes aegypti. O Anopheles transmite malária e o barbeiro, Chagas.", ref: REF.dengue,
    }),
    matchG(L, "match-doenca-vetor", null, {
      manual: true, n: 1, q: "Ligue cada doença ao seu vetor.",
      pares: [["Malária", "Mosquito Anopheles"], ["Dengue", "Mosquito Aedes aegypti"], ["Doença de Chagas", "Barbeiro (triatomíneo)"], ["Leishmaniose", "Flebotomíneo (mosquito-palha)"]],
      why: "Cada doença tem o seu vetor: Anopheles, Aedes aegypti, barbeiro e o flebotomíneo da leishmaniose.",
      ref: "CDC, Dengue e Leishmaniasis (abertas e lidas): https://www.cdc.gov/dengue/about/index.html ; https://www.cdc.gov/leishmaniasis/about/index.html. Malária e Chagas: refs do Show (Ministério da Saúde), não reabertas.",
    }),
    orderG(L, "order-ciclo-lombriga", null, {
      manual: true, n: 2, q: "Ordene o ciclo da lombriga (Ascaris), da pessoa doente até a infecção de outra.",
      itens: ["Ovos saem nas fezes", "Ovos no solo e na água", "Ovos nas mãos ou na verdura", "Ovos engolidos", "Lombriga adulta no intestino"],
      why: "Os ovos saem nas fezes, contaminam o solo, chegam às mãos e à verdura, são engolidos e a lombriga se desenvolve no intestino.", ref: REF.oms,
    }),
  ]),
};
