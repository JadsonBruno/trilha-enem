import { doShow, mcG, tfG, matchG, orderG, fillG, porNivel } from "../_util.mjs";
import { nearest, isMono, REF } from "../_modelos.mjs";

const L = "bio-u4-l4";
const ARV_REP = [["Lagarto", "Cobra"], ["Tartaruga", ["Crocodilo", "Ave"]]];
const ARV_MAM = [["Gato", "Cão"], ["Rato", ["Macaco", "Humano"]]];
const cl = (arvore, extra, cap) => ({ kind: "cel-cladograma", arvore, ...extra, cap });
const gruposMono = [["Macaco", "Humano"], ["Rato", "Macaco"], ["Gato", "Humano"], ["Cão", "Rato"]];
const mono = gruposMono.filter((g) => isMono(ARV_MAM, g));
if (mono.length !== 1) throw new Error("monofilético: ambíguo");
const prox = nearest(ARV_MAM, "Macaco");
if (prox.length !== 1) throw new Error("parente próximo: ambíguo");

export default {
  id: L, titulo: "Evolução e árvores", temas: ["evolucao"],
  cartoes: [
    { tipo: "conceito", titulo: "Seleção natural", texto: "Numa população há variação herdável. Quem tem a característica vantajosa sobrevive mais e deixa mais descendentes. O ambiente só escolhe entre os traços existentes, não os cria. A população evolui; o indivíduo, não." },
    { tipo: "exemplo", titulo: "Espécies e fósseis", texto: "Especiação: populações isoladas deixam de se cruzar e, mesmo reunidas, são espécies distintas (isolamento reprodutivo). Fóssil de transição tem traços de dois grupos e vem de camada intermediária.", fig: { kind: "cel-fosseis", cap: "Camadas de rocha" } },
    { tipo: "exemplo", titulo: "Parentesco na árvore", texto: "Parente mais próximo divide o ancestral comum mais recente. Grupo monofilético é um ancestral com todos os seus descendentes. Girar um nó não muda a informação; a ordem das pontas não conta.", fig: cl([[["Humano", "Chimpanzé"], "Gorila"], "Orangotango"], { foco: "Gorila" }, "Primatas") },
    { tipo: "pegadinha", titulo: "Lamarck × Darwin", texto: "Lamarck: o uso esforça o órgão e o traço adquirido é herdado. Darwin: já existe variação herdável e a seleção favorece uma parte dela. O esforço de um indivíduo não é herdado." },
  ],
  exercicios: porNivel([
    doShow("bio-evo-girafa-selecao"),
    doShow("bio-evo-clado-humano"),
    tfG(L, "tf-crocodilo-ave", { k: "clado-prox", arvore: ARV_REP, foco: "Crocodilo", claim: "Ave" }, {
      n: 2, q: "Nesta árvore, o parente mais próximo do crocodilo é a ave.", fig: [cl(ARV_REP, { foco: "Crocodilo", alvo: "Ave", grupo: ["Crocodilo", "Ave"] }, "Répteis e aves")],
      certa: nearest(ARV_REP, "Crocodilo").join() === "Ave", why: "Crocodilo e ave saem do mesmo nó, mais recente que o nó que os une à tartaruga.", ref: REF.filo,
    }),
    mcG(L, "mc-monofiletico-mamiferos", { k: "clado-mono", arvore: ARV_MAM, grupos: gruposMono }, {
      n: 3, q: "Qual agrupamento é monofilético, isto é, um ancestral com todos os seus descendentes?",
      fig: [cl(ARV_MAM, { grupo: ["Macaco", "Humano"] }, "Mamíferos")],
      certo: mono[0].join(" + "), errados: gruposMono.filter((g) => !isMono(ARV_MAM, g)).map((g) => g.join(" + ")), pos: 3,
      why: "Só macaco + humano saem de um mesmo nó sem deixar descendente de fora. Os outros pares misturam ramos.", ref: REF.filo,
    }),
    mcG(L, "mc-parente-macaco", { k: "clado-prox", arvore: ARV_MAM, foco: "Macaco" }, {
      n: 2, q: "Pela árvore, quem é o parente mais próximo do macaco (losango)?", fig: [cl(ARV_MAM, { foco: "Macaco", alvo: prox[0] }, "Mamíferos")],
      certo: prox[0], errados: ["Rato", "Gato", "Cão"], pos: 0,
      why: "Macaco e humano saem do mesmo nó recente; o rato se liga a eles num nó mais antigo.", ref: REF.filo,
    }),
    matchG(L, "match-evolucao-termos", null, {
      manual: true, n: 1, q: "Ligue cada termo à sua ideia.",
      pares: [["Lamarck", "Herança de características adquiridas"], ["Darwin e Wallace", "Seleção natural sobre variação herdável"], ["Evolução", "Mudança na população, geração a geração"]],
      why: "Lamarck propôs herdar o que se adquire; Darwin e Wallace, a seleção natural. Evoluir é mudar a população, não o indivíduo.", ref: REF.evo,
    }),
    tfG(L, "tf-especies-isolamento", null, {
      manual: true, n: 2, q: "Duas populações separadas por um rio são espécies distintas se, reunidas, não trocarem genes.", fig: [{ kind: "cel-especiacao", cap: "População separada pelo rio" }],
      certa: true, why: "O critério é o isolamento reprodutivo: o rio só separa no espaço; espécies distintas não trocam genes mesmo reunidas.", ref: REF.esp,
    }),
    orderG(L, "order-passos-selecao", null, {
      manual: true, n: 2, q: "Ordene os passos da seleção natural.",
      itens: ["Há variação herdável na população", "Quem tem o traço vantajoso sobrevive mais", "Esses indivíduos deixam mais descendentes", "O traço fica mais comum na população"],
      why: "Variação herdável, sobrevivência e reprodução diferencial e, por fim, um traço mais comum na população.", ref: REF.evo,
    }),
  ]),
};
