import { doShow, mcG, tfG, matchG, fillG, porNivel } from "../_util.mjs";
import { compativeis, REF, juntar } from "../_modelos.mjs";

const L = "bio-u2-l5";
const GEL3 = [{ n: "Mãe", b: [1, 5, 7, 9] }, { n: "Filho", b: [1, 4, 7, 10] }, { n: "Pai A", b: [4, 6, 10] }, { n: "Pai B", b: [2, 4, 9] }, { n: "Pai C", b: [3, 5, 8] }];
const comp = compativeis(GEL3);
const gel = (cap) => ({ kind: "cel-gel", raias: GEL3, cap });
if (comp.length !== 1) throw new Error("gel: pai ambíguo");

export default {
  id: L, titulo: "DNA na prática", temas: ["biotecnologia"],
  cartoes: [
    { tipo: "conceito", titulo: "Ferramentas do DNA", texto: "Transgênico recebe gene de outra espécie. Clone é cópia genética de quem doou o núcleo. A PCR copia um trecho de DNA. A eletroforese separa fragmentos pelo tamanho: os menores correm mais.", fig: { kind: "cel-transgenico", doador: "Bactéria", receptor: "Milho", cap: "Gene inserido no milho" } },
    { tipo: "exemplo", titulo: "CRISPR-Cas9", texto: "O RNA guia pareia com a sequência-alvo e leva a Cas9, que corta o DNA ali. Quem escolhe o ponto do corte é o RNA guia; a Cas9 só corta onde ele manda.", fig: { kind: "cel-crispr", cap: "CRISPR-Cas9" } },
    { tipo: "pegadinha", titulo: "Clone, transgênico, híbrido", texto: "Clone: cópia de um indivíduo. Transgênico: leva gene de outra espécie por engenharia genética. Híbrido: vem do cruzamento de duas variedades, sem gene “de fora”." },
    { tipo: "enem", titulo: "Como cai no ENEM", texto: "No gel, as bandas são um “código de barras”. Liste as bandas do filho que a mãe não tem e confira qual suspeito tem todas elas. Quem não tem uma delas é excluído." },
  ],
  exercicios: porNivel([
    doShow("bio-biotec-transgenico"),
    doShow("bio-biotec-gel-paternidade"),
    doShow("bio-biotec-clonagem"),
    doShow("bio-biotec-crispr"),
    mcG(L, "mc-gel-pai", { k: "gel-pai", raias: GEL3 }, {
      n: 2, q: "Pelas bandas do gel, quem pode ser o pai do filho?", fig: [gel("Teste de paternidade")],
      certo: comp[0], errados: ["Pai B", "Pai C", "Nenhum é compatível"], pos: 0,
      why: "As bandas 4 e 10 do filho não vêm da mãe: só o Pai A tem as duas. O Pai B tem a 4, mas não a 10.", ref: REF.biotec,
    }),
    tfG(L, "tf-gel-exclui-c", { k: "gel-excluido", raias: GEL3, suspeito: "Pai C" }, {
      n: 2, q: "O suspeito Pai C pode ser excluído: ele não tem as bandas que o filho herdou do pai.", fig: [gel("Mãe, filho e suspeitos")],
      certa: !comp.includes("Pai C"), why: "O Pai C não tem a banda 4 nem a 10. Falta qualquer uma delas e o suspeito é excluído.", ref: REF.biotec,
    }),
    matchG(L, "match-tecnicas", null, {
      manual: true, n: 1, q: "Ligue cada técnica ao que ela faz.",
      pares: [["PCR", "Copia trechos de DNA"], ["Eletroforese", "Separa fragmentos pelo tamanho"], ["CRISPR-Cas9", "Corta o DNA em ponto escolhido"], ["Transgenia", "Insere gene de outra espécie"]],
      why: "A PCR multiplica um trecho; o gel separa por tamanho; o CRISPR corta onde o RNA guia manda; a transgenia insere gene alheio.",
      ref: juntar(REF.biotec, "CRISPR e transgenia: refs do Show (MedlinePlus Genetics; OMS), não reabertas"),
    }),
    fillG(L, "fill-gel-menores", null, {
      manual: true, n: 1, q: "Complete sobre a eletroforese.", frase: "No gel, os fragmentos ___ percorrem a maior distância.",
      certo: "menores", errados: ["maiores", "de qualquer tamanho"], pos: 0,
      why: "Os fragmentos menores passam mais facilmente pelos poros do gel e vão mais longe do poço.", ref: REF.biotec,
    }),
  ]),
};
