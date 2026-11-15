import { doShow, mcG, tfG, matchG, orderG, fillG, porNivel } from "../_util.mjs";
import { CODONS, transcribe, translate, mutate, AA_PT, REF } from "../_modelos.mjs";

const L = "bio-u2-l4";
const fita = (v, o, cap) => ({ kind: "gen-fita", v, ...o, cap });
const rnaN = "CAUGGGCUUUUAAG", n = translate(rnaN).length;
const dnaT = "TACTTTGGC";
const rnaM = "AUGAAACCCGGGUAA";
const compr = (r) => translate(r).length;
const mutCurta = mutate(rnaM, 4, "A", "U"), mutSil = mutate(rnaM, 9, "C", "G");
const rnaO = "AUGUUCGGCUGGUAA", pep = translate(rnaO).map((a) => AA_PT[a]);
const cods = ["AUG", "UGG", "UUU", "UAA"];
const nomeAA = (c) => { const a = CODONS[c]; return a === "Pare" ? "Parada (não codifica)" : AA_PT[a] + (c === "AUG" ? " (início)" : ""); };

export default {
  id: L, titulo: "Código genético e mutação", temas: ["genetica"],
  cartoes: [
    { tipo: "conceito", titulo: "DNA, RNAm, proteína", texto: "O DNA é transcrito em RNAm (A–U, T–A, G–C, C–G). O ribossomo lê o RNAm de 3 em 3 bases: cada códon é um aminoácido. A leitura começa no AUG e para em UAA, UAG ou UGA.", fig: fita("transcricao", { dna: "TACCGAGAA" }, "Fita molde (3' → 5')") },
    { tipo: "exemplo", titulo: "Tabela dos códons", texto: "AUG Met (início) · UUU e UUC Phe · GGC Gly · GCU Ala · AAA e AAG Lys · UGG Trp · CCC e CCG Pro · UAA, UAG e UGA parada. Os exercícios usam só estes códons." },
    { tipo: "pegadinha", titulo: "Troca nem sempre muda", texto: "No RNA não há T, só U. Trocar uma base pode ser silenciosa (mesmo aminoácido), mudar um aminoácido ou criar uma parada que encurta a proteína." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "Pedem a menor proteína após uma mutação. Divida o RNAm em códons, ache a parada e veja qual troca cria um códon de parada mais cedo." },
  ],
  exercicios: porNivel([
    doShow("bio-gen-codigo-transcricao"),
    mcG(L, "mc-tamanho-peptideo", { k: "cod-n", rna: rnaN }, {
      n: 2, q: "Este RNAm é traduzido (tabela do cartão). Quantos aminoácidos tem o peptídeo?", fig: [fita("traducao", { rna: rnaN }, "RNAm (5' → 3')")],
      certo: `${n} aminoácidos`, errados: ["4 aminoácidos", "5 aminoácidos", "2 aminoácidos"], pos: 0,
      why: "Começa no AUG e lê AUG-GGC-UUU até UAA, a parada, que não entra: 3 aminoácidos.", ref: REF.codigo,
    }),
    tfG(L, "tf-transcricao-aug-aaa-ccg", { k: "cod-transc", dna: dnaT, claim: "AUGAAACCG" }, {
      n: 1, q: "Esta fita molde produz o RNAm 5'-AUG AAA CCG-3'.", fig: [fita("transcricao", { dna: dnaT }, "Fita molde (3' → 5')")],
      certa: transcribe(dnaT) === "AUGAAACCG", why: "Pareando T–A, A–U, C–G e G–C: TAC TTT GGC dá AUG AAA CCG.", ref: REF.codigo,
    }),
    tfG(L, "tf-mutacao-parada", { k: "cod-mut", rna: rnaM, pos: 4, de: "A", para: "U", claim: "encurta" }, {
      n: 2, q: "Trocar a 4ª base (A) por U cria um códon de parada e encurta o peptídeo.", fig: [fita("traducao", { rna: rnaM }, "RNAm (5' → 3')")],
      certa: compr(mutCurta) < compr(rnaM), why: "O 2º códon AAA vira UAA, uma parada: o peptídeo cai de 4 para só 1 aminoácido.", ref: REF.codigo,
    }),
    tfG(L, "tf-mutacao-silenciosa", { k: "cod-mut", rna: rnaM, pos: 9, de: "C", para: "G", claim: "muda-aa" }, {
      n: 2, q: "Trocar a 9ª base (C) por G altera o aminoácido do 3º códon.", fig: [fita("traducao", { rna: rnaM }, "RNAm (5' → 3')")],
      certa: translate(mutSil).join() !== translate(rnaM).join(), why: "CCC e CCG codificam prolina: mutação silenciosa, o peptídeo não muda.", ref: REF.codigo,
    }),
    fillG(L, "fill-aug", { k: "cod-fill", codon: "AUG" }, {
      n: 1, q: "Complete com o aminoácido.", frase: "O códon AUG codifica o aminoácido ___.",
      certo: `${AA_PT[CODONS.AUG]} (${CODONS.AUG})`, errados: ["Leucina (Leu)", "Triptofano (Trp)"], pos: 1,
      why: "AUG é o códon de início e codifica a metionina.", ref: REF.codigo,
    }),
    matchG(L, "match-codon-aa", { k: "cod-match", codons: cods }, {
      n: 2, q: "Ligue cada códon ao que ele codifica (tabela do cartão).", pares: cods.map((c) => [c, nomeAA(c)]),
      why: "AUG: metionina (início); UGG: triptofano; UUU: fenilalanina; UAA: parada, não codifica aminoácido.", ref: REF.codigo,
    }),
    orderG(L, "order-aminoacidos", { k: "cod-ordem", rna: rnaO }, {
      n: 2, q: "Pela tabela do cartão, em que ordem os aminoácidos entram a partir de AUG UUC GGC UGG UAA?", itens: pep,
      why: "Lê-se de 3 em 3: AUG (Met), UUC (Phe), GGC (Gly), UGG (Trp). UAA é a parada.", ref: REF.codigo,
    }),
  ]),
};
