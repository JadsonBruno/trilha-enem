import { doShow, mcG, tfG, matchG, orderG, fillG, porNivel } from "../_util.mjs";
import { REF } from "../_modelos.mjs";

const L = "bio-u4-l1";
// função → organela (tabela conferida na página OpenStax 4.3)
const FUNCAO = { atp: "mito", dna: "nucleo", fotossintese: "cloro", proteina: "rer" };
const celA = (letras, cap = "Célula animal") => ({ kind: "cel-celula", tipo: "animal", letras, cap });
const celV = (letras, cap = "Célula de folha") => ({ kind: "cel-celula", tipo: "vegetal", letras, cap });
const LA = { nucleo: "B", mito: "D", golgi: "A", rer: "C" };
const LV = { parede: "D", cloro: "A", mito: "B", vacuolo: "C" };
const LT = { nucleo: "A", mito: "B", golgi: "C" };
const letraDe = (letras, org) => letras[org];
const outras = (ls, certa) => Object.values(ls).filter((l) => l !== certa).sort();
const orgDaLetra = (letras, l) => Object.keys(letras).find((k) => letras[k] === l);

export default {
  id: L, titulo: "Organelas e energia", temas: ["citologia"],
  cartoes: [
    { tipo: "conceito", titulo: "Cada organela, um serviço", texto: "Núcleo guarda o DNA. Mitocôndria faz a respiração celular e gera ATP. O RE rugoso, com ribossomos, fabrica proteínas; o liso, lipídios. Golgi modifica e empacota. Lisossomo digere. Cloroplasto faz fotossíntese.", fig: celA({ nucleo: "A", mito: "B", rer: "C", golgi: "D" }) },
    { tipo: "exemplo", titulo: "Luz e clorofila", texto: "A clorofila absorve sobretudo luz azul e vermelha e reflete a verde. Por isso a folha é verde e a luz verde rende pouco na fotossíntese.", fig: { kind: "cel-espectro", cap: "Absorção da clorofila" } },
    { tipo: "pegadinha", titulo: "Planta também respira", texto: "A planta faz fotossíntese no cloroplasto (só com luz), mas respira o tempo todo na mitocôndria. Mitocôndrias existem em células de animais e de plantas.", fig: celV({ cloro: "A", mito: "B" }) },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "A figura traz a célula com letras e o texto descreve uma função. Descubra a organela pela função (energia, proteína, DNA, luz) e só então procure a letra." },
  ],
  exercicios: porNivel([
    doShow("bio-cel-org-mito"),
    doShow("bio-cel-fot-noite"),
    mcG(L, "mc-letra-nucleo", { k: "org-letra", tipo: "animal", letras: LA, alvo: "nucleo" }, {
      n: 1, q: "Qual letra marca o núcleo, onde fica o DNA da célula?", fig: [celA(LA)],
      certo: letraDe(LA, "nucleo"), errados: outras(LA, LA.nucleo), pos: 0,
      why: "O núcleo é a estrutura maior e redonda, que guarda o DNA e comanda a célula.", ref: REF.org,
    }),
    mcG(L, "mc-letra-cloroplasto", { k: "org-letra", tipo: "vegetal", letras: LV, alvo: "cloro" }, {
      n: 1, q: "Qual letra marca a organela onde ocorre a fotossíntese?", fig: [celV(LV)],
      certo: letraDe(LV, "cloro"), errados: outras(LV, LV.cloro), pos: 2,
      why: "A fotossíntese ocorre no cloroplasto, organela verde presente em células de plantas.", ref: REF.org,
    }),
    tfG(L, "tf-letra-a-atp", { k: "org-tf", letras: LT, letra: "A", funcao: "atp" }, {
      n: 2, q: "A letra A marca a organela que produz a maior parte do ATP da célula.", fig: [celA(LT)],
      certa: orgDaLetra(LT, "A") === FUNCAO.atp, why: "A letra A marca o núcleo (DNA). O ATP vem da mitocôndria, aqui marcada com a letra B.", ref: REF.org,
    }),
    matchG(L, "match-organela-funcao", null, {
      manual: true, n: 1, q: "Ligue cada organela à sua função.",
      pares: [["Mitocôndria", "Respiração celular (gera ATP)"], ["Cloroplasto", "Fotossíntese"], ["Núcleo", "Guarda o DNA"], ["Lisossomo", "Digestão dentro da célula"]],
      why: "Mitocôndria gera ATP, cloroplasto faz fotossíntese, núcleo guarda o DNA e o lisossomo digere materiais.", ref: REF.org,
    }),
    fillG(L, "fill-fotossintese-cloroplasto", null, {
      manual: true, n: 1, q: "Complete sobre a fotossíntese.", frase: "A fotossíntese ocorre no ___.",
      certo: "cloroplasto", errados: ["mitocôndria", "lisossomo"], pos: 1,
      why: "Cloroplastos usam luz, água e CO₂ para produzir glicose e liberar O₂.", ref: REF.org,
    }),
    orderG(L, "order-secrecao-proteina", null, {
      manual: true, n: 3, q: "Ordene o caminho de uma proteína feita para sair da célula.",
      itens: ["Ribossomo no RE rugoso faz a proteína", "Vesícula leva a proteína ao Golgi", "Golgi modifica e etiqueta a proteína", "Vesícula libera a proteína fora da célula"],
      why: "A proteína nasce no RE rugoso, passa pelo Golgi e sai da célula por uma vesícula que se funde à membrana.", ref: REF.endo,
    }),
  ]),
};
